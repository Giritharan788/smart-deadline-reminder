// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChnsKMPO7qXR6zRCFbT_BTSmHL6lnOXAA",
  authDomain: "deadline-reminder-f15b5.firebaseapp.com",
  projectId: "deadline-reminder-f15b5",
  storageBucket: "deadline-reminder-f15b5.firebasestorage.app",
  messagingSenderId: "249621262490",
  appId: "1:249621262490:web:95303e257897cf0806ef23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
