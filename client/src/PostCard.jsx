import React, { useEffect, useState } from 'react'
import './PostCard.css'
import ModalComment from './ModalComment'
import ModalEditPost from './ModalEditPost'
import ModalViewProf from './ModalViewProf'

function PostCard({likedPosts, setLikedPosts, postId, imgUrl, caption, username, likes, currentUser, fetchPosts, handleDelete}) {
    const [currentLikes, setCurrentLikes] = useState(likes)
    const [liked, setLiked] = useState(false)
    const [comOpen, setComOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [profOpen, setProfOpen] = useState(false)
    const [userClicked, setUserClicked] = useState(null)


    const handleLikes = async (postId) => {
        if ((liked === false) && (!likedPosts.includes(postId))) {
            setLiked(true)
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/posts/${currentUser}/${postId}/like`, 
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
                  setLikedPosts(data.likedPosts)
                  fetchPosts()
                })
                .catch(error => {
                  console.error('error fetching post:', error)
                })
        } else if ((liked === true) || (likedPosts.includes(postId))) {
            setLiked(false)
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/posts/${currentUser}/${postId}/dislike`, 
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
                  setLikedPosts(data.likedPosts)
                  fetchPosts()
                })
                .catch(error => {
                  console.error('error fetching post:', error)
                }) 
        }
    }

   


    const fetchClickedUser = async () => {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/get-user`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`status: ${response.status}`)
          }
          return response.json();
      })
      .then(data => {
          setUserClicked(data)
      })
      .catch(error => {
          console.error('error fetching user:', error)
      })
  
  }

  useEffect(() => {
    fetchClickedUser()
}, [profOpen])


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

    function handleClickUser() {
      setProfOpen(true)
    }

    function closeProf() {
      setProfOpen(false)
    }

    function openProf() {
      setProfOpen(true)
    }


    return (
        <div>
            <div className='post'>
                <img src={imgUrl}/>
                <h2>{caption}</h2>
                <p onClick={handleClickUser} className='post-author'>{username}</p>
                <button onClick={()=> handleLikes(postId)}>Likes: {currentLikes}</button>
                <button onClick={openComments}>Comments </button>
                {username === currentUser && (<button onClick={() => handleDelete(postId)}>Delete Post</button>)}
                {username === currentUser && (<button onClick={openEdits}>Edit Post</button>)}
            </div>
            {comOpen && <ModalComment closeComments={closeComments} postId={postId} username={currentUser}/>}
            {editOpen && <ModalEditPost closeEdits={closeEdits} postId={postId} username={currentUser} fetchPosts={fetchPosts}/>}
            {profOpen && <ModalViewProf closeProf={closeProf} username={username} userArray={userClicked}/>}
        </div>
    )
}

export default PostCard