import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './EventCard.css'

function EventCard({title, address, description}) {
    return (
        <div>
            <div className='event'>
                <h2>{title}</h2>
                <p>{address}</p>
                <p>{description}</p>
            </div>
        </div>
    )
}


export default EventCard