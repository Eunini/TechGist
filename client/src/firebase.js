// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'techgist-b8273.firebaseapp.com',
  projectId: 'techgist-b8273',
  storageBucket: 'techgist-b8273.appspot.com',
  messagingSenderId: '1082953248472',
  appId: '1:1082953248472:web:13c5523533d15259956b97',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
