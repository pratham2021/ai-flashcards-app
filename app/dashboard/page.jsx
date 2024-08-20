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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { app, auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import { signOut, deleteUser } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  listCollections,
  writeBatch,
  collection,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import LoginIcon from "@mui/icons-material/Login";
import GridViewIcon from '@mui/icons-material/GridView';
import firebase from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import moment from 'moment-timezone';

const page = () => {
  const [user, setUser] = useState(null);

  const [text, setText] = useState("");
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [storageFlashcards, setStorageFlashcards] = useState([]);

  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

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
      setFlashcards(data);
      // storeFlashcards(flashcards);
      setText("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("Logged in!");
      } else {
        setUser(null);
        router.push("/");
      }
    });
  }, []);

  // useEffect(() => {
  //   const fetchFlashcards = async () => {
  //     await retrieveFlashcards();
  //   };
  //   fetchFlashcards();
  //   const intervalId = setInterval(fetchFlashcards, 1000);
  //   return () => clearInterval(intervalId);
  // }, []);

  const logTheUserOut = () => {
    signOut(auth);
    router.push("/");
  };

  const viewSets = () => {
    router.push("/flashcards");
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
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
                justifyContent="center"
                alignItems="center"
                align="center"
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
                    onClick={handleSubmit}
                  >
                    {"Generate"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }} justifyContent="center" alignItems="center">
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              style={{ paddingBottom: 10 }}
            >
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {storageFlashcards.map((storageFlashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Front:</Typography>
                      <Typography>{storageFlashcard.cards["front"]}</Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Back:
                      </Typography>
                      <Typography>{storageFlashcard.cards["back"]}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Save Flashcards
            </Button>
          </Box>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Fragment>
  );
};

export default page;