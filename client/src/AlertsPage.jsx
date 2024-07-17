import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import WebSocketService from './WebSocketService'
import Cookies from 'js-cookie'

const AlertsPage = ({ userId, hobbyName, hobbyId }) => {
    console.log("userId", userId)
    console.log("hobbyName", hobbyName)
    console.log("hobbyId", hobbyId)
    const [notifications, setNotifications] = useState([])
    const intHobbyId = parseInt(hobbyId)


    const fetchNotifications = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/${userId}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            setNotifications(data)
        })
        .catch(error => {
            setNotifications([])
            console.error('error fetching notifs:', error)
        })
    }

    useEffect(() => {
        fetchNotifications()
    }, [userId])

    useEffect(() => {
      if (notifications == []) {
      }
  }, [notifications])


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
                fetchNotifications()
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
              console.log("res", response)
            })
            .then(data => {
                console.log("data", data)
                setNotifications(notifications.filter((notif) => notif.id !== notifId))
            })
            .catch(error => {
              console.error('error deleting notif:', error)
            })
    }
    console.log(notifications)
    

    return (
        <div>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={intHobbyId}/>
        <h2>Alerts</h2>
        <div>
            {notifications.map(notification => (
                <div key={notification.id} >
                    {notification.message}
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