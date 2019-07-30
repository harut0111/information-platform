import React from 'react';
import './style/SignUp.css';


class SignUp extends React.Component {
    constructor() {
      super();
      this.state = {
        fields: {},
        errors: {},
       
      }

      this.handleChange = this.handleChange.bind(this);
      this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);

    };

    handleChange(e) {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });

    }

    submituserRegistrationForm(e) {
      e.preventDefault();
      if (this.validateForm()) {
          let fields = {};
          fields["firstname"] = "";
          fields["lastname"] = "";
          fields["emailid"] = "";
          fields["Age"] = "";
          fields["password"] = "";
          this.setState({fields:fields});
          alert("Form submitted");
          console.log(this.state);
      }

    }

    validateForm() {

      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      if (!fields["firstname"]) {
        formIsValid = false;
        errors["firstname"] = "*Please enter your First Name.";
      }

      if (typeof fields["firstname"] !== "undefined") {
        if (!fields["firstname"].match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["firstname"] = "*Please enter alphabet characters only.";
        }
      }
      if (!fields["lastname"]) {
        formIsValid = false;
        errors["lastname"] = "*Please enter your Last Name.";
      }

      if (typeof fields["lastname"] !== "undefined") {
        if (!fields["lastname"].match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["lastname"] = "*Please enter alphabet characters only.";
        }
      }

      if (!fields["emailid"]) {
        formIsValid = false;
        errors["emailid"] = "*Please enter your email-ID.";
      }

      if (typeof fields["emailid"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["emailid"])) {
          formIsValid = false;
          errors["emailid"] = "*Please enter valid email-ID.";
        }
      }

      if (!fields["Age"]) {
        formIsValid = false;
        errors["Age"] = "*Please enter your Age.";
      }

      if (typeof fields["Age"] !== "undefined") {
        if (!fields["Age"].match(/^[0-9]/)) {
          formIsValid = false;
          errors["Age"] = "*Please enter valid Age.";
        }
      }
      if(fields["Age"]  < 18){
        formIsValid = false;
        errors["Age"] = "*You are very young.";
      }
      if(fields["Age"]  > 80){
        formIsValid = false;
        errors["Age"] = "*You are very old.";
      }
      if (!fields["password"]) {
        formIsValid = false;
        errors["password"] = "*Please enter your password.";
      }

      if (typeof fields["password"] !== "undefined") {
        if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
          formIsValid = false;
          errors["password"] = "*Please enter secure and strong password.";
        }
      }

      this.setState({
        errors: errors
      });
      return formIsValid;


    }



  render() {
    return (
    <div id="main-registration-container">
     <div id="register">
        <h2>Sign Up</h2>
        <form  name="userRegistrationForm"  onSubmit= {this.submituserRegistrationForm} >
        <label>first Name</label>
        <input type="text" name="firstname" value={this.state.fields.firstname} onChange={this.handleChange} />
        <div className="errorMsg">{this.state.errors.firstname}</div>
        <label>Last Name</label>
        <input type="text" name="lastname" value={this.state.fields.lastname} onChange={this.handleChange} />
        <div className="errorMsg">{this.state.errors.lastname}</div>
        <label>Email ID:</label>
        <input type="text" name="emailid" value={this.state.fields.emailid} onChange={this.handleChange}  />
        <div className="errorMsg">{this.state.errors.emailid}</div>
        <label>Password</label>
        <input type="password" name="password" value={this.state.fields.password} onChange={this.handleChange} />
        <div className="errorMsg">{this.state.errors.password}</div>
        <label>Age</label>
        <input type="text" name="Age" value={this.state.fields.Age} onChange={this.handleChange}   />
        <div className="errorMsg">{this.state.errors.Age}</div>
        <input type="submit" className="button"  value="Sign Up"/>
        </form>
    </div>
</div>

      );
  }


}


export default SignUp;