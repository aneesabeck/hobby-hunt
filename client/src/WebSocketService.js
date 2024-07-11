import { useEffect, useRef } from 'react'

const WebSocketService = ({ userId }) => {
    const socketRef = useRef(null)
    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8080')
        socketRef.current.onopen = () => {
            console.log('websocket connected')
            socketRef.current.send(JSON.stringify({ userId }))
        }
        socketRef.current.onmessage = (event) => {
            console.log('received message:', event.data)
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