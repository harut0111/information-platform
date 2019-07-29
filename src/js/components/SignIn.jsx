import React from "react";
import {connect} from 'react-redux';
import {setEmailValue, setPasswordValue} from "../redux/actions/signIn/signInActions";
import firebase from "../configs/FireBase";
import "firebase/auth";

function SignIn (props) {
    const {email, password, setEmailValue, setPasswordValue} = props;
    const onSignIn = e => {
        e.preventDefault();
        // const emailValue = email,
        //     passValue = password;
        setEmailValue("");
        setPasswordValue("");
        let auth = firebase.auth(),
            promise = auth.signInWithEmailAndPassword(email, password);
        promise.then(val => alert("User is loged In !"));
        promise.catch(e => alert(e.message));
    } 

    return (
        <div>
            <div>
                <input type="email"
                        placeholder="Email" 
                        value={email}
                        onChange={e => setEmailValue(e.target.value)}>
                </input>
            </div>
            <div>
                <input type="password" 
                       placeholder="Password" 
                       value={password}
                       onChange={e => setPasswordValue(e.target.value)}>
                 </input>
            </div>
            <button type="button" onClick={onSignIn}>SIGN IN</button>
            <button type="button">SIGN UP</button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        email: state.email,
        password: state.password
    }
}

const mapDispatchToProps = {
    setEmailValue,
    setPasswordValue,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);