import { Button } from '@material-ui/core';
import React from 'react';
import { GoogleLogout }  from "../login/Firebase";
import { UserContext, UserStateType } from "../providers/UserProvider";

export default function Logout() {
    return (
        <UserContext.Consumer>
           { LogoutButton }
        </UserContext.Consumer>
    )

}

 function LogoutButton(userState: UserStateType) {
    const onClick = (event: any) => {
        event?.preventDefault();
        GoogleLogout();
    }
    if (userState.user !== null) {
        return (<Button onClick={onClick} >Logout</Button>)
    } else {
        return (<></>)
    }
 }