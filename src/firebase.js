import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBn56-ITpQdeprQrIHkLUc-rOWgdT9uPeM",
    authDomain: "weightkanjo.firebaseapp.com",
    projectId: "weightkanjo",
    storageBucket: "weightkanjo.firebasestorage.app",
    messagingSenderId: "1013162444829",
    appId: "1:1013162444829:web:b5fb503aea1093d26b1ef4",
    measurementId: "G-674Z7Y6HNL"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
