import React, { Component } from 'react';

export default class SignInView extends Component {
  constructor() {
    super();
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      email: "",
      password: ""
    };
  }

  handleSignIn(event) {
    event.preventDefault();
    this.props.firebaseSignIn(this.state.email, this.state.password);
  }

  handleSignUp(event) {
    event.preventDefault();
    this.props.firebaseSignUp(this.state.email, this.state.password);
  }

  handleInputChange(event) {
    let target = event.target;
    
    if(target.name === "email"){
      this.setState({email: target.value});
    }
    else if(target.name === "password"){
      this.setState({password: target.value});
    }
  }

  render(){
    return(
      <div className="sign-in-view-steez">
        
        <span className="ketchup-bottle"></span>
        <span><h1>Ketchup or Catsup</h1></span>
        <p>Welcome to <strong>Ketchup or Catsup</strong>, a humble little shopping list app.</p>
        <div className="form-group">
          <label>Email: <input type="text" name="email" onChange={this.handleInputChange} /></label>
        </div>
        <div className="form-group">
          <label>Password: <input type="password" name="password" onChange={this.handleInputChange} /></label>
        </div>
        <button onClick={this.handleSignIn} className="button-steez">Sign in</button>
        <button onClick={this.handleSignUp} className="button-steez">Sign up</button>
      </div>
    );
  }
}