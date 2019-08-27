import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";
import Button from '@material-ui/core/Button';
import history from '../routh/history';
import { Link } from "react-router-dom";

export default function UserWelcome() {
    const [name, setName] = useState(""),
        [surname, setSurname] = useState(""),
        [userId, setUserId] = useState(""),
        [age, setAge] = useState(""),
        [email, setEmail] = useState(""),
        [group, setGroup] = useState(""),
        [isLoaded, setIsLoaded] = useState(false);
    

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
    // eslint-disable-next-line
    }, [null])

    useEffect(() => {
        if (userId) {
            fire.firestore().collection("User").doc(userId).get()
            .then(docRef => {
                setName(docRef.data().name);
                setSurname(docRef.data().surname);
                setAge(docRef.data().age);
                setGroup(docRef.data().group);
                setEmail(docRef.data().email);
                setIsLoaded(true);
            })
            .catch(e => { console.log(e.message) })
        }
    // eslint-disable-next-line
    }, [userId])
    
    const handleLogOut = e => {
        e.preventDefault();
        fire.auth().signOut()
        .then(() => {
            history.push('/');
            //console.log("User was log out !")
        }, e => {
            console.log(e.message);
        })
    }
    
    const onUserInfo = e => {
        e.preventDefault();
        let temp = document.getElementById("userInfo").style;
        temp.display !== "block" ? temp.display = "block" : temp.display = "none"; 
    }

    return (
        <div id="welcomeSection">
            <Link to="/">
                <Button onClick={handleLogOut}
                        size="small"
                        variant="contained" 
                        color="primary"
                        style={{ marginLeft: "80%"}}>
                LOG OUT
                </Button>
            </Link>
            {isLoaded ? (
                <div>
                    <h2>Welcome {name + " " + surname}</h2>
                    <Button onClick={onUserInfo}
                        variant="contained"
                        size="small"
                        color="primary"
                        style={{ margin: "10px 0"}}>
                        INFO
                    </Button>
                    <div id="userInfo">
                        <ul type="none">
                            <li>Your Age: {age}</li>
                            <li>Your Group: {group}</li>
                            <li>Your Email: {email}</li>
                        </ul>
                    </div>
                </div>
            ) : <h3>LOADING . . .</h3>}
        </div>
    )
}
