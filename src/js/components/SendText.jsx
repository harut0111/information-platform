import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";
import  sendMsgLogo  from "../../img/sendMsg.png";
import tickLogo from "../../img/tick.png";
import cancelLogo from "../../img/cancel.png";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { ADMIN_ID} from "../constants/signIn";

export default function SendText() {
    let [data, setData] = useState(""),
        [isLoaded, setIsLoaded] = useState(false),
        [userId, setUserId] = useState(""),
        [aboutUserId, setAboutUserId] = useState(),
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
                if (doc.id !== userId && doc.id !== ADMIN_ID) {
                    let objTemp = { ...doc.data() };
                    objTemp.id = doc.id;
                    arrTemp.push(objTemp); 
                }
            });
            arrTemp.sort((a, b) => {
                let groupA = a.group.toLowerCase(), 
                    groupB = b.group.toLowerCase();
                if (groupA < groupB) 
                    return -1;
                if (groupA > groupB)
                    return 1;
                return 0;
            });
            setData([...arrTemp]);
            setAboutUserId(arrTemp[0]["id"])
            setIsLoaded(true);
        })
        .catch(e => {console.log(e.message, "Catch error.")});
    // eslint-disable-next-line
    }, [null, userId]);

    const onSelectChange = e => {
        e.preventDefault();
        let aboutUserId = e.currentTarget.value;
        setAboutUserId(aboutUserId);
    };

    const onTextChange = e => {
        e.preventDefault();
        setText(e.target.value);
    };
    
    const onSendClick = e => {
        e.preventDefault();
        if(!text.trim())  {
            document.getElementById("textarea").style.border = "2px solid red";
            document.getElementById("cancelLogoSendText").style.visibility = "visible";
            setTimeout(() => {
                document.getElementById("textarea").style.border = "1px solid grey";
                document.getElementById("cancelLogoSendText").style.visibility = "hidden";
            }, 1000);
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
            document.getElementById("tickLogoSendText").style.visibility = "visible";
            setTimeout(() => {
                document.getElementById("tickLogoSendText").style.visibility = "hidden";
            }, 1000);
            //console.log("Message successfully written!");
            //console.log(data);
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
                    <h2>Send message  <img src={sendMsgLogo} id="sendTextLogo" alt="sendMsgLogo" /></h2>
                    <select required onChange={onSelectChange} name="aboutUserId">
                        {data.map(item => (
                            <option key={item.id} value={item.id}>
                                {`${item.group} (${item.name} ${item.surname}, Age: ${item.age})`}
                            </option>
                        ))}
                    </select>   
                <textarea id="textarea"
                    rows="5"
                    cols="25"
                    required 
                    placeholder="Write text to selected user."
                    onChange={onTextChange}
                    value={text}
                    name="text">
                </textarea>
                <Button
                    onClick={onSendClick}
                    variant="contained"
                    size="large"
                    color="primary"
                    style={{ width: "35%", marginLeft: "5%", padding: 5 }}>
                    SEND
                </Button>
                <img id="tickLogoSendText" src={tickLogo} alt="OK TickLogo" />
                <img id="cancelLogoSendText" src={cancelLogo} alt="Cancel CancelLogo" />
            </div>
            )
    )
}