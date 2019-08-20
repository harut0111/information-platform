import './styles/signUp.css';
import React, {useState, useEffect} from 'react';
import history from '../routh/history';
import firebase from "../configs/FireBase";
import "firebase/firestore";


export default function SignUp(props) {

    const DB = firebase.firestore();


    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState("")
    const [groupVal, setGroupVal] = useState([])
    const [groups, setGroups] = useState([])

    
    useEffect(() =>{
      callDB() 
      // eslint-disable-next-line
    }, [null])
    
    function callDB() {
      DB.collection("Group").get().then(querySnapshot => {
        const groups = [];
        querySnapshot.forEach(doc => {
          groups.push({
            id: doc.id,
            value: doc.data().name,
          })
        });
        setGroups(groups);
        setGroupVal(groups[0].value);
      })
    }
    
    let toggle = true;

    function handleOnSubmit(e) {
      toggle = false;
      e.preventDefault();

      if (toggle) {
       firebase.auth().createUserWithEmailAndPassword(email, password).then(p => {
          DB.collection("User").doc(p.user.uid).set({
            name: firstname,
            surname: lastname,
            email: email,
            age: age,
            group: groupVal
          })
          return p.user.uid;
        }).then(userId => {
          DB.collection("User_to_group").doc().set({
            groupId: groups.find(item => item.value === groupVal).id,
            userId: userId,
          })
        }).then(() => {
          history.push('/Home');
        })
        .catch((error) => {
            window.alert(error.message);
        }).finally(() => {
            toggle = true;
        });
    } else {
        window.alert("please fill in the inputs")
    }
  }
  
  const items = groups.map(item => {
    return (
      <option key= {item.id} name={item.value}> {item.value} </option>
    )
  })


    return (
     <div id="signInContainer">
       <div className="signUpContainer">

          <h1>SIGN UP</h1>
          <form name="userRegistrationForm" onSubmit={handleOnSubmit}>

            <input type="text" required maxLength="32" pattern="[A-Za-z]{1,32}" placeholder="First Name" value={firstname} onChange={(e)=>setFirstname(e.target.value)}/>
            <p style={{fontSize: 12}}>Must contain only letters</p>
            
            <input type="text" required maxLength="32" pattern="[A-Za-z]{1,32}" placeholder="Last Name" value={lastname} onChange={(e)=>setLastname(e.target.value)} />
            <p style={{fontSize: 12}}>Must contain only letters</p>
            
            <input type="email" required placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            
            <input type="password" required maxLength="12" pattern="[A-Za-z0-9]{6,12}"  placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <p style={{fontSize: 12}}>must contain at list <br /> 6 charackters [A-Za-z0-9]</p>
            
            <input type="number" required min="18" max="120" placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} />

            <select required onChange={(e)=>setGroupVal(e.target.value)} >
                {items}
            </select>
            
            <input type="submit" value="Registre" />
            
            <input type="button" value="Back" onClick={props.swtich}/>
          </form>

       </div>
    </div>
    );
}