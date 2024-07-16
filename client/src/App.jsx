import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Link, Navigate } from 'react-router-dom'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWorm } from '@fortawesome/free-solid-svg-icons'
import Login from './Login'
import SignUp from './SignUp'
import SetProfile from './SetProfile'
import SetInterests from './SetInterests'
import SetHobby from './SetHobby'
import HobbyCommunity from './HobbyCommunity'
import AlertsPage from './AlertsPage'
import ProfilePage from './ProfilePage'
import Cookies from 'js-cookie'

function App() {
  let location = useLocation()
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(Cookies.get('username'))
  const [userId, setUserId] = useState("")
  const [hobby, setHobby] = useState("")
  const [hobbyId, setHobbyId] = useState("")
  console.log("cookies", Cookies.get('username'))

  const handleNewHobby = (e) => {
    setHobbyId(e.target.value)
    const newhobbyId = e.target.value
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/change-hobby`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hobbyId: newhobbyId,
      }),
    })
    .then(response => {
      return response.json()

    })
    .then(data => {
      setHobbyId(data.hobbyId)
      setUser(data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }

  useEffect(() => {
    const fetchCurrentHobby = async () => {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/get-hobby`)
      .then(response => {
      })
      .then(data => {
          setHobby(data.name)
      })
      .catch(error => {
          console.error('error fetching hobby:', error)
      })
  }
}, [hobbyId])
console.log("hobbyId", hobbyId)

const fetchCurrentUser = async () => {
  console.log("hello")
  fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/get-user`)
  .then(response => {
      if (!response.ok) {
          throw new Error(`status: ${response.status}`)
      }
      return response.json();
  })
  .then(data => {
      setHobbyId(data.hobbyId)
      setUser(data)
  })
  .catch(error => {
      console.error('error fetching user:', error)
  })

}

useEffect(() => {
  fetchCurrentUser()
}, [username])

  
  return (
    <>
    {location.pathname === '/' && (
      <>
      <div className='header'>
        <div className='header-left'>
          <FontAwesomeIcon icon={faWorm} className='hobby-logo'/>
          <h1 className='title'>Hobby Hunt</h1>
        </div>
        <div className='header-right'>
        {!username &&  (<Link to="/login"><button className='header-button'>Login</button> </Link> )}
        {!username &&  (<Link to="/create"><button className='header-button'>Create an account</button></Link> )}
        </div>
      </div>
      <div className='main-content'>
        <h2 className='center-text'>Hobby hunt information</h2>

      </div>
  </>
    )}
  
      <Routes>
            <Route path="/create" element={<SignUp setUsername={setUsername}/>}/>
            <Route path="/login" element={<Login setUsername={setUsername} setUserArray={setUser} setHobbyId={setHobbyId}/>}/>
            <Route path="/profile-setup" element={<SetProfile username={username} setUserId={setUserId}/>}/>
            <Route path="interests" element={<SetInterests username={username}/>}/>
            <Route path="/select-hobby" element={<SetHobby username={username} setUser={setUser} setHobbyId={setHobbyId}/>}/>
            <Route path="/:hobbyId" element={<HobbyCommunity username={username} setHobby={setHobby} setHobbyId={setHobbyId} userId={userId} setUser={setUser} setUserId={setUserId} hobbyId={hobbyId} handleNewHobby={handleNewHobby}/>}/>
            <Route path="/alerts" element={<AlertsPage userId={userId} hobbyName={hobby} hobbyId={hobbyId}/>}/>
            <Route path="/profilepage" element={<ProfilePage user={user} hobbyName={hobby} hobbyId={hobbyId} setUsername={setUsername}/>}/>
      </Routes>


      </>
  )
}

export default App
