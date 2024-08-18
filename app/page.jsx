'use client'
import React, { Fragment, useState } from "react";
import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import SignInForm from "./components/SignUpForm";
import SignUpForm from "./components/SignUpForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const [signInPressed, setSignInPressed] = useState(true);
  const [signUpPressed, setSignUpPressed] = useState(false);

  const firstFunction = () => {
    setSignInPressed(true);
    setSignUpPressed(false);
  };

  const secondFunction = () => {
    setSignInPressed(false);
    setSignUpPressed(true);
  }

  const [user] = useAuthState(auth);

  const router = useRouter();

  if (user) {
    router.push('/dashboard');
  }

  return (
        <Fragment>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2, ease: 'easeInOut' }}>
                <AppBar sx={{ background: '#063970'}}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <RecentActorsIcon style={{ color: '#ffffff' }}/>
                        </Box>

                        <Box sx={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="h6" className="hidden-on-load" sx={{ left: '50%', transform: `translateX(50%)`,}}>
                                Flashcard Generator
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button sx={{ marginLeft: 'auto' }} variant="contained" onClick={firstFunction}>Sign In</Button>
                            <Button sx={{ marginLeft: '10px',  marginRight: '-10px' }} variant="contained" onClick={secondFunction}>Sign Up</Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                {!user ? (!signInPressed && !signUpPressed ? (<></>):(
                    signInPressed ? (<SignInForm/>): (signUpPressed ? (<SignUpForm/>): (<></>))
                )) : (<></>)}
            </motion.div>
        </Fragment>
  );
}