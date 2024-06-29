import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'

function SetHobby() {
    const [dbHobbies, setDBHobbies] = useState([])
    const [userInterests, setUserInterests] = useState([])
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

    const getDBHobbies = () => {
        try {
            fetchDBHobbies()
            const filteredDBHobbies = dbHobbies.filter(hobby => {
                return userInterests.includes(hobby.interests)
            })
            const dbHobbyNames = filteredDBHobbies.map(hobby => hobby.name)
        } catch (error) {
            console.error('Error fetching hobbies:', error)
            return []
        }
    }

    const fetchAPIHobbies = () => {
        
    }

    

}

export default SetHobby