import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
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
      <div className='user-pass'>       
        <label><input onChange={handleChangeUser} value={user} placeholder='Username' required></input></label>
        <label><input onChange={handleChangePassword} value={password} placeholder='Password' required></input></label>
      </div>
      <Link to="/login">
      <button onClick={handleLogin} className='login-btn'>Log in</button>
      </Link>
      <div>
        { result && <p>{result}</p>}
      </div>
      {hobby && (<Navigate to={`/${user}/${hobby}`} replace={true}/>)}
      </>
    )

}
  
export default Login
