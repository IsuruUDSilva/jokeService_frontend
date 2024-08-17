// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOq4HZy8XY65ZiaGXutW5m8COD59EMI2w",
  authDomain: "jokeservice-joke-delivery.firebaseapp.com",
  projectId: "jokeservice-joke-delivery",
  storageBucket: "jokeservice-joke-delivery.appspot.com",
  messagingSenderId: "393519739210",
  appId: "1:393519739210:web:2cd8ac01bdf98ec0b351b3",
  measurementId: "G-WGS0M2FPWD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
