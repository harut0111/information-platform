import React, {useEffect} from 'react';
import "./styles/home.css";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import UserWelcome from "./UserWelcome";
import Vote from "./Vote";
import SendText from "./SendText";
import MessagesToYou from "./MessagesToUser";
import fire from "../configs/FireBase";
import history from "../routh/history";
/*eslint-disable*/

export default function Home() {
    useEffect(() => {
        fire.auth().onAuthStateChanged((user) => {
            if (!user) {
                console.log("user doesn't exist !");
                return history.push("/");
            }
            console.log("user exist !");
        });
    // eslint-disable-next-line
    },[null]);

    return (
        <Router>
            <div id="homeWrapper">
                <UserWelcome />
                <div id="refSection">
                    <Link to="/Home/SendText">
                        <h2>Send Text</h2>
                    </Link>
                    <Link to="/Home/MessagesToYou">
                        <h2>Message To ME</h2>
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
