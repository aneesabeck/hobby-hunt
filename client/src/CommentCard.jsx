import React from 'react'

function CommentCard({username, text}) {

    return (
        <div>
            <h4>@{username}: {text}</h4>
        </div>
    )
}

export default CommentCard