import React from "react";
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
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
        },2000);
    }
    setLowBarEffect = (e,targetState) => {
        e.preventDefault();
        if (targetState === 'emailEffect'){
            this.setState({emailEffect:"lowerBarEffect"});
        }
        else if (targetState === 'passEffect'){
            this.setState({passEffect:"lowerBarEffect"});
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
    }
    handleMailInput = (e) => {
        e.preventDefault();
        this.setState({ email: e.target.value.toLowerCase() });
    }
    handlePassInput = (e) => {
        e.preventDefault();
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
                this.props.isLogged();
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
            <div className = 'loginContainer'>
                <img className = {this.state.loginImageClass} src = {this.state.loginImageSrc} />
                <h3 style={{ textAlign: "center" }}> MTrack</h3>
                <div>
                <form onSubmit={this.loginHandler}>
                    <div style={{position:"relative"}}>
                        <input type="text" placeholder='Email' value={this.state.email} onClick = {(e) => {this.setLowBarEffect(e,'emailEffect')}} onBlur = {(e) => {this.unsetLowBarEffect(e,'emailEffect')}}  onChange={(e) => { this.handleMailInput(e) }} />
                        <span className = {this.state.emailEffect}></span>
                    </div>

                    <div style={{position:"relative"}}>
                        <input type="password" placeholder='Password' value={this.state.password} onClick = {(e) => {this.setLowBarEffect(e,'passEffect')}} onBlur = {(e) => {this.unsetLowBarEffect(e,'passEffect')}}  onChange={(e) => { this.handlePassInput(e) }} />
                        <span className = {this.state.passEffect}></span>
                    </div>
                    
                    <input type="submit" value="Login" />
                    <p id="message">{this.state.loginMessage}</p>
                </form>
                <Link to = '/register'>Register</Link>
                </div>
            </div>


        );
    }
}

export default Login;