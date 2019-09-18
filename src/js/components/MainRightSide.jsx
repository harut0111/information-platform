import React, { useState }from "react";
import "./styles/mainRightSide.css";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function MainRightSide() {

    const [toggle, setToggle] = useState(true);

    function switchToggle() {
        setToggle(!toggle);
    }

    return (
        <div className="rightSide">
            {toggle ? <SignIn switch={switchToggle} /> : <SignUp switch={switchToggle}/>}
        </div>
    )
}

