import React from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'

const Post = ({ username, imageUrl, caption }) => {
    return (
        <div className='post'>

            {/* Post Header -> Avatar + Username */}
            <div className='post__header'>
                <Avatar 
                    className='post__avatar'
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>

            {/* Original Image */}
            <img 
            className='post__image'
            src={imageUrl}
            alt=''
            />

            {/* Username + Caption */}
            <h4 className='post__text'><strong>{username}</strong> {caption} </h4>
        
        </div>
    )
}

export default Post
