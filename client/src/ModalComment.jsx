import React, { useState, useEffect } from 'react';
import CommentCard from './CommentCard'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ModalComment = ({ postId, username, show, onHide }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    
    useEffect(() => {
        fetchPostComments()
    }, [postId, comments])

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
        console.log("submit")
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
        <Modal show={show} onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{backgroundColor:'#4e9c90'}}
          >
       <Modal.Header closeButton className='text-center'>
          <Modal.Title id="contained-modal-title-vcenter" className='text-center'>
            <h2>Comments</h2>
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div>
        {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard username={comment.username} text={comment.text}/>
            ))
    ) : (
        <p>No comments available</p>
    )}
      </div>
      <form onSubmit={handleCommentSubmit}>

      <Form className="form-signin">
      <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control  size="lg" type="text" placeholder="Add a comment" onChange={handleChange} value={newComment}/>
      </Form.Group>
      </Form>
      <div className='text-center'>
      {newComment && <button type="submit" className='settings-btn' style={{width: '100px', height: '50px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Submit</button>}
      </div>

      </form>
      </Modal.Body>
      </Modal>
     </>
    )

}



export default ModalComment;