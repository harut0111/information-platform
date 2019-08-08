import React, { Component } from 'react';
import "./styles/clock.css";

class Clock extends Component {

  constructor() {
    super()
    this.state={
      time:new Date(),
      asd: ""
    }
  }

  currentTime() {
    this.setState({
      time: new Date()
    })
  }

  componentWillMount() {
    this.asd = setInterval(()=>this.currentTime(),1000)
  }

  componentWillUnmount() {
    clearInterval(this.asd, 1000)
  }


  render() {
    
  setInterval(
   function colorGen() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    
    document.getElementById("clock").style.color = "rgb(" + r + "," + g + "," + 0 + ")";
  }, 1000);
    
    return (
      <div id='clock'>
        {this.state.time.toLocaleTimeString()}
      </div>
    )
  }
  
}

export default Clock;