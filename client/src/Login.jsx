import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faWorm } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './Login.css'
import Cookies from 'js-cookie'

function Login({ setUsername, setUserArray, setHobbyId }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const [hobby, SetHobby] = useState(null)
    const [hidePass, setHidePass] = useState("password")
  
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
              setUsername(user)
              fetchUserHobby()
              return response.json()
            }
            else {
              setResult("Failed to login! Try again");
            }
          })
          .then(data => {
            setHobbyId(data.hobbyId)
            setUserArray(data)
            Cookies.set('username', data.username, { expires: 7 })
          })
          .catch(error => {
            setResult("Failed to login! Try again");
          });
      }

    const handleShow = () => {
      if (hidePass === "password") {
        setHidePass("text")
      } else if (hidePass === "text") {
        setHidePass("password")
      }
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
        <Link to="/">
          <div className='back-header'>
            <FontAwesomeIcon icon={faArrowLeft} className='back-logo'/>
          </div>
        </Link>

        <Form className="form-signin">
            <div className="text-center mb-4">
                <FontAwesomeIcon icon={faWorm} className='hobby-logo' style={{color: '#4e9c90', fontSize: '70px'}}/>
                <br></br>
                  <h1 className="h3 mb-3 font-weight-normal" style={{fontSize: '50px'}}>Log in</h1>
                  <p style={{fontSize: '20px'}}>We're happy you're back</p>
            </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control  size="lg" type="email" placeholder="Enter username" required onChange={handleChangeUser} value={user}/>
              <Form.Control size="lg" type={hidePass} placeholder="Password" onChange={handleChangePassword} value={password} required/>
          </Form.Group> 

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" onClick={handleShow}label="Show password" />
          </Form.Group>
          
        <ButtonGroup>
          <Link to="/login">
            <button onClick={handleLogin} className='log-btn' style={{width: '120px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Log in</button>
          </Link>
          <Link to="/create">
            <button  className='log-btn' style={{width: '190px', height: '60px', fontSize:'15px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Don't have an account? Create now</button>
          </Link>
        </ButtonGroup>
      <div style={{marginBottom:'-29px', marginTop: '20px', textAlign:'center'}}>
        { result && <p>{result}</p>}
      </div>
      <p className="mt-5 mb-3 text-muted text-center">&copy; 2024</p>
    
     </Form>

      {hobby && (<Navigate to={`/hobby-community/${hobby}`} replace={true}/>)}
      </>
    )

}
  
export default Login
