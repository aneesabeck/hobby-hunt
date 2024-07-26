import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'
import ModalEditProfile from './ModalEditProfile'
import Image from 'react-bootstrap/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

const ProfilePage = ({ user, username, hobbyName, hobbyId, setUsername, handleNewHobby, fetchCurrentUser }) => {
    const intHobbyId = parseInt(hobbyId)
    const [editOpen, setEditOpen] = useState(false)
    const [bgColor, setBgColor] = useState(user?.backgroundColor)
    const [modalShow, setModalShow] = useState(false);
    const [settings, setSettings] = useState(null)

    function changeTheHobby(e) {
      var hobbyId = e.target.value;
      handleNewHobby(hobbyId);
  }


    useEffect(() => {
      fetchCurrentUser()
    }, [user])

    const handleBgColor = (e) => {
      setBgColor(e.target.value)
      const color = e.target.value
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/change-bg`, {
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
      <>
      <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={intHobbyId}/>
        <div className='text-center'>
          <br></br><br></br><br></br><br></br>
          <h1>Hello, {user?.firstname}!</h1>
          <br></br>
          <div className="text-center mb-4" style={{border: '1.5px solid #4e9c90', margin: '20px 30px 20px 30px', borderRadius: '8px', boxShadow: '0px 0px 20px #4e9c90', backgroundColor: bgColor ?? user?.backgroundColor, color: (bgColor==='#B80F0A')? 'white' : 'black'}}>
        <br></br>
        <h1>@{username}</h1>
        <div>
        <h2>{user?.firstname} {user?.lastname}</h2>
        <h3></h3>
        </div>
        <h3>{user?.pronouns}</h3>
        <Image src={(user?.pfp)? user?.pfp : 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'} style={{width: '400px', height: '350px', border: '1.5px solid darkgrey', padding: '20px'}} rounded />
        <h3 style={{marginTop: '20px'}}>Bio: {user?.bio}</h3>
        <h3 style={{marginBottom:'20px'}}>Current Hobby: {hobbyName}</h3>
        <label style={{margin:'20px', fontSize:'25px'}}>Select a background Color:
          <select value={bgColor ?? user?.backgroundColor} onChange={handleBgColor}>
            <option value='white' onClick={handleBgColor}>Default</option>
              <option value='#B80F0A' onClick={handleBgColor}>red</option>
              <option value='orange' onClick={handleBgColor}>orange</option>
              <option value='#FADA5E' onClick={handleBgColor}>yellow</option>
              <option value='#597D35' onClick={handleBgColor}>green</option>
              <option value='lightblue' onClick={handleBgColor}>blue</option>
              <option value='#8D4585' onClick={handleBgColor}>purple</option>
              <option value='pink' onClick={handleBgColor}>pink</option>
          </select>
    

        </label>
        <label style={{margin:'20px', fontSize:'25px'}}>Select a new hobby:
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
          <br></br>
          <FontAwesomeIcon icon={faGear} className='edit-btn' onClick={() => setModalShow(true)} style={{color: '#4e9c90', fontSize: '50px', marginBottom: '20px'}}/>

          
        
        </div>
        <br></br><br></br><br></br>
        <ModalEditProfile username={username} setUsername={setUsername} show={modalShow} onHide={() => {setModalShow(false), setSettings(null)}} settings={settings} setSettings={setSettings}/>
        </div>
        <footer className="container">
            <hr></hr>
            <p className="float-right"><a href="#">Back to top</a></p>
            <p>&copy; 2024 Hobby Hunt, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
            <br></br><br></br><br></br><br></br><br></br>
        </footer>
        </>
    )

}

export default ProfilePage;