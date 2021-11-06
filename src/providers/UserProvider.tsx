import React, { createContext, useEffect, useState } from 'react'
import { auth, GetCredentials }  from "../login/Firebase";
import  firebase from 'firebase'
import {
    Route,
    Redirect,
    RouteProps,
  } from "react-router-dom";
import { useReducer } from 'react';


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
    return (
        <UserContext.Consumer>
            {(user) => {
                    return <RedirectOrRoute {...props} user={user} />
                }
            }
        </UserContext.Consumer>
    )

}

interface AuthenticatedUserProps {
    user: AuthenticatedUser
}

type AuthenticationStatus = "PENDING" | "LOGGED_IN" | "LOGGED_OUT";
interface AuthenticationState {
    status: AuthenticationStatus
}


function RedirectOrRoute(props: RouteProps & AuthenticatedUserProps) {
    let { children, user, ...rest } = props;
    let initialAuthState: AuthenticationState = user ? {status: "LOGGED_IN"}  : {status: "LOGGED_OUT"}
    let [authenticationStatus, dispatchAuthStatus] = useReducer((authState: AuthenticationState, action: AuthenticationStatus) => {
        authState.status = action;
        return authState;
    }, initialAuthState)
    useEffect(() => {
        if (!user) {
            GetCredentials().then(result => {
                if (result.credential) {
                    dispatchAuthStatus("LOGGED_IN");
                } else {
                    dispatchAuthStatus("LOGGED_OUT");
                }
                
            } )
            .catch(err => dispatchAuthStatus("LOGGED_OUT"))
        }
    }, [user])

    return (
        <Route
        {...rest}
        render={({location}) => {
            if (authenticationStatus.status === "LOGGED_OUT") {
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
            } else if (authenticationStatus.status === "LOGGED_IN"){
                return (
                    <Route
                    {...props}
                    />
                )
            } else {
                return (<div>
                    Loading page....
                </div>);
            }
        } }
        />
    );

}