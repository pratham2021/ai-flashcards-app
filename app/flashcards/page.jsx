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
  CardActionArea,
  Container,
} from "@mui/material";
import { app, auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import { signOut, deleteUser } from "firebase/auth";
import {
  deleteDoc,
  doc,
  collection,
  getDocs
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import LoginIcon from "@mui/icons-material/Login";
import GridViewIcon from "@mui/icons-material/GridView";
import firebase from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

export default function Flashcards() {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();
  // let userUniqueIdentification = "";
  const [userUniqueIdentification, setUserUniqueIdentification] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        const collectionRef = collection(docRef, "flashcardSets"); // this has to point to the flashcardSets collection

        const snapshots = await getDocs(collectionRef);

        const documents = snapshots.docs.map((doc) => {
          const documentData = doc.data().flashcards;
          
          console.log(documentData[0]["front"]);
          console.log(documentData[0]["back"]);

          console.log(documentData[1]["front"]);
          console.log(documentData[1]["back"]);
        });

        console.log(documents.length);
      } else {
        setUser(null);
        router.push("/");
      }
    });
  }, []);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
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

  const goToDashboard = () => {
    router.push("/dashboard");
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
              <IconButton
                sx={{ marginLeft: "-10px", marginRight: "auto" }}
                className="hidden-on-load"
                variant="contained"
                style={{ color: "#ffffff" }}
                onClick={goToDashboard}
              >
                <RecentActorsIcon />
              </IconButton>
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
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea
                    onClick={() => handleCardClick(flashcard.name)}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flashcard.front}
                      </Typography>
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
}