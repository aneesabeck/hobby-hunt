import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import WebSocketService from './WebSocketService'

const AlertsPage = ({ userId, hobbyName, hobbyId }) => {
    const [notifications, setNotifications] = useState([])
    const intHobbyId = parseInt(hobbyId)

    useEffect(() => {
        fetch(`/notifications/${userId}`)
        .then(response => response.json())
        .then(data => setNotifications(data))
        .catch(error => console.log(error))
    }, [userId])

    return (
        <div>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={intHobbyId}/>
        <h2>Alerts</h2>
        <div>
            {notifications.map(notification => (
                <div key={notification.id} >
                    {notification.message}
                </div>
            ))}

        </div>
        </div>
    )

}

export default AlertsPage;