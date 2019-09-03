import React, {useState, useEffect} from "react";
import fire from "../configs/FireBase";
import "./styles/home.css";
import {ADMIN_ID} from "../constants/signIn";
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import noMessages from "../../img/noMessages.png";
import deleteMsgIcon from '../../img/deleteMsg.png';
import sendText from "../../img/sendText.jpg";

export default function MessagesFromMe() {
    const [userId, setUserId] = useState(""),
        [data, setData] = useState([]),
        [isLoaded, setIsLoaded] = useState("Loading");

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
    // eslint-disable-next-line
    }, [null]);

    useEffect(() => {
        fire.firestore().collection("User").get()
        .then((snapshot => {
            let tempArr = [];
            snapshot.forEach((doc) => {
                if (doc.id !== userId && doc.id !== ADMIN_ID) {
                    let tempObj = {};
                    tempObj = { ...doc.data() };
                    tempObj.id = doc.id;
                    tempArr.push(tempObj);
                }   
            })
            return tempArr;
        }))
        .then((usersArr => {
            fire.firestore().collection("User_text").where("creatorUserId", "==", userId).get()
                .then(docRef => {
                    let tempArr = [];
                    docRef.forEach((doc) => {
                        let tempObj = {};
                        tempObj.evenId = doc.id;
                        tempObj.aboutUserId = doc.data().aboutUserId;
                        tempObj.text = doc.data().theText;
                        tempObj.date = doc.data().dateCreated.seconds;
                        tempArr.push(tempObj);
                    });
                    return tempArr.sort((a, b) => b.date - a.date);
                })
                .then(aboutUserMsgArr => {
                    let result = []
                    for(let aboutUser of aboutUserMsgArr) {
                        for(let user of usersArr) {
                            if(user.id === aboutUser.aboutUserId) {
                                let tempObj = {};
                                tempObj = {...user, ...aboutUser};
                                delete tempObj.aboutUserId;
                                tempObj.date = (new Date(tempObj.date * 1000)).toLocaleString();
                                result.push(tempObj);
                                break;
                            }
                        }
                    }
                    //console.log(result);
                    setData([...result]);
                    if(result.length) setIsLoaded("OK");
                    else setIsLoaded("Empty");
                })
        }))
    
    // eslint-disable-next-line
    }, [null, userId]);

    const onRemMsg = e => {
        e.preventDefault();
        let id = e.target.getAttribute("data-id"),
            tempArr = [...data],
            index,
            i = 0;

        for (let el of tempArr) {
            if (el.evenId === id) {
                index = i;
                tempArr.splice(index, 1);
                setData([...tempArr]);
                break;
            }
            i += 1;
        }

        fire.firestore().collection("User_text").doc(id).delete()
            .then(() => {
                //console.log("Successfully removed !");
            })
            .catch(e => { console.log(e.message) });
    }

    const useStyles = makeStyles(theme => ({
        progress: {
            margin: theme.spacing(2),
        }
    }));
    let classes = useStyles();

    if(isLoaded === "Loading") return (
        <div id="toReferPageMsgFromMe">
            <div>
                <CircularProgress className={classes.progress} />
                <CircularProgress className={classes.progress} color="secondary" />
                <CircularProgress className={classes.progress} />
            </div>
        </div>
    )
    else if(isLoaded === "Empty") return (
        <div id="toReferPageMsgFromMe" className="noMessages" style={{padding: 40}}>
            <h2 style={{ color: '#3B5998' }}>No active message sent from you !</h2>
            <img src={noMessages} alt="No active message" style={{marginTop: -12}}/>
        </div>
    )
    return (
        <div id="toReferPageMsgFromMe">
            <h2 id="headTitle">Active messages that you have sent ! 
                <img src={sendText} alt="MsgFromMe" style={{marginBottom: -27, width: 100, marginLeft: 5}}/>
            </h2>
            {data.map((val) => (
                <div id="messagesFromUser" key={val.evenId}>
                    <h2>{`${val.name} ${val.surname}`}</h2>
                    <h4>{`(Group: ${val.group}, Age: ${val.age})`}</h4>
                    <h5>{`${val.date}`}</h5>  
                    <img className="deleteMsgIcon2" src={deleteMsgIcon}
                        alt="DeleteMsgIcon"
                        onClick={onRemMsg}
                        data-id={val.evenId} />
                    <hr />
                    <div id="paragWrapper">
                        <p>{val.text}</p>
                    </div>
                </div>
        ))}
        </div>
    )
}