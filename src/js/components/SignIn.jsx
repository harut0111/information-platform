import "firebase/auth";
import "./styles/signIn.css";
import React, { useEffect } from "react";
import {connect} from 'react-redux';
import firebase from "../configs/FireBase";
import history from '../routh/history';
import {Link} from "react-router-dom";
import { ADMIN_ID } from "../constants/signIn";

import { 
    setEmailValue, 
    setPasswordValue, 
    handleClickShowPassword } from "../redux/actions/signIn/signInActions";

// Material UI packages --------------------------------------
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
// ------------------------------------------------------------

export const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        flexBasis: 200,
        width: 300
    },
    textFieldEmail: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    rightIcon: {
        marginLeft: 40
    },
    buttonSignIn: {
        fontSize: 18,
        padding: 5,
        textAlign: "center",
        width: 160,
        marginTop: 10,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#4CAF50",
        '&:hover': {
            background: "rgb(69, 139, 72)",
        }
    },
    buttonSignUp: {
        fontSize: 18,
        padding: 5,
        marginLeft: 10,
        marginTop: 10,
        width: 130,
        size: "small",
    },
    buttonRegistry: {
        fontSize: 18,
        padding: 5,
        marginTop: 10,
        width: "72%",
        boxSizing: "border-box"
    },
    buttonBack: {
        fontSize: 18,
        padding: 5,
        marginLeft: 10,
        marginTop: 10,
        width: "auto",
        backgroundColor: "#4CAF50",
        '&:hover': {
            background: "rgb(69, 139, 72)",
        }
    },
}));

function SignIn (props) {

    const classes = useStyles();
    const {
        email, 
        password, 
        showPassword, 
        setEmailValue, 
        setPasswordValue, 
        handleClickShowPassword } = props;

    function updateAuth() {
        firebase.auth().onAuthStateChanged(function(user) {

            if (user) {
                user.uid === ADMIN_ID ? 
                history.push('/Admin') : history.push('/Home');
            } else {
                //console.log("No user is signed in.", user);
            }
          });
    }
    
    useEffect(() => {
        updateAuth();
         // eslint-disable-next-line
    }, [null]);

    function login (e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            // updateAuth();
        })
        .catch((error) => {
            window.alert(error.message);
        });
    }


    const handleMouseDownPassword = e => {
        e.preventDefault();
    };

    return (
        <div id="signInContainer">
            <h1>SIGN IN</h1>
            <div className="signInMainCont">
                <p id="errorMsg">Wrong Email or Password.</p>
                <div>
                    <TextField
                        // id="filled-email-input"
                        label="Email"
                        className={classes.textFieldEmail}
                        type="email"
                        autoComplete="email"
                        margin="normal"
                        variant="filled"
                        value={email}
                        onChange={e => {setEmailValue(e.target.value)}}
                    />
                </div>
                <div>
                    <TextField
                        // id="filled-adornment-password"
                        className={clsx(classes.margin, classes.textField)}
                        variant="filled"
                        type={showPassword ? 'text' : 'password'}              
                        label="Password"
                        value={password}
                        onChange={e => {setPasswordValue(e.target.value)}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        aria-label="toggle password visibility"
                                        onClick={() => { handleClickShowPassword(!showPassword)}}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <Link to='/' onClick={login} style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="default"  className={classes.buttonSignIn}>
                        SIGN IN<Icon className={classes.rightIcon}>send</Icon>
                    </Button>
                </Link>
                {/* style={{textDecoration: "none"}} */}
                <Button variant="contained" 
                        color="primary" size="medium"
                        className={classes.buttonSignUp}
                        onClick={props.swtich}>
                    SIGN UP
                </Button>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        email: state.email,
        password: state.password,
        showPassword: state.showPassword,
        signin: state.signin
    }
}

const mapDispatchToProps = {
    setEmailValue,
    setPasswordValue,
    handleClickShowPassword,
}


 // eslint-disable-next-line
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);