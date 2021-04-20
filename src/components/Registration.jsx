import React from "react";

export default class Registration extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email : "",
            password : ""
        }
    }
    handleMailInput = (e) => {
        e.preventDefault();
        this.setState({email:e.target.value});
    }   
    handlePassInput = (e) => {
        e.preventDefault();

        this.setState({password:e.target.value});
    }   
    createAccountHandler = () =>{
    
       console.log("Creating account");
       fetch("http://localhost:5000/createaccount/",{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
              })
       });
    };
    render()
    {
        return(
            <div>
                <h3> Registration</h3>
                <form onSubmit = {this.createAccountHandler}>
                <input type = "text" placeholder = 'Email' value = {this.state.email}  onChange = {(e) => {this.handleMailInput(e)}} />
                <br></br>
                <input type = "password" placeholder = 'Password' value = {this.state.password} onChange = {(e) => {this.handlePassInput(e) }}/>
                <br></br>
                <input type = "password" placeholder = 'Confirm Password'/>
                <br></br>
                <input type="submit" value = "Create Account" />
                <p id="message"></p>
                </form>
            </div>

            
        );
        
    }
}