import React, { Reducer, useReducer } from 'react';
import User from './components/User';
import Order from './components/Order';
import ButtonAppBar from './components/ButtonAppBar';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import Login from './components/Login';
import UserProvider, { UserContext } from './providers/UserProvider';
import { DispatchAction, DisplayType } from './components/models';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';



const useStyles = makeStyles(
    {
        body: {
            marginTop: '20px',
        },
        loginPage: {

        }
    }
)

function App() {

  let classes = useStyles();


function reducer(prevState: DisplayType, action: DispatchAction): DisplayType {

  switch(action.type) {
    case 'order':
      return {order: true, customer: false}
    case 'customer':
      return {order: false, customer: true}
    default:
      throw Error("Undefined display " + action.type)
  }

}

  let [displayState, dispatchDisplay] = useReducer<Reducer<DisplayType, DispatchAction>, DisplayType>( reducer, {order: true, customer: false}, (d: DisplayType) => d)

  return (
    <> 
        <UserProvider>
          <UserContext.Consumer>
            { (userState) => {
                if (userState.user == null) {
                  return (
                    <div>
                    <ButtonAppBar dispatchDisplay={dispatchDisplay}></ButtonAppBar>
                    <Grid container className={classes.body} justify="center">
                      <Grid item xs={6} >
                        <Card>
                          <CardContent>
                            <Typography>Please login to proceed</Typography>
                            <Login></Login>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    </div>
                  )
                }
                return (
                  <>
                    <ButtonAppBar dispatchDisplay={dispatchDisplay}></ButtonAppBar>
                    <div className={classes.body}>
                      {
                        displayState.order && !displayState.customer && <Order></Order>
                      }
                      {
                      !displayState.order && displayState.customer && <User></User>
                      }
                    </div>
                  </>
                )
            }}
          </UserContext.Consumer>
        </UserProvider>
    </>
  );
}

export default App;
