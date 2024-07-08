// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf4hSm3L08U7hCzYCGU21yDpAxj4S9-ec",
  authDomain: "blogpage-93201.firebaseapp.com",
  projectId: "blogpage-93201",
  storageBucket: "blogpage-93201.appspot.com",
  messagingSenderId: "883634970772",
  appId: "1:883634970772:web:9aa5c779a22f159049d481"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);