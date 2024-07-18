import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './SignUp.css'

function SignUp({ setUsername }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [result, setResult] = useState(null);
    const [currentUser, setCurrentUser] = useState(null)
    // const history = useHistory();
  
    const handleChangeUser = (e) => {
      setUser(e.target.value);
    }
  
    const handleChangePassword = (e) => {
      setPassword(e.target.value);
    }

    const handleChangeFirst = (e) => {
        setFirst(e.target.value);
      }

    const handleChangeLast = (e) => {
        setLast(e.target.value);
      }
  
    const handleCreate = () => {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user,
            password,
            first,
            last
          }), 
        })
        .then(response => {
          if (response.ok) {
            setResult("Success");
            setUsername(user)
            setCurrentUser(response.json())
          }
          else {
            setResult("Fail");
          }
        })
        .catch(error => {
          setResult("Fail");
        });
    }

    return (
        <>
        <div className='create-header'>
            <Link to="/">
              <div className='back-header'>
                <FontAwesomeIcon icon={faArrowLeft} className='back-logo'/>
              </div>
            </Link>
            <h1 className='create-title'>Sign Up</h1>
        </div>
        <div className='fullname'>       
        <label><input onChange={handleChangeFirst} value={first} placeholder='First Name' required></input></label>
        <label><input onChange={handleChangeLast} value={last} placeholder='Last Name' required></input></label>
      </div>
      <div className='user-pass'>       
        <label><input onChange={handleChangeUser} value={user} placeholder='Username' required></input></label>
        <label><input onChange={handleChangePassword} value={password} placeholder='Password' required></input></label>
      </div>
      <div className='create-btns'>
        <Link to="/create">
          <button onClick={handleCreate} className='create-btn'>Sign Up</button>
        </Link>
        <Link to="/login">
          <button>Have an account? Log in</button>
        </Link>
      </div>
      <div>
        { result && <p>{result}</p>}
      </div>
      {currentUser && (<Navigate to={`/profile-setup`} replace={true}/>)}
      </>
    )

}
  
export default SignUp