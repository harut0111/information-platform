import React from 'react';



export default function AdminArticle() {

    function temp(e) {
        e.preventDefault();
    }
    return (
        <div className='articleCont'>
            <form action="/action_page.php" onSubmit={temp}>
                <textarea name="message" rows="20" cols="70">
              
                </textarea>
                <br></br>
                <input type="submit" value="Publish"></input>
            </form>
        </div>
    )
}