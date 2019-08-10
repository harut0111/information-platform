import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export default function MessagesToUser() {
    const [userId, setUserId] = useState(""),
          [data, setData] = useState([]),
          [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
    // eslint-disable-next-line
    }, [null])

    useEffect(()=> {
        // Getting all users from database 
        fire.firestore().collection("User").get()
        .then((snapshot => {
            let tempArr = [];
            snapshot.forEach((doc) => {
                let tempObj = {};
                tempObj = {...doc.data()};
                tempObj.id = doc.id;
                tempArr.push(tempObj);
            })
            return tempArr;
        }))
        .then((arrAllUsers => {
            if(arrAllUsers.length) {
                // Getting all messages to user from database 
                fire.firestore().collection("User_text").where("aboutUserId", "==", userId).get()
                .then(docRef => {
                    let tempArr = [];
                    docRef.forEach((doc) => {
                        let tempObj = {};
                        tempObj.evenId = doc.id;
                        tempObj.id = doc.data().creatorUserId;
                        tempObj.text = doc.data().theText;
                        //tempObj.date = new Date(doc.data().dateCreated.seconds * 1000).toLocaleDateString() + " - " + new Date(doc.data().dateCreated.seconds*1000).toLocaleTimeString();
                        tempObj.date = doc.data().dateCreated.seconds;
                        tempArr.push(tempObj);
                    });
                    return tempArr.sort((a, b) => b.date - a.date);
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
                                    tempObj.date = new Date(elem.date * 1000).toLocaleDateString() + " - " + new Date(elem.date * 1000).toLocaleTimeString();
                                    tempObj.evenId = elem.evenId;
                                    tempArr.push(tempObj)
                                    break;
                                }
                            }
                        }
                        //console.log(tempArr);
                        if (JSON.stringify(data) !== JSON.stringify(tempArr)) {
                            setData([...tempArr]);
                            setIsLoaded(true);
                        }  
                    }
                })
            }
        }))
        .catch((e)=>{console.log(e.message)});
         // eslint-disable-next-line
    }, [userId])

    const onRemMsg = e => {
        e.preventDefault();
        let id = e.target.getAttribute("data-id") || e.target.parentNode.getAttribute("data-id"),
            tempArr = [...data],
            index,
            i = 0;

        for(let el of tempArr) {
            if(el.evenId === id) {
                index = i;
                tempArr.splice(index, 1);
                setData([...tempArr]);
                break;
            }
            i += 1;
        }

        fire.firestore().collection("User_text").doc(id).delete()
        .then(() => {
            console.log("Successfully removed !");
        })
        .catch(e => {console.log(e.message)});
    }

    const useStyles = makeStyles(theme => ({
        button: {
            margin: theme.spacing(1),
        },
    }));
    
    const classes = useStyles();

    return (
        !isLoaded ? (
            <div id="toReferPage">
                <h2 style={{marginTop: 20}}>You havn't messages !</h2>
            </div>
        ) : (
             <div id="toReferPage">
                <h1>Аll letters sent to you !</h1>
                    {data.map( val => (
                        <div id="messages" key={val.evenId}>
                            <h2>{`${val.name} ${val.surname}`}</h2>
                            <h4>{`(Group: ${val.group}, Age: ${val.age})`}</h4>
                            <hr />
                            <h4>{`${val.date}`}</h4>
                            <div id="paragWrapper">
                                <p>
                                    {val.text}
                                    <IconButton className={classes.button} 
                                                aria-label="delete"
                                                onClick={onRemMsg}
                                                data-id = {val.evenId}>
                                        <DeleteIcon color="secondary" data-id={val.evenId} />
                                    </IconButton>
                                </p>
                            </div>
                        </div>
                    ))}
            </div> 
        )
    )  
}

