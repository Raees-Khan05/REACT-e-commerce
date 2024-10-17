// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARoumL2e85JzTtz9uhxRCaVDDb2mgzbGQ",
  authDomain: "first-project-cc18b.firebaseapp.com",
  projectId: "first-project-cc18b",
  storageBucket: "first-project-cc18b.appspot.com",
  messagingSenderId: "770785505812",
  appId: "1:770785505812:web:cd9aa86b5761327af16d01",
  measurementId: "G-WC0ZSCJ5ES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app); 