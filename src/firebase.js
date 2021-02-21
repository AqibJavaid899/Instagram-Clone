import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAHV2xEW99cEiMPB9xC2YNqu7wzmxTJGDU",
    authDomain: "instagram-clone-8b3db.firebaseapp.com",
    projectId: "instagram-clone-8b3db",
    storageBucket: "instagram-clone-8b3db.appspot.com",
    messagingSenderId: "317742137286",
    appId: "1:317742137286:web:5743b717aa474721643cc7",
    measurementId: "G-NC3SB42GLD"
  })

  const db = firebase.firestore()
  const auth = firebase.auth()
  const storage = firebase.storage()

  export {db, auth, storage}