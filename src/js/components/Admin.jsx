import './styles/admin.css';
import React, { useEffect  } from 'react';
import history from '../routh/history';
import { Link } from "react-router-dom";
import { ADMIN_ID } from "../constants/signIn";
import firebase from '../configs/FireBase';
import "firebase/firestore";
import { Route, Switch } from "react-router-dom";

import AdminUser from './AdminUser';
import AdminGroup from './AdminGroup';
import AdminHome from './AdminHome';

function Admin() {

    // const [adminId, setAdminId] = useState("");
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user && user.uid === ADMIN_ID) {
                // setAdminId(user.uid)
                // callDB(user.uid);
                // history.push('/Group');
            } else {
                history.push('/');
            }
        });
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
                        <Link to = '/Admin'>
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
                        <h3>Name:</h3>
                        <h3>Surname:</h3>
                        <h3>Age: </h3>
                </div>
                <Switch>
                    <Route path="/Admin/User" component={AdminUser} />
                    <Route path="/Admin/Group" component={AdminGroup} />
                    <Route path="/Admin" component={AdminHome} />
                </Switch>
            </div>

       </div>     
    );
}

export default Admin;