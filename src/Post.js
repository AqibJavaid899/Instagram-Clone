import React, {useState, useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { Input } from '@material-ui/core'
import {db} from './firebase'
import firebase from 'firebase'

const Post = ({ postID, user, username, imageUrl, caption }) => {

    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])

    useEffect(() => {
        let unsubscribe; 
        if (postID) {
            unsubscribe = db.collection('posts').doc(postID)
            .collection('comments').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
            })
        }
        return () => {
            unsubscribe()
        }
    }, [postID])

    const handleComment = (e) => {
        e.preventDefault()
        db.collection('posts').doc(postID).collection('comments').add({
            comment: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment('')
    }

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
            <h4 className='post__text'>
                <strong className='post__commentname'>{username}</strong>
                {caption}
            </h4>
            
            {/* Traversing each comment w.r.t every Post and print them corresponding to that Post */}
            <div className='post__text'>
                {comments.map((comment) => (
                <p className='post__comment'>
                    <strong className='post__commentname'>{comment.username}</strong>
                    {comment.comment}
                </p>   
                ))}
            </div>
            

            {user && (
                // Comment Box with Button 
                <form className='post__commentbox'>
                    <Input
                        className='post__input'
                        type='text'
                        value={comment}
                        placeholder='Add a comment...'
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button 
                        disabled={!comment} 
                        className='post__button' 
                        onClick={handleComment}>
                            Post
                    </button>
                </form>
            )}
        </div>
    )
}

export default Post
