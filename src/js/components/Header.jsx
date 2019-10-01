import React, { useState }  from "react";
import "./styles/header.css";
import logo from "../../img/logo2.png";
import { Link } from "react-router-dom";
import FormPage from '../components/ContactForm';

export default function Header() {
    
    const [toggle, setToggle] = useState(true);
    // document.body.style.overflow = toggle ? "auto" : "hidden";

    function swtichToggle() {
        setToggle(!toggle);
    }

    return (
        <header>
            <Link to="/"><img src={logo} alt="LOGO" /></Link>
            <h1>INFORMATION PLATFORM</h1>
            <div id="textToAdmin">
                <button onClick={swtichToggle}>CONTACT US</button>
            </div>
            <div className="contactForm" style={{display: toggle? "none": "block"}}>
                <div className="contactFormCont">
                    <FormPage swtich={swtichToggle}/>
                </div>
            </div>
        </header>
    )
}
