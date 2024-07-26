import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import "./SetHobby.css";
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWorm } from '@fortawesome/free-solid-svg-icons'

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
            return response.json()
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
      <>
      <br></br> <br></br> <br></br> <br></br> <br></br>
      <div className="hobbies-select">
        <div className="text-center mb-4">
                <FontAwesomeIcon icon={faWorm} className='hobby-logo' style={{color: '#4e9c90', fontSize: '70px'}}/>
                <br></br>
                  <h1 className="h3 mb-3 font-weight-normal" style={{fontSize: '50px'}}>Select a hobby</h1>
                  <p style={{fontSize: '20px'}}>Note: You can change your selection later!</p>
                  {findHobbies.map((hobby) => (
                  <div onClick={(e) => handleHobbyClick(e, hobby.id)} className="hobby-btn" key={hobby.id} style={{backgroundColor: activeBtnId === hobby.id ? 'grey' : '#4e9c90', color: '#f9faed', boxShadow: activeBtnId === hobby.id ? '1px 1px 6px #c5c5c5, -1px -1px 6px #ffffff' : '0' }}>
                    <h2>{hobby.name}</h2>
                  </div>
                ))}
        <button onClick={handleSave} className='log-btn' style={{width: '150px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#f9faed', color: '#4e9c90', border: '1px solid #4e9c90'}}>Save Hobby</button>
          </div>
        <div>
        { result && <p>{result}</p>}
        </div>
        
        {save &&  (<Navigate to={`/hobby-community/${selectedHobby}`}/>)}
      </div>
      </>
    )

   
 

}

export default SetHobby