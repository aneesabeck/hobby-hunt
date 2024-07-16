import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './HobbyCommunity.css'
import PostCard from './PostCard'
import EventCard from './EventCard'
import ModalPost from './ModalPost'
import Sidebar from './Sidebar'
import SearchBar from './SearchBar'
import WebSocketService from './WebSocketService'
import Cookies from 'js-cookie'


function HobbyCommunity({ username, setHobby, setHobbyId, userId, setUser, setUserId, hobbyId, handleNewHobby }) {
    const [posts, setPosts] = useState([])
    const [currentHobby, setCurrentHobby] = useState(null)
    const [hobbyName, setHobbyName] = useState("")
    const currentHobbyRef = useRef(currentHobby)
    const [events, setEvents] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [changeHobby, setChangeHobby] = useState(null)
    const [sort, setSort] = useState('asc')
    console.log("hb", hobbyId)


    const fetchPosts = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
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
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/get-hobby`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
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
        fetch(`${currentHobbyRef.current.api}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('failed to fetch events')
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
        })
        .catch(error => {
            console.error('error fetching user:', error)
        })
    
    }

    useEffect(() => {
        fetchCurrentHobby()
    }, [hobbyId])

    useEffect(() => {
        fetchCurrentHobby()
    }, [username])
    

    useEffect(() => {
        if (currentHobby !== null) {
            currentHobbyRef.current = currentHobby
            fetchPosts()
            fetchEvents()
            fetchCurrentUser()
        }
    }, [currentHobby])

    useEffect(() => {
        if (currentHobby !== null) {
            currentHobbyRef.current = currentHobby
            fetchPosts()
            fetchEvents()
            fetchCurrentUser()
        }
    }, [username])

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
            <PostCard postId={post.id} imgUrl={post.imgUrl} caption={post.caption} username={post.username} likes={post.likes} currentUser={username} fetchPosts={fetchPosts} handleDelete={handleDelete}/>
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

    useEffect(() => {
        setChangeHobby("Success")
    }, [hobbyId])

  


    return (
        <>
        {changeHobby && (<Navigate to={`/${hobbyId}`} replace={true}/>)}
        {!username &&  (<Link to="/login"><button className='header-button'>Login</button> </Link> )}
        {!username &&  (<Link to="/create"><button className='header-button'>Create an account</button></Link> )}
        <label>Select a new hobby:
          <select value={hobbyId} onChange={handleNewHobby}>
          <option value='1' ><Link to="/1">Performing Arts</Link></option>
          <option value='2'><Link to="/2">Gardening</Link></option>
          <option value='3'><Link to="/3">Soccer</Link></option>
          <option value='4'><Link to="/4">Tourism</Link></option>
          <option value='5' ><Link to="/5">Animation</Link></option>
          <option value='6' ><Link to="/6">Pottery</Link></option>
         <option value='7' > <Link to="/7">Crochet</Link></option>
          <option value='8'><Link to="/8">Running</Link></option>
          <option value='9'><Link to="/9">Video Games</Link></option>
         <option value='10'> <Link to="/10">Jewelry Collection</Link></option>
          <option value='11'><Link to="/11">Music</Link></option>
          <option value='12'><Link to="/12">Baking</Link></option>
          <option value='13'><Link to="/13">Biking</Link></option>
          </select>
          </label>
        <div className='community-page'>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={hobbyId}/>
            <div className='hobby-posts'>
            <label>Sort Posts:
                <select value={sort} onChange={handleSortPosts}>
                    <option value='asc'>Most to Least Recent</option>
                    <option value='desc'>Least to Most Recent</option>
                    <option value='alpha' >Alphabetically by Caption</option>
                </select>
          </label>
          <SearchBar fetchPosts={fetchPosts} setPosts={setPosts} hobbyId={hobbyId}/>
                <button onClick={openModal}>Create new Post</button>
                {allPosts}
            </div>
            <div className='events'>
                {allEvents}
            </div>
            {isOpen && <ModalPost closeModal={closeModal} fetchPosts={fetchPosts} username={username} hobby={hobbyId}/>}
            <WebSocketService userId={parseInt(userId)}/>
        </div>
        </>
    )
}

export default HobbyCommunity