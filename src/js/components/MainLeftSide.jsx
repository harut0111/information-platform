import "./styles/mainLeftSide.css";
import firebase from "../configs/FireBase";
import "firebase/firestore"; 
import React, { Component } from 'react';

export class MainLeftSide extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
          groupList: [],
        }
      }
      
    componentDidMount() {   

      const groupList = [];
      const DB = firebase.firestore();

      DB.collection("Group").get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          groupList.push({
            id: doc.id,
            value: doc.data().name,
          })
        });
        this.setState(state => ({
          groupList: state.groupList.concat(groupList)
        }))
      })
      .catch((e => console.log(e.message)))
    }

    render() {
      
    const { groupList } = this.state;
    const items = groupList.map(item => {
      return (
        <div className='groups' key= {item.id} name={item.value}><h2> {item.value} </h2></div>
      )
    })
    
    return (
        <div className="leftSide">
            <div className="leftSideWrapper">
                <h1>GROUPS OF OUR COMPANY</h1>
                <div className="groupsContainer">
                  {items} 
                </div>
            </div>
        </div>
    )
  }
}

export default MainLeftSide;