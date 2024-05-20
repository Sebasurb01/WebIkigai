import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUO55aj19GL306A1WyLPrmq2KratLRLqw",
  authDomain: "myprojectikigai.firebaseapp.com",
  projectId: "myprojectikigai",
  storageBucket: "myprojectikigai.appspot.com",
  messagingSenderId: "466106609327",
  appId: "1:466106609327:web:c761c13652d3c1eef12e5a",
  measurementId: "G-JF72FPXWSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
export const db = getFirestore(app);
// Get an Auth instance
export const auth = getAuth(app);



export const storage = getStorage(app);

