import React, { useState, useEffect } from 'react';
import "./styles/clock.css";

export default function Clock() {

  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  })

  const color = `rgb(
            ${Math.floor((Math.random() * 106) + 100)}, 
            ${Math.floor((Math.random() * 106) + 100)}, 
            ${Math.floor((Math.random() * 106) + 100)}
        )`;

  return (
      <div id='clock' style={{color: color}}>
        {time.toLocaleTimeString()}
      </div>
  )
}
