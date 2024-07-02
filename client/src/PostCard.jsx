import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './PostCard.css'

function PostCard({postId, imgUrl, caption, hobbyId, username, likes}) {
    const [currentLikes, setCurrentLikes] = useState(likes)

    const handleLikes = async (postId) => {
        console.log(postId)
    }


    console.log(caption)
    return (
        <div>
            <div className='post'>
                <img src={imgUrl}/>
                <h2>{caption}</h2>
                <p>{username}</p>
                <button onClick={()=> handleLikes(postId)}>Likes: {currentLikes}</button>
            </div>
        </div>
    )
}

export default PostCard