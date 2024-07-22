import React, { useState, useEffect } from 'react';
import "./ModalEditPost.css";

const ModalViewProf = ({ closeProf, username, userArray }) => {


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



export default ModalViewProf;