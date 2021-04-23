import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import MainPage from './components/MainPage.jsx';
import Login from './components/Login.jsx';
import Registration from './components/Registration.jsx';

function isLogged()
{
  fetch('/isLoggedIn',{
    method:'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  }
  }).then(function(response){
    if (response.status == 200)
    {
      return true;
    }
    else
    {
      return false;
    }
  });
}
/*destructure the props properties into two parts
1) find the component property and assign it to Component so that it can be interpreted correctly 
2) take the rest of the properties and use them
*/
function PrivateRoute({component: Component, ...rest})
{
  let logged = isLogged();
  return(
    <Route
     {...rest}
     render = { (props) => logged?<Component {...props} />:<Redirect to='/login' /> } /> 
  )
}

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <Route exact path = '/login'  component = {Login}  />
        <Route exact path = '/create' component = {Registration} />
        <Route exact path = '/home' component={MainPage}    />
        <PrivateRoute exact path = '/' component = {MainPage}></PrivateRoute>
      </Switch>
    );
  }
}

export default App;
