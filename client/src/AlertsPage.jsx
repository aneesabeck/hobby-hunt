import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import WebSocketService from './WebSocketService'
import Cookies from 'js-cookie'

const AlertsPage = ({ userId, hobbyName, hobbyId, fetchNotifications, notifications, setNotifications }) => {
    // const [notifications, setNotifications] = useState([])
    const intHobbyId = parseInt(hobbyId)



    useEffect(() => {
        fetchNotifications(userId)
    }, [userId])

    useEffect(() => {
      if (notifications == []) {
      }
  }, [notifications])

  useEffect(() => {
    const timestamp = new Date().toISOString()
    console.log("time", timestamp)
    markRead(timestamp)
}, [])

    const markRead = async (timestamp) => {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/${userId}/read`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timestamp })
        })
        .then(response => {
          return response.json()
        })
        .then(data => {
            fetchNotifications(userId)
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
            .then(response => {
  
            })
            .then(data => {
                setNotifications(notifications.filter((notif) => notif.id !== notifId))
            })
            .catch(error => {
              console.error('error deleting notif:', error)
            })
    }
    

    return (
        <div>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={intHobbyId}/>
        <h2>Alerts</h2>
        <div>
            {notifications.map(notification => (
                <div key={notification.id} >
                    {notification.message}
                    {notification.read ? (
                      <p>read </p>
                    ) : (
                      <p>not read</p>
                    )}
                    <button onClick={() => handleDelete(notification.id)}>Delete</button>
                </div>
            ))}
            {(notifications.length !== 0) && (<button onClick={() => handleClear(userId)}>Clear notifications</button>)}
            {(notifications.length === 0) && (<h3>No recent notifications</h3>)}

        </div>
        <WebSocketService userId={parseInt(userId)}/>
        </div>
    )

}

export default AlertsPage;