import { useEffect, useRef } from 'react'
import useSound from 'use-sound'
import bell from './assets/bell.wav'

const WebSocketService = ({ userId }) => {
    const socketRef = useRef(null)
    // const playNotificationSound = () => {
    //     const audio = new Audio('/assets/bell.wav')
    //     console.log("play")
    //     audio.play()
    // }
    const playNotificationSound = () => {
        console.log("play")
        new Audio(bell).play()
    }


    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8080')
        socketRef.current.onopen = () => {
            console.log('websocket connected')
            socketRef.current.send(JSON.stringify({ userId }))
        }
        socketRef.current.onmessage = (event) => {
            console.log('received message:', event.data)
            playNotificationSound()
        }
        socketRef.current.onclose = () => {
            console.log('websocket closed')
        }
        socketRef.current.onerror = (error) => {
            console.log('error', error)
        }
        return () => {
            socketRef.current.close()
        }
    }, [userId])
    return null
}

export default WebSocketService