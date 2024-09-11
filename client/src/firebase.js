// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-965de.firebaseapp.com",
  projectId: "blog-965de",
  storageBucket: "blog-965de.appspot.com",
  messagingSenderId: "1065002764818",
  appId: "1:1065002764818:web:b72e96ae3c6736782fa6cb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
