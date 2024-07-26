import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './SearchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

function SearchBar({ fetchPosts, setPosts, hobbyId, unreadNotifs }) {
    const [inputText, setText] = useState("")
    const handleInput = (event) => {
        var input = event.target.value.toLowerCase();
        setText(input)

    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (inputText === '') {
            fetchPosts()
        } else {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/posts/search?caption=${inputText}`, 
            {
              method: "GET",
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
              setPosts(data)
            })
            .catch(error => {
              console.error('error fetching searched posts:', error)
            })
        }
       
    }
    const navigate = useNavigate()


    return (
        <form className="search-bar" style={{width:'700px'}}>
            <input className="search-input" type="text" value={inputText} onChange={handleInput} placeholder="Search for posts" input={inputText}/>
            <button className="search-button" type="submit" onClick={handleSubmit}>Search</button>
            <button onClick={() => {navigate("/alerts")}} style={{backgroundColor:'white', width: '90px'}}> <FontAwesomeIcon icon={faBell} className='icon-btn' style={{ fontSize: '25px', marginRight:'5px', color: '#4e9c90'}}/> {unreadNotifs.length}</button>
    
        </form>
    )
}

export default SearchBar