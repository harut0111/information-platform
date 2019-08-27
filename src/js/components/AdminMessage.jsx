import React, { useState, useEffect  } from 'react';
import firebase from '../configs/FireBase';
import "firebase/firestore";

export default function AdminMessage() {

    const DB = firebase.firestore();

    const [ messages, setMessages ] = useState([]);

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
                    name: doc.data().name,
                    email: doc.data().email,
                    subject: doc.data().subject,
                    message: doc.data().message,
                    date: doc.data().date
                })
            });
            setMessages(messages);
        });
    }

    

    

    function onDeleteClick(e) {

        const id = e.currentTarget.parentNode.id

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
        return (
            <div className='adminUserItems' key={message.id} id={message.id} >
                <p><b>Name:</b> {message.name} </p>
                <p><b>Email:</b> {message.email} </p>
                <p><b>Message:</b> {message.message} </p>
                <p><b>Send Date:</b> {message.date} </p>
                <button onClick={onDeleteClick}>Delete</button>
            </div>
        )
    })

    return (
        <div className="adminMsgesCont">
            <h1>Admin Messages (N{sortedMessages.length})</h1>
            {messageItems}
        </div>
    )
}