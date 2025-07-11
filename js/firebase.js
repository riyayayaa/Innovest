// js/firebase.js

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDukfEX_PB90lTJiF28wV9zVjmuehB8S50",
  authDomain: "innovest-1ebb0.firebaseapp.com",
  projectId: "innovest-1ebb0",
  storageBucket: "innovest-1ebb0.firebasestorage.app",
  messagingSenderId: "1045052429019",
  appId: "1:1045052429019:web:55b231014fe0c2bf11b2fe",
  measurementId: "G-R71Y998393"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
