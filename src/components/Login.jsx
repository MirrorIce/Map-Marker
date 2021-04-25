import React from "react";
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';



//refer the js-cookie documentation for more options

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            ip: "localhost"
        }

        this.loginHandler = this.loginHandler.bind(this)

    }
    handleMailInput = (e) => {
        e.preventDefault();
        this.setState({ email: e.target.value });
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

            }
            else {
                console.log("NOK");
            }
        })
    };
    render() {
        return (
            <div style={{ width: "20%", margin: "auto" }}>
                <h3 style={{ textAlign: "center" }}> Welcome</h3>
                <form onSubmit={this.loginHandler}>
                    <input style={{ width: "100%", margin: "0 auto" }} type="text" placeholder='Email' value={this.state.email} onChange={(e) => { this.handleMailInput(e) }} />
                    <br></br>
                    <input style={{ width: "100%", margin: "0 auto" }} type="password" placeholder='Password' value={this.state.password} onChange={(e) => { this.handlePassInput(e) }} />
                    <br></br>
                    <br></br>
                    <input type="submit" value="Login" style={{ margin: "0 auto", width: "40%", display: "block", backgroundColor: "white", border: "2px solid lightGray" }} />
                    <p id="message"></p>
                </form>
            </div>


        );
    }
}

export default Login;