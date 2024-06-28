import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { MultiSelect } from "./MultiSelect"

function SetInterests() {
    const { username } = useParams();
    
    const interests = [
        {id: "1", title: "Sports & Outdoors"},
        {id: "2", title: "Education"},
        {id: "3", title: "Collection"},
        {id: "4", title: "Competition"},
        {id: "5", title: "Observation"},
        {id: "6", title: "Other / Not Sure"}
    ]

    const toggleOption = ({ id }) => {

    }

    return (
        <div>
            <h2>What are you currently interested in?</h2>
            <MultiSelect interests={interests} selected={[]} toggleOption={toggleOption}/>
        </div>
    )

}
export default SetInterests