import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARkdgM8jTm7sAY7ZcU0YKl4JoGyQPuVjw",
    authDomain: "ai-flashcard-app-c3057.firebaseapp.com",
    projectId: "ai-flashcard-app-c3057",
    storageBucket: "ai-flashcard-app-c3057.appspot.com",
    messagingSenderId: "1091844279157",
    appId: "1:1091844279157:web:3c7fe02ed3be817ae6613c",
    measurementId: "G-RSENHKJSEE"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db }