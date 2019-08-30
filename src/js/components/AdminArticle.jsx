import React, { useState, useEffect } from 'react';
import DoneIcon from '@material-ui/icons/Done';
import firebase from '../configs/FireBase';
import "firebase/firestore";


export default function AdminArticle() {


    const DB = firebase.firestore();

    const [textareaVal, setTextareaVal] = useState("");
    const [articles, setArticles] = useState([]);
    const [title, setTitle] = useState("");

    const [display, setDisplay] = useState(false);
    const [infmes, setInfmes] = useState(false);

    let toggle = true;

    useEffect(() => {
        callDB();
        // eslint-disable-next-line
    }, [null])


    function callDB() {

        DB.collection("Article").get().then(querySnapshot => {
            const articles = [];
            querySnapshot.forEach(doc => {
                articles.push({
                    id: doc.id,
                    title: doc.data().title,
                    content: doc.data().content,
                    createdDate: doc.data().createdDate
                })
            });
            setArticles(articles);
        });
    }


    function handleArticleSubmit(e) {
        e.preventDefault();

        if (textareaVal.trim() && title.trim() && toggle) {
            toggle = false;
            const date = new Date().toLocaleString();
            DB.collection("Article").add({
                title: title,
                content: textareaVal,
                createdDate: date
            })
                .then(article => {
                    setArticles([...articles, {
                        id: article.id,
                        title: title,
                        content: textareaVal,
                        createdDate: date
                    }]);

                    setTextareaVal("");
                    setTitle("");
                }).then(() => {
                    setDisplay(true);
                    setTimeout(() => setDisplay(false), 2000);
                })
                .catch(function (error) {
                    window.alert(error.message);
                }).finally(() => {
                    toggle = true;
                });
        } else {
            window.alert("please fill in the inputs");
        }
    }


    function onDeleteClick(e) {

        const id = e.currentTarget.parentNode.id

        const newArticleList = articles.filter(item => {
            return item.id !== id;
        });

        DB.collection("Article").doc(id).delete()
            .then(() => {
                setArticles(newArticleList);
            }).then(() => {
                setInfmes(true);
                setTimeout(() => setInfmes(false), 2000);
            })
            .catch(function (error) {
                window.alert(error.message);
            });
    }

    const sortedArticleItems = [...articles];

    sortedArticleItems.sort((g1, g2) => (
        Date.parse(g2.createdDate) - Date.parse(g1.createdDate)
    ));

    const articleItems = sortedArticleItems.map(item => {
        return (
            <div className='adminUserItems' key={item.id} id={item.id}>
                <div className='articleItemData'>
                    <p><b>Title:</b> {item.title}</p>
                    <p><b>Content:</b> {item.content}</p>
                    <p><b>Created Date:</b> {item.createdDate}</p>
                    <p><b>ID:</b> {item.id}</p>
                </div>
                <button onClick={onDeleteClick}>Delete</button>
            </div>
        )
    })

    return (
        <div className="adminArticleCont">
            <div className='publishSide'>
                <form onSubmit={handleArticleSubmit}>
                    <label>Title:</label>
                    <input
                        required
                        className="articleTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    <label>Article:</label>
                    <textarea
                        name="message"
                        rows="10"
                        // cols="100" 
                        required
                        value={textareaVal}
                        onChange={(e) => setTextareaVal(e.target.value)} />
                    <div style={{display: "flex"}}>
                    <input type="submit" value="Publish" className="submitButton" />
                        <div style={{display: display ? "block" : "none"}}>
                            <DoneIcon fontSize="large" className="AdminDoneIcon" />
                        </div>
                    </div>
                    
                </form>
            </div>
            <div className="monSide">
                <h1 style={{ margin: "20px 0px 10px 0", textAlign: "center" }}>Published Articles (N{sortedArticleItems.length})</h1>
                <p className="AddDoneInf" style={{display: display ? "block" : "none" }}>New Article Published</p>
                <p className="DeleteDoneInf" style={{display: infmes ? "block" : "none" }}>Successfully Deleted</p>
                {articleItems}
            </div>
        </div>
    )
}