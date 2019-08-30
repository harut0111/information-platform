import React, { useState, useEffect  } from 'react';
import firebase from '../configs/FireBase';
import "firebase/firestore";

export default function AdminMessage() {

    const DB = firebase.firestore();

    const [ messages, setMessages ] = useState([]);
    const [display, setDisplay] = useState(false);
    const [infmes, setInfmes] = useState(false);

    useEffect(() => {
        callDB();
     // eslint-disable-next-line
    }, [null])

    
    function callDB() {

        DB.collection("Admin").onSnapshot(querySnapshot => {
            const listArr = querySnapshot.docChanges()[0];
            if(listArr && listArr.type === "added") {
                const messages = [];
                querySnapshot.forEach(function(doc) {
                    messages.push({
                        id: doc.id,
                        name: doc.data().name,
                        email: doc.data().email,
                        subject: doc.data().subject,
                        message: doc.data().message,
                        date: doc.data().date
                    });
                });
                setMessages(messages);
                if(querySnapshot.docChanges().length === 1) {
                    setDisplay(true);
                    setTimeout(() => setDisplay(false), 2000);
                }

            }
        },function(error) {
            window.alert(error.message);
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
        }).then(() => {
            setInfmes(true);
            setTimeout(() => setInfmes(false), 2000);
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
            <h1 style={{ margin: "20px 0px 10px 0", textAlign: "center" }}>Admin Messages (N{sortedMessages.length})</h1>
            <p className="AddDoneInf" style={{display: display ? "block" : "none" }}>New Message</p>
            <p className="DeleteDoneInf" style={{display: infmes ? "block" : "none" }}>Successfully Deleted</p>
            {messageItems}
        </div>
    )
}