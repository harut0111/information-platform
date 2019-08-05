import React, { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import firebase from '../configs/FireBase';
import history from '../routh/history';

function Home() {

    const [signin, setSignin] = useState("");

    function logout() {
        // e.preventDefault();
        firebase.auth().signOut().then(() => {
            history.push('/');
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                setSignin(user.uid)
            }
          });
    },[null])


    // console.log(props.signin.uid)
    return (
       <div>
           <h1>Home</h1>
           <h1>Current user id {signin} </h1>

        <Link to = '/' onClick={logout}>
            <button >Log Out</button>
        </Link>
           
       </div>     
    );
}


export default Home;