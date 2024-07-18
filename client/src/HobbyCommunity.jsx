import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './HobbyCommunity.css'
import PostCard from './PostCard'
import EventCard from './EventCard'
import ModalPost from './ModalPost'
import Sidebar from './Sidebar'

function HobbyCommunity({ username }) {
    const { hobby } = useParams()
    const [posts, setPosts] = useState([])
    const [currentHobby, setCurrentHobby] = useState(null)
    const [hobbyName, setHobbyName] = useState("")
    const currentHobbyRef = useRef(currentHobby)
    const [events, setEvents] = useState([])
    const [newPost, setNewPost] = useState({imgUrl:'', caption:'', author: ''})
    const [isOpen, setIsOpen] = useState(false)

    const fetchPosts = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobby}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            setPosts(data.sort((a, b) => a.id - b.id))
        })
        .catch(error => {
            console.error('error fetching posts:', error)
            console.log(error)
        })
    }

    const fetchCurrentHobby = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobby}`)
        .then(response => {
        if (!response.ok) {
            throw new Error(`status: ${response.status}`)
        }
        return response.json();
        })
        .then(data => {
        setCurrentHobby(data)
        setHobbyName(data.name)
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
                    // setSelectedHobby(response.json())
                    return response.json()
                }
                throw new Error('failed to set profile')
            })
            .then(data => {
              setEvents(data.results)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    useEffect(() => {
        fetchCurrentHobby()
    }, [hobby])

    useEffect(() => {
        if (currentHobby !== null) {
            currentHobbyRef.current = currentHobby
            fetchPosts()
            fetchEvents()
        }
    }, [currentHobby])


    const allPosts = posts.map(post => {
        return (
            <PostCard postId={post.id} imgUrl={post.imgUrl} caption={post.caption} hobbyId={post.hobbyId} username={post.username} likes={post.likes} currentUser={username} fetchPosts={fetchPosts}/>
        )
    })

    const allEvents = events.map(event => {
        return (
            <EventCard title={event.title} address={event.entities.formatted_address} description={event.description}/>
        )
    })

    const eventEnt = events.map(event => {
        return (
            <p>{event.entities}</p>
        )
    })

    function closeModal() {
        setIsOpen(false)
      }
    
      function openModal() {
        setIsOpen(true)
      }


    return (
        <div className='community-page'>
            <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={hobby}/>

            <div className='hobby-posts'>
                <button onClick={openModal}>Create new Post</button>
                {allPosts}
            </div>
            <div className='events'>
                {allEvents}
                <p>hello</p>
            </div>
            {isOpen && <ModalPost closeModal={closeModal} fetchPosts={fetchPosts} username={username} hobby={hobby}/>}

        </div>
    )
}

export default HobbyCommunity