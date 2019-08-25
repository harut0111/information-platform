import React, { useState, useEffect  } from 'react';
import firebase from '../configs/FireBase';
import "firebase/firestore";

export default function AdminUser() {

    const DB = firebase.firestore();

    const [ users, setUsers ] = useState([]);
    const [ groupNames, setGroupNames ] = useState([]);
    const [ selectVal, setSelectVal ] = useState("All Users");
    const filteredUserItems = [];

    useEffect(() =>{
        callDB() 
     // eslint-disable-next-line
    }, [null])


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

        DB.collection("Group").get().then(querySnapshot => {
            let groupNames = [];
            querySnapshot.forEach(doc => {
                groupNames.push({
                    id: doc.id,
                    name: doc.data().name,
                })
            });
            setGroupNames(groupNames);
        });
    }

    for (const item of users) {
        if(selectVal === "All Users") {
            filteredUserItems.push (
                <div className='adminUserItems' key={item.id}>  
                    <p>Name: {item.name}</p>
                    <p>Surname: {item.surname}</p>
                    <p>Age: {item.age}</p>
                    <p>Email: {item.email}</p>
                    <p>Group: {item.group}</p>
                    <p>ID: {item.id}</p>
                </div>
            )
        } else {
            if(item.group === selectVal) {
                filteredUserItems.push (
                    <div className='adminUserItems' key={item.id}>  
                        <p>Name: {item.name}</p>
                        <p>Surname: {item.surname}</p>
                        <p>Age: {item.age}</p>
                        <p>Email: {item.email}</p>
                        <p>Group: {item.group}</p>
                        <p>ID: {item.id}</p>
                    </div>
                )
            } 
        }
    }

    const selectOptions = groupNames.map(item => {
        return (
            <option key={item.id} value={item.name}>{item.name}</option>
        )
    })

    return (
        <div className="adminUsersCont">
            <div className="adminUserHead">
                <h1>Current Users</h1>
                <select value={selectVal} onChange={(e) => setSelectVal(e.target.value)}>
                    <option value="All Users">All Users</option>
                    {selectOptions}
                </select>
            </div>
            {filteredUserItems.length ? filteredUserItems: (
                <div>
                  <h1 style={{color: "red", marginTop: "50px"}}>There are no {selectVal} users</h1>
                </div>
            )}
        </div>
    )
}