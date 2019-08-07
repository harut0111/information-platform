import React from 'react';
import "./styles/home.css";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import UserWelcome from "./UserWelcome";
import Vote from "./Vote";
import SendText from "./SendText";
import MessagesToYou from "./MessagesToUser";

export default function Home() {

    return (
        <Router>
            <div id="homeWrapper">
                <UserWelcome />
                <div id="refSection">
                    <Link to="/Home/SendText">
                        <h2>Send Text</h2>
                    </Link>
                    <Link to="/Home/MessagesToYou">
                        <h2>Messages To You</h2>
                    </Link>
                    <Link to="/Home/Vote">
                        <h2>Vote</h2>
                    </Link>
                </div>
                <Route path="/Home/SendText" component={SendText} />
                <Route path="/Home/MessagesToYou" component={MessagesToYou} />
                <Route path="/Home/Vote" component={Vote} />  
            </div>
        </Router>
    )
}

/* 
// Master

import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import firebase from '../configs/FireBase';
import history from '../routh/history';

function Home() {

    const [signin, setSignin] = useState("");

    function logout() {
        // e.preventDefault();
        firebase.auth().signOut().then(() => {
            history.push('/');
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) setSignin(user.uid);
        });
    }, [null])


    // console.log(props.signin.uid)
    return (
        <div>
            <h1>Home</h1>
            <h1>Current user id {signin} </h1>

            <Link to='/' onClick={logout}>
                <button >Log Out</button>
            </Link>

        </div>
    );
}


export default Home; */