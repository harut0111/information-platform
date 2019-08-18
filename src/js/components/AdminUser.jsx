import React, { useState, useEffect  } from 'react';
import firebase from '../configs/FireBase';
import "firebase/firestore";

export default function AdminUser() {

    const DB = firebase.firestore();

    const [users, setUsers] = useState([]);

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
    }
    
    const userItems = users.map(item => {
        return (
          <div className='adminUserItems' key={item.id}>  
                <p>Name: {item.name}</p>
                <p>Surname: {item.surname}</p>
                <p>Age: {item.age}</p>
                <p>Email: {item.email}</p>
                <p>Group: {item.group}</p>
                <p>ID: {item.id}</p>
          </div>
        )
    })



    return (
        <div className="adminUsersCont">
            <h1>Users</h1>
            {userItems}
        </div>
    )
}