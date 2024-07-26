import React from 'react';
import Modal from 'react-bootstrap/Modal';

const ModalViewProf = ({ userArray, show, onHide }) => {
    return (
        <>
        <Modal show={show} onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{backgroundColor: userArray?.backgroundColor}}
          >
       <Modal.Header closeButton className='text-center'>
          <Modal.Title id="contained-modal-title-vcenter" className='text-center'>
            <h2>@{userArray?.username}'s Profile</h2>
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-center'>
            <h4>{userArray?.firstname} {userArray?.lastname}</h4>
            <h4>{userArray?.pronouns}</h4>
            <h4>{userArray?.bio}</h4>
        </div>
      </Modal.Body>
      </Modal>
        
        </>
    )

}



export default ModalViewProf;