// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "techgist16.firebaseapp.com",
  projectId: "techgist16",
  storageBucket: "techgist16.firebasestorage.app",
  messagingSenderId: "833170078328",
  appId: "1:833170078328:web:92d2e0fc59c56c41ee8b8d",
  measurementId: "G-SH2SZTZY01"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);