import React from 'react';
import { Grid } from '@material-ui/core';
import {BrowserRouter as Router , NavLink, Route, Switch} from "react-router-dom";
import User from './components/User';
import OrderForm, { OtherForm } from './components/Order';
import Header from './components/Header';
import './App.css';
import { LoginPage } from './components/Login';
import UserProvider from './providers/UserProvider';
import { UpdateUser, UserList } from './components/UserList';

function HomePage() {

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item xs={6}> <NavLink to="/order">Order</NavLink> </Grid>
      <Grid item xs={6}> <NavLink to="/user">User</NavLink> </Grid>
  </Grid>

  )

}

function App() {

  return (
    <UserProvider>
        <Router>
          <div>
            <Header />
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route exact path="/order">
                <OrderForm/>
              </Route>
              <Route exact path="/other">
                <OtherForm/>
              </Route>
              <Route exact path="/users">
                <UserList/>
              </Route>
              <Route exact path="/user">
                <User user={undefined}/>  
              </Route>
              {/* <Route path="/user/:id"> 
              <User user={undefined}/> 
              </Route> */}
              <Route path="/user/:id" children={({ match }) => (<UpdateUser params={match?.params} />)}/>
              <Route exact path="/login">
                <LoginPage/>
              </Route>
            </Switch>
          </div>
        </Router>
      </UserProvider>

  )
}

export default App;
