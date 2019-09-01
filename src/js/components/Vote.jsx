import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/home.css";
import like from "../../img/like.png";
import unlike from "../../img/unlike.png";
import vote from "../../img/vote2.png";
// ----------------- material-UI packages -----------------------
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
// --------------------------------------------------------------

export default function Vote() {

    const [userId, setUserId] = useState(""),
        [allVotes, setAllVotes] = useState([]),
        [isLoaded, setIsLoaded] = useState(false),
        [anchorEl, setAnchorEl] = useState(null),
        [allUsers, setAllUsers] = useState([]),
        [votingProcess, setVotingProcess] = useState(false),
        [realTimeUpdate, setRealTimeUpdate] = useState(false),
        [updateVote, setUpdateVote] = useState(false);

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
        // eslint-disable-next-line
    }, [null]);

    // Getting all users list from firestore(db)
    useEffect(() => {
        fire.firestore().collection("User").get()
            .then((snapshot => {
                let tempAllUsers = [];
                snapshot.forEach((doc) => {
                    let tempObj = {};
                    tempObj = { ...doc.data() };
                    tempObj.id = doc.id;
                    tempAllUsers.push(tempObj);
                })
                if (JSON.stringify(allUsers) !== JSON.stringify(tempAllUsers)) {
                    setAllUsers(tempAllUsers);
                }
            }))
            .catch((e) => console.log(e.messaage));
    // eslint-disable-next-line
    }, [userId])

   
    // Getting Vote list from firestore(db)
    useEffect(() => {
        fire.firestore().collection("Vote").get()
            .then((snapshot) => {
                let tempVotesArr = [];
                snapshot.forEach((doc) => {
                    let tempObj = { ...doc.data() };
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
                                let tempObj = { ...doc.data() };
                                delete tempObj.dateVoted;
                                tempObj.docId = doc.id;
                                voteResultArr.push(tempObj);
                            });

                            for (let voteRes of voteResultArr) {
                                for (let vote of tempVotesArr) {
                                    if (voteRes.voteId === vote.docId) {
                                        vote.voted.push(voteRes.voteUserId);
                                        break;
                                    }
                                }
                            }
                            //console.log(tempVotesArr);
                            //console.log(voteResultArr);
                            let finalDataVotes = [];
                            for (let vote of tempVotesArr) {
                                let tempObj = {};
                                for (let user of allUsers) {
                                    if (user.id === vote.creatorVoteId) {
                                        tempObj = { ...user, ...vote };
                                        tempObj.voted = [...vote.voted];
                                        tempObj.date = (new Date(tempObj.date * 1000)).toLocaleString();
                                        tempObj.docId = vote.docId;
                                        finalDataVotes.push(tempObj)
                                        break;
                                    }
                                }
                            }
                            if (JSON.stringify(allVotes) !== JSON.stringify(finalDataVotes)) {
                                //console.log(finalDataVotes);
                                setAllVotes([...finalDataVotes]);
                                setIsLoaded(true);
                            }
                        })
                } else setIsLoaded("Empty");
            })
            .catch(e => console.log(e.messaage));
    // eslint-disable-next-line
    }, [allUsers, updateVote, realTimeUpdate]);

    useEffect(() => {
        fire.firestore().collection("Vote").onSnapshot(querySnapshot => {
            const listArr = querySnapshot.docChanges()[0];
            if (listArr && querySnapshot.docChanges().length === 1) {
                    setRealTimeUpdate(true);
                    setTimeout(() => setRealTimeUpdate(false), 2000);
            }
        })
     // eslint-disable-next-line
    }, [null]);
   

    const voteAddClick = e => {
        e.preventDefault();
        let title = e.currentTarget.parentNode.children[1];
        let desc = e.currentTarget.parentNode.children[2];

        if (!title.value.trim()) {
            title.style.borderColor = "red";
            setTimeout(() => {
                title.style.borderColor = "#FFC44A";
            }, 500);
        }
        else if (!desc.value.trim()) {
            desc.style.borderColor = "red";
            setTimeout(() => {
                desc.style.borderColor = "#FFC44A";
            }, 500);
        }
        else {
            // =================== Call to Firestore (DataBase) ===================
            fire.firestore().collection("Vote").doc().set({
                creatorVoteId: userId,
                title: title.value,
                description: desc.value,
                voteGood: 0,
                voteBad: 0,
                dateCreated: new Date()
            })
                .then(() => {
                    handleClose();
                    setUpdateVote(!updateVote);
                })
                .catch(e => {
                    handleClose();
                    console.log("Error writing document: ", e);
                });
        }
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
            color: "#773BB2",
            '&:hover': {
                color: "#4D009A",
            },
        },
        progress: {
            margin: theme.spacing(2),
        },
        typography: {
            padding: theme.spacing(2),
            backgroundColor: "#FF8000",
            border: "2px solid #fff",
            borderRadius: 10
        }
    }));

    const handleClick = e => setAnchorEl(e.currentTarget),
        handleClose = () => setAnchorEl(null),
        open = Boolean(anchorEl),
        id = open ? 'simple-popover' : undefined,
        classes = useStyles();
    // ====================================================================

    // Good Or Bad vote handler ===========================================
    const likeUnlikeHandler = e => {
        e.preventDefault();
        if (votingProcess) return;
        setVotingProcess(true);

        let voteENUM = e.currentTarget.name,
            voteDocId = e.target.getAttribute("data-vote"),
            countOfVoters = e.currentTarget.getAttribute("data-goodcount") ||
                e.currentTarget.getAttribute("data-badcount"),
            classValue = e.target.className,
            voteButtons = document.getElementsByClassName(classValue);
        e.currentTarget.nextSibling.innerText = +countOfVoters + 1;

        for (let el of voteButtons) {
            el.style.opacity = 0.3;
            el.style.cursor = "default";
        }

        setTimeout(() => { setVotingProcess(false) }, 1000);

        if (voteENUM === "good") {
            fire.firestore().collection("Vote").doc(voteDocId).update({
                voteGood: ++countOfVoters
            })
                .then(() => {
                    fire.firestore().collection("Vote_result").doc().set({
                        voteId: voteDocId,
                        voteResult: "good",
                        voteUserId: userId,
                        dateVoted: new Date()
                    })
                        .then(() => setUpdateVote(!updateVote))
                })
                .catch(e => console.log(e.messaage))
        }
        else {
            fire.firestore().collection("Vote").doc(voteDocId).update({
                voteBad: ++countOfVoters
            })
            .then(() => {
                fire.firestore().collection("Vote_result").doc().set({
                    voteId: voteDocId,
                    voteResult: "bad",
                    voteUserId: userId,
                    dateVoted: new Date()
                })
                .then(() => setUpdateVote(!updateVote));
            })
            .catch(e => console.log(e.messaage));
        }
    }

    // get already voted users list ======================================================

    const onAlreadyVoted = e => {
        e.preventDefault();
        let allVoters = (e.currentTarget.getAttribute("data-allvoters")).split(","),
            resAllVoters = [],
            popup = e.target.nextSibling;
        for (let user of allUsers) {
            for (let voter of allVoters) {
                if (voter === user.id) {
                    let tempObj = { ...user };
                    resAllVoters.push(tempObj);
                    break;
                }
            }
        }
        popup.innerHTML = `<h4>Already voted users list</h4><hr />`;
        resAllVoters.forEach((val => {
            popup.innerHTML += `<p><b>User: ${val.name} ${val.surname}<br />
                            Email: ${val.email}</b></p> <hr />`;
        }))
        popup.style.visibility = "visible";
    }

    const onCloseIcon = e => {
        e.preventDefault();
        //console.log(e.target, e.currentTarget);
        e.currentTarget.style.visibility = "hidden";
    }

    if (isLoaded === "Empty") return (
        <div id="toReferPageVote" style={{ padding: 35 }}>
            <h1 id="voteHead" style={{ padding: 35 }}>
                Vote List
                    <Icon className={classes.iconHover}
                    aria-describedby={id}
                    variant="contained"
                    onClick={handleClick}
                    style={{
                        fontSize: 45,
                        margin: "-10px -10px -10px 30px",
                        cursor: "pointer"
                    }}
                   >add_circle
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
                            horizontal: 'center',
                        }}>
                        <Typography className={classes.typography} variant="h5">
                            <span className="headTypography">Create New Vote</span>
                            <input className="titleTypography"
                                type="text" placeholder="Title . . .">
                            </input>
                            <textarea rows="15" cols="50"
                                placeholder="Description . . ." className="descTypography">
                            </textarea>
                            <button onClick={voteAddClick}
                                id="buttonTypography" type="button">ADD
                            </button>
                        </Typography>
                    </Popover>
                </div>
            </h1>
        </div>
    )

    return (
        !isLoaded ? (
            <div id="toReferPageVote" style={{ width: "90%" }}>
                <div>
                    <CircularProgress className={classes.progress} />
                    <CircularProgress className={classes.progress} color="secondary" />
                    <CircularProgress className={classes.progress} />
                </div>
            </div>
        ) : (
                <div id="toReferPageVote">
                    <h1 id="voteHead">
                        Vote List
                    <Icon className={classes.iconHover}
                            aria-describedby={id}
                            variant="contained"
                            onClick={handleClick}
                            color="primary"
                            style={{
                                fontSize: 45,
                                margin: "-10px -10px -10px 30px",
                                cursor: "pointer"
                            }}>add_circle
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
                                    horizontal: 'center',
                                }}>
                                <Typography className={classes.typography} variant="h5">
                                    <span className="headTypography">Create New Vote</span>
                                    <input className="titleTypography"
                                        type="text" placeholder="Title . . .">
                                    </input>
                                    <textarea rows="15" cols="50"
                                        placeholder="Description . . ." className="descTypography">
                                    </textarea>
                                    <button onClick={voteAddClick}
                                        id="buttonTypography" type="button">ADD
                                </button>
                                </Typography>
                            </Popover>
                        </div>
                    </h1>
                    {allVotes.map((val) => (
                        <div id="messagesVote" key={val.docId}>
                            <div id="paragWrapper">
                                <h3>{`${val.name} ${val.surname}`}</h3>
                                <h5>{`(Group: ${val.group}, Age: ${val.age})`}</h5>
                                <h6>{`${val.date}`}</h6>
                                <hr />
                                <h4 style={{ textDecoration: "underline" }}>{val.title}</h4>
                                <p>{val.description}</p>
                            </div>
                            <div id="like_unlike_container">
                                {val.voted.indexOf(userId) === -1 ? (
                                    <>
                                        <span>
                                            <img src={like}
                                                data-vote={val.docId}
                                                data-goodcount={val.voteGood}
                                                className={val.docId}
                                                name="good"
                                                alt="Like"
                                                onClick={likeUnlikeHandler} />
                                            <span className="countVotes">{val.voteGood}</span>
                                        </span>
                                        <img src={vote} onClick={onAlreadyVoted}
                                            alt="Already voted users list"
                                            data-allvoters={val.voted}
                                            style={{ marginTop: 8, width: 32 }} />
                                        <span className="popupHidden" onClick={onCloseIcon}>
                                        </span>
                                        <span>
                                            <img src={unlike}
                                                className={val.docId}
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
                                                    name="good"
                                                    alt="Like"
                                                    style={{ opacity: 0.3, cursor: "default" }} />
                                                <span className="countVotes">{val.voteGood}</span>
                                            </span>
                                            <img src={vote} onClick={onAlreadyVoted}
                                                alt="Unlike"
                                                data-allvoters={val.voted}
                                                style={{ marginTop: 8, width: 32 }} />
                                            <span className="popupHidden" onClick={onCloseIcon}></span>
                                            <span>
                                                <img src={unlike}
                                                    name="bad"
                                                    alt="Unlike"
                                                    style={{ opacity: 0.3, cursor: "default" }} />
                                                <span className="countVotes">{val.voteBad}</span>
                                            </span>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )
    )
}