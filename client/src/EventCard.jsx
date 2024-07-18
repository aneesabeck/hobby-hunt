import React from 'react'
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