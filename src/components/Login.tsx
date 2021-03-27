
import React from 'react';
import { UserContext } from '../providers/UserProvider';
import { Button, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
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
                       <>
                         { userState.user == null &&  (
                            
                                    <Button  variant="contained" color="secondary" onClick={googleSignIn} disableElevation>Sign In With Google</Button>
                                
                                
                        ) }
                        </>
                     
            )}
        </UserContext.Consumer>
    )

}