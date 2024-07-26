import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './SignUp.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { faWorm } from '@fortawesome/free-solid-svg-icons'
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function SignUp({ setUsername }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [result, setResult] = useState(null);
    const [currentUser, setCurrentUser] = useState(null)
    const [hidePass, setHidePass] = useState("password")
    
  
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

    const handleShow = () => {
        if (hidePass === "password") {
          setHidePass("text")
        } else if (hidePass === "text") {
          setHidePass("password")
        }
      }
  
    const handleCreate = () => {
      if (user === '' | password === '' | first === '' | last === '') {
        setResult("Failed to sign up! Try again")
        return
      } 
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
        <Link to="/">
              <div className='back-header'>
                <FontAwesomeIcon icon={faArrowLeft} className='back-logo'/>
              </div>
          </Link>
        <Form className="form-signin">
          <div className="text-center mb-6">
            <FontAwesomeIcon icon={faWorm} className='hobby-logo' style={{color: '#4e9c90', fontSize: '70px'}}/>
            <br></br>
            <h1 className="h3 mb-3 font-weight-normal" style={{fontSize: '50px'}}>Sign up</h1>
            <p style={{fontSize: '20px'}}>Welcome to hobby hunt!</p>
          </div>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              
              <Form.Control type="text" placeholder="First Name" required onChange={handleChangeFirst} value={first}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
            
              <Form.Control type="text" placeholder="Last Name" required onChange={handleChangeLast} value={last}/>
            </Form.Group>
          </Row>
        <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control  size="lg" type="email" placeholder="Enter username" required onChange={handleChangeUser} value={user}/>
              <Form.Control size="lg" type={hidePass} placeholder="Create password" onChange={handleChangePassword} value={password} required/>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" onClick={handleShow}label="Show password" />
          </Form.Group>
          </Form.Group> 


        <ButtonGroup>
        <Link to="/create">
          <button  className='log-btn' onClick={handleCreate} style={{width: '120px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Sign Up</button>
        </Link>
        <Link to="/login">
          <button className='log-btn' style={{width: '180px', height: '60px', fontSize:'16px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Have an account? Log in</button>
        </Link>
        </ButtonGroup>
       
      <div style={{marginBottom:'-29px', marginTop: '20px', textAlign:'center'}}>
        { result && <p>{result}</p>}
      </div>
      <p className="mt-5 mb-3 text-muted text-center">&copy; 2024</p>
    
    </Form>

      {currentUser && (<Navigate to={`/profile-setup`} replace={true}/>)}
      </>
    )

}
  
export default SignUp