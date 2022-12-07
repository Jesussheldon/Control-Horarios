// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCAIYf3iQIIYPWnXU6IqnfjtrI1iQhzsU",
  authDomain: "c-horarios.firebaseapp.com",
  projectId: "c-horarios",
  storageBucket: "c-horarios.appspot.com",
  messagingSenderId: "626404956239",
  appId: "1:626404956239:web:0709e6abea5612bbcc723a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);