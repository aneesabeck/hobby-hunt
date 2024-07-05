import React, { useState, useEffect } from 'react';
import "./ModalPost.css";

const ModalBoard = ({ closeModal, fetchPosts, username, hobby }) => {
    const [formData, setFormData] = useState({
        imgUrl: '',
        caption: '',
        author: '',
      })

    const handleChange = (e) => {
        const { name, value } = e.target
    
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }))
      }

      const handleSubmit = (e) => {
        e.preventDefault()
        closeModal()
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobby}/${username}/new-post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imgUrl: formData.imgUrl,
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

      function handleCloseModal() {
        closeModal()
    }


    return (
        <>
      <div className="centered">
                <div className="modal">
                    <div className='modal-content'>
                    <form className="board-form" onSubmit={handleSubmit}>
                        <label>
                            Caption: <input type="text" name="caption" value={formData.caption} onChange={handleChange} required/>
                        </label>
                        <label>
                            imgUrl: <input type="text" name="imgUrl" value={formData.imgUrl} onChange={handleChange} required/>
                        </label>

                        <div className="form-buttons">
                            <button type="submit">Submit</button>
                        </div>

                        </form>
                    </div>
                    <button className="closeBtn" onClick={handleCloseModal}>
                        Close
                    </button>
                    

                </div>
      </div>
        
        </>
    )

}



export default ModalBoard;