import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import WebSocketService from './WebSocketService'
import Cookies from 'js-cookie'

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
        // .then(response => {
        //   console.log(response)
        //   return response.json()
        // })
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

    // const sortedNotifs = notifications

    // function sortNotifs(type) {
    //     if (notifications == null) {
    //       return
    //     }
    //     console.log("sort notifications", notifications)
    //     if (type === "unread") {
    //       const newNotifs = notifications.filter(notif => (!notif.read))
    //       setSortedNotifs(newNotifs)
    //       // setNotifications(newNotifs);
    //     } else if (type === "read") {
    //       const newNotifs = notifications.filter(notif => (notif.read))
    //       setSortedNotifs(newNotifs)
    //       // setNotifications(newNotifs)
    //     } else if (type === "all") {
    //       setSortedNotifs(notifications)
    //       // setNotifications(notifications)
    //     }
    // }
    // console.log("sorted", sortedNotifs)
    

    return (
        <div>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={intHobbyId}/>
        <h2>Alerts</h2>
        <div>
          <button onClick={() => setFilter("unread")}>New Alerts</button>
          <button onClick={() => setFilter("read")}>Read Alerts</button>
          <button onClick={() => setFilter("all")}>All Alerts</button>
            {notifications.filter((notif) => 
              {if (filter === "unread") {
                  return (!notif.read)
              } else if (filter === "read") {
                  return (notif.read)
             } else if (filter === "all") {
                  return (true)
             }
            }).map(notification => (
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
        </div>
    )

}

export default AlertsPage;