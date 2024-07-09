import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './PostCard.css'

function PostCard({postId, imgUrl, caption, hobbyId, username, likes, currentUser, fetchPosts}) {
    const [currentLikes, setCurrentLikes] = useState(likes)
    const [liked, setLiked] = useState(false)
    console.log("hello")


    const handleLikes = async (postId) => {
        if (liked === false) {
            setLiked(true)
            console.log("liked")
            console.log(liked)
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/posts/${postId}/like`, 
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`HTTP Error status: ${response.status}`)
                  }
                  return response.json()
                })
                .then(data => {
                  setCurrentLikes(data.likes)
                  fetchPosts()
                })
                .catch(error => {
                  console.error('error fetching post:', error)
                })
        } else if (liked === true) {
            setLiked(false)
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/posts/${postId}/dislike`, 
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`HTTP Error status: ${response.status}`)
                  }
                  return response.json()
                })
                .then(data => {
                  setCurrentLikes(data.likes)
                  fetchPosts()
                })
                .catch(error => {
                  console.error('error fetching post:', error)
                }) 
        }
    }

    const handleDelete = async (postId) => {
        console.log(currentUser)
        console.log(postId)
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${currentUser}/delete/${postId}`, 
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
              return response.json()
            })
            .then(data => {
              fetchPosts()
            })
            .catch(error => {
              console.error('error fetching post:', error)
            })
    }

    const handleEdit = async (postId) => {
        console.log(postId)
    }

    console.log(postId)

    return (
        <div>
            <div className='post'>
                <img src={imgUrl}/>
                <h2>{caption}</h2>
                <p>{username}</p>
                <button onClick={()=> handleLikes(postId)}>Likes: {currentLikes}</button>
                {username === currentUser && (<button onClick={() => handleDelete(postId)}>Delete Post</button>)}
                {username === currentUser && (<button onClick={handleEdit}>Edit Post</button>)}
            </div>
        </div>
    )
}

export default PostCard