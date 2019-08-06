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

