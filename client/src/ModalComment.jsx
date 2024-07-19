import React, { useState, useEffect } from 'react';
import "./ModalComment.css";
import CommentCard from './CommentCard'

const ModalComment = ({ closeComments, postId, username }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    
    useEffect(() => {
        fetchPostComments()
    }, [postId])

    const handleChange = (e) => {
        setNewComment(e.target.value)
      }
    

    const fetchPostComments = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/posts/${postId}/comments`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`status: ${response.status}`)
          }
          return response.json();
        })
        .then(data => {
          setComments(data)
        })
        .catch(error => {
          console.error('error fetching boards:', error)
        })      
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${postId}/${username}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment: newComment }),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
    
          throw new Error('Failed to add comment.')
        })
        .then(data => {
          setNewComment('')
          fetchPostComments()
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }


    return (
        <>
      <div className="centered">
                <div className="modal">
                    <div className='comment-modal-content'>
                        <h1>Comments</h1>
                        <div>
                        { comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentCard username={comment.username} text={comment.text}/>
                            ))
                    ) : (
                        <p>No comments available</p>
                    )}
                    </div>
                    <form onSubmit={handleCommentSubmit}>
                        <label>
                            New Comment: <input type="text" value={newComment} onChange={handleChange} placeholder="Add a comment"/>
                        </label>
                        <div className='comment-modal-submit'>
                        <button type="submit">Submit</button>
                    </div>
                    </form>
        
                    </div>
                    <button className="closeBtn" onClick={closeComments}>
                        Close
                    </button>
                    

                </div>
      </div>
        
        </>
    )

}



export default ModalComment;