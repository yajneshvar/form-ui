import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router';
import { GoogleLogout }  from "../login/Firebase";
import { UserContext, AuthenticatedUser } from "../providers/UserProvider";

export default function Logout() {
    let history = useHistory();
    const logout = (event: any) => {
        event?.preventDefault();
        GoogleLogout();
        history.push("/")
    }
    return (
        <UserContext.Consumer>
           { (userState) => {
               return <LogoutButton userState={userState} logout={logout}/>
            } 
             
           }
        </UserContext.Consumer>
    )

}

interface LogoutProps {
    userState: AuthenticatedUser,
    logout: (event: any) => void
}

 function LogoutButton({userState, logout}: LogoutProps) {
    if (userState !== null) {
        return (<Button variant="contained" color="secondary" onClick={logout} disableElevation>Logout</Button>)
    } else {
        return (<></>)
    }
 }