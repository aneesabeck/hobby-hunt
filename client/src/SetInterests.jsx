import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { MultiSelect } from "react-multi-select-component"
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWorm } from '@fortawesome/free-solid-svg-icons'

function SetInterests({ username }) {
    const [saveInterests, setSaveInterests] = useState(null)
    const [selected, setSelected] = useState([])
    const [incomplete, setIncomplete] = useState(null)
    const interests = [
        {label: "Sports & Outdoors", value: "sports_and_outdoors"},
        {label: "Education", value: "education"},
        {label: "Art", value: "art"},
        {label: "Competition", value: "competition"},
        {label: "Other / Not sure", value: "general"}
    ]


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(selected.length)
        if (selected.length === 0) {
            setIncomplete("Don't forget to select an interest!")
            return
        }
        const categories = selected.map(item => item.value)
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/interests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                interests: categories,
            })
        })
            .then(response => {
                if (response.ok) {
                    setSaveInterests(response)
                    return response.json()
                }
                throw new Error('failed to save interests')
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    return (
        <>
        <br></br><br></br><br></br><br></br><br></br><br></br>
        <Form className="form-signin" onSubmit={handleSubmit}>
            <div className="text-center mb-4">
                <FontAwesomeIcon icon={faWorm} className='hobby-logo' style={{color: '#4e9c90', fontSize: '70px'}}/>
                <br></br><br></br>
                  <h1 className="h3 mb-3 font-weight-normal" style={{fontSize: '44px'}}>Select interests</h1>
            </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
                <MultiSelect options={interests} value={selected} onChange={setSelected} labelledBy={"Select"} isCreatable={true}/>
                <br></br>
                <button type='submit'className='log-btn' style={{width: '300px', height: '55px', fontSize:'15px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white'}}>Save Interests</button>
          </Form.Group> 
          <br></br>
          {incomplete && <p style={{textAlign: 'center'}}>{incomplete}</p>}
        <p className="mt-5 mb-3 text-muted text-center" >&copy; Hobby Hunt 2024</p>
     </Form>
     {saveInterests && (<Navigate to={`/select-hobby`} replace={true}/>)}
            
        </>
        
    )

}
export default SetInterests