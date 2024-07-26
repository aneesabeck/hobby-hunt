import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
// import './CommentCard.css'

function CommentCard({username, text}) {

    return (
        <div>
            <h4>@{username}: {text}</h4>
        </div>
    )
}

export default CommentCard