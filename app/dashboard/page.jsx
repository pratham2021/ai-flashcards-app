'use client'
import React, { Fragment, useEffect, useState } from 'react'
import { AppBar, Button, Paper, TextField, Box, Grid, Toolbar, Typography } from "@mui/material";
import { app, auth, db } from "../../firebase"
import { useRouter } from 'next/navigation';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import LoginIcon from '@mui/icons-material/Login';
import firebase from 'firebase/app';
import 'firebase/auth';
import ItemCard from '../../components/ItemCard';
import { motion } from 'framer-motion';
import { makeStyles } from '@mui/styles';
import Flashcard from '../../components/Flashcard';

const useStyles = makeStyles({
  field: {
    display: 'block'
  }
});

const page = () => {
  
  const [user] = useAuthState(auth);
  
  const [text, setText] = useState('');
  const router = useRouter();

  const [topic, setTopic] = useState('');
  const [numberOfFlashcards, setNumberOfFlashcards] = useState(1);
  const [flashcards, setFlashcards] = useState([]);

  const classes = useStyles();

  const [topicError, setTopicError] = useState(false);
  const [numberOfFlashcardsError, setNumberOfFlashcardsError] = useState(false);

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!topic.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    if (isNaN(numberOfFlashcards)) {
      alert('Please enter a number to be able to generate flashcards.')
      return;
    }

    if (!topic) {
      setTopicError(true);
    }

    if (!numberOfFlashcards) {
      setNumberOfFlashcardsError(true);
    }

    if (topic && numberOfFlashcards) {
      setTopicError(false);
      setNumberOfFlashcardsError(false);

      // Generate the flashcards with the OpenAI API
      const response = await fetch(`/api/flashcards?topic=${encodeURIComponent(topic)}&count=${numberOfFlashcards}`);

      if (response.ok) {
        const data = await response.json(); 
        setFlashcards(data);
      } else {
        console.error("Failed to generate flashcards.");
      }
    }

    console.log(flashcards.length);
    setTopic('');
    setNumberOfFlashcards(1);
  };

  // async function createFlashcards(topic, n) {
  //   const response = await fetch('../api/route', {
  //       method: 'POST',
  //       headers: {
  //           'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ topic, n }),
  //   });

  //   const data = await response.json();
  //   if (response.ok) {
  //       return data.flashcards;
  //   } else {
  //       throw new Error(data.error || 'Failed to generate flashcards.');
  //   }
  // };

  // const handleSubmit = async () => {
  //   if (!text.trim()) {
  //     alert('Please enter some text to generate flashcards.')
  //     return
  //   }
  
  //   try {
  //     const response = await fetch('/api/generate', {
  //       method: 'POST',
  //       body: text,
  //     })
  
  //     if (!response.ok) {
  //       throw new Error('Failed to generate flashcards')
  //     }
  
  //     const data = await response.json()
  //     setFlashCards(data.flashCards);
  //   } catch (error) {
  //     console.error('Error generating flashcards:', error)
  //     alert('An error occurred while generating flashcards. Please try again.')
  //   }
  // }

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/');
    }
  }, [user]);

  const logTheUserOut = () => {
      signOut(auth);
      router.push('/');
  };

  const wipeClean = async () => {
    
    const userToDelete = auth.currentUser;

    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(userToDelete);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/');
    } catch (error) {
      console.log('Error deleting user:');
    }
  };

  return (
    <Fragment>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2, ease: 'easeInOut' }}>
        <AppBar sx={{ background: '#063970'}}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RecentActorsIcon className="hidden-on-load"  style={{ color: '#ffffff' }}/>
            </Box>
            
            <Box sx={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h6" className="hidden-on-load" sx={{ left: '50%', transform: `translateX(50%)`,}}>          
                  Dashboard
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ marginLeft: 'auto', marginRight: '10px' }} className="hidden-on-load" variant="contained" style={{ color: '#ffffff' }} onClick={logTheUserOut}>
                  <LoginIcon/>
              </IconButton>
              <IconButton sx={{ marginLeft: '10px', marginRight: '-5px' }} className="hidden-on-load" variant="contained" style={{ color: '#ffffff' }} onClick={wipeClean}>
                  <DeleteIcon/>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh', transform: `translateX(1.25%)`,}} align='center'>
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <Paper elevation={10} style={{ padding: 24 }}>
                <Typography variant="h4" style={{ paddingBottom: 10 }}>
                  Flashcard Content
                </Typography>
                
                <Grid container spacing={2} style={{transform: `translateX(2.5%)`,}}>
                
                  <Grid item xs={12}>
                      <TextField className={classes.field} label="Topic" onChange={(e) => setTopic(e.target.value)} variant="outlined" color="primary" fullWidth value={topic} placeholder='Enter Title' autoComplete="off" required error={topicError}/>
                  </Grid>

                  <Grid item xs={12}>
                      <TextField className={classes.field} type="text" label="Number" onChange={(e) => setNumberOfFlashcards(e.target.value)} variant="outlined" color="primary" fullWidth value={numberOfFlashcards} placeholder='Enter a number' autoComplete="off" required error={numberOfFlashcardsError}/>
                  </Grid>


                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleGenerate}>
                      {'Generate'}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
        </Grid>

        {flashcards.map((flashcard, index) => (
          <Flashcard key={index} question={flashcard.question} answer={flashcard.answer} />
        ))}
      </motion.div>
    </Fragment>
  )
}

export default page;