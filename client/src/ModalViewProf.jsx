import React, { useState, useEffect } from 'react';
import "./ModalEditPost.css";

const ModalEditPost = ({ closeProf, username, userArray }) => {

    function handleCloseModal() {
        closeEdits()
    }

    const fetchCurrentUser = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/get-user`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            setUser(data)
            setUserId(data.id)
        })
        .catch(error => {
            console.error('error fetching user:', error)
        })
    
    }


    return (
        <>
      <div className="centered">
                <div className="modal" style={{backgroundColor: userArray.backgroundColor}}>
                    <div className='modal-content'>
                    <p>{username}</p>
                    <p>{userArray.bio}</p>
                    <p>{userArray.pronouns}</p>
                    <p>{userArray.firstname}</p>
                    <p>{userArray.lastname}</p>

                    </div>
                    <button className="closeBtn" onClick={closeProf}>
                        Close
                    </button>
                    

                </div>
      </div>
        
        </>
    )

}



export default ModalEditPost;