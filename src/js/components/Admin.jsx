import './styles/admin.css';
import './styles/adminBtn.css';
import React, { useEffect, useState } from 'react';
import history from '../routh/history';
import { Link } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import { ADMIN_ID } from "../constants/signIn";
import adminIcon from '../../img/adminIcon.png'
import Clock from './Clock';


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
    const [admin, setAdmin] = useState({});
    const [activeLink, setActiveLink] = useState([]);

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
                }).then(() => {
                    handleActiveLink();
                })
                .catch(function (error) {
                    console.log("Error getting document:", error.message);
                });
            } else {
                history.push('/');
            }
        })
        // eslint-disable-next-line
    }, [null])

    /* ----  LOG OUT -----*/
    function logout(e) {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            history.push('/');
        }).catch((e) => {
            console.log(e.message);
        });
    }

    function handleActiveLink() {
        
        switch (history.location.pathname) {
            case "/Admin/Home":
                setActiveLink([1, 0, 0, 0, 0, 0, 0])
                break;
            case "/Admin/User":
                setActiveLink([0, 1, 0, 0, 0, 0, 0])
                break;
            case "/Admin/Group":
                setActiveLink([0, 0, 1, 0, 0, 0, 0])
                break;
            case "/Admin/Vote":
                setActiveLink([0, 0, 0, 1, 0, 0, 0])
                break;
            case "/Admin/Article":
                setActiveLink([0, 0, 0, 0, 1, 0, 0])
                break;
            case "/Admin/Message":
                setActiveLink([0, 0, 0, 0, 0, 1, 0])
                break;
            default:
                setActiveLink([0, 0, 0, 0, 0, 0, 1])
                break;
        }
    }

    return (
        <div className='adminCont'>
            <div className='adminNavbar' onClick={handleActiveLink}>
                <ul>
                    <Link to='/Admin/Home'>
                        <li className={activeLink[0] ? "activeLink" : ""}>Admin</li>
                    </Link>
                    <Link to='/Admin/User'>
                        <li className={activeLink[1] ? "activeLink" : ""}>Users</li>
                    </Link>
                    <Link to='/Admin/Group'>
                        <li className={activeLink[2] ? "activeLink" : ""}>Groups</li>
                    </Link>
                    <Link to='/Admin/Vote'>
                        <li className={activeLink[3] ? "activeLink" : ""}>Votes</li>
                    </Link>
                    <Link to='/Admin/Article'>
                        <li className={activeLink[4] ? "activeLink" : ""}>Articles</li>
                    </Link>
                 <Link to='/Admin/Message'>
                        <li className={activeLink[5] ? "activeLink" : ""}>Messages</li>
                    </Link>
                    <Link to='/' onClick={logout} style={{ float: "right" }}>
                        <li className={activeLink[6] ? "logout activeLink" : "logout"}>Log Out</li>
                    </Link>
                </ul>
            </div>
            <div className='adminMainCont'>
                <div className="adminProfile">
                    <Clock />
                    <h1 style={{ padding: "10px 0px" }}>Admin Profile </h1>
                    <img src={adminIcon} alt="adminIcon" />
                    <p> <b>Name:</b> {admin.name} </p>
                    <p> <b>Surname:</b> {admin.surname} </p>
                    <p> <b>Email:</b> {admin.email} </p>
                    {/* <p> ID: {admin.id} </p> */}
                    {/* <p> Age: {admin.age} </p> */}
                </div>
                <div className="dataBaseCont">
                    <Switch>
                        <Route path="/Admin/User" component={AdminUser} />
                        <Route path="/Admin/Group" component={AdminGroup} />
                        <Route path="/Admin/Vote" component={AdminVote} />
                        <Route path="/Admin/Article" component={AdminArticle} />
                        <Route path="/Admin/Message" component={AdminMessage} />
                        <Route path="/Admin/Home" component={AdminHome} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default Admin;