import React, { useState }from "react";
import "./styles/mainRightSide.css";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function MainRightSide() {

    const [toggle, setToggle] = useState(true);

    function swtichToggle() {
        setToggle(!toggle);
    }

    return (
        <div className="rightSide">
            {toggle ? <SignIn swtich={swtichToggle} /> : <SignUp swtich={swtichToggle}/>}
        </div>
    )
}

