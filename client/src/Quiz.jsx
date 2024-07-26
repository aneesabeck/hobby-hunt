import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Link, useParams, Navigate } from 'react-router-dom'
import "./SetHobby.css";
import Cookies from 'js-cookie'

function Quiz({ userId, hobbyName, hobbyId, handleNewHobby }) {
    const [recommendations, setRecommendations] = useState({})
    const [complete, setComplete] = useState(null)
    const [newHobbyId, setNewHobbyId] = useState(null)
    const [questionnaire, setQuestionnaire] = useState({})
    const [saved, setSaved] = useState(false)
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
        console.log("userAnse", userAnswers)
        console.log("click")
        const { name, value } = e.target

        setUserAnswers(prevState => ({
            ...prevState,
            [name]: value
        }))
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
        })
        .catch(error => {
        console.error('error fetching questionnaire:', error)
        })
}

    useEffect(() => {
        fetchQuestionnaire()
    }, [])

    function changeTheHobby() {
      handleNewHobby(newHobbyId);
      setSaved(true)
  }

    return (
        <>
         <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={hobbyId}/>
        {/* <form onSubmit={markAnswers}>
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
        </form> */}
        <div className='text-center'>
          <br></br><br></br><br></br><br></br>
          <h1>Hobby Personality Quiz</h1>
          <h3>Not sure which hobby might be best for you? Take this personality quiz to find out!</h3>
          <div className="text-center mb-4" style={{border: '1.5px solid #4e9c90', margin: '50px 30px 20px 30px', borderRadius: '8px', boxShadow: '0px 0px 20px #4e9c90', backgroundColor: '#4e9c90', color: 'white', padding:'50px'}}>
          {(Object.keys(recommendations).length === 0) &&
          (<form onSubmit={markAnswers}>
        {Object.keys(questionnaire).map((key => {
            const value = questionnaire[key]
            return (
                <div style={{marginBottom:'50px'}}>
                  <h3>{value.question.question}</h3>
                  <div>
                  {value.options.map((option) => (
                    <button style={{margin:'10px', fontSize:'18px', backgroundColor: (parseInt(option.id) === parseInt(userAnswers[parseInt(value.question.id)])) ? 'grey' : 'white', color: (parseInt(option.id) === parseInt(userAnswers[parseInt(value.question.id)])) ? 'white' : 'black', boxShadow: (parseInt(option.id) === parseInt(userAnswers[parseInt(value.question.id)])) ? '0px 0px 20px white' : '0'}} name={value.question.id} value={option.id} onClick={handleChange} >

                      {option.questionOption}
                    </button>
                  ))}
                  </div>
                </div>
              )
            
        }))}
        <button type="submit" className='quiz-submit-btn'>Submit</button>
        {complete && <p>{complete}</p>}
        </form>)}
        <div className='text-center'>
        {(Object.keys(recommendations).length !== 0) && !saved && (<><div className='text-center' style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <h4>Your top 5 hobbies!</h4>
          {Object.keys(recommendations).map((key => {
          const hobId = parseInt(recommendations[key])
          return (
            <button onClick={(e) => {setNewHobbyId(parseInt(e.target.value)), console.log("hobId", hobId), console.log("newhobby", newHobbyId)}} style={{margin:'10px', fontSize:'20px', backgroundColor: (newHobbyId === hobId) ? 'grey' : 'white', boxShadow:(newHobbyId === hobId) ? '0px 0px 20px white' : '0', color: (newHobbyId === hobId) ? 'white' : 'black'}} value={hobId} >{key}</button>
          )
        }))}</div> {newHobbyId && <button onClick={changeTheHobby}>Save new hobby</button>}</>)}
        {saved && <h3>You successfully changed your hobby!</h3>}
        </div>

      </div>
        <br></br><br></br><br></br>
        </div>
        <footer className="container">
            <hr></hr>
            <p className="float-right"><a href="#">Back to top</a></p>
            <p style={{paddingBottom:'100px'}}>&copy; 2024 Hobby Hunt, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
        </footer>
        </>
    )



 

}

export default Quiz