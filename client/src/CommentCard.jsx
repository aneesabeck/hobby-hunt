import React, { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
// import './CommentCard.css'
// import ModalComment from './ModalComment'

function CommentCard({username, text}) {

    return (
        <div>
            <h3>{username}: {text}</h3>
        </div>
    )
}

export default CommentCard