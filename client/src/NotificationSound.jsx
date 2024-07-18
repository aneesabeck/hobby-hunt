import React, { createContext, useEffect } from 'react'

export const NotificationContext = createContext()

const NotificationSound = ({ children }) => {
    const playNotificationSound = () => {
        const audio = new Audio('/assets/bell.wav')
        console.log("play")
        audio.play()
    }

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080')

        socket.onmessage = (event) => {
            const newNotification = JSON.parse(event.data)
            playNotificationSound()
        }
        return () => {
            socket.close()
        };
    }, [])

    return (
        <NotificationContext.Provider value={{}}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationSound