import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './Login.css'

function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const [currentUser, setCurrentUser] = useState(null)
    const [hobby, SetHobby] = useState(null)
  
    const handleChangeUser = (e) => {
      setUser(e.target.value);
    }
  
    const handleChangePassword = (e) => {
      setPassword(e.target.value);
    }
  
    const handleLogin = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user,
              password,
            }), 
          })
          .then(response => {
            if (response.ok) {
              setResult("login success!");
              fetchUserHobby()
              // return currentUser
            }
            else {
              setResult("failed to login!");
            }
          })
          .catch(error => {
            setResult("failed to login!");
          });
      }

    const fetchUserHobby = () => {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${user}/get-hobbyId`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status: ${response.status}`)
        }
        return response.json();
      })
      .then(data => {
        SetHobby(data)
      })
      .catch(error => {
        console.error('error fetching hobbies:', error)
      })
    }

  
    return (
        <>
        <div className='login-header'>
            <Link to="/">
              <div className='back-header'>
                <FontAwesomeIcon icon={faArrowLeft} className='back-logo'/>
              </div>
            </Link>
            <h1 className='login-title'>Log in</h1>
        </div>
      <div className='user-pass'>       
        <label className='username-input'>Username: <input onChange={handleChangeUser} value={user} placeholder='Enter your username' required></input></label>
        <label className='password-input'>Password: <input onChange={handleChangePassword} value={password} placeholder='Enter your password' required></input></label>
      </div>
      <div className='login-btns'>
        <Link to="/login">
          <button onClick={handleLogin} className='login-btn'>Log in</button>
        </Link>
        <Link to="/create">
          <button>Don't have an account? Create now</button>
        </Link>
      </div>
      <div>
        { result && <p>{result}</p>}
      </div>
      {hobby && (<Navigate to={`/${user}/${hobby}`} replace={true}/>)}
      </>
    )

}
  
export default Login
