import React, { useState, useEffect  } from 'react';
import firebase from '../configs/FireBase';
import "firebase/firestore";

export default function AdminMessage() {

    const DB = firebase.firestore();

    const [ messages, setMessages ] = useState([]);
    const [ users, setUsers ] = useState([]);

    useEffect(() =>{
        callDB() 
     // eslint-disable-next-line
    }, [null])


    function callDB() {
          // get User Date from DB
          DB.collection("Admin").get().then(querySnapshot => {
            let messages = [];
            querySnapshot.forEach(doc => {
                messages.push({
                    id: doc.id,
                    creatorUserId: doc.data().creatorUserId,
                    dateCreated: doc.data().dateCreated,
                    theText: doc.data().theText,
                })
            });
            setMessages(messages);
        });

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

    

    

    function onDeleteClick(e) {

        const id = e.currentTarget.parentNode.id
        console.log(id);
        

        DB.collection("Admin").doc(id).delete()
        .then(() => {
            const filteredMsges = messages.filter(item => {
                return item.id !== id;
            }); 
            setMessages(filteredMsges);
        })
        .catch(function(error) {
            window.alert(error.message);
        });
    }
    
    const sortedMessages = [...messages];
    sortedMessages.sort((g1, g2) => (
        Date.parse(g2.dateCreated) - Date.parse(g1.dateCreated)
    ));

    const messageItems = sortedMessages.map(message => {

        if(message.creatorUserId !== "Unknown") {
            for (const userItem of users) {
                if(userItem.id === message.creatorUserId) {

                    return (
                        <div className='adminUserItems' key={message.id} id={message.id} >
                            <p><b>Name:</b> {userItem.name} </p>
                            <p><b>Surname:</b> {userItem.surname} </p>
                            <p><b>Age:</b> {userItem.age} </p>
                            <p><b>Email:</b> {userItem.email} </p>
                            <p><b>Group:</b> {userItem.group} </p>
                            <p><b>Sender ID:</b> {userItem.id} </p>
                            <p><b>Send Date:</b> {message.dateCreated} </p>
                            <p><b>Message:</b> {message.theText} </p>
                            <button onClick={onDeleteClick}>Delete</button>
                        </div>
                    )
                }
            }
        }

        return (
            <div className='adminUserItems' key={message.id} id={message.id} >  
                  <p><b>User:</b> {message.creatorUserId} </p>
                  <p><b>Send Date:</b> {message.dateCreated} </p>
                  <p><b>Message:</b> {message.theText} </p>
                  <button onClick={onDeleteClick}>Delete</button>
            </div>
        )
    })

    return (
        <div className="adminMsgesCont">
            <h1>Admin Messages</h1>
            {messageItems}
        </div>
    )
}