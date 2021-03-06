import React, { Component, useState } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import MainPage from './components/MainPage.jsx';
import Login from './components/Login.jsx';
import Registration from './components/Registration.jsx';


/*destructure the props properties into two parts
1) find the component property and assign it to Component so that it can be interpreted correctly 
2) take the rest of the properties and use them
*/
function PrivateRoute({component: Component, ...rest})
{ 
  return(
    <Route
     {...rest}
     render = { (props) =>{
      return rest.logged?<Component {...props} />:<Redirect to='/login' />
     }
       
       } /> 
  )
}

class App extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    logged: undefined
  }
  
isLogged = async (e) =>
{   let result = undefined;
    let self = this;
    await fetch('/isLoggedIn',{
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
  }).then(function(result){
    self.setState({logged:result});
    return result;
  }); 
}

componentDidMount(){
  this.isLogged();
}

  render() {
    return (
      <Switch>
        <Route exact path = '/login'  render = {(props) => {return this.state.logged?<Redirect to='/home'/>:<Login {...props} isLogged = {this.isLogged}/>}}  />
        <Route exact path = '/register' component = {Registration} />
        <PrivateRoute logged = {this.state.logged} exact path = '/home' component={MainPage}    />
        <PrivateRoute logged = {this.state.logged} exact path = '/' component = {MainPage}></PrivateRoute>
      </Switch>
    );
  }
}

export default App;
