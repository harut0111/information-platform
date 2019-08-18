import React, { useState, useEffect  } from 'react';
import firebase from '../configs/FireBase';
import "firebase/firestore";


export default function AdminVote() {


    const DB = firebase.firestore();

    const [votes, setVotes] = useState([]);

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


    const Vote = votes.map((item,index )=> {
        return (
          <div className='adminUserItems' key={index}>  
                <p>creatorVoteId: {item.creatorVoteId}</p>
                <p>dateCreated: {item.dateCreated}</p>
                <p>description: {item.description}</p>
                <p>title: {item.title}</p>
                <p>voteBad: {item.voteBad}</p>
                <p>voteGood: {item.voteGood}</p>
                <p>ID: {item.id}</p>
          </div>
        )
    })



    return (
        <div className="adminVoteCont">
            <h1>Votes</h1>
            {Vote}
        </div>
    )
}