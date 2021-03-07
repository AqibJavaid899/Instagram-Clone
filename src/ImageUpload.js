import { Button, Input } from '@material-ui/core'
import React, {useState} from 'react'
import {db, storage} from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

const ImageUpload = ({username}) => {
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)

    const handleUpload = (e) => {
        // Uploads the image to the Firebase Storage
        const uploadedImage = storage.ref(`pictures/${image.name}`).put(image)

        // Storage Snapshot Function to update user about the status of the Upload
        uploadedImage.on(
            'states_changed',
            // Progress Function for the Image Upload
            (snapshot) => {
                const progressStatus = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progressStatus)
            },
            // Error Function
            (error) => {
                alert(error.message)
            },
            // process Completion Function
            () => {
                storage
                .ref('pictures')
                .child(image.name)
                // Getting the URL of uploaded image
                .getDownloadURL()
                .then((picUrl) => {
                    // Adding the Data to the Firebase DB
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        username: username,
                        caption: caption,
                        imageUrl: picUrl
                    })
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )}

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    return (
        <div className='imageupload'>
            <progress className='imageupload__progress' value={progress} max='100'/>
            <Input className='imageupload__caption' type='text' value={caption} placeholder='Enter a caption...' onChange={(e) => setCaption(e.target.value)} />
            <input type='file' onChange={handleChange} />
            <Button className='imageupload__button' disabled={!caption && !image} variant="contained" color="primary" onClick={handleUpload}>Upload</Button>

        </div>
    )
}

export default ImageUpload
