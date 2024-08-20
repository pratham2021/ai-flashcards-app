"use client";
import React, { Fragment, useEffect, useState } from "react";
import { AppBar, Button, Paper, TextField, Box, Grid, Toolbar, Typography } from "@mui/material";
import { app, auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import { signOut, deleteUser } from "firebase/auth";
import { deleteDoc, doc, listCollections, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import LoginIcon from "@mui/icons-material/Login";
import firebase from "firebase/app";
import "firebase/auth";
import { motion } from "framer-motion";
import Flashcard from "../../components/Flashcard";

const page = () => {
  const [user] = useAuthState(auth);

  const [text, setText] = useState("");
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [storageFlashcards, setStorageFlashcards] = useState([]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data.flashCards);
      alert("Flashcards generated");
      // storeFlashcards(flashcards);
      setText("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  useEffect(() => {
    if (!auth.currentUser || !user) {
      router.push("/");
    }

    // Retrieve flashcards from Firebase
    


  }, [user, flashcards, storageFlashcards]);

  const logTheUserOut = () => {
    signOut(auth);
    router.push("/");
  };

  const storeFlashcards = async (cardsToStore) => {
    const uniqueIdentification = crypto.randomUUID();

    const docRef = doc(db, user.uid, "flashcards");
    
    const subCollectionRef = collection(docRef, uniqueIdentification);
    
    cardsToStore.forEach(async (card, index) => {
      const subDocRef = doc(subCollectionRef, `Flashcard ${index + 1}`);

      await setDoc(subDocRef, {
        topic: "",
        question: "",
        answer: "",
        flipped: false,
      });
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setFlashcards([]);
    }
    catch (error) {
      console.log("Error clearing an array!")
    }
  };

  const retrieveFlashcards = async () => {
    const docRef = doc(db, user.uid, "flashcards");

    try {
      const subcollections = await listCollections(docRef);

      const allDocumentsData = [];
      
      for (const subcollection of subcollections) {
        console.log(`Fetching documents from subcollection: ${subcollection.id}`);

        const subCollectionRef = collection(docRef, subcollection.id);

        const querySnapshot = await getDocs(subCollectionRef);

        querySnapshot.forEach(doc => {
          const documentData = {
            id: doc.id, 
            ...doc.data()
          };

          allDocumentsData.push(documentData);
        });
      }

      setStorageFlashcards(allDocumentsData);
    }
    catch (error) {
      alert("Error retrieving flashcards.")
    }
  }

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
                sx={{ marginLeft: "auto", marginRight: "5px" }}
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

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "80vh", transform: `translateX(1.25%)` }}
          align="center"
        >
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Paper elevation={10} style={{ padding: 24 }}>
              <Typography variant="h4" style={{ paddingBottom: 10 }}>
                Flashcard Content
              </Typography>

              <Typography variant="body1" style={{ paddingBottom: 10 }}>
                Make sure to border the text that needs to be converted into
                flashcards in triple quotes and tell the LLM how many flashcards
                to create.
              </Typography>

              <Grid
                container
                spacing={2}
                style={{ transform: `translateX(2.5%)` }}
              >
                <Grid item xs={12}>
                  <TextField
                    label="Topic"
                    onChange={(e) => setText(e.target.value)}
                    color="primary"
                    fullWidth
                    value={text}
                    placeholder="Enter Information"
                    autoComplete="off"
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                  >
                    {"Generate"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={5} style={{ padding: 30 }}>
            {storageFlashcards.map((storageFlashcard, index) => (
              <Flashcard key={index} question={storageFlashcard["question"]} answer={storageFlashcard["answer"]}/>
            ))}
        </Grid>

      </motion.div>
    </Fragment>
  );
};

export default page;
