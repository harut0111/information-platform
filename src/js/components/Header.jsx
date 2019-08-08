import React from "react";
import "./styles/header.css";
import Clock from "./Clock";
import {NavLink} from "react-router-dom";
/*eslint-disable*/

export default function Header() {
    return (
        <header>
            <NavLink to='/'><img src="https://shop.solo-it.ru/upload/iblock/703/ava.png" /></NavLink>
            <h1>INFORMATION PLATFORM</h1>
            <Clock/> 
        </header>
    )
}
