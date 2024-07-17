import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import "./SetHobby.css";
import Cookies from 'js-cookie'

function SetHobby({ username, setUser, setHobbyId }) {
    const [dbHobbies, setDBHobbies] = useState([])
    const [userInterests, setUserInterests] = useState([])
    const [selectedHobby, setSelectedHobby] = useState(null)
    const [save, setSave] = useState(null)
    const [result, setResult] = useState(null);
    const [activeBtnId, setActiveBtnId] = useState(null)

    const fetchUserInterests = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/get-interests`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`status: ${response.status}`)
            }
            return response.json();
          })
          .then(data => {
            setUserInterests(data)
          })
          .catch(error => {
            console.error('error fetching hobbies:', error)
          })
    }


    const fetchDBHobbies = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/get-hobbies`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`status: ${response.status}`)
            }
            return response.json();
          })
          .then(data => {
            setDBHobbies(data)
          })
          .catch(error => {
            console.error('error fetching hobbies:', error)
          })
      }

      useEffect(() => {
        fetchDBHobbies()
      }, [username])
  
      useEffect(() => {
        fetchUserInterests()
      }, [username])




    const getDBHobbies = () => {
      const filteredDBHobbies = dbHobbies.filter(hobby => {
          return userInterests.includes(hobby.interests)
      })
      return filteredDBHobbies
    }

    const handleHobbyClick = (e, hobbyId) => {
      e.preventDefault()
      setActiveBtnId(hobbyId)
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/update-hobby/${hobbyId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            // if (response.ok) {
            // console.log(response.json())
            return response.json()
      
            // }
            // throw new Error('failed to set profile')
        })
        .then(data => {
          Cookies.set('username', data.username, { expires: 7 })
          setSelectedHobby(hobbyId)
          setHobbyId(hobbyId)
          setUser(data)
        })
        .catch((error) => {
            console.error("Error:", error)
        })
    }
    const findHobbies = getDBHobbies()

    const handleSave = () => {
      if (selectedHobby != null){
        setSave("Success")
      }
      setResult("Please select a hobby")
    }

    return (
      <div className="hobbies-select">
        {findHobbies.map((hobby) => (
          <div onClick={(e) => handleHobbyClick(e, hobby.id)} class="hobby-btn" key={hobby.id} style={{backgroundColor: activeBtnId === hobby.id ? '#c94e50' : '#fffce1'}}>
            <h2>{hobby.name}</h2>
          </div>
        ))}
        <div>
        { result && <p>{result}</p>}
        </div>
        <button onClick={handleSave}>Save Hobby</button>
        {save &&  (<Navigate to={`/${selectedHobby}`}/>)}
      </div>
    )

   
 

}

export default SetHobby