import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const AlertsPage = ({ userId, hobbyName, hobbyId, fetchNotifications, notifications, setNotifications }) => {
    const intHobbyId = parseInt(hobbyId)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        fetchNotifications(userId)
    }, [userId])


  useEffect(() => {
    const timestamp = new Date().toISOString()
    markRead(timestamp)
}, [])

    const markRead = async (timestamp) => {
      if (userId == null) {
        return
      }
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/${userId}/read`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timestamp })
        })
        .catch(error => {
          console.error('error marking read:', error)
        })
    }


    const handleClear = async (userId) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/clear-notifications/${userId}`, 
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP Error status: ${response.status}`)
              }
              return response.json()
            })
            .then(data => {
                fetchNotifications(userId)
            })
            .catch(error => {
              console.error('error clearing notifs:', error)
            })
    }

    const handleDelete = async (notifId) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/delete/${notifId}`, 
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(data => {
                setNotifications(notifications.filter((notif) => notif.id !== notifId))
            })
            .catch(error => {
              console.error('error deleting notif:', error)
            })
    }
    

    return (
      <>
        <div className='text-center'>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={intHobbyId} style={{zIndex: 1}}/>
        <div>
        <h1 style={{marginTop:'60px', marginBottom:'20px'}}>Alerts</h1>
          <div>
          <button onClick={() => setFilter("unread")} className='alert-btn' style={{width: '190px', height: '60px', fontSize:'20px', marginRight:'10px', border: '2px solid #4e9c90', color: '#4e9c90'}}>New Alerts</button>
          <button onClick={() => setFilter("read")} className='alert-btn' style={{width: '190px', height: '60px', fontSize:'20px', marginRight:'10px', border: '2px solid #4e9c90', color: '#4e9c90'}}>Read Alerts</button>
          <button onClick={() => setFilter("all")} className='alert-btn' style={{width: '190px', height: '60px', fontSize:'20px', marginRight:'10px', border: '2px solid #4e9c90', color: '#4e9c90'}}>All Alerts</button>
          </div>
          <ToastContainer position='middle-center' style={{marginTop:'20px', marginBottom:'20px', zIndex: 0}}>
            {notifications.filter((notif) => 
              {if (filter === "unread") {
                  return (!notif.read)
              } else if (filter === "read") {
                  return (notif.read)
             } else if (filter === "all") {
                  return (true)
             }
            }).map(notification => (
              <Toast className="d-inline-block m-1" style={{backgroundColor:'#4e9c90'}} onClose={() => handleDelete(notification.id)}>
                    <Toast.Header>
                    <strong className="me-auto">{notification.read ? (
                      <p></p>
                    ) : (
                      <p>New Alert</p>
                    )}</strong>
                    </Toast.Header>
                    <Toast.Body>
                    <h4 style={{color: 'white'}}>{notification.message}</h4>
                </Toast.Body>
              </Toast>
            ))}
            </ToastContainer>
            {(notifications.length !== 0) && (<button onClick={() => handleClear(userId)} className='alert-btn' style={{width: '250px', height: '60px', fontSize:'20px', marginRight:'10px', marginTop:'20px', border: '2px solid #4e9c90', color: '#4e9c90'}}>Clear notifications</button>)}
            {(notifications.length === 0) && (<h3>No recent notifications</h3>)}

        </div>
        </div>
        <footer className="container" style={{marginTop:'700px'}}>
        <hr></hr>
        <p className="float-right"><a href="#">Back to top</a></p>
        <p style={{paddingBottom:'100px'}}>&copy; 2024 Hobby Hunt, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
    </footer>
    </>
    )

}

export default AlertsPage;