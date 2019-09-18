import React, {useEffect} from 'react';
import "./styles/home.css";
import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import { ADMIN_ID } from "../constants/signIn";
import UserWelcome from "./UserWelcome";
import Vote from "./Vote";
import SendText from "./SendText";
import MessagesToMe from "./MessagesToMe";
import MessagesFromMe from "./MessagesFromMe";
import HomeArticle from "./HomeArticle";
import fire from "../configs/FireBase";
import history from "../routh/history";
import voteBG from "../../img/voteBG.jpg";
import msgToMe from "../../img/sms.png";
import mySendMsg from "../../img/sendMsg.png";
import sendText from "../../img/sendText.jpg";
import backToHome from "../../img/backToHome2.png";


export default function Home() {
    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (!user && user.uid === ADMIN_ID) {
                return history.push("/");
            }
        });
    // eslint-disable-next-line
    }, [null]);

    return (
        <Router>
            <div id="homeWrapper">
                <UserWelcome />
                <div id="refSection">
                    <Link to="/Home">
                        <img src={backToHome} alt="Back To Home" />
                    </Link>
                    <Link to="/Home/SendText">
                        <img src={mySendMsg} alt="Send Message" />
                    </Link>
                    <Link to="/Home/MessagesToMe">
                        <img src={msgToMe} alt="Messages To ME" />
                    </Link>
                    <Link to="/Home/MessagesFromMe">
                        <img src={sendText} alt="My Sent Messages" />
                    </Link>
                    <Link to="/Home/Vote">
                        <img src={voteBG} alt ="Vote" />
                    </Link>
                </div>

                <Switch>
                    <Route path="/Home/SendText" component={SendText} />
                    <Route path="/Home/MessagesFromMe" component={MessagesFromMe} />
                    <Route path="/Home/MessagesToMe" component={MessagesToMe} />
                    <Route path="/Home/Vote" component={Vote} />
                    <Route path="/Home" component={HomeArticle} />
                </Switch>
            </div>
        </Router>
    )    
}
