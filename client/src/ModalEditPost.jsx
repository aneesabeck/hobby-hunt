import React, { useState, useEffect } from 'react';
import "./ModalEditPost.css";

const ModalEditPost = ({ closeEdits, postId, fetchPosts}) => {
    const [formData, setFormData] = useState({
        imgUrl: '',
        caption: '',
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
        closeEdits()
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${postId}/edit-post`, {
          method: 'PUT',
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
    
          throw new Error('Failed to edit post.')
        })
        .then(data => {
          fetchPosts()
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      }

      function handleCloseModal() {
        closeEdits()
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
//   const handleSelectImage = (e) => {
//     e.preventDefault()
//     setEditSelect("Success")
//   }

//   const handleSelectCaption = (e) => {
//     e.preventDefault()
//     setEditSelect("Success")
//   }



    return (
        <>
      <div className="centered">
                <div className="modal">
                    <div className='modal-content'>
                        {/* <h3>What would you like to change?</h3>
                        {editSelect == null &&  (<button onClick={handleSelectImage}>Image</button> )}
                        {editSelect == null &&  (<button>Caption</button> )} */}
                    <form className="board-form" onSubmit={handleSubmit}>
                        <label>
                            Caption: <input type="text" name="caption" value={formData.caption} onChange={handleChange}/>
                        </label>
                        <label>Image: <input type='file' accept="image/*" onChange={handleImgChange}></input></label>

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



export default ModalEditPost;