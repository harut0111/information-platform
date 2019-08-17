import React, { useState, useEffect  } from 'react';
import firebase from '../configs/FireBase';
import "firebase/firestore";

export default function AdminGroup() {

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
        setGroupName("");

        if(groupName.trim()) {
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
            })
            .catch(function(error) {
                window.alert(error.message);
            });
        } else {
            window.alert("please write group name");
        }
    }

    function handleGroupEditSubmit(e) {
        e.preventDefault();
        
        if(groupEditName.trim() && groupEditDate) {
            
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
            })
            .catch(function(error) {
                window.alert(error.message);
            });

        } else {
            window.alert("please write group name");
        }
    }


    function handleOnGroupToolClick(e) {

        if(e.target.className === "remove") {

            const id = e.currentTarget.id
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

                    let users = UserToGroup.filter(item => { 
                        return item.groupId === id;
                    })
                    // get the users Id that belcongs to current group
                    users.forEach(item => (
                        DB.collection("User").doc(item.userId).delete()
                    ))
                });
                
            })
            .catch(function(error) {
                console.error(error.message);
            });
        } else if(e.target.className === "edit") {
            
            // check if there is open editor form
            if(popVisib === "" || popVisib === e.currentTarget.id) {
                e.currentTarget.lastChild.style.display = !groupSwitch ? "block": "none";
                !groupSwitch ?  setPopVisib(e.currentTarget.id) : setPopVisib("");
                setGroupSwitch(!groupSwitch);
            }
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
                <h4>Name: {item.name}</h4>
                <p>Created Date: {item.createdDate}</p>
                <p>ID: {item.id}</p>
              </div>  
              <div className='groupItemTools'>
                    <span className="remove">X</span>
                    <span className="edit">*</span>
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
                    <button 
                        type="submit"
                        className="groupOkBtn"
                    > Ok </button>
                </form>
              </div>
          </div>
        )
    })

    return (
        <div className="adminGroupsCont">
            <h1>Groups</h1>
            <form onSubmit={handleGroupSubmit}>
                <label>
                    <input 
                        type="text" 
                        name="groupName" 
                        value={groupName} 
                        onChange={handleGroupChange} 
                        placeholder="name"
                        required />

                </label>
                <button 
                    type="submit" 
                    className="addGroupButton"
                >  Add </button>
            </form>
            {groupItems}
        </div>
    )

}