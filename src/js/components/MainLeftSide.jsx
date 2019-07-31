import React from "react";
import "./styles/mainLeftSide.css";

export default function MainLeftSide() {
    return (
        <div className="leftSide">
            <div className="leftSideWrapper">
                <h1>GROUPS OF OUR COMPANY</h1>
                <div className="groupsContainer">
                    <div className="groups"><h2>FRONT END</h2></div>
                    <div className="groups"><h2>BACK END</h2></div>
                    <div className="groups"><h2>FULL STACK</h2></div>
                    <div className="groups"><h2>WEB DESIGN</h2></div>
                    <div className="groups"><h2>QA</h2></div>
                    <div className="groups"><h2>HR</h2></div>
                    <div className="groups"><h2>CEO</h2></div>
                </div>
            </div>
        </div>
    )
}