"use client";
import React, { Fragment, useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Paper,
  TextField,
  Box,
  Grid,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import { app, auth, db } from "../../firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, deleteUser } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  listCollections,
  getDocs,
  collection,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import LoginIcon from "@mui/icons-material/Login";
import GridViewIcon from "@mui/icons-material/GridView";
import firebase from "firebase/app";
import "firebase/auth";
import { motion } from "framer-motion";

export default function Flashcard() {
  const [user] = useAuthState(auth);
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const wipeClean = async () => {
    const userToDelete = auth.currentUser;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(userToDelete);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/");
    } catch (error) {
      console.log("Error deleting user:");
    }
  };

  const logTheUserOut = () => {
    signOut(auth);
    router.push("/");
  };

  const viewSets = () => {
    router.push("/flashcards");
  };

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <AppBar sx={{ background: "#063970" }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <RecentActorsIcon
                className="hidden-on-load"
                style={{ color: "#ffffff" }}
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h6"
                className="hidden-on-load"
                sx={{ left: "50%", transform: `translateX(50%)` }}
              >
                Dashboard
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                sx={{ marginLeft: "auto", marginRight: "10px" }}
                className="hidden-on-load"
                variant="contained"
                style={{ color: "#ffffff" }}
                onClick={viewSets}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                sx={{ marginLeft: "10px", marginRight: "10px" }}
                className="hidden-on-load"
                variant="contained"
                style={{ color: "#ffffff" }}
                onClick={logTheUserOut}
              >
                <LoginIcon />
              </IconButton>
              <IconButton
                sx={{ marginLeft: "10px", marginRight: "-0px" }}
                className="hidden-on-load"
                variant="contained"
                style={{ color: "#ffffff" }}
                onClick={wipeClean}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <CardContent>
                      <Box
                        sx={{
                          width: 300,
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          backgroundColor: flipped ? "#f0f0f0" : "#fff",
                          border: "1px solid #000",
                          padding: 2,
                          margin: 1,
                          cursor: "pointer",
                          boxShadow: 1,
                          transition: "transform 0.6s",
                          transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
                          position: "relative",
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </motion.div>
    </Fragment>
  );

  // ... (rest of the component)
}

// <Box onClick={handleClick} sx={{ width: 300, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: flipped ? '#f0f0f0' : '#fff', border: '1px solid #000', padding: 2, margin: 1, cursor: 'pointer', boxShadow: 1, transition: 'transform 0.6s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', position: 'relative', }}>
//   <Paper elevation={3} sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'inherit', borderRadius: 1, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.6s', }}>
//       <Typography variant="body1">
//         {flipped ? answer : question}
//       </Typography>
//   </Paper>
// </Box>
