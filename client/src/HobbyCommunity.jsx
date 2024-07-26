import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostCard from './PostCard'
import EventCard from './EventCard'
import ModalPost from './ModalPost'
import Sidebar from './Sidebar'
import SearchBar from './SearchBar'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function HobbyCommunity({ username, setHobby, setHobbyId, setUser, setUserId, hobbyId, notifications }) {
    const [posts, setPosts] = useState([])
    const [currentHobby, setCurrentHobby] = useState(null)
    const [hobbyName, setHobbyName] = useState("")
    const currentHobbyRef = useRef(currentHobby)
    const [events, setEvents] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [sort, setSort] = useState('asc')
    const [likedPosts, setLikedPosts] = useState([])
    const [modalShow, setModalShow] = useState(false);


    const fetchPosts = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/posts`)
        .then(response => { 
            return response.json();
        })
        .then(data => {
            if (sort === 'asc') {
                setPosts(data.sort((a, b) => b.id - a.id))
            } else if (sort === 'desc') {
                setPosts(data.sort((a, b) => a.id - b.id))
            } else if (sort === 'alpha'){
                setPosts(data.sort((a, b) => a.caption.localeCompare(b.caption)))
            }
        })
        .catch(error => {
            console.error('error fetching posts:', error)
            console.log(error)
        })
    }

    const fetchCurrentHobby = async () => {
        if (!hobbyId) {
            return
        }
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/get-hobby`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            setCurrentHobby(data)
            setHobbyName(data.name)
            setHobbyId(data.id)
            setHobby(data.name)
            currentHobbyRef.current = data
        })
        .catch(error => {
            console.error('error fetching hobby:', error)
        })
    }

    const fetchEvents = async () => {
        fetch(`${currentHobbyRef.current.api}&saved_location.location_id=WrVOU8VnzjdXuc23w8LNhw`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
              setEvents(data.results)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    const fetchCurrentUser = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/get-user`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            setUser(data)
            setUserId(data.id)
            setLikedPosts(data.likedPosts)
        })
        .catch(error => {
            console.error('error fetching user:', error)
        })
    
    }

    useEffect(() => {
        fetchCurrentHobby()
        fetchCurrentUser()
    }, [hobbyId])

    useEffect(() => {
        if (currentHobby !== null) {
            currentHobbyRef.current = currentHobby
            fetchPosts()
            fetchEvents()
            fetchCurrentUser()
        }
    }, [currentHobby])

    const handleDelete = async (postId) => {

        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/delete/${postId}`, 
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP Error status: ${response.status}`)
              }
            })
            .then(data => {
              setPosts(posts.filter(post => post.id != postId))
            })
            .catch(error => {
              console.error('error fetching deleting post:', error)
              console.log(error)
            })
    }


    const allPosts = posts.map(post => {
        return (
            <PostCard likedPosts={likedPosts} setLikedPosts={setLikedPosts} postId={post.id} imgUrl={post.imgUrl} caption={post.caption} username={post.username} likes={post.likes} currentUser={username} fetchPosts={fetchPosts} handleDelete={handleDelete}/>
        )
    })

    const allEvents = events.map(event => {
        return (
            <EventCard title={event.title} address={event.geo.address.formatted_address} description={event.description}/>
        )
    })
 

    function closeModal() {
        setIsOpen(false)
      }
    
      function openModal() {
        setIsOpen(true)
      }

    const handleSortPosts = (e) => {
        setSort(e.target.value)
        const sortedValue = e.target.value
        if (sortedValue === 'asc') {
            setPosts(posts.sort((a, b) => b.id - a.id))
        } else if (sortedValue === 'desc') {
            setPosts(posts.sort((a, b) => a.id - b.id))
        } else if (sortedValue === 'alpha'){
            setPosts(posts.sort((a, b) => a.caption.localeCompare(b.caption)))
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [sort])

   const unreadNotifs = notifications.filter((notification) => !notification.read)

    const navigate = useNavigate()

    return (
        <>
        {!username &&  (<Link to="/login"><button className='header-button'>Login</button> </Link> )}
        {!username &&  (<Link to="/create"><button className='header-button'>Create an account</button></Link> )}
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={hobbyId}/>
        <div className='text-center'>
        <h1 style={{margin: '30px'}}>{hobbyName} Community</h1>
        </div>
        <Container>
            <Row>
            <Col xs={12} md={8} style={{justifyContent:'center', marginRight:'-90px'}}>
            <div className='hobby-posts' style={{display:'flex', flexDirection: 'column', alignItems:'center'}}>
          <SearchBar fetchPosts={fetchPosts} setPosts={setPosts} hobbyId={hobbyId} unreadNotifs={unreadNotifs}/>
                <div className='text-center' style={{marginBottom:'20px'}}>   
                <button onClick={() => setModalShow(true)} className='create-btn' style={{width: '250px', height: '60px', fontSize:'18px', marginBottom: '20px', color: 'white', textAlign:'center', marginRight:'20px'}}>Create new Post</button>  
                <label >
                <select value={sort} onChange={handleSortPosts} className='create-btn' style={{width:'250px', height:'60px'}}>
                    <option value='asc' key='asc'>Most to Least Recent</option>
                    <option value='desc' key='desc'>Least to Most Recent</option>
                    <option value='alpha' key='alpha'>Alphabetically by Caption</option>
                </select>
          </label>
                </div>   
                {allPosts}
                
            </div>
            </Col>
            <Col xs={6} md={4}>
            <div className='events' style={{marginTop:'50px'}}>
                <h3 style={{marginBottom:'25px'}}>Upcoming Events</h3>
                {allEvents}
            </div>
            <ModalPost closeModal={closeModal} fetchPosts={fetchPosts} username={username} hobby={hobbyId} show={modalShow} onHide={() => setModalShow(false)}/>
            </Col>
            </Row>
        </Container>
        <footer className="container">
        <hr></hr>
        <p className="float-right"><a href="#">Back to top</a></p>
        <p style={{paddingBottom:'100px'}}>&copy; 2024 Hobby Hunt, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
      </footer>
        </>
    )
}

export default HobbyCommunity