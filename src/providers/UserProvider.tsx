import React, { createContext, useEffect, useState } from 'react'
import { auth }  from "../login/Firebase";
import  firebase from 'firebase'
import {
    Route,
    Redirect,
    RouteProps,
    RouteComponentProps,
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


export function PrivateRoute(props : RouteProps) {
    let { children, ...rest } = props;
    return (
        <UserContext.Consumer>
            {(user) => {
                if (!user) {
                    return (
                        <Route
                        {...rest}
                        render={({location}) => {
                                return (<Redirect
                                    to={{
                                        pathname: "/login",
                                        state: {from: location}
                                    }}
                                />)
                        } }
                    />
                    )
                } else {
                    return (
                        <Route
                        {...props}
                        />
                    )
                }
            }
            }
        </UserContext.Consumer>
    )

}