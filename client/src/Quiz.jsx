import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import "./SetHobby.css";
import Cookies from 'js-cookie'

function Quiz({ userId }) {
    const [recommendations, setRecommendations] = useState({})
    const [complete, setComplete] = useState(null)
    const [questionnaire, setQuestionnaire] = useState({})
    const [userAnswers, setUserAnswers] = useState({
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
    })

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        console.log(name, value)

        setUserAnswers(prevState => ({
            ...prevState,
            [name]: value
        }))
        console.log(userAnswers)
    }

    const fetchQuestionnaire = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/questionnaire`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`status: ${response.status}`)
            }
            return response.json();
          })
          .then(data => {
            setQuestionnaire(data)
          })
          .catch(error => {
            console.error('error fetching questionnaire:', error)
          })
    }

    const markAnswers = async (e) => {
        e.preventDefault()
        console.log(userAnswers)
        let keys = Object.keys(userAnswers)
        for (let i = 0; i < keys.length; i++) {
            if (userAnswers[keys[i]] === '') {
                setComplete("Please answer all questions!")
                return
            }
        }
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/user-answers`, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                userId: userId,
                questionOptionIds: userAnswers
             })
          })
          .then(response => {
            fetchRecommendations()
            return response.json()
          })
          .then(data => {
            console.log("data", data)
          })
          .catch(error => {
            console.error('error marking read:', error)
          })
      }
    
    const fetchRecommendations = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/recommendations/${userId}`)
        .then(response => {
        return response.json();
        })
        .then(data => {
            setRecommendations(data)
            setComplete(true)
        console.log("rec", data)
        })
        .catch(error => {
        console.error('error fetching questionnaire:', error)
        })
}

    useEffect(() => {
        fetchQuestionnaire()
    }, [])

    return (
        <>
        <form onSubmit={markAnswers}>
        {complete && <p>{complete}</p>}
        {Object.keys(questionnaire).map((key => {
            const value = questionnaire[key]
            return (
                <div>
                  <p>{value.question.question}</p>
                  {value.options.map((option) => (
                    <button name={value.question.id} value={option.id} onClick={handleChange}>
                      {option.questionOption}
                    </button>
                  ))}
                </div>
              )
            
        }))}
        <button type="submit">Submit</button>
        </form>
        </>
    )



 

}

export default Quiz