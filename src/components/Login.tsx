
import React from 'react';
import { UserContext } from '../providers/UserProvider';
import { Button } from '@material-ui/core';
import { GoogleSignIn }  from "../login/Firebase";


export default function Login() {

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