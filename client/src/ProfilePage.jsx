import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import ModalEditProfile from './ModalEditProfile'
import { Route, Routes, useLocation, Link, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const ProfilePage = ({ user, hobbyName, hobbyId, setUsername, handleNewHobby, fetchCurrentUser }) => {
    const intHobbyId = parseInt(hobbyId)
    const [editOpen, setEditOpen] = useState(false)
    const [bgColor, setBgColor] = useState(user?.backgroundColor)

    function changeTheHobby(e) {
      var hobbyId = e.target.value;
      handleNewHobby(hobbyId);
  }
  
    function closeEdits() {
        setEditOpen(false)
      }
    
    function openEdits() {
      setEditOpen(true)
    }

    const handleBgColor = (e) => {
      setBgColor(e.target.value)
      const color = e.target.value
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${user.username}/change-bg`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          color: color,
        }),
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
  
        throw new Error('Failed to change bg color.')
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    }




    return (
        <div style={{backgroundColor: bgColor ?? user?.backgroundColor}}>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={intHobbyId}/>
        <h2>{user?.username}</h2>
        <h3>{user?.firstname}</h3>
        <h3>{user?.lastname}</h3>
        <h3>{user?.pronouns}</h3>
        <img src={user?.pfp}/>
        <h3>{user?.bio}</h3>
        <h3>{hobbyName}</h3>
        <button onClick={openEdits}>Edit Profile</button>
        <label>Select a background Color:
          <select value={bgColor ?? user?.backgroundColor} onChange={handleBgColor}>
            <option value='' onClick={handleBgColor}>Default</option>
              <option value='red' onClick={handleBgColor}>red</option>
              <option value='orange' onClick={handleBgColor}>orange</option>
              <option value='yellow' onClick={handleBgColor}>yellow</option>
              <option value='green' onClick={handleBgColor}>green</option>
              <option value='lightblue' onClick={handleBgColor}>blue</option>
              <option value='purple' onClick={handleBgColor}>purple</option>
              <option value='pink' onClick={handleBgColor}>pink</option>
          </select>

        </label>
        <label>Select a new hobby:
          <select value={hobbyId} onChange={changeTheHobby}>
          <option value='1' >Performing Arts</option>
          <option value='2'>Gardening</option>
          <option value='3'>Soccer</option>
          <option value='4'>Tourism</option>
          <option value='5' >Animation</option>
          <option value='8' >Pottery</option>
         <option value='11' > Crochet</option>
          <option value='12'>Running</option>
          <option value='13'>Video Games</option>
         <option value='14'> Jewelry Collection</option>
          <option value='15'>Music</option>
          <option value='16'>Baking</option>
          <option value='17'>Biking</option>
          </select>
          </label>
        {editOpen && <ModalEditProfile closeEdits={closeEdits} username={user.username} setUsername={setUsername}/>}
        </div>
    )

}

export default ProfilePage;