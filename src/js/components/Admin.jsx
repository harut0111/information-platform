import './styles/admin.css';
import React, { useState, useEffect  } from 'react';
import history from '../routh/history';
import { Link } from "react-router-dom";
import { ADMIN_ID } from "../constants/signIn";

import firebase from '../configs/FireBase';
import "firebase/firestore";

function Admin() {

    const DB = firebase.firestore();

    
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    
    const [groupValue, setGroupValue] = useState('');
    const [groupEditFormVis, setgroupEditFormVis] = useState(false);

    // const [adminId, setAdminId] = useState("");
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user && user.uid === ADMIN_ID) {
                // setAdminId(user.uid)
                callDB(user.uid);
            } else {
                history.push('/');
            }
        });
    // eslint-disable-next-line
    },[null])

    function callDB() {

        // get User Date from DB
        DB.collection("User").get().then(querySnapshot => {
            let users = [];
            querySnapshot.forEach(doc => {
                users.push({
                    id: doc.id,
                    name: doc.data().name,
                    surname: doc.data().surname,
                    age: doc.data().age,
                    email: doc.data().email,
                    group: doc.data().group
                })
            });
            setUsers(users);
        });

        // get Group Date from DB
        DB.collection("Group").get().then(querySnapshot => {
            let groups = [];
            querySnapshot.forEach(doc => {
                groups.push({
                    id: doc.id,
                    name: doc.data().name,
                    createdDate: doc.data().createdDate
                })
            });
            groups.sort((g1, g2) => (
                Date.parse(g2.createdDate) - Date.parse(g1.createdDate)
            ));
            setGroups(groups);
        });

    }

    // LOG OUT 
    function logout(e) {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            history.push('/');
        }).catch((e) => {
            console.log(e);
        });
    }



    // --------- set Data in HTML Element  --------

    const userItems = users.map(item => {
        return (
          <div className='adminUserItems' key= {item.id}>  
                <p>Name: {item.name}</p>
                <p>Surname: {item.surname}</p>
                <p>Age: {item.age}</p>
                <p>Email: {item.email}</p>
                <p>Group: {item.group}</p>
          </div>
        )
    })

    function handleChange(e) {
        setGroupValue(e.target.value);
    }


    function handleGroupSubmit(e) {
        e.preventDefault();

        if(groupValue.trim()) {
            const date = new Date().toLocaleString();
            DB.collection("Group").add({
                name: groupValue,
                createdDate: date
            })
            .then(function(group) {
                console.log(group.id);
                setGroups([{
                    id: group.id,
                    name: groupValue,
                    createdDate: date
                },...groups])
                setGroupValue("");
            })
            .catch(function(error) {
                window.alert(error.message);
            });
        } else {
            window.alert("please write group name");
        }
    }

    function handleOnGropClick(e) {

        if(e.target.className === "remove") {

            const id = e.currentTarget.id
            const newGroupList = groups.filter(item => {
                return item.id !== id;
            });

            // remove from firebase and set update local state
            DB.collection("Group").doc(id).delete().then(() => {
                setGroups(newGroupList);
            })
            .catch(function(error) {
                console.error(error.message);
            });
        } else if(e.target.className === "edit") {
            setgroupEditFormVis(!groupEditFormVis);
            console.log(e.currentTarget.lastChild.className={});
        }

    }

    // ------------------ create HTML group items -------------------
    const groupItems = groups.map(item => {
        return (
          <div className='adminGroupItems' key={item.id} id={item.id}  onClick={handleOnGropClick}>
              <div className="groupItemData">
                <h4>Name: {item.name}</h4>
                <p>Create Date: {item.createdDate}</p>
                <p>ID: {item.id}</p>
              </div>  
              <div className='groupItemTools'>
                    <span className="remove">X</span>
                    <span className="edit">*</span>
              </div>
              <div className="groupPopupForm" style={{display: "none"}}>
                <form>
                    <label><b>Group Name</b></label>
                    <input type='text' required></input>
                    <label><b>Create Date</b></label>
                    <input type='date' required></input>
                    <button type="submit" className="groupOkButton">Ok</button>
                </form>
              </div>
          </div>
        )
    })
 

    return (
       <div className='adminCont'>
           <div className='adminNavbar'>
                <ul>
                    <li>Admin</li>
                    <li>Users</li>
                    <li>Groups</li>
                    <li>Article</li>
                    <Link to = '/' onClick={logout}>
                        <li>Log Out</li>
                    </Link>
                </ul>
           </div>
            <div className='adminMainCont'>
                <div className="adminProfile">
                        <h3>Admin id is /// </h3>
                </div>

                <div className="adminUsers">
                    <h1>Users</h1>
                    {userItems}
                </div>

                <div className="adminGroupsCont">
                    <h1>Groups</h1>
                    <form onSubmit={handleGroupSubmit}>
                        <label>
                            <input 
                                type="text" 
                                name="groupValue" 
                                value={groupValue} 
                                onChange={handleChange} 
                                placeholder="name"
                                required />

                        </label>
                        <button type="submit" className="addGroupButton"> 
                            Add
                        </button>
                    </form>
                    {groupItems}
                </div>
            </div>

       </div>     
    );
}


export default Admin;