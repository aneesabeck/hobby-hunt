import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './PostCard.css'

function PostCard({postId, imgUrl, caption, hobbyId, username, likes, currentUser}) {
    const [currentLikes, setCurrentLikes] = useState(likes)


    const handleLikes = async (postId) => {
        console.log(postId)
    }

    const handleDelete = async (postId) => {
        console.log(postId)
    }

    const handleEdit = async (postId) => {
        console.log(postId)
    }


    return (
        <div>
            <div className='post'>
                <img src={imgUrl}/>
                <h2>{caption}</h2>
                <p>{username}</p>
                <button onClick={()=> handleLikes(postId)}>Likes: {currentLikes}</button>
                {username === currentUser && (<button onClick={handleDelete}>Delete Post</button>)}
                {username === currentUser && (<button onClick={handleEdit}>Edit Post</button>)}
            </div>
        </div>
    )
}

// GET https://api.predicthq.com/v1/events?label=performing-arts%2Centertainment&limit=5 HTTP/1.1
// Accept: text/csv
// Authorization: Bearer $ACCESS_TOKEN

export default PostCard