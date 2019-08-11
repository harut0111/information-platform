import React, {useState, useEffect} from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";
import like from "../../img/like.png";
import unlike from "../../img/unlike.png";

// ----------------- material-UI packages -----------------------
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
// --------------------------------------------------------------

export default function Vote () {
    const [userId, setUserId] = useState(""),
        [allVotes, setAllVotes] = useState([]),
        //[voteRes, setVoteRes] = use([])
        [isLoaded, setIsLoaded] = useState(false),
        [anchorEl, setAnchorEl] = useState(null),
        [updateVote, setUpdateVote] = useState(false);

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
    // eslint-disable-next-line
    }, [null]);

    useEffect(() => {
        fire.firestore().collection("User").get()
            .then((snapshot => {
                let tempAllUsersArr = [];
                snapshot.forEach((doc) => {
                    let tempObj = {};
                    tempObj = {...doc.data()};
                    tempObj.id = doc.id;
                    tempAllUsersArr.push(tempObj);
                })
                return tempAllUsersArr;
            }))
            .then(tempAllUsersArr => {
                fire.firestore().collection("Vote").get()
                    .then((snapshot) => {
                        let tempVotesArr = [];
                        snapshot.forEach((doc) => {
                            let tempObj = {...doc.data()};
                            tempObj.date = doc.data().dateCreated.seconds;
                            tempObj.docId = doc.id;
                            tempObj.voted = [];
                            tempVotesArr.push(tempObj);
                        });
                       //console.log(tempVotesArr);
                        return tempVotesArr.sort((a, b) => b.date - a.date);
                    })
                    .then((tempVotesArr) => {
                        if (tempVotesArr.length) {
                            fire.firestore().collection("Vote_result").get()
                            .then((snapshot) => {
                                let voteResultArr = [];
                                snapshot.forEach((doc) => {
                                    let tempObj = {...doc.data()};
                                    delete tempObj.dateVoted;
                                    tempObj.docId = doc.id;
                                    voteResultArr.push(tempObj);
                                });
                
                                for(let vote of tempVotesArr) {
                                    for (let voteRes of voteResultArr) {
                                        if(voteRes.voteId === vote.docId) {
                                            vote.voted.push(voteRes.voteUserId);
                                            //break;
                                        }
                                    }
                                }
                                //console.log(tempVotesArr);
                                //console.log(voteResultArr);

                                let finalDateVotes = [];
                                //console.log(tempVotesArr);
                                for (let vote of tempVotesArr) {
                                    let tempObj = {};
                                    for (let user of tempAllUsersArr) {
                                        if (user.id === vote.creatorVoteId) {
                                            tempObj = { ...user, ...vote };
                                            tempObj.voted = [...vote.voted];
                                            tempObj.date = new Date(vote.date * 1000).toLocaleDateString() + " - " + new Date(vote.date * 1000).toLocaleTimeString();
                                            tempObj.docId = vote.docId;
                                            finalDateVotes.push(tempObj)
                                            break;
                                        }
                                    }
                                }
                                if (JSON.stringify(allVotes) !== JSON.stringify(finalDateVotes)) {
                                    //console.log(finalDateVotes);
                                    setAllVotes([...finalDateVotes]);
                                    setIsLoaded(true);
                                }
                            })
                        }
                    })
                    .catch(e => console.log(e.messaage));
            })
    // eslint-disable-next-line
    });
    
    const voteAddClick = e => {
        e.preventDefault();
        let inputsTypography = document.getElementsByClassName("inputTypography");

        if (!inputsTypography[0].value || !inputsTypography[1].value) {
            inputsTypography[0].style.border="3px solid red";
            inputsTypography[1].style.border="3px solid red";
            return handleClose();
        }
        // =================== Call to Firestore (DataBase) ===================
        fire.firestore().collection("Vote").doc().set({
            creatorVoteId: userId,
            title: inputsTypography[0].value,
            description: inputsTypography[1].value,
            voteGood: 0,
            voteBad: 0,
            dateCreated: new Date()
        })
        .then(() => {
            handleClose();
            setUpdateVote(!updateVote);
            //alert("Vote successfully added !");
            console.log("Document successfully written!");
        })
        .catch(e => {
            handleClose(); 
            console.log("Error writing document: ", e);
        });
    }
    // =========================================================================

    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        icon: {
            margin: theme.spacing(2),
        },
        iconHover: {
            margin: theme.spacing(2),
            '&:hover': {
                color: red[800],
            },
        },
        progress: {
            margin: theme.spacing(2),
        },
        typography: {
            padding: theme.spacing(2),
            backgroundColor: "#3B5998",
            border: "3px solid grey",
            borderRadius: 10
        }
    }));

    // ====================================================================
    const handleClick = e => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl),
        id = open ? 'simple-popover' : undefined;
    // ====================================================================
    const classes = useStyles();
    
    const likeUnlikeHandler = e => {
        let voteENUM = e.target.name;
        let voteDocId = e.target.getAttribute("data-vote");
        
        if(voteENUM === "good") {
            let goodCount = e.target.getAttribute("data-goodcount");
            fire.firestore().collection("Vote").doc(voteDocId).update({
                voteGood: ++goodCount
            })
            .then(() => {
                fire.firestore().collection("Vote_result").doc().set({
                    voteId: voteDocId,
                    voteResult: "good",
                    voteUserId: userId,
                    dateVoted: new Date()
                }).then(() => {
                    setUpdateVote(!updateVote);
                    console.log("Added Like");
                })
            })
            .catch(e => console.log(e.messaage))
        } else {
            let badCount = e.target.getAttribute("data-badcount");
            fire.firestore().collection("Vote").doc(voteDocId).update({
                voteBad: ++badCount
            })
            .then(() => {
                fire.firestore().collection("Vote_result").doc().set({
                    voteId: voteDocId,
                    voteResult: "bad",
                    voteUserId: userId,
                    dateVoted: new Date()
                }).then(() => {
                    setUpdateVote(!updateVote);
                    console.log("Added Unlike");
                })
            })
            .catch(e => console.log(e.messaage))
        }
    }

    return (
        !isLoaded ? (
                <div id="toReferPage">
                    <div>
                        <CircularProgress className={classes.progress} />
                        <CircularProgress className={classes.progress} color="secondary" />
                        <CircularProgress className={classes.progress} />
                    </div>
                </div>
        ) : (
            <div id="toReferPage">       
                <h1 id="voteHead">
                    Vote List 
                    <Icon className={classes.iconHover}
                            aria-describedby={id} 
                            variant="contained" 
                            onClick={handleClick}
                            color="primary" 
                            style={{fontSize: 45, 
                                    margin: "-10px 0px -10px 20px", 
                                    cursor: "pointer"}}>add_circle
                    </Icon>
                        <div>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}>
                                <Typography className={classes.typography}>
                                    <input className="inputTypography" type="text" placeholder="Title"></input><br />
                                    <input className="inputTypography" type="text" placeholder="Description"></input><br />
                                    <button onClick={voteAddClick} id="buttonTypography" type="button">ADD</button>
                                </Typography>
                            </Popover>
                        </div>
                </h1>
                {allVotes.map((val) => (
                    <div id="messages" key={val.docId}>
                        <div id="paragWrapper">
                            <h2>{`${val.name} ${val.surname}`}</h2>
                            <h4>{`(Group: ${val.group}, Age: ${val.age})`}</h4>
                            <h5>{`${val.date}`}</h5>
                            <hr />
                            <h3 style={{textDecoration: "underline"}}>{val.title}</h3>
                            <p>{val.description}</p>
                            <div id="like_unlike_container">
                            {val.voted.indexOf(userId) === -1 ? (
                                <>
                                    <span>
                                        <img src={like}
                                            data-vote={val.docId}
                                            data-goodcount={val.voteGood}
                                            name="good"
                                            alt="Like"
                                            onClick={likeUnlikeHandler} />
                                        <span className="countVotes">{val.voteGood}</span>
                                    </span>
                                    <span>
                                        <img src={unlike}
                                            data-vote={val.docId}
                                            data-badcount={val.voteBad}
                                            name="bad"
                                            alt="Unlike"
                                            onClick={likeUnlikeHandler} />
                                        <span className="countVotes">{val.voteBad}</span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>
                                        <img src={like}
                                            //data-vote={val.docId}
                                            //data-goodcount={val.voteGood}
                                            name="good"
                                            alt="Like" 
                                            style={{opacity: 0.3, cursor: "default"}} />
                                        <span className="countVotes">{val.voteGood}</span>
                                    </span>
                                    <span>
                                        <img src={unlike}
                                            //data-vote={val.docId}
                                            //data-badcount={val.voteBad}
                                            name="bad"
                                            alt="Unlike" 
                                            style={{opacity: 0.3, cursor: "default"}} />
                                        <span className="countVotes">{val.voteBad}</span>
                                    </span>
                                </>
                                )
                            }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    )
}

