import React, { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import firebase from '../configs/FireBase';
import history from '../routh/history';
import { ADMIN_ID } from "../constants/signIn";

function Admin() {

    const [signin, setSignin] = useState("");

    function logout(e) {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            history.push('/');
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user && user.uid === ADMIN_ID) {
                setSignin(user.uid)
            } else {
                history.push('/');
            }
        });
    // eslint-disable-next-line
    },[null])

    return (
       <div style={{textAlign: "center"}}>
           <h1 >Admin</h1>
           <h3>Admin id is {signin} </h3>

        <Link to = '/' onClick={logout}>
            <button >Log Out</button>
        </Link>
       </div>     
    );
}


export default Admin;