import React, { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import firebase from '../configs/FireBase';
import history from '../routh/history';
import { ADMIN_ID } from "../constants/signIn";

function Home() {

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