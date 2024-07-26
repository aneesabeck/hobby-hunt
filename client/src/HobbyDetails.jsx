import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Link, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'


const HobbyDetails = ({ username, hobbyId, hobbyName}) => {
    const [tools, setTools] = useState('')
    useEffect(() => {
        fetchDetails()
    }, [username])
    
    const fetchDetails = async () => {
        if (hobbyId == null) {
            return
        }
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/get-tools`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            setTools(data.replace('y', 'h'))
        })
        .catch(error => {
            console.error('error fetching tools:', error)
        })
    
    }
    return (
        <>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={parseInt(hobbyId)}/>
        <h1>Affordable tools</h1>
        <p>{tools}</p>
        </>
    )
}

export default HobbyDetails;