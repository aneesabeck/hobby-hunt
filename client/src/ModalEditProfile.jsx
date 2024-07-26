import React, { useState } from 'react';
import "./ModalEditProfile.css";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ModalEditProfile = ({ username, setUsername, show, onHide, settings, setSettings }) => {
    const [profile, setProfile] = useState(false)
    const [changeUser, setChangeUser] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [findError, setFindError] = useState(null)
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        pronouns: '',
        bio: '',
        pfp: '',
        currentUser: '',
        newUser: '',
        currentPassword: '',
        newPassword: ''
      })
    const [pfp, setPfp] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
    
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }))
      }

      const handleSubmit = (e) => {
        e.preventDefault()
        onHide()
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/edit-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstname: formData.firstname,
            lastname: formData.lastname,
            pronouns: formData.pronouns,
            bio: formData.bio,
            pfp: pfp
          }),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
    
          throw new Error('Failed to edit profile.')
        })
        .catch((error) => {
          console.error('Error:', error)
          setFindError('Try again!')
        })
      }

      const handleUserSubmit = (e) => {
        e.preventDefault()
        onHide()
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${formData.currentUser}/edit-user`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newUser: formData.newUser,
          }),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
    
          throw new Error('Failed to edit username.')
        })
        .then(data => {
          setUsername(formData.newUser)
        })
        .catch((error) => {
          console.error('Error:', error)
          setFindError('Your current username does not matcg! Try again')
        })
      }

      const handlePassSubmit = (e) => {
        e.preventDefault()
        onHide()
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          }),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
    
          throw new Error('Failed to edit password.')
        })
        .catch((error) => {
          console.error('Error:', error)
          setFindError("Incorrect password! Try again")
        })
      }



    const handleImgChange = (e) => {
      const file = e.target.files[0]
      if (!file || !file.type.startsWith('image/')){
          console.error("Please select an image file")
      }
      const reader = new FileReader()
      reader.onload = () => {
          setPfp(reader.result)
      }
      reader.readAsDataURL(file)
  }

  const handleEditProfile = () => {
    setSettings(true)
    setProfile(true)
    setChangeUser(false)
    setChangePassword(false)
  }

  const handleEditUser = () => {
    setSettings(true)
    setChangeUser(true)
    setProfile(false)
    setChangePassword(false)
  }

  const handleEditPassword = () => {
    setSettings(true)
    setChangePassword(true)
    setProfile(false)
    setChangeUser(false)
  }

 


    return (
        <>
        <Modal show={show} onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{backgroundColor:'#4e9c90'}}
    >
      <Modal.Header closeButton className='text-center'>
        <Modal.Title id="contained-modal-title-vcenter" className='text-center'>
          {!settings && <h2>Settings</h2>}
          {profile && settings && <h2>Edit your profile</h2>}
          {changeUser && settings && <h2>Change your username</h2>}
          {changePassword && settings && <h2>Change your password</h2>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className='text-center' style={{marginBottom:'20px', marginTop:'20px'}}>
        {!settings && <button onClick={handleEditUser} className='settings-btn' style={{width: '200px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Change Username</button>}
        {!settings && <button onClick={handleEditPassword} className='settings-btn' style={{width: '200px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Change Password</button>}
        {!settings && <button onClick={handleEditProfile} className='settings-btn' style={{width: '200px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Edit Profile</button>}
        </div>

        {profile && settings && 
        <div className="text-center mb-4">
        <form onSubmit={handleSubmit}>
        <Form className="form-signin">
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control  size="lg" type="text" placeholder="Change your first name" onChange={handleChange} name="firstname" value={formData.firstname}/>
            <Form.Control  size="lg" type="text" placeholder="Change your last name" onChange={handleChange} name="lastname" value={formData.lastname}/>
            <Form.Control  size="lg" type="text" placeholder="Change your pronouns" onChange={handleChange} name="pronouns" value={formData.pronouns}/>
            <Form.Control  size="lg" type="text" placeholder="Change your bio" onChange={handleChange} name="bio" value={formData.bio}/>
            <Form.Control  size="lg" type="text" placeholder="Change your bio" onChange={handleImgChange} name="bio" value={formData.bio}/>
        
        </Form.Group> 
        <Form.Group controlId="formFile" className="mb-4">
                <Form.Label>Change your profile picture</Form.Label>
                <Form.Control type="file" onChange={handleImgChange}/>
            </Form.Group>
        </Form>
        <button type="submit" className='settings-btn' style={{width: '150px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Submit</button>
        </form>
        {findError && <p>{findError}</p>}
        </div>
        }

        {changeUser && settings && 
        <div className="text-center mb-4">
        <Form className="form-signin" onSubmit={handleUserSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control  size="lg" type="text" placeholder="Enter your current username" onChange={handleChange} name="currentUser" value={formData.currentUser}/>
            <Form.Control  size="lg" type="text" placeholder="New Username" onChange={handleChange} name="newUser" value={formData.newUser}/>
        </Form.Group> 
        <button type="submit" className='settings-btn' style={{width: '150px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Submit</button>
        </Form>
        {findError && <p>{findError}</p>}
        </div>}

    {changePassword && settings && 
    <div className="text-center mb-4">
    <Form className="form-signin" onSubmit={handlePassSubmit}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control  size="lg" type="text" placeholder="Enter your current password" onChange={handleChange} name="currentPassword" value={formData.currentPassword}/>
        <Form.Control  size="lg" type="text" placeholder="New Password" onChange={handleChange} name="newPassword" value={formData.newPassword}/>
    </Form.Group> 
    <button type="submit" className='settings-btn' style={{width: '150px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Submit</button>
    </Form>
    {findError && <p>{findError}</p>}
    </div>}         

      </Modal.Body>
    </Modal>
        
        </>
    )

}



export default ModalEditProfile;