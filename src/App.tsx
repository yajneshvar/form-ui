import React from 'react';
import User from './components/User';
import Order from './components/Order';
import Header from './components/Header';
import './App.css';
import { LoginPage } from './components/Login';
import UserProvider, { PrivateRoute } from './providers/UserProvider';
import { Grid } from '@material-ui/core';
import {BrowserRouter as Router , NavLink, Route, Switch} from "react-router-dom";
import { UpdateUser, UserList } from './components/UserList';
import { LocationProvider } from '@reach/router';



function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <div>
            <Header></Header>
            <Switch>
              <Route exact path="/">
                <HomePage></HomePage>
              </Route>
              <PrivateRoute exact path="/order">
                <Order/>
              </PrivateRoute>
              <PrivateRoute exact path="/users">
                <UserList/>
              </PrivateRoute>
              <PrivateRoute exact path="/user">
                <User user={undefined}/>  
              </PrivateRoute>
              {/* <PrivateRoute path="/user/:id"> 
              <User user={undefined}/> 
              </PrivateRoute> */}
              <PrivateRoute path="/user/:id" children={({ match }) => (<UpdateUser params={match?.params}></UpdateUser>)}/>
              <Route exact path="/login">
                <LoginPage/>
              </Route>
            </Switch>
          </div>
        </Router>
      </UserProvider>
    </>

  )
}

function HomePage() {

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item xs={6}> <NavLink to="/order">Order</NavLink> </Grid>
      <Grid item xs={6}> <NavLink to="/user">User</NavLink> </Grid>
  </Grid>

  )

}

export default App;
