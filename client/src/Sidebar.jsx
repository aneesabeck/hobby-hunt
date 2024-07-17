import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './Sidebar.css'
import { slide as Menu } from 'react-burger-menu'
import Cookies from 'js-cookie'

function Sidebar({ hobbyName, hobbyId }) {
    const [sidebar, setSidebar] = useState(false);
    const [community, setCommunity] = useState(null)
    const [details, setDetails] = useState(null)
    const [profile, setProfile] = useState(null)
    const [alerts, setAlerts] = useState(null)
    const [out, setOut] = useState(null)

    const handleCommunity = () => {
        setCommunity("Success")
      }
    const handleDetails = () => {
        setDetails("Success")
    }
    const handleProfile = () => {
        setProfile("Success")
      }
    const handleAlerts = () => {
        setAlerts("Success")
    }

    const handleSignOut = () => {
        setOut("Success")
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