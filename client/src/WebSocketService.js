import { useEffect, useRef } from 'react'
import useSound from 'use-sound'
import bell from './assets/bell.wav'

const WebSocketService = ({ userId, fetchNotifications }) => {
    const socketRef = useRef(null)
    const playNotificationSound = () => {
        console.log("play")
        new Audio(bell).play()
    }


    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8080')
        console.trace('websocket connected')
        socketRef.current.onopen = () => {
            // console.trace('websocket connected')
            socketRef.current.send(JSON.stringify({ userId }))
        }
        socketRef.current.onmessage = (event) => {
            console.log('received message:', event.data)
            playNotificationSound()
            fetchNotifications(userId)
        }
        socketRef.current.onclose = () => {
            console.error('websocket closed')
        }
        socketRef.current.onerror = (error) => {
            console.log('error', error)
        }

        // socketRef.addEventListener("open", (event) => {
        //     socketRef.current.send(JSON.stringify({ userId }))
        //   });

        // return () => {
        //     socketRef.current.close()
        // }
    }, [userId])
    return null
}

export default WebSocketService