// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDCDrytYjA17NVvzEUT0NZadgfLLmN_aHw",
    authDomain: "harut0111-infplat.firebaseapp.com",
    databaseURL: "https://harut0111-infplat.firebaseio.com",
    projectId: "harut0111-infplat",
    storageBucket: "harut0111-infplat.appspot.com",
    messagingSenderId: "138367174066",
    appId: "1:138367174066:web:8a2fb1c145ec3b49a190ab",
    measurementId: "G-Y5P1VS0TF5"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export default fire;