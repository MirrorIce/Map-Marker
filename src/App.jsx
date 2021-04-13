import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import MainPage from './components/MainPage.jsx';
import Login from './components/Login.jsx';
import Registration from './components/Registration.jsx';
const checkLoggedIn = async function () {
  var ip = "192.168.43.241";
  var isLogged = false;
  let promise = fetch("http://" + ip + ":3000/isLogged", {
    mode: "cors",
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: "include"
  }).then(function (response) {
    if (response.status == 200) {

      console.log("YES");
      return true;
    }
    else {
      console.log("NO");
      return false;
    }
  });
  let result = await promise;
  console.log(result + "XXX");
  localStorage.setItem('isLoggedIn',result);
  console.log(localStorage.getItem('isLoggedIn'));
  return result;
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  localStorage.getItem('isLoggedIn') === "true" ? (<Route {...rest} render={(props) => {
    return <Component {...props} />
  }
  } />) : (<Route {...rest} render={(props) => {
    return <Redirect to='/login' />
  }
  } />)
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      ip: "192.168.43.241"
    }
  }
  setLoggedIn = (logged) => {
    this.setState({ isLoggedIn: logged });
    localStorage.setItem('isLoggedIn', logged);
    console.log(localStorage.getItem('isLoggedIn'));
    this.forceUpdate();
  };


  render() {
    checkLoggedIn();
    return (
      <Switch markComplete={this.markComplete}>
        <Route path='/login' render={(props) => <Login {...props} setLoggedIn={this.setLoggedIn} />} />
        <Route path='/create' component={Registration} />
        <PrivateRoute path='/mainpage' component={MainPage} checkCredential={this.checkLoggedIn} />
      </Switch>

    );
  }
}

export default App;
