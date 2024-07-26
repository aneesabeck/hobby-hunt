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
import Quiz from './Quiz'
import Cookies from 'js-cookie'
import WebSocketService from './WebSocketService'
import 'bootstrap/dist/css/bootstrap.css'; 
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import HobbyDetails from './HobbyDetails'

function App() {
  let location = useLocation()
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(Cookies.get('username'))
  const [userId, setUserId] = useState(null)
  const [hobbyName, setHobbyName] = useState(null)
  const [hobbyId, setHobbyId] = useState(null)
  const [notifications, setNotifications] = useState([])
  const cookies = Cookies.get('username')

  useEffect(() => {
    if (cookies == null) {
      setUser(null)
      setHobbyName("")
      setUsername("")
    }
}, [cookies])


  const handleNewHobby = (newHobbyId) => {
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
      setHobbyName(data.hobbyName)
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
        setHobbyName(data.name)
    })
    .catch(error => {
        console.error('error fetching hobby:', error)
    })
}


useEffect(() => {
  fetchCurrentHobby()
}, [userId])

const fetchCurrentUser = async () => {
  if (username == null) {
    return
  }
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

const fetchNotifications = async (userId) => {
  if (userId == null) {
    return
  }
  fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/${userId}`)
  .then(response => {
      return response.json();
  })
  .then(data => {
      setNotifications(data)
  })
  .catch(error => {
      setNotifications([])
      console.error('error fetching notifs:', error)
  })
}


useEffect(() => {
  fetchCurrentUser()
}, [])




  
  return (
    <>
    {location.pathname === '/' && (
      <>
    <span className="nav-bar">
     {['xl'].map((expand) => (
        <Navbar key={expand} expand={expand} className="navbg-body-tertiary mb-3 nav-bar" style={{marginBottom: '100px'}}>
          <Container fluid>
            <Navbar.Brand href="#"><div className='header-left'>
          <FontAwesomeIcon icon={faWorm} className='hobby-logo' style={{color: '#f9faed'}}/>
          <h1 className='title'>Hobby Hunt</h1>
        </div>
        </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                {!username &&  (<Link to="/login"><button className='header-button'>Login</button> </Link> )}
                {!username &&  (<Link to="/create"><button className='header-button'>Create an account</button></Link> )}
                {username &&  (<Link to={`/hobby-community/${hobbyId}`}><button className='header-button'>Hobby Community</button></Link> )}
                {username &&  (<h3 style={{color: '#f9faed', marginLeft:'20px'}}>Signed in as: @{username}</h3>)}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
       </span>
    <Carousel className='carousel'>
      <Carousel.Item>
      <img src="https://payload.cargocollective.com/1/18/592058/14124816/HEADER.gif" style={{maxWidth: '100%', width: 'auto', alignItems: 'center', maxHeight: '700', height: 'auto', opacity: '0.85'}}/>

      </Carousel.Item>
  
    </Carousel>
    <br></br><br></br><br></br>

      <div className="container marketing">

        <div className="row">
          <div className="col-lg-4">
            {!username && <img className="rounded-circle" src="https://payload.cargocollective.com/1/18/592058/14124816/WHAT_HOBBY_colo_01_1340_c.jpg" alt="Generic placeholder image" width="140" height="140" style={{boxShadow: '0px 0px 20px #4e9c90', border: '1px solid #4e9c90'}}/>}
            {username && (<Link to={`/hobby-community/${hobbyId}`}><img className="circle-nav rounded-circle" src="https://payload.cargocollective.com/1/18/592058/14124816/WHAT_HOBBY_colo_01_1340_c.jpg" alt="Generic placeholder image" width="140" height="140" /></Link>)}
            <br></br><br></br>
            <h2>Hobby Communities</h2>
            <p>Join a hobby community where you could make unique posts, view cool events, and meet new people</p>
          </div>
          <div className="col-lg-4">
          {!username && <img className="rounded-circle" src="https://payload.cargocollective.com/1/18/592058/14124816/TIME_colo_01_1340_c.jpg" alt="Generic placeholder image" width="140" height="140" style={{boxShadow: '0px 0px 20px #4e9c90', border: '1px solid #4e9c90'}}/>}
          {username &&  (<Link to={`/hobby-details`}><img className="circle-nav rounded-circle" src="https://payload.cargocollective.com/1/18/592058/14124816/TIME_colo_01_1340_c.jpg" alt="Generic placeholder image" width="140" height="140" /></Link>)}
            <br></br><br></br>
            <h2>Affordable Resources</h2>
            <p>Get daily updates of affordable resources related to your hobby with stores and price ranges</p>
          </div>
          <div className="col-lg-4">
          {!username && <img className="rounded-circle" src="https://payload.cargocollective.com/1/18/592058/14124816/GOOD_FOR_YOU_colo_01_1340_c.jpg" alt="Generic placeholder image" width="140" height="140" style={{boxShadow: '0px 0px 20px #4e9c90', border: '1px solid #4e9c90'}}/>}
          {username && (<Link to={`/hobby-quiz`}><img className="circle-nav rounded-circle" src="https://payload.cargocollective.com/1/18/592058/14124816/GOOD_FOR_YOU_colo_01_1340_c.jpg" alt="Generic placeholder image" width="140" height="140" /></Link>)}
            <br></br><br></br>
            <h2>Personality Quiz</h2>
            <p>Take a fun personality quiz to determine what hobby would be the best for you</p>
          </div>
        </div>

        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading">Discover new hobbies. <span className="text-muted">Without breaking your pockets.</span></h2>
            <br></br>
            <p className="lead">Log in or sign up now to find something new that you love, connect with others, and spend responsibily. Hobby hunt is here for you to find the best hobby that fits your needs</p>
          </div>
          <div className="col-md-5">
            <br></br><br></br><br></br><br></br>
            <img className="featurette-image img-fluid mx-auto" src="https://t4.ftcdn.net/jpg/02/59/37/11/360_F_259371177_Da7RDFX36VY3TDSqiqFisdS4YpJOv9az.jpg" alt="Generic placeholder image" height='100px' style={{height:'300px', boxShadow: '8px 8px 15px rgba(0, 0, 0, 0.5)'}}/>
          </div>
        </div>
      </div>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <footer className="container">
        <hr></hr>
        <p className="float-right"><a href="#">Back to top</a></p>
        <p>&copy; 2024 Hobby Hunt, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
        <br></br><br></br><br></br><br></br><br></br>
      </footer>
      </>
    )}
  
      <Routes>
            <Route path="/create" element={<SignUp setUsername={setUsername}/>}/>
            <Route path="/login" element={<Login setUsername={setUsername} setUserArray={setUser} setHobbyId={setHobbyId}/>}/>
            <Route path="/profile-setup" element={<SetProfile username={username} setUserId={setUserId}/>}/>
            <Route path="interests" element={<SetInterests username={username}/>}/>
            <Route path="/select-hobby" element={<SetHobby username={username} setUser={setUser} setHobbyId={setHobbyId}/>}/>
            <Route path="/hobby-community/:hobbyId" element={<HobbyCommunity username={username} setHobby={setHobbyName} setHobbyId={setHobbyId} setUser={setUser} setUserId={setUserId} hobbyId={hobbyId} notifications={notifications}/>}/>
            <Route path="/alerts" element={<AlertsPage userId={userId} hobbyName={hobbyName} hobbyId={hobbyId} fetchNotifications={fetchNotifications} notifications={notifications} setNotifications={setNotifications}/>}/>
            <Route path="/profilepage" element={<ProfilePage user={user} username={username} hobbyName={hobbyName} hobbyId={hobbyId} setUsername={setUsername}  handleNewHobby={handleNewHobby} fetchCurrentUser={fetchCurrentUser}/>}/>
            <Route path="/hobby-quiz" element={<Quiz userId={userId} hobbyName={hobbyName} hobbyId={hobbyId} handleNewHobby={handleNewHobby}/>}/>
            <Route path="/hobby-details" element={<HobbyDetails username={username} hobbyId={hobbyId} hobbyName={hobbyName}/>}/>
      </Routes>
      <WebSocketService userId={parseInt(userId)} fetchNotifications={fetchNotifications}/>


      </>
  )
}

export default App
