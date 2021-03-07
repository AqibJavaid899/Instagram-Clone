import {useState, useEffect} from 'react'
import './App.css';
import Post from './Post'
import {db, auth} from './firebase'
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50
  const left = 50

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
   const [posts, setPosts] = useState([])
   const [modalStyle] = useState(getModalStyle);
   const classes = useStyles();
   const [open, setOpen] = useState(false)
   const [signInOpen, setSignInOpen] = useState(false)
   const [username, setUsername] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [user, setUser] = useState(null)



  // Using UseEffect() to set the setUser()
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser)
        console.log(user)
      }
      else {  setUser(null)  }
    })
    return () => 
    {  unsubscribe()  }
    }, [user, username])


  // Using UseEffect() to set the setPosts() and attached a onSnapshot() listener to the Firebase DB
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

    //Implementating SignIn function for Modal
    const handleSignIn = (event) => {
      event.preventDefault();
      auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
      setSignInOpen(false)
    }

    //Implementating SignUp function for Modal
    const handleSignUp = (event) => {
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
      setOpen(false)
    }


  return (
    <div className='app'>
    <script src="//www.instagram.com/embed.js"></script>   


      {/* Sign Up Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        
          <center className='app__header'>
            <img
              className='app__headerImage'
              src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
              alt=''
            />
          </center>

          <form className="app__signup"> 
            <Input 
            type='text'
            name='username'
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
            type='email'
            name='email'
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
            type='password'
            name='password'
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={handleSignUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      {/* Sign In Modal */}
      <Modal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        
          <center className='app__header'>
            <img
              className='app__headerImage'
              src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
              alt=''
            />
          </center>

          <form className="app__signup"> 
            <Input 
            type='email'
            name='email'
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
            type='password'
            name='password'
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={handleSignIn}>Sign In</Button>
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

        {/* Showing the Modal Button below the App Header depending on the condition */}
          {user ? (
            <Button type='submit' onClick={() => auth.signOut()}>Sign Out</Button>
          ) : (
            <div>
              <Button type='submit' onClick={() => setOpen(true)}>Sign Up</Button>
              <Button type='submit' onClick={() => setSignInOpen(true)}>Sign In</Button>
            </div>
          )
          }
      </div>


      <div className='app__posts'>

        <div className='app__postsLeft'>
          {/* Posts */}
            {posts.map(({id, post}) => (
              <Post key={id} postID={id} user={user} username={post.username} 
              imageUrl={post.imageUrl} caption={post.caption} />
            ))}
        </div>
        
        <div className='app__postsRight'>
          {/* Instagram Embed */}
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

        </div>

      </div>


      
      {/* Calling the ImageUpload Component */}
      {user ? (
          <ImageUpload username= {user?.displayName}/>
        ): (
        <h3>Please Sign In/Sign up to upload</h3>
      )
        }
        
    </div>
  );
}

export default App;




