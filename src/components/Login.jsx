import React from "react";
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import "../style/login.css";



//refer the js-cookie documentation for more options

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            ip: "localhost",
            loginMessage:"",
            loginImageSrc:"./globe2d.png",
            emailEffect:""
        }

        this.loginHandler = this.loginHandler.bind(this)

    }

    resetText = () =>{
        setTimeout(()=>{
            this.setState({loginMessage:""});
            this.setState({loginImageSrc:"./globe2d.png"});
        },3000);
    }


    setMailEffect = (e) => {
        e.preventDefault();
        this.setState({emailEffect:"lowerBarEffect"});
    }
    unsetMailEffect = (e) => {
        e.preventDefault();
        this.setState({emailEffect:""});
    }
    handleMailInput = (e) => {
        e.preventDefault();
        this.setState({ email: e.target.value });
    }

    setPassEffect = (e) => {
        e.preventDefault();
        this.setState({passEffect:"lowerBarEffect"});
    }
    unsetPassEffect = (e) => {
        e.preventDefault();
        this.setState({passEffect:""});
    }
    handlePassInput = (e) => {
        e.preventDefault();
        console.log(this.state.password);
        this.setState({ password: e.target.value });
    }
    loginHandler = (e) => {
        e.preventDefault();
        var self = this;
        fetch("/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
            credentials: "include"
        }).then(res => {
            if (res.status == 200) {
                // this.setState({loginMessage:"Let's go!"});
                this.setState({loginImageSrc:"./loginOk.png"});
                this.resetText();
            }
            else {
                // this.setState({loginMessage:"Incorrect credentials! Try again!"});
                this.setState({loginImageSrc:"./loginNok.png"});
                this.resetText();
            }
        })
    };
    render() {
        return (
            <div class = 'loginContainer'>
                <img class = {this.state.loginImageClass} src = {this.state.loginImageSrc} />
                <h3 style={{ textAlign: "center" }}> MTrack</h3>
                <form onSubmit={this.loginHandler}>
                    <div style={{position:"relative"}}>
                        <input type="text" placeholder='Email' value={this.state.email} onClick = {(e) => {this.setMailEffect(e)}} onBlur = {(e) => {this.unsetMailEffect(e)}}  onChange={(e) => { this.handleMailInput(e) }} />
                        <span class = {this.state.emailEffect}></span>
                    </div>

                    <div style={{position:"relative"}}>
                        <input type="password" placeholder='Password' value={this.state.password} onClick = {(e) => {this.setPassEffect(e)}} onBlur = {(e) => {this.unsetPassEffect(e)}}  onChange={(e) => { this.handlePassInput(e) }} />
                         <span class = {this.state.passEffect}></span>
                    </div>
                    
                    <input type="submit" value="Login" />
                    <p id="message">{this.state.loginMessage}</p>
                </form>
            </div>


        );
    }
}

export default Login;