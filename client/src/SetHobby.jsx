import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'

function SetHobby() {
    const [dbHobbies, setDBHobbies] = useState([])
    const [userInterests, setUserInterests] = useState([])
    const [apiHobbies, setAPIHobbies] = useState([])
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
            return dbHobbyNames
        } catch (error) {
            console.error('Error fetching hobbies:', error)
            return []
        }
    }

    useEffect(() => {
        fetchUserInterests()
    }, [username])

  
    const fetchAPIHobbies = async () => {   
        try {
            // fetchUserInterests()
            console.log("interests", userInterests)
            const hobbyApiKey = import.meta.env.VITE_HOBBY_API
            const newAPIHobbies = []
            const APIHobbies = userInterests.map(async (interest) =>
                await fetch(`https://api.api-ninjas.com/v1/hobbies?category=${interest}`, {
                    method: 'GET',
                    headers: { 'X-Api-Key': hobbyApiKey }
                })
                .then(response => {
                    if (response.ok) {
                        console.log("interest", interest)
                        return response.json()
                    }
                })
                .then(data => {
                    console.log("data", data)
                    // setAPIHobbies([...apiHobbies, data])
                    return data
                })
            )
            return APIHobbies
        } catch (error) {
            console.error('error fetching api hobbies', error)
        }
    }
    // const check = fetchAPIHobbies()
    // const apiHobby = check.map(response => response.data)
    // console.log("hellooo", apiHobby)
    console.log("test fetch", fetchAPIHobbies())
    // console.log("check api", apiHobbies)

    

}

export default SetHobby