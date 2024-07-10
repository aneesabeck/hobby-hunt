import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { IconContext } from "react-icons/lib";
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai";
import './Sidebar.css'
import { slide as Menu } from 'react-burger-menu'

function Sidebar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);



    return (
        <>
            <Menu>
            <h3 className='menu-item'>hobby Community Page</h3>
            <h3 className='menu-item'>hobby Details</h3>
            <h3 className='menu-item'>Profile</h3>
            <h3 className='menu-item'>Alerts</h3>
    
            </Menu>
        </>
    );
};
export default Sidebar