import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { MultiSelect } from "react-multi-select-component"

function SetInterests() {
    const { username } = useParams();
    console.log(username)
    const [saveInterests, setSaveInterests] = useState(null)
    const [selected, setSelected] = useState([])
    const interests = [
        {label: "Sports & Outdoors", value: "sports_and_outdoors"},
        {label: "Education", value: "education"},
        {label: "Collection", value: "collection"},
        {label: "Competition", value: "competition"},
        {label: "Observation", value: "observation"},
        {label: "Other / Not sure", value: "general"}
    ]


    const handleSubmit = (e) => {
        e.preventDefault()
        const categories = selected.map(item => item.value)
        console.log(selected)
        console.log(categories)
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
        <div>
            <h2>What are you currently interested in?</h2>
            <pre>{JSON.stringify(selected)}</pre>
            <form onSubmit={handleSubmit}>
            <MultiSelect options={interests} value={selected} onChange={setSelected} labelledBy={"Select"} isCreatable={true}/>
            <button type='submit'>Save Interests</button>
            </form>
        </div>
    )

}
export default SetInterests