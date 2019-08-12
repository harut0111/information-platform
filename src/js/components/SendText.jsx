import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

export default function SendText() {
    let [data, setData] = useState(""),
        [isLoaded, setIsLoaded] = useState(false),
        [userId, setUserId] = useState(""),
        [aboutUserId, setAboutUserId] = useState(""),
        [text, setText] = useState("");
    
    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
     // eslint-disable-next-line
    }, [null]);

    useEffect(() => {
        fire.firestore().collection("User").get()
        .then(querySnapshot => {
            let arrTemp = [];
            querySnapshot.forEach( doc => {
                if (doc.id !== userId) {
                    let objTemp = { ...doc.data() };
                    objTemp.id = doc.id;
                    arrTemp.push(objTemp); 
                }
            });
            setData([...arrTemp]);
            setIsLoaded(true);
        })
        .catch(e => {console.log(e.message, "Catch error.")});
    }, [userId]);

    const onSelectChange = e => {
        e.preventDefault();
        setAboutUserId(e.target.value);
    };

    const onTextChange = e => {
        e.preventDefault();
        setText(e.target.value);
    };
    
    const onSendClick = e => {
        e.preventDefault();
        if(!text)  {
            document.getElementById("textarea").style.border = "3px solid red";
            return false;
        }
        // Call to Firestore (DataBase)
        fire.firestore().collection("User_text").doc().set({
            creatorUserId: userId,
            aboutUserId: aboutUserId,
            theText: text,
            dateCreated: new Date()
        })
        .then(() => {
            alert("Text successfully sended!");
            console.log("Document successfully written!");
            console.log(data);
        })
        .catch(e => {
            console.log("Error writing document: ", e);
        });
        setText("");
    }

    const useStyles = makeStyles(theme => ({
        progress: {margin: theme.spacing(2),}
    }));
    const classes = useStyles();

    return (
        !isLoaded ? (
            <div id="toReferPage">
                <div>
                    <CircularProgress className={classes.progress} />
                    <CircularProgress className={classes.progress} color="secondary" />
                    <CircularProgress className={classes.progress} />
                </div>
            </div>
        ) : (
            <div id="toReferPage">
                <h1>Write text to another user</h1>
                <h2>Select User</h2><br/>
                <select required onChange={onSelectChange} name="aboutUserId">
                    {data.map(item => (
                        <option key={item.id} value={item.id}>
                            {`${item.name} ${item.surname} (Group: ${item.group}, Age: ${item.age})`}
                        </option>
                    ))}
                </select>
                <textarea id="textarea"
                    rows="5"
                    cols="25"
                    required 
                    placeholder="Write text to selected user."
                    onChange={onTextChange}
                    onMouseOver={(e) => e.target.style.border = "3px solid #155e80"}
                    onMouseOut={(e) => e.target.style.border = "3px solid grey"}
                    value={text}
                    name="text">
                </textarea>
                <Button
                    onClick={onSendClick}
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ width: "max-content", margin: "0 auto", padding: 5 }}>
                    SEND TEXT
                </Button>
            </div>
            )
    )
}