import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'

function SetHobby() {
    const [dbHobbies, setDBHobbies] = useState([])
    const [userInterests, setUserInterests] = useState([])
    const [selectedHobby, setSelectedHobby] = useState(null)
    const { username } = useParams();

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
        try {
            const filteredDBHobbies = dbHobbies.filter(hobby => {
                return userInterests.includes(hobby.interests)
            })
            // const dbHobbyNames = filteredDBHobbies.map(hobby => hobby.name)
            return filteredDBHobbies
        } catch (error) {
            console.error('Error fetching hobbies:', error)
            return []
        }
    }

    const handleHobbyClick = (e, hobbyId) => {
      e.preventDefault()
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/update-hobby/${hobbyId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                // setSelectedHobby(response.json())
                return response.json()
            }
            throw new Error('failed to set profile')
        })
        .then(data => {
          setSelectedHobby(data.hobbyId)
        })
        .catch((error) => {
            console.error("Error:", error)
        })
    }
    const findHobbies = getDBHobbies()

    return (
      <div className="hobbies-select">
        {findHobbies.map((hobby) => (
          <div onClick={(e, hobbyId) => handleHobbyClick(e, hobby.id)}>
            {hobby.name}
          </div>
        ))}
      </div>
    )

   
 

}

export default SetHobby