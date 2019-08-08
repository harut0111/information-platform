import React from "react";
import "./styles/header.css";
import {NavLink} from "react-router-dom";

export default function Header() {
    return (
        <header>    

<NavLink to='/'><img src="https://shop.solo-it.ru/upload/iblock/703/ava.png" /></NavLink>
            
        </header>
    )
}