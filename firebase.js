// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCK7BX4IaYqoOdDrS1Qi8o6KnjrLSrROHI',
  authDomain: 'react-notes-842c7.firebaseapp.com',
  projectId: 'react-notes-842c7',
  storageBucket: 'react-notes-842c7.appspot.com',
  messagingSenderId: '646143194537',
  appId: '1:646143194537:web:d112fa0009497adf89c0b8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, 'notes');
