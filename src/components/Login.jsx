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
            ip: "192.168.43.241"
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
        //  console.log(this.props.setLoggedIn(false));
        //  console.log(this.props.setLoggedIn);
        var self = this;
        fetch("http://" + this.state.ip + ":3000/login/", {
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
                console.log(res);
                self.props.setLoggedIn(true);
                self.props.history.push('/mainpage');
            }
            else {
                self.props.setLoggedIn(false);
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

// Login.propTypes = {
//     setLoggedIn: PropTypes.method
// }

export default Login;