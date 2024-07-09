import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Link } from 'react-router-dom'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWorm } from '@fortawesome/free-solid-svg-icons'
import Login from './Login'
import SignUp from './SignUp'
import SetProfile from './SetProfile'
import SetInterests from './SetInterests'
import SetHobby from './SetHobby'
import HobbyCommunity from './HobbyCommunity'

function App() {
  let location = useLocation()
  const [username, setUsername] = useState("")
  
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
            <Link to="/login">
              <button className='header-button'>Login</button>
            </Link>
            <Link to="/create">
              <button className='header-button'>Create an account</button>
            </Link>
        </div>
      </div>
      <div className='main-content'>
        <h2 className='center-text'>Hobby hunt information</h2>

      </div>
  </>
    )}
  
      <Routes>
            <Route path="/create" element={<SignUp setUsername={setUsername}/>}/>
            <Route path="/login" element={<Login setUsername={setUsername}/>}/>
            <Route path="/profile-setup" element={<SetProfile username={username}/>}/>
            <Route path="interests" element={<SetInterests username={username}/>}/>
            <Route path="/select-hobby" element={<SetHobby username={username}/>}/>
            <Route path="/:hobby" element={<HobbyCommunity username={username}/>}/>
      </Routes>


      </>
  )
}

export default App
