import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import WebSocketService from './WebSocketService'

const AlertsPage = ({ userId, hobbyName, hobbyId }) => {
    const [notifications, setNotifications] = useState([])
    const [empty, setEmpty] = useState(null)
    const intHobbyId = parseInt(hobbyId)


    const fetchNotifications = async () => {
        console.log(userId)
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            setNotifications(data)
            if (data.length !== 0) {
                setEmpty("Success")
            }
        })
        .catch(error => {
            setNotifications([])
            setEmpty(null)
            console.error('error fetching notifs:', error)
        })
    }

    useEffect(() => {
        fetchNotifications()
        console.log("fetch notif")
    }, [userId])


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
                setEmpty(null)
                fetchNotifications()
            })
            .catch(error => {
              console.error('error clearing notifs:', error)
            })
    }

    const handleDelete = async (notifId) => {
        console.log(notifId)
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/delete/${notifId}`, 
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
                    <button onClick={() => handleDelete(notification.id)}>Delete</button>
                </div>
            ))}
            {empty != null && (<button onClick={() => handleClear(userId)}>Clear notifications</button>)}
            {empty == null && (<h3>No recent notifications</h3>)}

        </div>
        <WebSocketService userId={parseInt(userId)}/>
        </div>
    )

}

export default AlertsPage;