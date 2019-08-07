import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import "firebase/firestore";

export default function MessagesToUser() {
    const [userId, setUserId] = useState(""),
          [data, setData] = useState([]),
          [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
    })

    useEffect(()=> {
        // Getting all users from database 
        fire.firestore().collection("User").get()
        .then((snapshot => {
            let tempArr = [];
            snapshot.forEach((doc) => {
                let tempObj = {};
                tempObj.id = doc.id;
                tempObj.name = doc.data().name;
                tempObj.surname = doc.data().surname;
                tempObj.group = doc.data().group;
                tempObj.age = doc.data().age;
                tempArr.push(tempObj);
            })
            return tempArr;
        }))
        .then((arrAllUsers => {
            if(arrAllUsers.length) {
               //console.log(arrAllUsers);

                // Getting all messages to user from database 
                fire.firestore().collection("User_text").where("aboutUserId", "==", userId).get()
                .then(docRef => {
                    let tempArr = [];
                    docRef.forEach((doc) => {
                        let tempObj = {};
                        tempObj.evenId = doc.id;
                        tempObj.id = doc.data().creatorUserId;
                        tempObj.text = doc.data().theText;
                        //tempObj.date = doc.data().dateCreated;
                        tempArr.push(tempObj);
                    });
                    return tempArr;
                })
                .then((allSenders) => {   
                    if (allSenders.length) {
                        let tempArr = [];
                        for (let elem of allSenders) {
                            let tempObj = {};
                            for(let user of arrAllUsers) {
                                if(user.id === elem.id) {
                                    tempObj = {...user};
                                    delete tempObj.id;
                                    tempObj.text = elem.text;
                                    tempObj.evenId = elem.evenId;
                                    //console.log(tempObj.evenId);
                                    tempArr.push(tempObj)
                                    break;
                                }
                            }
                        }
                        //console.log(tempArr);
                        if (JSON.stringify(data) !== JSON.stringify(tempArr)) {
                            setData(tempArr);
                            setIsLoaded(true);
                        }  
                    }
                })
            }
        }))
        .catch((e)=>{console.log(e.message)})
    }, [userId])

    const onRemMsg = e => {
        e.preventDefault();
        //e.target.parentNode.style.color = "red";
        let eventNode = e.target.parentNode;
        let id = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if(id) {
            fire.firestore().collection("User_text").doc(id).delete()
            .then((() => {
                eventNode.style.color = "red";
                console.log("Successfully removed !");
            }), e => {
                console.log(e.message);
            })
        }

    }

    const useStyles = makeStyles(theme => ({
        button: {
            margin: theme.spacing(1),
        },
    }));
    
    const classes = useStyles();

    return (
        isLoaded === false ? (
            <div id="toReferPage">
                <h1>You havn't messages !</h1>
            </div>
        ) : (
             <div id="toReferPage">
                <h1>Аll letters sent to you !</h1>
                    {data.map( val => (
                        <div id="messages" key={val.evenId}>
                            <h3>{`${val.name} ${val.surname}`}</h3>
                            <h5>{`(Group: ${val.group}, Age: ${val.age})`}</h5><hr/>
                            <div>
                                <p id={val.evenId}>
                                    {val.text}
                                    <IconButton className={classes.button} 
                                                aria-label="delete" onClick={onRemMsg}>
                                        <DeleteIcon color="primary"/>
                                    </IconButton>
                                </p>
                            </div>
                        </div>
                    ))}
            </div> 
        )
       
    )  
}

