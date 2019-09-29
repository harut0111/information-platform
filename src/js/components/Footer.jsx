import React from "react";
import "./styles/footer.css"; 
// import {Link} from "react-router-dom";
// import githubLogoLight from "../../img/GitHubLight-32px.png";
// import githubLogoDark from "../../img/GitHub32px.png";


export default function Footer() {

    return (
        <footer>
            <div id="footerContent">
            <div>
                {/* <div id="subsGit"><p>Follow us on GitHub</p></div>
                <div id="github">
                    <Link to="//github.com/BaghdasaryanHayk" target="_blank">
                        <img src={githubLogoLight} alt="GitHub Link" />
                    </Link>
                    <Link to="//github.com/harut0111" target="_blank">
                        <img src={githubLogoDark} alt="GitHub Link" />
                    </Link>
                    <Link to="//github.com/edgar188" target="_blank">
                        <img src={githubLogoLight} alt="GitHub Link" />
                    </Link>
                    <Link to="//github.com/ArmanShirinyan" target="_blank">
                        <img src={githubLogoDark} alt="GitHub Link" />
                    </Link> 
                </div> */}
                    <div><p style={{ color: "silver", fontSize: "18px"}}>All Rights Reserved | Copyright &#9400; {new Date().getFullYear()}</p></div>
            </div>
            </div>
        </footer>
    )
}