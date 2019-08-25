import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";
import noMessages from "../../img/noMessages.png";
import sendMsgIcon from '../../img/sendMsg.png';
import deleteMsgIcon from '../../img/deleteMsg.png';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function MessagesToUser() {
    const [userId, setUserId] = useState(""),
          [data, setData] = useState([]),
          [isLoaded, setIsLoaded] = useState("Load");

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
                                    tempObj.text = elem.text;
                                    tempObj.date = new Date(elem.date * 1000).toLocaleDateString() 
                                        + " - " + new Date(elem.date * 1000).toLocaleTimeString();
                                    tempObj.evenId = elem.evenId;
                                    tempArr.push(tempObj)
                                    break;
                                }
                            }
                        }
                        console.log(tempArr);
                        // console.log(tempArr);
                        if (JSON.stringify(data) !== JSON.stringify(tempArr)) {
                            setData([...tempArr]);
                            setIsLoaded("OK")
                        }
                        
                    } else {
                        setIsLoaded("Empty");
                    }
                })
            }
        }))
        .catch((e)=>{console.log(e.message)});
        // eslint-disable-next-line
    }, [userId])

    const onRemMsg = e => {
        e.preventDefault();
        let id = e.target.getAttribute("data-id"),
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

    const onResponseMsg = e => {
        let hiddenNode = e.target.parentNode.nextSibling;
        hiddenNode.style.display === "none" 
            ? hiddenNode.style.display = "block" 
            : hiddenNode.style.display = "none";
    }

    const onResponseSend = e => {
        e.preventDefault();
        let responseContainer = e.target.parentNode;
        let textarea = e.target.previousSibling.previousSibling;
        let text = textarea.value;
        textarea.value = "";
        if (!text) {
            textarea.style.borderColor = "red";
            setTimeout(() => {textarea.style.borderColor = "grey"}, 500);
        } 
        else {
           let aboutUserId = e.target.getAttribute("data-id");
            responseContainer.style.display = "none";
            //Call to Firestore (DataBase)
            fire.firestore().collection("User_text").doc().set({
                creatorUserId: userId,
                aboutUserId,
                theText: text,
                dateCreated: new Date()
            })
            .then(() => {
                alert("Message successfully sended.");
            })
            .catch(e => {
                console.log("Error writing document: ", e);
            });
        } 
        
    }
    
    const useStyles = makeStyles(theme => ({
        progress: {
            margin: theme.spacing(2),
        }
    }));
    let classes = useStyles();

    if(isLoaded === "OK") {
        return (
            <div id="toReferPageMessToUser">
                <h2>Аll messages sent to you !</h2>
                {data.map(val => (
                    <div id="messagesToUser" key={val.evenId}>
                        <h2>{`${val.name} ${val.surname}`}</h2>
                        <h5>{`(Group: ${val.group}, Age: ${val.age})`}</h5>
                        <h6>{`${val.date}`}</h6>
                        <hr />
                        <div id="paragWrapper">
                            <p>{val.text}</p>
                            <div className="icons">
                                <img className="sendMsgIcon"
                                    src={sendMsgIcon}
                                    alt="SendMsgIcon"
                                    onClick={onResponseMsg} />
                                <img className="deleteMsgIcon" src={deleteMsgIcon}
                                    alt="DeleteMsgIcon"
                                    onClick={onRemMsg}
                                    data-id={val.evenId} />
                            </div>
                            <div className="responseMsg" style={{ display: "none" }}>
                                <textarea rows="4"
                                    cols="10"
                                    placeholder={`Hi ${val.name} !`}
                                    style={{ maxHeight: 60, minHeight: 60 }} />
                                <br />
                                <button onClick={onResponseSend}
                                    data-id={val.id}> SEND
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    else if(isLoaded === "Empty") {
        return (
            <div id="toReferPageMessToUser" className="noMessages" style={{padding:10}}>
                 <h2 style={{ marginTop: 20, textDecoration: "underline" }}>
                     You haven't messages !
                 </h2>
                 <img src={noMessages} alt="You haven't messages" />
             </div>
        )
    }
    else return (
        <div id="toReferPageMessToUser">
            <div>
                <CircularProgress className={classes.progress} />
                <CircularProgress className={classes.progress} color="secondary" />
                <CircularProgress className={classes.progress} />
            </div>
        </div>
        )

}

