import React, { useState, useEffect } from 'react';
import './SearchBar.css'

function SearchBar({ fetchPosts, setPosts, hobbyId }) {
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


    return (
        <form className="search-bar">
            <input className="search-input" type="text" value={inputText} onChange={handleInput} placeholder="Search for posts" input={inputText}/>
            <button className="search-button" type="submit" onClick={handleSubmit}>Search</button>
        </form>
    )
}

export default SearchBar