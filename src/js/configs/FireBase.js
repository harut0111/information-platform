// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD4y4NXU_iYEokPKRcW-0oHku7hKEKUeME",
    authDomain: "information-platform-4cfb3.firebaseapp.com",
    databaseURL: "https://information-platform-4cfb3.firebaseio.com",
    projectId: "information-platform-4cfb3",
    storageBucket: "information-platform-4cfb3.appspot.com",
    messagingSenderId: "312250622176",
    appId: "1:312250622176:web:61c3c0923c27e6ab"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
// fire.firestore().settings({timestampsInSnapshots:true});
export default fire;