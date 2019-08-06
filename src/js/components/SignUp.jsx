import React from 'react';
import './styles/signUp.css';
import fire from "../configs/FireBase";


const fieldValues = {
        firstname: "",
        lastname: "",
        emailid: "",
        password: "",
        age: "",
        group: "Front-End",
    }

class SignUp extends React.Component {
    constructor() {
      super();
      this.state = {
        fields: { ...fieldValues},
        errors: {},
      }
    };

    handleChange = e => {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });
    }

    submituserRegistrationForm = e => {
      e.preventDefault();
      if (this.validateForm()) {
        // ================== Call to FireBase =======================
        let auth = fire.auth();
        let userId;
        let promise = auth.createUserWithEmailAndPassword(this.state.fields.emailid, this.state.fields.password);
        promise.then(val => {
          //console.log(val);
          userId = val.user.uid;
          console.log(userId, this.state.fields);
          //let db = fire.firestore();
          
          this.setState({
            fields: {...fieldValues}
          });
          alert(`You are successfully registered !`);
        });
        promise.catch(e => alert(e.message));
      }
    }

    // ================================ validateForm ================================
    validateForm() {
      let fields = this.state.fields;
      let errors = {};
      let isFormValid = true;

      if (!fields["firstname"]) {
        isFormValid = false;
        errors["firstname"] = "*Please enter your First Name.";
      }

      if (typeof fields["firstname"] !== "undefined") {
        if (!fields["firstname"].match(/^[a-zA-Z ]*$/)) {
          isFormValid = false;
          errors["firstname"] = "*Please enter alphabet characters only.";
        }
      }
      if (!fields["lastname"]) {
        isFormValid = false;
        errors["lastname"] = "*Please enter your Last Name.";
      }

      if (typeof fields["lastname"] !== "undefined") {
        if (!fields["lastname"].match(/^[a-zA-Z ]*$/)) {
          isFormValid = false;
          errors["lastname"] = "*Please enter alphabet characters only.";
        }
      }

      if (!fields["emailid"]) {
        isFormValid = false;
        errors["emailid"] = "*Please enter your email-ID.";
      }

      if (typeof fields["emailid"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["emailid"])) {
          isFormValid = false;
          errors["emailid"] = "*Please enter valid email-ID.";
        }
      }

      if (!fields["age"]) {
        isFormValid = false;
        errors["age"] = "*Please enter your age.";
      }

      if (typeof fields["age"] !== "undefined") {
        if (!fields["age"].match(/^[0-9]/)) {
          isFormValid = false;
          errors["age"] = "*Please enter valid ge.";
        }
      }
      if(fields["age"] < 18){
        isFormValid = false;
        errors["age"] = "*You are very young.";
      }
      if(fields["age"] > 80){
        isFormValid = false;
        errors["age"] = "*You are very old.";
      }
      if (!fields["password"]) {
        isFormValid = false;
        errors["password"] = "*Please enter your password.";
      }

      if (typeof fields["password"] !== "undefined") {
        if (!fields["password"].match(/^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)) {
          isFormValid = false;
          errors["password"] = "*Password must containe: Uppercase characters (A-Z), Lowercase characters(a-z), Digits(0-9)";
        }
      }

      this.setState({
        errors
      });
      return isFormValid;
    }


  render() {
    return (
   
     <div id="register">
        <h1>SIGN UP</h1>
        <form name="userRegistrationForm" onSubmit= {this.submituserRegistrationForm} method="POST">
          <label>First Name</label>
          <input type="text" name="firstname" value={this.state.fields.firstname} onChange={this.handleChange} />
          <div className="errorMsg">{this.state.errors.firstname}</div>
          <label>Last Name</label>
          <input type="text" name="lastname" value={this.state.fields.lastname} onChange={this.handleChange} />
          <div className="errorMsg">{this.state.errors.lastname}</div>
          <label>Email ID:</label>
          <input type="email" name="emailid" value={this.state.fields.emailid} onChange={this.handleChange} />
          <div className="errorMsg">{this.state.errors.emailid}</div>
          <label>Password</label>
          <input type="password" name="password" value={this.state.fields.password} onChange={this.handleChange} />
          <div className="errorMsg">{this.state.errors.password}</div>
          <label>Age</label>
          <input type="text" name="age" value={this.state.fields.age} onChange={this.handleChange} />
          <div className="errorMsg">{this.state.errors.age}</div>
          <label>Group</label>
            <select required onChange={this.handleChange} name="group">
              <option name="Front-End" >Front-End</option>
              <option name="Back-End" >Back-End</option>
              <option name="Full-Stack" >Full Stack</option>
              <option name="Web-Design">Web-Design</option>
              <option name="HR" >HR</option>
              <option name="QA">QA</option>
              <option name="CEO" >CEO</option>
              <option name="UI-UX" >UI-UX</option>
          </select>
          <input type="submit" className="button"  value="Sign Up"/>
        </form>
    </div>

      );
  }


}


export default SignUp;