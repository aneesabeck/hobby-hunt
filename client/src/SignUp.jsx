import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './SignUp.css'

function SignUp() {
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
        <div className='fullname'>       
        <label><input onChange={handleChangeFirst} value={first} placeholder='First Name' required></input></label>
        <label><input onChange={handleChangeLast} value={last} placeholder='Last Name' required></input></label>
      </div>
      <div className='user-pass'>       
        <label><input onChange={handleChangeUser} value={user} placeholder='Username' required></input></label>
        <label><input onChange={handleChangePassword} value={password} placeholder='Password' required></input></label>
      </div>
      <button onClick={handleCreate} className='create-btn'>Create new account</button>
      <div>
        { result && <p>{result}</p>}
      </div>
      {currentUser && (<Navigate to={`/${user}/profile-setup`} replace={true}/>)}
      </>
    )

}
  
export default SignUp