import './styles/admin.css';
import React, { useEffect, useState } from 'react';
import history from '../routh/history';
import { Link } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import { ADMIN_ID } from "../constants/signIn";
import adminIcon from '../../img/adminIcon.png'


import firebase from '../configs/FireBase';
import "firebase/firestore";

import AdminUser from './AdminUser';
import AdminGroup from './AdminGroup';
import AdminHome from './AdminHome';
import AdminVote from './AdminVote';
import AdminArticle from './AdminArticle';
import AdminMessage from './AdminMessage';

function Admin() {

    const DB = firebase.firestore();
    const [ admin, setAdmin ] = useState({});

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user && user.uid === ADMIN_ID) {
      
                DB.collection("User").doc(user.uid).get().then(doc => {
                    if (doc.exists) {
                        setAdmin({
                            id: user.uid,
                            name: doc.data().name,
                            surname: doc.data().surname,
                            age: doc.data().age,
                            email: doc.data().email,
                            group: doc.data().group
                        })
                    } else {
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error.message);
                });
            } else {
                history.push('/');
            }
        })
    // eslint-disable-next-line
    },[null])

    /* ----  LOG OUT -----*/ 
    function logout(e) {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            history.push('/');
        }).catch((e) => {
            console.log(e.message);
        });
    }


    return (
       <div className='adminCont'>
           <div className='adminNavbar'>
                <ul>
                    <div className='NavLeftSide'>
                        <Link to = '/Admin'>
                            <li>Admin</li>
                        </Link>
                        <Link to = '/Admin/User'>
                            <li>Users</li>
                        </Link>
                        <Link to = '/Admin/Group'>
                            <li>Groups</li>
                        </Link>
                        <Link to = '/Admin/Vote'>
                            <li>Votes</li>
                        </Link>
                        <Link to = '/Admin/Article'>
                            <li>Articles</li>
                        </Link>
                        <Link to = '/Admin/Message'>
                            <li>Messages</li>
                        </Link>
                    </div>
                    <div className='NavRightSide'>
                        <Link to = '/' onClick={logout}>
                            <li className="logout">Log Out</li>
                        </Link>
                    </div>
                </ul>
           </div>
            <div className='adminMainCont'>
                <div className="adminProfile">
                    <h1 style={{padding: "10px 0px"}}>Admin Profile </h1>
                    <img src={adminIcon} alt="adminIcon"/>
                    <h5> Name: {admin.name} </h5>
                    <h5> Surname: {admin.surname} </h5>
                    <h5> Age: {admin.age} </h5>
                    <h5> email: {admin.email} </h5>
                    <h5> ID: {admin.id} </h5>
                </div>
                <div className="dataBaseCont">
                    <Switch>
                        <Route path="/Admin/User" component={AdminUser} />
                        <Route path="/Admin/Group" component={AdminGroup} />
                        <Route path="/Admin/Vote" component={AdminVote} />
                        <Route path="/Admin/Article" component={AdminArticle} />
                        <Route path="/Admin/Message" component={AdminMessage} />
                        <Route path="/Admin" component={AdminHome} />
                    </Switch>
                </div>
            </div>
       </div>     
    );
}

export default Admin;