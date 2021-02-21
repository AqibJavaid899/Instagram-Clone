import {useState, useEffect} from 'react'
import './App.css';
import Post from './Post'
import {db, auth} from './firebase'
import {Button, Input} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'

// Styling related to the Modal
function getModalStyle() {
  const top = 50; 
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
   // States
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false)
  const [signInModal, setSignInModal] = useState(false)
  const [posts, setPosts] = useState([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // Using UseEffect() to set the setUser()
  useEffect(() => {
    // This fires off if any authentication changes occurs i.e. like creating a user, logging in/out a user 
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        // This will run if user has logged in/signed up
        console.log(authUser)
        setUser(authUser)
      }
      else{
        // user has logged  out and if that happens then reset the user state to null
        setUser(null)
      }})
    return () => {
      // This will detach already running listener when the onAuth function again re-fires. This we do in order to not to stack many listeners
      unsubscribe()
    }
  }, [user, username])
  
 
  // Using UseEffect() to set the setPosts() and attached a onSnapshot() listener to the Firebase DB
  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

    //Implementating SignIn function for Modal
    const signIn = (e) => {
      e.preventDefault()
      auth
        .signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message))
      // Closing the Modal
      setSignInModal(false)
    }

  //Implementating SignUp function for Modal
  const signUp = (e) => {
    e.preventDefault()
    auth
      .createUserWithEmailAndPassword(email, password)
      // Setting user displayName here because the Firebase Auth is not setting its value in the UseEffect function
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    // Closing the Modal
    setOpen(false)
  }


  return (
    <div className='app'>

      {/* Sign Up Modal */}
      <Modal
      open={open}
      onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}> 
        {/* Implementing a Form for the Modal here */}
          <form className='app__signup'>
            <center>
                <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
                />
            </center>

           <Input
              placeholder="username"
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <Input
              placeholder="email"
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              placeholder="password"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form>
        </div>
    </Modal>

    {/* Sign In Modal */}
    <Modal
      open={signInModal}
      onClose={() => setSignInModal(false)}
      >
        <div style={modalStyle} className={classes.paper}> 
        {/* Implementing a Form for the Modal here */}
          <form className='app__signup'>
            <center>
                <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
                />
            </center>

            <Input
              placeholder="email"
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              placeholder="password"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>
    </Modal>


      {/* Application Header */}
      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt=''
        />
      </div>

      {/* Showing the Modal Button below the App Header depending on the condition */}
      {user 
        ?  <Button onClick={() => auth.signOut()}>Logout</Button>
        :  
        <div className='app__loginContainer'>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
          <Button onClick={() => setSignInModal(true)}>Sign In</Button>
        </div>
      }

      {/* Posts */}
      {posts.map(({id, post}) => (
        <Post key={id} username={post.username} 
          imageUrl={post.imageUrl} caption={post.caption} />
      ))}

    </div>
  );
}

export default App;




