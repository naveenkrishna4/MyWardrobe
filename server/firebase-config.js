// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD01aNYNRfuKp0IKf3SsL2mbb8jb0ODTzU",
  authDomain: "my-wardrobe-62f1a.firebaseapp.com",
  projectId: "my-wardrobe-62f1a",
  storageBucket: "my-wardrobe-62f1a.appspot.com",
  messagingSenderId: "516070668114",
  appId: "1:516070668114:web:aa1d68b73b02f841956c8b",
  measurementId: "G-RKSNLPH5TM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
