import React from 'react';
import logo from './logo.svg';
import User from './components/User';
import Order from './components/Order';
import ButtonAppBar from './components/ButtonAppBar';
import './App.css';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid'

import { makeStyles } from '@material-ui/core/styles';
import { inherits } from 'util';
import { findByLabelText } from '@testing-library/react';
import Login from './components/Login';
import UserProvider from './providers/UserProvider';
import Logout from './components/Logout';



const useStyles = makeStyles(
    {
        body: {
            marginTop: '20px',
        }
    }
)

function App() {

  let classes = useStyles();

  let [showUser, setShowUser] = React.useState(false);

  return (
    <> 
    <ButtonAppBar onOpen={setShowUser}></ButtonAppBar>
    <Grid
      container
      justify="center"
      alignItems="center"
      alignContent="center"
      className={classes.body}
    >
      
        
        <UserProvider>
  
            <Login></Login>
            <Logout></Logout>
            {showUser ? <User></User> : <Order></Order>}
       
        </UserProvider>

      

    </Grid>
    
    </>
  );
}

export default App;
