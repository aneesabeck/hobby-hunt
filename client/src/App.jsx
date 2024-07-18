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
  const [hobbyId, setHobbyId] = useState(null)
  const cookies = Cookies.get('username')

  useEffect(() => {
    if (cookies == null) {
      setUser(null)
      setHobby("")
      setUsername("")
    }
}, [cookies])


  const handleNewHobby = (newHobbyId) => {
    // const newhobbyId = e.target.value
    // remove this put, because changing dropdown shouldn't affect the state
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/change-hobby`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hobbyId: newHobbyId,
      }),
    })
    .then(response => {
      return response.json()

    })
    .then(data => {
      setHobbyId(data.hobbyId)
      setUser(data)
      setHobby(data.hobbyName)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }

  const fetchCurrentHobby = async () => {
    if (hobbyId == null) {
      return
    }
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/get-hobby`)
    .then(response => {
      return response.json()
    })
    .then(data => {
        setHobby(data.name)
    })
    .catch(error => {
        console.error('error fetching hobby:', error)
    })
}


useEffect(() => {
  fetchCurrentHobby()
}, [userId])

const fetchCurrentUser = async () => {
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
      setUserId(data.id)
  })
  .catch(error => {
      console.error('error fetching user:', error)
  })

}


useEffect(() => {
  fetchCurrentUser()
}, [])




  
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
        {username &&  (<Link to={`/hobby-community/${hobbyId}`}><button className='header-button'>Hobby Community</button></Link> )}
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
            <Route path="/hobby-community/:hobbyId" element={<HobbyCommunity username={username} setHobby={setHobby} setHobbyId={setHobbyId} userId={userId} setUser={setUser} setUserId={setUserId} hobbyId={hobbyId} handleNewHobby={handleNewHobby}/>}/>
            <Route path="/alerts" element={<AlertsPage userId={userId} hobbyName={hobby} hobbyId={hobbyId}/>}/>
            <Route path="/profilepage" element={<ProfilePage user={user} hobbyName={hobby} hobbyId={hobbyId} setUsername={setUsername}  handleNewHobby={handleNewHobby} fetchCurrentUser={fetchCurrentUser}/>}/>
      </Routes>


      </>
  )
}

export default App
