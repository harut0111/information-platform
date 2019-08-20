import React, { useState, useEffect } from 'react';
import fire from "../configs/FireBase";
import "./styles/homeArticle.css";

export default function HomeArticle() {
    const [article, setArticle] = useState([]);

    useEffect(() => {
        fire.firestore().collection("Article").get()
            .then((snapshot => {
                let tempArrArticle = [];
                snapshot.forEach((doc) => {
                    let tempObj = {};
                    tempObj = {...doc.data()};
                    tempObj.id = doc.id;
                    tempArrArticle.push(tempObj);
                })
                return tempArrArticle;
            }))
            .then((articleArr) => {
                setArticle(articleArr);
            })
            .catch((e) => console.log(e.message));
    // eslint-disable-next-line
    }, [null]);

    return (
        article.length ? (
            <div id="homeArticle">
                <div className="article">
                    <h1>Articles</h1>
                    {article.map((val, i) => (
                        <div key={i}>
                            <h3><i>{val.title}</i></h3>
                            <p>{val.content}</p>
                            <h5>{val.createdDate}</h5>
                        </div>
                    ))}
                </div>
            </div>
        ) : <></>
    )
}