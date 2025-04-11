// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyA_VvZTp4_81OYqb7b5QrasrQUeqI8PB68",
  authDomain: "wardrobewise-974d6.firebaseapp.com",
  projectId: "wardrobewise-974d6",
  storageBucket: "wardrobewise-974d6.firebasestorage.app",
  messagingSenderId: "277119900844",
  appId: "1:277119900844:web:83fa91f57bd6641fc09309",
  measurementId: "G-DC5RTDTR2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally initialize analytics only for web
let analytics = null;
if (Platform.OS === 'web') {
  try {
    const { getAnalytics } = require("firebase/analytics");
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Firebase analytics initialization failed:", error);
  }
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };