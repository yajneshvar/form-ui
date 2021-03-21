
import React from 'react';
import { UserContext } from '../providers/UserProvider';
import LoginButton from './LoginButton';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import { GoogleSignIn }  from "../login/Firebase";


export default function Login() {

    const useStyles = makeStyles( (theme: Theme) => createStyles(
        {
            padding: {
                padding: theme.spacing(2)
            }
        }
    )
    )

    let classes = useStyles();
    

   let googleSignIn = (event: any) => {
        event?.preventDefault();
        GoogleSignIn();
    }   

    return (
        <UserContext.Consumer>
            {(userState) => (
                        <Grid container className={classes.padding}>
                        <Grid>User is {userState.user?.email}</Grid>
                         { userState.user == null &&  (
                                <Grid>
                                    <button onClick={googleSignIn}>Google Sign In</button>
                                </Grid>
                                
                        ) }
                        </Grid>
            )}
        </UserContext.Consumer>
    )

}