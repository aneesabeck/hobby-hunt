import React, { useEffect, useState } from 'react'
import './PostCard.css'
import ModalComment from './ModalComment'
import ModalEditPost from './ModalEditPost'

function PostCard({postId, imgUrl, caption, username, likes, currentUser, fetchPosts}) {
    const [currentLikes, setCurrentLikes] = useState(likes)
    const [liked, setLiked] = useState(false)
    const [comOpen, setComOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)


    const handleLikes = async (postId) => {
        if (liked === false) {
            setLiked(true)
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

    // const handleEdit = async (postId) => {
    //     console.log(postId)
    // }

    function closeComments() {
        setComOpen(false)
      }
    
      function openComments() {
        setComOpen(true)
      }

      function closeEdits() {
        setEditOpen(false)
      }
    
      function openEdits() {
        setEditOpen(true)
      }


    return (
        <div>
            <div className='post'>
                <img src={imgUrl}/>
                <h2>{caption}</h2>
                <p>{username}</p>
                <button onClick={()=> handleLikes(postId)}>Likes: {currentLikes}</button>
                <button onClick={openComments}>Comments </button>
                {username === currentUser && (<button onClick={() => handleDelete(postId)}>Delete Post</button>)}
                {username === currentUser && (<button onClick={openEdits}>Edit Post</button>)}
            </div>
            {comOpen && <ModalComment closeComments={closeComments} postId={postId} username={currentUser}/>}
            {editOpen && <ModalEditPost closeEdits={closeEdits} postId={postId} username={currentUser} fetchPosts={fetchPosts}/>}
        </div>
    )
}

export default PostCard