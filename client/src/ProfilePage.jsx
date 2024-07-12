import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'

const ProfilePage = ({ user, hobbyName, hobbyId }) => {
    const intHobbyId = parseInt(hobbyId)
    console.log(user)


    return (
        <div>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={intHobbyId}/>
        <h2>{user.username}</h2>
        <h3>{user.firstname}</h3>
        <h3>{user.lastname}</h3>
        <h3>{user.pronouns}</h3>
        <img src={user.pfp}/>
        <h3>{user.bio}</h3>
        <h3>{hobbyName}</h3>
        </div>
    )

}

export default ProfilePage;