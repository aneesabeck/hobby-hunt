import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { IconContext } from "react-icons/lib";
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai";
import './Sidebar.css'
import { slide as Menu } from 'react-burger-menu'

function Sidebar({ hobbyName, hobbyId }) {
    const [sidebar, setSidebar] = useState(false);
    const [community, setCommunity] = useState(null)
    const [details, setDetails] = useState(null)
    const [profile, setProfile] = useState(null)
    const [alerts, setAlerts] = useState(null)

    const showSidebar = () => setSidebar(!sidebar);

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



    return (
        <>
            <Menu>
            <h3 className='menu-item' onClick={handleCommunity}>{hobbyName} Community</h3>
            <h3 className='menu-item'  onClick={handleDetails}>{hobbyName} Details</h3>
            <h3 className='menu-item'  onClick={handleProfile}>Profile</h3>
            <h3 className='menu-item'  onClick={handleAlerts}>Alerts</h3>
    
            </Menu>
            {community &&  (<Navigate to={`/${hobbyId}`}/>)}
            {details &&  (<Navigate to={`/${hobbyId}`}/>)}
            {profile &&  (<Navigate to={`/${hobbyId}`}/>)}
            {alerts &&  (<Navigate to={`/${hobbyId}`}/>)}
        </>
    );
};
export default Sidebar