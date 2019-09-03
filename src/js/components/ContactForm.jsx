import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CloseIcon from '@material-ui/icons/Close';
import firebase from '../configs/FireBase';
import "firebase/firestore";


const useStyles = makeStyles(()=> ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
    //   marginLeft: theme.spacing(1),
    //   marginRight: theme.spacing(1),
        width: "100%"
    },
    button: {
        width: "50%"
    },
    rightIcon: {
        marginLeft: "10%"
    }
}));



export default function TextFields(props) {

  const DB = firebase.firestore();
  const classes = useStyles();


  const [ name, setName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ subject, setSubject ] = useState("")
  const [ message, setMessage ] = useState("")

  let toggle = true;

  function handleSubmit(e) {
      e.preventDefault();

      if( toggle ) {
        toggle = false;

        DB.collection("Admin").doc().set({
            name: name,
            email: email,
            subject: subject,
            message: message,
            date: new Date().toLocaleString(),
        })
        .then(() => {
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            props.swtich();
        })
        .catch(function(error) {
            window.alert(error.message);
        }).finally(() => {
            toggle = true;
        });
    } 
  }


  return (
    
    <form className={classes.container} onSubmit={handleSubmit}>
        <div className="contactFormContent">
            <div className="formCloseIcon">
                <CloseIcon onClick={props.swtich}/>
            </div>
            <p style={{color: "navy"}}>Write to us</p>
            <div className="contactName">
                <TextField
                    required
                    id="outlined-name"
                    label="Your Name"
                    className={classes.textField}
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    // variant="outlined"
                />
            </div>
            <div className="contactEmail">
                <TextField
                    required    
                    id="outlined-email-input"
                    label="Your Email"
                    className={classes.textField}
                    type="email"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // variant="outlined"
                />
            </div>
            <div className="contactSubject">
                <TextField
                    required
                    id="outlined-subject"
                    label="Subject"
                    className={classes.textField}
                    margin="normal"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    // variant="outlined"
                />
            </div>
            <div className="contactMessage">
            <TextField
                required
                id="outlined-multiline-static"
                label="Your Message"
                multiline
                rows="3"
                className={classes.textField}
                margin="normal"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                // variant="outlined"
                />
            </div>
            <div className="contactBtn" style={{textAlign: "center"}}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    className={classes.button}
                    >
                    Send
                    <Icon className={classes.rightIcon}>send</Icon>
                </Button>
            </div>
        </div>
    </form>
  );
}