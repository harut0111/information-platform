import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";
import Button from '@material-ui/core/Button';

export default function UserWelcome() {
    let [name, setName] = useState(""),
        [surname, setSurname] = useState(""),
        [age, setAge] = useState(""),
        [country, setCountry] = useState(""),
        [isLoaded, setIsLoaded] = useState(false);

    const handleLogOut = e => {
        e.preventDefault();
        fire.auth().signOut().then(() => {
            console.log("User was log out !")
        }, e => {
            console.log(e.message);
        })
    }

    useEffect(() => {
        let id = "PMXDx8G2cYblbGvEywIgNdSYkQr1";
        fire.firestore().collection("User").doc(id).get()
        .then(docRef => {        
            setName(docRef.data().name);
            setSurname(docRef.data().surname);
            setAge(docRef.data().age);
            setCountry(docRef.data().country);
            setIsLoaded(true);
        })
        .catch(e => {console.log(e.message)})
    })

    return (
        <div id="welcomeSection">
            <Button onClick={handleLogOut}
                    color="primary" 
                    variant="contained" 
                    style={{ marginLeft: "80%" }}>
            LOG OUT
            </Button>
            {isLoaded ? (
                <div>
                    <h1>Welcome {name + " " + surname}</h1>
                    <p>Your age: {age}</p>
                    <p>Your country: {country}</p>
                </div>
            ) : <h1>LOADING . . .</h1>}
        </div>
    )
}
