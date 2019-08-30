import React, { useState, useEffect  } from 'react';
import { ADMIN_ID } from "../constants/signIn";
import DoneIcon from '@material-ui/icons/Done';
import firebase from '../configs/FireBase';
import "firebase/firestore";


export default function AdminVote() {


    const DB = firebase.firestore();

    const [ votes, setVotes ] = useState([]);
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");

    const [display, setDisplay] = useState(false);
    const [infmes, setInfmes] = useState(false);

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

        }).then(() => {
            setInfmes(true);
            setTimeout(() => setInfmes(false), 2000);
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
            }).then(() => {
                setDisplay(true);
                setTimeout(() => setDisplay(false), 2000);
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
                <p><b>creatorVoteId:</b> {item.creatorVoteId}</p>
                <p><b>dateCreated: </b>{item.dateCreated}</p>
                <p><b>description: </b>{item.description}</p>
                <p><b>title:</b> {item.title}</p>
                <p><b>Like:</b> {item.voteBad}</p>
                <p><b>Unlike:</b> {item.voteGood}</p>
                {/* <p>ID: {item.id}</p> */}
                <button onClick={onDeleteClick}>Delete</button>
          </div>
        )
    })


    return (
        <div className="adminVoteCont">
            <div className='setVotes'>
                <form onSubmit={handleOnSubmit}>
                    <label><b>Title:</b></label>
                    <input 
                        type="text" 
                        required value={title} 
                        onChange={(e) => setTitle(e.target.value)}/>

                    <label><b>Description:</b></label>
                    <textarea 
                        type="text"
                        rows="7" 
                        cols="60" 
                        required 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}/>
                    <div style={{display: "flex"}}>
                        <input type="submit" value="Create" className="submitButton" />
                        <div style={{display: display ? "block" : "none"}}>
                            <DoneIcon fontSize="large" className="AdminDoneIcon" />
                        </div>
                    </div>
                </form>
            </div>
            <div className="getVotes">
                <h1 style={{ margin: "20px 0px 10px 0", textAlign: "center"}}>Created Votes (N{sortedVotes.length})</h1>
                <p className="AddDoneInf" style={{display: display ? "block" : "none" }}>New Vote Added</p>
                <p className="DeleteDoneInf" style={{display: infmes ? "block" : "none" }}>Successfully Deleted</p>
                {Vote}
            </div>
        </div>
    )
}