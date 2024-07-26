import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './Sidebar.css'
import { slide as Menu } from 'react-burger-menu'
import Cookies from 'js-cookie'

function Sidebar({ hobbyName, hobbyId }) {
    const [community, setCommunity] = useState(false)
    const [details, setDetails] = useState(false)
    const [profile, setProfile] = useState(false)
    const [alerts, setAlerts] = useState(false)
    const [out, setOut] = useState(false)

    const handleCommunity = () => {
        setCommunity(true)
      }
    const handleDetails = () => {
        setDetails(true)
    }
    const handleProfile = () => {
        setProfile(true)
      }
    const handleAlerts = () => {
        setAlerts(true)
    }

    const handleSignOut = () => {
        setOut(true)
        Cookies.remove("username")
    }



    return (
        <>
            <Menu>
            <h3 className='menu-item' onClick={handleCommunity}>{hobbyName} Community</h3>
            <h3 className='menu-item'  onClick={handleDetails}>{hobbyName} Details</h3>
            <h3 className='menu-item'  onClick={handleProfile}>Profile</h3>
            <h3 className='menu-item'  onClick={handleAlerts}>Alerts</h3>
            <h3 className='menu-item'  onClick={handleSignOut}>Sign Out</h3>
    
            </Menu>
            {community &&  (<Navigate to={`/hobby-community/${hobbyId}`}/>)}
            {details &&  (<Navigate to={`/hobby-community/${hobbyId}`}/>)}
            {profile &&  (<Navigate to={`/profilepage`}/>)}
            {alerts &&  (<Navigate to={`/alerts`}/>)}
            {out &&  (<Navigate to={`/`}/>)}
        </>
    );
};
export default Sidebar