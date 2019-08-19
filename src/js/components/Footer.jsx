import React, { useState, useEffect } from "react";
import fire from "../configs/FireBase";
import "./styles/footer.css"; 
import {Link} from "react-router-dom";
import githubLogoLight from "../../img/GitHubLight-32px.png";
import githubLogoDark from "../../img/GitHub32px.png";
import tickLogo from "../../img/tick.png";
import cancelLogo from "../../img/cancel.png";

export default function Footer() {
    const [userId, setUserId] = useState("Unknown"),
        [text, setText] = useState("");

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
        // eslint-disable-next-line
    });

    const onTextChange = e => {
        setText(e.target.value);
    }

    const onSendClick = e => {
        e.preventDefault();
        //console.log(text);
        if (!text) {
            let txABorder = document.getElementById("textareaAdmin"),
                cancel = document.getElementById("cancelLogo");
            txABorder.style.border = "2px solid red";
            cancel.style.visibility = "visible";
            setTimeout(() => {
                txABorder.style.border = "1px solid silver";
                cancel.style.visibility = "hidden";
            }, 500);
        } 
        else {
            // Call to Firestore (DataBase)
            fire.firestore().collection("Admin").doc().set({
                creatorUserId: userId,
                theText: text,
                dateCreated: new Date().toLocaleString()
            }).then(() => {
                console.log("Text successfully sended!");
            }).catch(e => {
                console.log("Error writing document: ", e);
            });

            let tick = document.getElementById("tickLogo");
            tick.style.visibility = "visible";
            setTimeout(() => {
                tick.style.visibility = "hidden";
            }, 500);
            setText("");
        }
    }

    return (
        <footer>
            <div id="footerContent">
            <div id="textToAdmin">
                <textarea placeholder="Send message to Admin."
                        id="textareaAdmin"
                        rows="4" 
                        cols="30"
                        value={text}
                        onChange={onTextChange}>
                </textarea>
                <img id="tickLogo" src={tickLogo} alt="OK TickLogo" />
                <img id="cancelLogo" src={cancelLogo} alt="Cancel CancelLogo" />
                <button onClick={onSendClick}>SEND</button>
            </div>
            <div>
                <div id="subsGit"><p>Subscribe Us On GitHub.</p></div>
                <div id="github">
                    <Link to="//github.com/BaghdasaryanHayk" target="_blank">
                        <img src={githubLogoLight} alt="GitHub Link" />
                    </Link>
                    <Link to="//github.com/harut0111" target="_blank">
                        <img src={githubLogoDark} alt="GitHub Link" />
                    </Link>
                    <Link to="//github.com/edgar188" target="_blank">
                        <img src={githubLogoLight} alt="GitHub Link" />
                    </Link>
                    <Link to="//github.com/ArmanShirinyan" target="_blank">
                        <img src={githubLogoDark} alt="GitHub Link" />
                    </Link> 
                </div>
                    <div><p style={{ color: "silver" }}>Copyright &#9400; 2019 | HB.HM.EH.AS | All Rights Reserved.</p></div>
            </div>
            </div>
        </footer>
    )
}