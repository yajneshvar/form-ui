import React, { createContext, useEffect, useState } from 'react'
import { auth }  from "../login/Firebase";
import  firebase from 'firebase'
import {
    Route,
    Redirect,
    RouteProps,
  } from "react-router-dom";


export type AuthenticatedUser = firebase.User | null;
export const UserContext = createContext<AuthenticatedUser>(null);

export default function UserProvider(props :any) {

    const [userState, setUserState] = useState<AuthenticatedUser>(null)

    useEffect(() => {
        auth.onAuthStateChanged((authenticatedUser) => {
                setUserState(authenticatedUser)
        })
    }, [setUserState])

    return (
        <UserContext.Provider value={userState}>
            {props.children}
        </UserContext.Provider>
    )

}


export function PrivateRoute({ children, ...rest } : RouteProps) {
    return (
        <UserContext.Consumer>
            {(user) => 
                <Route
                    {...rest}
                    render={({location} : {location:any}) => user ? children : (<Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />) }
                />
            }
        </UserContext.Consumer>
    )

}