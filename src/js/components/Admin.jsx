import './styles/admin.css';
import React, { useEffect, useState } from 'react';
import history from '../routh/history';
import { Link } from "react-router-dom";
import { ADMIN_ID } from "../constants/signIn";
import firebase from '../configs/FireBase';
import "firebase/firestore";
import { Route, Switch } from "react-router-dom";

import AdminUser from './AdminUser';
import AdminGroup from './AdminGroup';
import AdminHome from './AdminHome';
import AdminVote from './AdminVote';
import AdminArticle from './AdminArticle';

function Admin() {

    const DB = firebase.firestore();
    const [admin, setAdmin] = useState({});

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
                        // doc.data() will be undefined in this case
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
            console.log(e);
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
                            <li>Vote</li>
                        </Link>
                        <Link to = '/Admin/Article'>
                            <li>Articles</li>
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
                        <h1 style={{textAlign: "center", padding: "10px"}}>Admin Profile</h1>
                        <h3>Name: {admin.name}</h3>
                        <h3>Surname: {admin.surname}</h3>
                        <h3>Age: {admin.age}</h3>
                        <h3>email: {admin.email}</h3>
                        <h3>ID: {admin.id}</h3>
                </div>
                <Switch>
                    <Route path="/Admin/User" component={AdminUser} />
                    <Route path="/Admin/Group" component={AdminGroup} />
                    <Route path="/Admin/Vote" component={AdminVote} />
                    <Route path="/Admin/Article" component={AdminArticle} />
                    <Route path="/Admin" component={AdminHome} />
                </Switch>
            </div>

       </div>     
    );
}

export default Admin;