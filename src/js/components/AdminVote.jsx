import React, { useState, useEffect  } from 'react';
import { ADMIN_ID } from "../constants/signIn";
import firebase from '../configs/FireBase';
import "firebase/firestore";


export default function AdminVote() {


    const DB = firebase.firestore();

    const [ votes, setVotes ] = useState([]);
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");

    let toggle = true;

    useEffect(() =>{
        callDB() 
     // eslint-disable-next-line
    }, [null])

    function callDB() {

        DB.collection("Vote").get().then(querySnapshot => {
          const votes = [];
          
          querySnapshot.forEach(doc => {
              votes.push({
                  id: doc.id,
                  creatorVoteId: doc.data().creatorVoteId,
                  dateCreated: doc.data().dateCreated.toDate().toLocaleString(),
                  description: doc.data().description,
                  title: doc.data().title,
                  voteBad: doc.data().voteBad,
                  voteGood: doc.data().voteGood,
              })
          });
          setVotes(votes);
      });
    }

    function onDeleteClick(e) {

        const id = e.currentTarget.parentNode.id

        const newVoteList = votes.filter(item => {
            return item.id !== id;
        });

        DB.collection("Vote").doc(id).delete()
        .then(() => {
            setVotes(newVoteList);
        }).then(() => {

            DB.collection("Vote_result").get().then(querySnapshot => {
                const Vote_reulst = [];
                querySnapshot.forEach(doc => {
                    Vote_reulst.push({
                        id: doc.id,
                        voteId: doc.data().voteId
                    });
                });

                let filteredRes = Vote_reulst.filter(item => { 
                    return item.voteId === id;
                })

                filteredRes.forEach(item => (
                    DB.collection("Vote_result").doc(item.id).delete()
                ))
            });

        })
        .catch(function(error) {
            window.alert(error.message);
        });
    }
    
    function handleOnSubmit(e) {

        e.preventDefault();

        if( title.trim() && description.trim() && toggle ) {

            toggle = false;
            const date = new Date();

            DB.collection("Vote").add({
                title: title,
                description: description,
                dateCreated: date,
                voteBad: 0,
                voteGood: 0,
                creatorVoteId: ADMIN_ID,
            })
            .then(vote => {
                setVotes([...votes, {
                    id: vote.id,
                    title: title,
                    description: description,
                    dateCreated: date.toLocaleString(),
                    voteBad: 0,
                    voteGood: 0,
                    creatorVoteId: ADMIN_ID,
                }]);

                setTitle("");
                setDescription("");
            })
            .catch(function(error) {
                window.alert(error.message);
            }).finally(() => {
                toggle = true;
            });
        } else {
            window.alert("please fill in the inputs");
        }
    }

    const sortedVotes = [...votes];
    sortedVotes.sort((g1, g2) => (
        Date.parse(g2.dateCreated) - Date.parse(g1.dateCreated)
    ));

    const Vote = sortedVotes.map((item,index )=> {
        return (
          <div className='adminUserItems' key={index} id={item.id}>  
                <p>creatorVoteId: {item.creatorVoteId}</p>
                <p>dateCreated: {item.dateCreated}</p>
                <p>description: {item.description}</p>
                <p>title: {item.title}</p>
                <p>voteBad: {item.voteBad}</p>
                <p>voteGood: {item.voteGood}</p>
                <p>ID: {item.id}</p>
                <button onClick={onDeleteClick}>Delete</button>
          </div>
        )
    })


    return (
        <div className="adminVoteCont">
            <div className='setVotes'>
                <form onSubmit={handleOnSubmit}>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        required value={title} 
                        onChange={(e) => setTitle(e.target.value)}/>

                    <label>Description:</label>
                    <textarea 
                        type="text"
                        rows="7" 
                        cols="60" 
                        required 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}/>
                    
                    <input type="submit" value="Create" className="submitButton" />
                </form>
            </div>
            <div className="getVotes">
                <h1 style={{marginTop: "20px"}}>Created Votes (N{sortedVotes.length})</h1>
                {Vote}
            </div>
        </div>
    )
}