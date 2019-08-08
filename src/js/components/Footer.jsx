import React from "react";
import "./styles/footer.css"; 
import {NavLink} from "react-router-dom";

export default function Footer() {
    return (
        <footer>
            <h2>INFO</h2>
            <div className="info">
                <p>Tel. +(374)99 999 999 </p>
                <p>Email. info@hhae.com </p>
                <p>Site. hhae.com </p>
                <p>Address. 3, Komitas str., Yerevan, Armenia </p><br/>
                <div><h4>OUR PAGES</h4>
                   <NavLink to='/fb'><img src="https://image.flaticon.com/icons/png/512/124/124010.png"/></NavLink>
                   <NavLink to='/tvit'><img src="https://image.flaticon.com/icons/png/512/124/124021.png"/></NavLink>
                   <NavLink to='/insta'><img src="https://image.flaticon.com/icons/png/512/124/124032.png"/></NavLink>
                   <NavLink to='/tel'><img src="https://image.flaticon.com/icons/png/512/124/124019.png"/></NavLink>
                   <NavLink to='/vk'><img src="https://image.flaticon.com/icons/png/512/124/124029.png"/></NavLink>
                   <NavLink to='/wiber'><img src="https://image.flaticon.com/icons/png/512/124/124016.png"/></NavLink>
                   <NavLink to='/Wats'><img src="https://image.flaticon.com/icons/png/512/124/124034.png"/></NavLink>
                   </div>
            </div>
            


               <div><p> Copyright © 2019</p></div>
            
            
        </footer>
    )
}