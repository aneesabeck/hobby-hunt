import React, { useEffect, useState } from 'react'
import './PostCard.css'
import ModalComment from './ModalComment'
import ModalEditPost from './ModalEditPost'
import ModalViewProf from './ModalViewProf'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function PostCard({likedPosts, setLikedPosts, postId, imgUrl, caption, username, likes, currentUser, fetchPosts, handleDelete}) {
    const [currentLikes, setCurrentLikes] = useState(likes)
    const [liked, setLiked] = useState(false)
    const [userClicked, setUserClicked] = useState(null)
    const [modalCommentShow, setModalCommentShow] = useState(false);
    const [modalEditShow, setModalEditShow] = useState(false);
    const [modalProfShow, setModalProfShow] = useState(false);


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
}, [modalProfShow])




    return (
      <Card style={{ width: '22rem', marginBottom:'50px', backgroundColor:'#4e9c90', boxShadow: '0px 0px 20px #4e9c90' }}>
      <Card.Img variant="top" src={imgUrl} style={{padding:'10px'}}/>
        <Card.Body>
            <Card.Title style={{color: 'white'}}><h2>{caption}</h2></Card.Title>
            <h5 onClick={() => setModalProfShow(true)} className='icon-btn' style={{color: 'white'}}>@{username}</h5>
            <Container> 
                <Row>
                  <Col sm={2}>
                      <p onClick={()=> handleLikes(postId)} style={{fontSize:'21px', color:'white'}}>{currentLikes}</p>
                  </Col>
                  <Col sm={10}>
                      <FontAwesomeIcon icon={faThumbsUp} onClick={()=> handleLikes(postId)} className='icon-btn' style={{color: (likedPosts.includes(postId)) ? 'black' : 'white', fontSize: '25px'}}/>
                  </Col>
                </Row>
            </Container>
            <button onClick={() => setModalCommentShow(true)} style={{width: '315px', marginBottom: '20px'}}>Comments </button>
            {username === currentUser && <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(postId)} className='icon-btn' style={{color: 'white', fontSize: '25px', marginRight: '15px'}}/>}
            {username === currentUser && <FontAwesomeIcon icon={faPenToSquare} onClick={() => setModalEditShow(true)} className='icon-btn' style={{color: 'white', fontSize: '25px'}}/>}
        </Card.Body>
      <ModalComment postId={postId} username={currentUser} show={modalCommentShow} onHide={() => setModalCommentShow(false)} />
      <ModalEditPost postId={postId} fetchPosts={fetchPosts} show={modalEditShow} onHide={() => setModalEditShow(false)}/>
      <ModalViewProf userArray={userClicked} show={modalProfShow} onHide={() => setModalProfShow(false)}/>
      </Card>
    )
}

export default PostCard