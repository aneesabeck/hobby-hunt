import React, { useState, useEffect } from 'react';
import "./ModalEditProfile.css";

const ModalEditProfile = ({ closeEdits, username, setUsername}) => {
    const [settings, setSettings] = useState(null)
    const [profile, setProfile] = useState(null)
    const [changeUser, setChangeUser] = useState(null)
    const [changePassword, setChangePassword] = useState(null)
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
        closeEdits()
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
        })
      }

      const handleUserSubmit = (e) => {
        e.preventDefault()
        closeEdits()
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
        })
      }

      const handlePassSubmit = (e) => {
        e.preventDefault()
        closeEdits()
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
        })
      }

      function handleCloseModal() {
        closeEdits()
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
    setSettings("Success")
    setProfile("True")
  }

  const handleEditUser = () => {
    setSettings("Success")
    setChangeUser("True")
  }

  const handleEditPassword = () => {
    setSettings("Success")
    setChangePassword("True")
  }


    return (
        <>
      <div className="centered">
                <div className="modal">
                    <div className='modal-content'>
                        {!settings && <button onClick={handleEditUser}>Change Username</button>}
                        {!settings && <button onClick={handleEditPassword}>Change Password</button>}
                        {!settings && <button onClick={handleEditProfile}>Edit Profile</button>}
                    {profile && <form className="board-form" onSubmit={handleSubmit}>
                        <label>
                            First Name: <input type="text" name="firstname" value={formData.firstname} onChange={handleChange}/>
                        </label>
                        <label>
                            Last Name: <input type="text" name="lastname" value={formData.lastname} onChange={handleChange}/>
                        </label>
                        <label>
                            Pronouns: <input type="text" name="pronouns" value={formData.pronouns} onChange={handleChange}/>
                        </label>
                        <label>
                            Bio: <input type="text" name="bio" value={formData.bio} onChange={handleChange}/>
                        </label>
                        <label>Profile Picture: <input type='file' accept="image/*" onChange={handleImgChange}></input></label>

                        <div className="form-buttons">
                            <button type="submit">Submit</button>
                        </div>

                        </form>}

                    {changeUser && <form className="board-form" onSubmit={handleUserSubmit}>
                        <label>
                            Confirm Current Username: <input type="text" name="currentUser" value={formData.currentUser} onChange={handleChange}/>
                        </label>
                        <label>
                            Enter new username: <input type="text" name="newUser" value={formData.newUser} onChange={handleChange}/>
                        </label>

                        <div className="form-buttons">
                            <button type="submit">Submit</button>
                        </div>

                        </form>}

                    {changePassword && <form className="board-form" onSubmit={handlePassSubmit}>
                        <label>
                            Enter Current Password: <input type="text" name="currentPassword" value={formData.currentPassword} onChange={handleChange}/>
                        </label>
                        <label>
                            Enter new password: <input type="text" name="newPassword" value={formData.newPassword} onChange={handleChange}/>
                        </label>

                        <div className="form-buttons">
                            <button type="submit">Submit</button>
                        </div>

                        </form>}
                
                    </div>
                    <button className="closeBtn" onClick={handleCloseModal}>
                        Close
                    </button>
                    

                </div>
      </div>
        
        </>
    )

}



export default ModalEditProfile;