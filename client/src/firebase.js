// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration (public keys are safe client-side)
const firebaseConfig = {
  apiKey: 'AIzaSyBQzb58W-saLtpmjbsSDtgUVZ9lTqD_h0k',
  authDomain: 'techgist16.firebaseapp.com',
  projectId: 'techgist16',
  storageBucket: 'techgist16.firebasestorage.app',
  messagingSenderId: '833170078328',
  appId: '1:833170078328:web:92d2e0fc59c56c41ee8b8d',
  measurementId: 'G-SH2SZTZY01',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only when window exists (avoids issues in tests / SSR)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
