import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Link } from 'react-router-dom'
import './App.css'
import Login from './Login'
import SignUp from './SignUp'
import SetProfile from './SetProfile'
import SetInterests from './SetInterests'

function App() {
  let location = useLocation()

  return (
    <>
    {location.pathname === '/create' && (
      <>
      <div className='sign-header-container'>
        <div className='create-login-box'>
            <Link to="/login">
              <h1>Login</h1>
            </Link>
        </div>
        <div className='create-signup-box'>
            <Link to="/create">
              <h1>Create an account</h1>
            </Link>
        </div>
      </div>
      </>
    )}
    {location.pathname === '/login' && (
      <>
      <div className='sign-header-container'>
        <div className='login-box'>
            <Link to="/login">
              <h1>Login</h1>
            </Link>
        </div>
        <div className='signup-box'>
            <Link to="/create">
              <h1>Create an account</h1>
            </Link>
        </div>
      </div>
      </>
    )}
  
      <Routes>
            <Route path="/create" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/:username/profile-setup" element={<SetProfile/>}/>
            <Route path="/:username/interests" element={<SetInterests/>}/>
      </Routes>


      </>
  )
}

export default App
