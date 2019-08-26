import React from "react";
import "./styles/header.css";
import logo from "../../img/logo.png";
import {Link} from "react-router-dom";

export default function Header() {
    return (
        <header>
            <Link to="/"><img src={logo} alt="LOGO" /></Link>
            <h1>INFORMATION PLATFORM</h1>
        </header>
    )
}
