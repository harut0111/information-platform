import React, {useState, useEffect} from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";

export default function Vote () {
    const [userId, setUserId] = useState(""),
        [allVotes, setAllVotes] = useState([]),
        [isLoadedVotes, setIsLoadedVotes] = useState(false);

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
    // eslint-disable-next-line
    }, [null]);

    useEffect(() => {
        fire.firestore().collection("Vote").get()
        .then((snapshot) => {
            let tempArr = [];
            snapshot.forEach((doc) => {
                let tempObj = {};
                tempObj.docId = doc.id;
                tempObj.creatorVoteId = doc.data().creatorUserId;
                tempObj.description = doc.data().description;
                tempObj.title = doc.data().title;
                tempObj.date = new Date(doc.data().dateCreated.seconds * 1000).toLocaleDateString() + " - " + new Date(doc.data().dateCreated.seconds * 1000).toLocaleTimeString();
                //console.log(tempObj);
                tempArr.push(tempObj);
            });
            console.log(tempArr);
            setAllVotes([...tempArr]);
            setIsLoadedVotes(true);
            console.log("All Votes success. taken from database !");
            return tempArr;
        })
        // .then((allSenders) => {
        //     if (allSenders.length) {
        //         let tempArr = [];
        //         for (let elem of allSenders) {
        //             let tempObj = {};
        //             for (let user of arrAllUsers) {
        //                 if (user.id === elem.id) {
        //                     tempObj = { ...user };
        //                     delete tempObj.id;
        //                     tempObj.text = elem.text;
        //                     tempObj.date = elem.date;
        //                     tempObj.evenId = elem.evenId;
        //                     tempArr.push(tempObj)
        //                     break;
        //                 }
        //             }
        //         }
        //         //console.log(tempArr);
        //         if (JSON.stringify(data) !== JSON.stringify(tempArr)) {
        //             setData([...tempArr]);
        //             setIsLoaded(true);
        //         }
        //     }
        // })

        .catch(e => console.log(e.messaage));
    // eslint-disable-next-line
    }, [null]);
    
    return (
            !isLoadedVotes ? (
                <div>
                <h1>LOADING . . .</h1>
                </div>
            ) : (
                    <div id="toReferPage">
                        <h1>Vote Section id: {userId}</h1>
                        {allVotes.map((val) => (
                            <div id="messages">
                                <div id="paragWrapper" key={val.docId}>
                                    <h2>{val.title}</h2>
                                    <p>{val.description}</p>
                                    <hr />
                                </div>
                            </div>
                        ))}
                    </div>

                
            )

    )
    
}

