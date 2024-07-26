import { useEffect, useRef } from 'react'
import bell from './assets/bell.wav'

const WebSocketService = ({ userId, fetchNotifications }) => {
    const socketRef = useRef(null)
    const playNotificationSound = () => {
        new Audio(bell).play()
    }


    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8080')
        console.trace('websocket connected')
        socketRef.current.onopen = () => {
            socketRef.current.send(JSON.stringify({ userId }))
        }
        socketRef.current.onmessage = (event) => {
            playNotificationSound()
            fetchNotifications(userId)
        }
        socketRef.current.onclose = () => {
            console.error('websocket closed')
        }
        socketRef.current.onerror = (error) => {
            console.error(error)
        }
    }, [userId])
    return null
}

export default WebSocketService