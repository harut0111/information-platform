import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/defaultHome.css";
/*eslint-disable*/
export default function DefaultHome() {
    const [userId, setUserId] = useState("");

    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if (user) setUserId(user.uid);
        });
        // eslint-disable-next-line
    }, [null])

    return (
        <div id="defaultHomeWrapper">
            <div className="article">
                <h1>Articles</h1>
                <h3><i>Software</i></h3>
                <p>
                    A computer programmer, sometimes called more recently a coder (especially in more informal contexts), is a person who creates computer software. The term computer programmer can refer to a specialist in one area of computers, or to a generalist who writes code for many kinds of software.
                    A programmer's most oft-used computer language (e.g., Assembly, COBOL, C, C++, C#, Java, Lisp, Python) may be prefixed to the term programmer. Some who work with web programming languages also prefix their titles with web.
                    A range of occupations that involve programming also often require a range of other, similar skills, for example: (software) developer, web developer, mobile applications developer, embedded firmware developer, software engineer, computer scientist, game programmer, game developer and software analyst. The use of the term programmer as applied to these positions is sometimes considered an insulting simplification or even derogatory.
                </p>
                <h3><i>Web development</i></h3>
                <p>
                    Web development is the work involved in developing a web site for the Internet (World Wide Web) or an intranet (a private network). Web development can range from developing a simple single static page of plain text to complex web-based internet applications (web apps), electronic businesses, and social network services. A more comprehensive list of tasks to which web development commonly refers, may include web engineering, web design, web content development, client liaison, client-side/server-side scripting, web server and network security configuration, and e-commerce development.
                    Among web professionals, "web development" usually refers to the main non-design aspects of building web sites: writing markup and coding.Web development may use content management systems (CMS) to make content changes easier and available with basic technical skills.
                </p>
                <h3><i>Programmer</i></h3>
                <p>    
                    This article is about people who write computer software. For other uses, see Programmer (disambiguation).
                    For someone who perforticle is about people who write computer software. For other uses, see Programmer (disambiguation).
                    For someone who performs coding in the social sciences, see Coding (social sciences).
                    For someone who performs medical coding, see Medical coder.
                    "Coder" redirects here. For the settticle is about people who write computer software. For other uses, see Programmer (disambiguation).
                    For someone who performs coding in the social sciences, see Coding (social sciences).
                    For someone who performs medical coding, see Medical coder.
                    "Coder" redirects here. For the settticle is about people who write computer software. For other uses, see Programmer (disambiguation).
                    For someone who performs coding in the social sciences, see Coding (social sciences).
                    For someone who performs medical coding, see Medical coder.
                 </p>
            </div>
        </div>
    )
}  
