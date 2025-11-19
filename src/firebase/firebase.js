// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

//Danger - do not share config in public
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACgiMvWNFT0v8rqhOAqCxQ0iPttZGH2u8",
  authDomain: "email-password-auth-5827b.firebaseapp.com",
  projectId: "email-password-auth-5827b",
  storageBucket: "email-password-auth-5827b.firebasestorage.app",
  messagingSenderId: "497350602770",
  appId: "1:497350602770:web:31b6ce2840e55741ad68cb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
