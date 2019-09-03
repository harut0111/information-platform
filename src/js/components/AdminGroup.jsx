import React, { useState, useEffect  } from 'react';
import DoneIcon from '@material-ui/icons/Done';
import Swal from 'sweetalert2';
import firebase from '../configs/FireBase';
import "firebase/firestore";

export default function AdminGroup() {

    let toggle = true;

    const DB = firebase.firestore();

    /* -------- group -------- */
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    //toggle and vis.
    const [groupSwitch, setGroupSwitch] = useState(false);
    const [popVisib, setPopVisib] = useState("");
    
    // edit part
    const [groupEditName, setGroupEditName] = useState("")
    const [groupEditDate, setGroupEditDate] = useState("");
    const [display, setDisplay] = useState(false);
    // const [infmes, setInfmes] = useState(false);
    const [editInfMsg, setEditInfMsg] = useState(false);
    
    useEffect(() => {
            callDB();
    // eslint-disable-next-line
    },[null])

    function callDB() {

        // get Group Data from DB
        DB.collection("Group").get().then(querySnapshot => {
            const groups = [];
            querySnapshot.forEach(doc => {
                groups.push({
                    id: doc.id,
                    name: doc.data().name,
                    createdDate: doc.data().createdDate
                })
            });
            setGroups(groups);
        });
    }


    /* --- handle group input changes ---- */
    function handleGroupChange(e) {
        if(e.target.name === "groupName") {
            setGroupName(e.target.value);
        } else if(e.target.name === "groupEditName") {
            setGroupEditName(e.target.value);
        } else if (e.target.name === "groupEditDate") {
            setGroupEditDate(e.target.value);
        }
    }   

    

    function handleGroupSubmit(e) {
        e.preventDefault();
        
        if(groupName.trim() && toggle) {
            toggle = false;
            const date = new Date().toLocaleString();
            DB.collection("Group").add({
                name: groupName,
                createdDate: date
            })
            .then(function(group) {
                setGroups([{
                    id: group.id,
                    name: groupName,
                    createdDate: date
                },...groups])

                setGroupName("");
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
            window.alert("please write group name");
        }
    }

    function handleGroupEditSubmit(e) {
        e.preventDefault();
        
        if(groupEditName.trim() && groupEditDate && toggle) {
            
            toggle = false;
            const currentGroupId = e.currentTarget.parentNode.parentNode.id;
            e.currentTarget.parentNode.style.display = "none";
            setGroupSwitch(!groupSwitch);
            setPopVisib("");

            DB.collection("Group").doc(currentGroupId).set({
                name: groupEditName,
                createdDate: new Date(groupEditDate).toLocaleString()
            })
            .then(function() {//also make chanages on users
              
                DB.collection("User_to_group").get().then(querySnapshot => {
                    const UserToGroup = [];
                    querySnapshot.forEach(doc => {
                        UserToGroup.push(doc.data());
                    });

                    let users = UserToGroup.filter(item => { 
                        return item.groupId === currentGroupId;
                    })

                    // get the users Id that belong to current group
                    users.forEach(item => (
                        DB.collection("User").doc(item.userId).update({
                            group: groupEditName,
                        })
                    ))

                });
                
            })
            .then(function() {
                const tempGroups = [...groups];
                tempGroups.forEach(item => {
                    if(item.id === currentGroupId) {
                        item.name = groupEditName;
                        item.createdDate = new Date(groupEditDate).toLocaleString();
                    }
                })
                setGroups(tempGroups);
                setGroupEditName("");
                setGroupEditDate("");
            }).then(() => {
                setEditInfMsg(true);
                setTimeout(() => {
                    setEditInfMsg(false);
                }, 2000);
            })
            .catch(function(error) {
                window.alert(error.message);
            }).finally(() => {
                toggle = true;
            });

        } else {
            window.alert("please write group name");
        }
    }


    function handleOnGroupToolClick(e) {


        const id = e.currentTarget.id;

        if(e.target.className === "adminDeleteBtn") {

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                  Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  );
                  doRemove();
                }
            })

        } else if(e.target.className === "adminEditBtn") {
            
            // check if there is open editor form
            if(popVisib === "" || popVisib === id) {
                e.currentTarget.lastChild.style.display = !groupSwitch ? "block": "none";
                !groupSwitch ?  setPopVisib(e.currentTarget.id) : setPopVisib("");
                setGroupSwitch(!groupSwitch);
            }
        }


        function doRemove() {
            const newGroupList = groups.filter(item => {
                return item.id !== id;
            });

            // remove from firebase and set update local state
            DB.collection("Group").doc(id).delete().then(() => {
                setGroups(newGroupList);
            })
            .then(() => {

                //delete users in current group
                DB.collection("User_to_group").get().then(querySnapshot => {
                    const UserToGroup = [];
                    querySnapshot.forEach(doc => {
                        UserToGroup.push(doc.data());
                    });
                     // get the users Id that belcongs to current group
                    let users = UserToGroup.filter(item => { 
                        return item.groupId === id;
                    })
                   
                    users.forEach(item => (
                        DB.collection("User").doc(item.userId).delete()
                    ))
                });
            }).then(() => {
                // setInfmes(true);
                // setTimeout(() => setInfmes(false), 2000);
            })
            .catch(function(error) {
                window.alert(error.message);
            });
        }
    }

    
    // ------------------ HTML group items -------------------
    const sortedGroupItems = [...groups];
    sortedGroupItems.sort((g1, g2) => (
        Date.parse(g2.createdDate) - Date.parse(g1.createdDate)
    ));

    const groupItems = sortedGroupItems.map(item => {
        return (
          <div className='adminGroupItems' key={item.id} id={item.id}  onClick={handleOnGroupToolClick}>
              <div className="groupItemData">
                <p><b>Name:</b> {item.name}</p>
                <p><b>Date:</b> {item.createdDate}</p>
                {/* <p>ID: {item.id}</p> */}
              </div>  
              <div className='groupItemTools'>
                <span className="adminDeleteBtn">Remove</span>
                <span className="adminEditBtn">Edit</span>
              </div>
              <div className="groupPopupForm" style={{display: "none"}}>
                <form onSubmit={handleGroupEditSubmit}>
                    <label><b>Group Name</b></label>
                    <input 
                        type='text' 
                        name="groupEditName" 
                        required
                        onChange={handleGroupChange}
                        value={groupEditName}
                        ></input>
                    <label><b>Create Date</b></label>
                    <input 
                        type='datetime-local' 
                        name="groupEditDate" 
                        required
                        onChange={handleGroupChange}
                        value={groupEditDate}
                    ></input>
                    <button className="groupOkBtn" type="submit">
                        <span className="adminOkBtn"> Ok </span>
                    </button>
                </form>
              </div>
          </div>
        )
    })
    
    return (
        <div className="adminGroupsCont">
           
            <form onSubmit={handleGroupSubmit}>
                <label><b>Group Name: </b></label>
                <input 
                    type="text" 
                    name="groupName" 
                    value={groupName} 
                    onChange={handleGroupChange} 
                    required 
                    style={{width: "200px"}}/>
                    <div style={{display: "flex"}}>
                        <button className="groupOkBtn" type="submit">
                            <span className="adminAddBtn"> Add </span>
                        </button>
                        <div style={{display: display ? "block" : "none"}}>
                            <DoneIcon fontSize="large" className="AdminDoneIcon" />
                        </div>
                    </div>
               
            </form>
            <h1 style={{ margin: "20px 0px 10px 0", textAlign: "center"}}>Current Groups (N{sortedGroupItems.length})</h1>
            <p className="AddDoneInf" style={{display: display ? "block" : "none" }}>New Group Added</p>
            {/* <p className="DeleteDoneInf" style={{display: infmes ? "block" : "none" }}>Successfully Removed</p> */}
            <p className="DeleteDoneInf" style={{display: editInfMsg ? "block" : "none" }}>Successfully Edited</p>
            {groupItems}
        </div>
    )

}