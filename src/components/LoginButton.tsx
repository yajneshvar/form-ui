import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { GoogleSignIn }  from "../login/Firebase";
import { UserStateType } from '../providers/UserProvider';

export default function LoginButton(userState: UserStateType) {


    const useStyles = makeStyles( (theme: Theme) => createStyles(
        {
            padding: {
                padding: theme.spacing(2)
            }
        }
    )
    )

    let classes = useStyles();
    

    const authenticatedUser = userState.user;

   let googleSignIn = (event: any) => {
        event?.preventDefault();
        GoogleSignIn();
    }   

    return (
        <Grid container className={classes.padding}>
        <Grid>User is {authenticatedUser?.email}</Grid>
         { authenticatedUser == null &&  (
                <Grid>
                    <button onClick={googleSignIn}>Google Sign In</button>
                </Grid>
                
        ) }
        </Grid>
    )

}