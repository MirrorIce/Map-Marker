import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import MainPage from './components/MainPage.jsx';
import Login from './components/Login.jsx';
import Registration from './components/Registration.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <Switch>
        <Route exact path = '/' />
        <Route exact path = '/login'  component = {Login}  />
        <Route exact path = '/create' component = {Registration} />
        <Route exact path = '/home' component={MainPage}    />
      </Switch>
      </div>
    );
  }
}

export default App;
