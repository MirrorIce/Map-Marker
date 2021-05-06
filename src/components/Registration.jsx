import React from "react";
import { Link } from "react-router-dom";

export default class Registration extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email : "",
            password : "",
            confirmPassword:"",
            message:"",
            emailEffect:"",
            passEffect:"",
            passConfirmEffect:""
        }
        this.createAccountHandler = this.createAccountHandler.bind(this);
    }
    setLowBarEffect = (e,targetState) => {
        e.preventDefault();
        if (targetState === 'emailEffect'){
            this.setState({emailEffect:"lowerBarEffect"});
        }
        else if (targetState === 'passEffect'){
            this.setState({passEffect:"lowerBarEffect"});
        }
        else if (targetState === 'passConfirmEffect'){
            this.setState({passConfirmEffect:"lowerBarEffect"});
        }
        
    }
    unsetLowBarEffect = (e,targetState) => {
        e.preventDefault();

        if (targetState === 'emailEffect'){
            this.setState({emailEffect:""});
        }
        else if (targetState === 'passEffect'){
            this.setState({passEffect:""});
        }
        else if (targetState === 'passConfirmEffect'){
            this.setState({passConfirmEffect:""});
        }
    }
    handleMailInput = (e) => {
        e.preventDefault();
        this.setState({email:e.target.value.toLowerCase()});
    }   
    handlePassInput = (e) => {
        e.preventDefault();
        this.setState({password:e.target.value});
    }  
    
    handleConfirmPassInput = (e) => {
        e.preventDefault();
        this.setState({confirmPassword:e.target.value});
    }
    createAccountHandler = (e) =>{
       e.preventDefault();
       if (this.state.password === this.state.confirmPassword){
           this.setState({message:""});
           fetch("/register",{
                method:'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                  })
           }).then((response) => {
               if (response.status === 409){
                this.setState({message:"There is already an account with this name created!"});
               }
               else if (response.status !== 200){
                this.setState({message:"Trouble with the server, please notify the admin!"});
               }
               else if (response.status === 200){
                this.setState({message:"Account created succesfully"});
               }
           });
       }
       else{
         this.setState({message:"Passwords do not match!"});
       }
    };
    render()
    {
        return(
            <div className = 'registrationContainer'>
                <h3> Registration</h3>
                <form onSubmit = {this.createAccountHandler}>
                    <div style={{position:"relative"}}>
                        <input type = "text" placeholder = 'Email' value = {this.state.email}  onChange = {(e) => {this.handleMailInput(e)}} onClick = {(e) => {this.setLowBarEffect(e,'emailEffect')}} onBlur = {(e) => {this.unsetLowBarEffect(e,'emailEffect')}}  />
                        <span className = {this.state.emailEffect}></span>
                    </div>
                    <div style={{position:"relative"}}>
                        <input type = "password" placeholder = 'Password' value = {this.state.password} onChange = {(e) => {this.handlePassInput(e) }} onClick = {(e) => {this.setLowBarEffect(e,'passEffect')}} onBlur = {(e) => {this.unsetLowBarEffect(e,'passEffect')}} />
                        <span className = {this.state.passEffect}></span>
                    </div>
                        <div style={{position:"relative"}}>
                        <input type = "password" placeholder = 'Confirm Password' value = {this.state.confirmPassword} onChange = {(e) => {this.handleConfirmPassInput(e) }} onClick = {(e) => {this.setLowBarEffect(e,'passConfirmEffect')}} onBlur = {(e) => {this.unsetLowBarEffect(e,'passConfirmEffect')}} />
                    <span className = {this.state.passConfirmEffect}></span>
                    </div>
                    <input type="submit" value = "Create Account" />
                </form>
                <p id="message">{this.state.message}</p>
            </div>

            
        );
        
    }
}