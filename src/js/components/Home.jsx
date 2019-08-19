import React, {useEffect} from 'react';
import "./styles/home.css";
import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import UserWelcome from "./UserWelcome";
import Vote from "./Vote";
import SendText from "./SendText";
import MessagesToYou from "./MessagesToUser";
import HomeArticle from "./HomeArticle";
import fire from "../configs/FireBase";
import history from "../routh/history";
import voteBG from "../../img/voteBG.jpg";
import msgToMe from "../../img/msgToMe.jpg";
import sendText from "../../img/sendText.jpg";
import backToHome from "../../img/backToHome.jpg";


export default function Home() {
    useEffect(() => {
        fire.auth().onAuthStateChanged((user) => {
            if (!user) {
                //console.log("user doesn't exist !");
                return history.push("/");
            }
            //console.log("user exist !");
        });
    // eslint-disable-next-line
    }, [null]);

    return (
        <Router>
            <div id="homeWrapper">
                <UserWelcome />
                <div id="refSection">
                    <Link to="/Home/SendText">
                        <img src={sendText} alt="Send Message"/>
                    </Link>
                    <Link to="/Home/MessagesToYou">
                        <img src={msgToMe} alt="Messages To ME" />
                    </Link>
                    <Link to="/Home/Vote">
                        <img src={voteBG} alt ="Vote"/>
                    </Link>
                    <Link to="/Home">
                        <img src={backToHome} alt="Back To Home" />
                    </Link>
                    

                </div>
                <Switch>
                    <Route path="/Home/SendText" component={SendText} />
                    <Route path="/Home/MessagesToYou" component={MessagesToYou} />
                    <Route path="/Home/Vote" component={Vote} />
                    <Route path="/Home" component={HomeArticle} />
                </Switch>
                {/* <Route path="/Home/SendText" component={SendText} />
                <Route path="/Home/MessagesToYou" component={MessagesToYou} />
                <Route path="/Home/Vote" component={Vote} />
                <Route exact path="/Home" component={MessagesToYou} /> */}
            </div>
        </Router>
    )    
}
