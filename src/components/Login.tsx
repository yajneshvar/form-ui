
import React, { useEffect } from 'react';
import { UserContext, AuthenticatedUser } from '../providers/UserProvider';
import { Button, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import { googleSignIn }  from "../login/Firebase";
import { useHistory } from 'react-router';


export default function Login() {
    return (
        <UserContext.Consumer>
            {(userState) => {
              return <LoginButton user={userState} />
            }}
        </UserContext.Consumer>
    )

}

interface LoginProps {
  user: AuthenticatedUser
}

function LoginButton({user}: LoginProps) {

  let history = useHistory(); 

  let login = (event: any) => {
    event?.preventDefault();
    googleSignIn();
  } 

  // useEffect(() => {
  //     if (user !== null) {
  //       history.replace("/order");
  //     }
  // }, [user, history])


  return (
    <>
    { user == null &&  (
      <Button  variant="contained" color="secondary" onClick={login} disableElevation>Sign In With Google</Button>
   ) }
   </>

  )

}

const useStyles = makeStyles(
    {
        body: {
            marginTop: '20px',
        },
        loginPage: {

        }
    }
)

export function LoginPage() {
    const classes = useStyles()
    return (
        <div>
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