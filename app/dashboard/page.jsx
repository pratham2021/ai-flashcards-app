'use client'
import React, {Fragment, useEffect, useState } from 'react'
import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";
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


const page = () => {
  
  const [user] = useAuthState(auth);
  const [flashCards, setFlashCards] = useState([]);
  const router = useRouter();

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

        <Grid container spacing={5} style={{ padding: 30 }}>
            {flashCards.map((flashCard) => (
                <Grid item key={crypto.randomUUID()}>
                  <ItemCard/>
                </Grid>
            ))}
        </Grid>
      </motion.div>
    </Fragment>
  )
}

export default page;