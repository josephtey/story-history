// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwN1eZpavBUpXhKdjoZB5jL0cZAZ2bMc4",
  authDomain: "story-history.firebaseapp.com",
  projectId: "story-history",
  storageBucket: "story-history.appspot.com",
  messagingSenderId: "267437033644",
  appId: "1:267437033644:web:029f0c95e26ecaac123709",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
