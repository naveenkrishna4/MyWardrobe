import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBitOzoDlLPE--H9YgqFelFSIgxSqymwHk",
  authDomain: "my-wardrobe-422de.firebaseapp.com",
  databaseURL: "https://my-wardrobe-422de-default-rtdb.firebaseio.com",
  projectId: "my-wardrobe-422de",
  storageBucket: "my-wardrobe-422de.appspot.com",
  messagingSenderId: "1051909412859",
  appId: "1:1051909412859:web:eb5880b23aa35adfc7dd5e",
  measurementId: "G-SEBMS4GETD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, provider, firestore, storage };
