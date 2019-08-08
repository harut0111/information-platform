import React, { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import firebase from '../configs/FireBase';
import history from '../routh/history';
import { ADMIN_ID } from "../constants/signIn";

function Admin() {

    const [signin, setSignin] = useState("");

    function logout(e) {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            history.push('/');
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user && user.uid === ADMIN_ID) {
                setSignin(user.uid)
            } else {
                history.push('/');
            }
        });
    // eslint-disable-next-line
    },[null])

    return (
       <div style={{textAlign: "center"}}>
           <h1 >Admin</h1>
           <h3>Admin id is {signin} </h3>
           <p>
                A computer programmer, sometimes called more recently a coder 
                (especially in more informal contexts), is a person who creates 
                computer software. The term computer programmer can refer to a specialist 
                in one area of computers, or to a generalist who writes code for many kinds 
                of software. A programmers most oft-used computer language (e.g., Assembly, 
                COBOL, C, C++, C#, Java, Lisp, Python) may be prefixed to the term programmer. 
                Some who work with web programming languages also prefix their titles with web. 
                A range of occupations that involve programming also often require a range of other, 
                similar skills, for example: (software) developer, web developer, mobile applications 
                developer, embedded firmware developer, software engineer, computer scientist, game 
                programmer, game developer and software analyst. The use of the term programmer as 
                applied to these positions is sometimes considered an insulting simplification or 
                even derogatory.
           </p>
           <p>
                A computer programmer, sometimes called more recently a coder 
                (especially in more informal contexts), is a person who creates 
                computer software. The term computer programmer can refer to a specialist 
                in one area of computers, or to a generalist who writes code for many kinds 
                of software. A programmers most oft-used computer language (e.g., Assembly, 
                COBOL, C, C++, C#, Java, Lisp, Python) may be prefixed to the term programmer. 
                Some who work with web programming languages also prefix their titles with web. 
                A range of occupations that involve programming also often require a range of other, 
                similar skills, for example: (software) developer, web developer, mobile applications 
                developer, embedded firmware developer, software engineer, computer scientist, game 
                programmer, game developer and software analyst. The use of the term programmer as 
                applied to these positions is sometimes considered an insulting simplification or 
                even derogatory.
           </p>

           <h2>
                A computer programmer, sometimes called more recently a coder 
                (especially in more informal contexts), is a person who creates 
                computer software. The term computer programmer can refer to a specialist 
                in one area of computers, or to a generalist who writes code for many kinds 
                of software. A programmers most oft-used computer language (e.g., Assembly, 
                COBOL, C, C++, C#, Java, Lisp, Python) may be prefixed to the term programmer. 
                Some who work with web programming languages also prefix their titles with web. 
                A range of occupations that involve programming also often require a range of other, 
                similar skills, for example: (software) developer, web developer, mobile applications 
                developer, embedded firmware developer, software engineer, computer scientist, game 
                programmer, game developer and software analyst. The use of the term programmer as 
                applied to these positions is sometimes considered an insulting simplification or 
                even derogatory.
           </h2>
           <h4>
           A range of occupations that involve programming also often require a range of other, 
                similar skills, for example: (software) developer, web developer, mobile applications 
                developer, embedded firmware developer, software engineer, computer scientist, game 
                programmer, game developer and software analyst. The use of the term programmer as 
                applied to these positions is sometimes considered an insulting simplification or 
                even derogatory.
           </h4>


        <Link to = '/' onClick={logout}>
            <button >Log Out</button>
        </Link>
       </div>     
    );
}


export default Admin;