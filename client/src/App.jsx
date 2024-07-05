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
    {/* {location.pathname === '/create' && (
      <>
        <div className='header-right'>
            <Link to="/login">
              <button className='header-button'>Login</button>
            </Link>
        </div>
      </>
    )}
    {location.pathname === '/login' && (
      <>
        <div className='header-right'>
            <Link to="/create">
              <button className='header-button'>Create an account</button>
            </Link>
        </div>
      </>
    )} */}
  
      <Routes>
            <Route path="/create" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/:username/profile-setup" element={<SetProfile/>}/>
            <Route path="/:username/interests" element={<SetInterests/>}/>
            <Route path="/:username/select-hobby" element={<SetHobby/>}/>
            <Route path="/:username/:hobby" element={<HobbyCommunity/>}/>
      </Routes>


      </>
  )
}

export default App
