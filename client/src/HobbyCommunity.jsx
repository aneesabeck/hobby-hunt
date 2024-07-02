import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './HobbyCommunity.css'
import PostCard from './PostCard'

function HobbyCommunity() {
    const { username, hobby } = useParams()
    console.log(username)
    console.log(hobby)
    const [posts, setPosts] = useState([])
    const [newPost, setNewPost] = useState({imgUrl:'', caption:'', author: ''})

    const fetchPosts = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobby}/posts`)
        .then(response => {
        if (!response.ok) {
            throw new Error(`status: ${response.status}`)
        }
        return response.json();
        })
        .then(data => {
        setPosts(data)
        })
        .catch(error => {
        console.error('error fetching posts:', error)
        })
    }

    useEffect(() => {
        fetchPosts()
    }, [hobby])

    const allPosts = posts.map(post => {
        console.log(post.caption)
        return (
            <PostCard postId={post.id} imgUrl={post.imgUrl} caption={post.caption} hobbyId={post.hobbyId} username={post.username} likes={post.likes}/>
        )
    })

    return (
        <div className='community-page'>
            <div className='hobby-posts'>
                <button>Create new Post</button>
                {allPosts}
            </div>
            <div className='events'>
                <p>bye</p>
            </div>

        </div>
    )
}

export default HobbyCommunity