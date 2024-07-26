import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ModalPost = ({ fetchPosts, username, hobby, show, onHide }) => {
    const [formData, setFormData] = useState({
        imgUrl: '',
        caption: '',
        author: '',
      })
    const [imgUrl, setImgUrl] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
    
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }))
      }

      const handleSubmit = (e) => {
        e.preventDefault()
        onHide(true)
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobby}/${username}/new-post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imgUrl: imgUrl,
            caption: formData.caption
          }),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
    
          throw new Error('Failed to add post.')
        })
        .then(data => {
          fetchPosts()
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      }


    const handleImgChange = (e) => {
      const file = e.target.files[0]
      if (!file || !file.type.startsWith('image/')){
          console.error("Please select an image file")
      }
      const reader = new FileReader()
      reader.onload = () => {
          setImgUrl(reader.result)
      }
      reader.readAsDataURL(file)
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
            <h2>Create a new Post</h2>
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={handleSubmit}>

      <Form className="form-signin">
      <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control  size="lg" type="text" placeholder="Add a caption" name="caption" value={formData.caption} onChange={handleChange} required/>
      </Form.Group>
      <Form.Group controlId="formFile" className="mb-4">
                <Form.Label>Add an image</Form.Label>
                <Form.Control type="file"  onChange={handleImgChange}/>
            </Form.Group>
      </Form>
      <div className='text-center'>
      {formData && <button type="submit" className='settings-btn' style={{width: '100px', height: '50px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Submit</button>}
      </div>

      </form>
      </Modal.Body>
      </Modal>   
        
        </>
    )

}



export default ModalPost;