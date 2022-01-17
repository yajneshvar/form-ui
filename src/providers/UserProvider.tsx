import React, { createContext, useEffect, useState , useReducer } from 'react'
import  firebase from 'firebase'
import {
    Route,
    Redirect,
    RouteProps,
  } from "react-router-dom";
import { auth, getCredentials }  from "../login/Firebase";


export type AuthenticatedUser = firebase.User | null;
export const UserContext = createContext<AuthenticatedUser>(null);

interface CachedCredential {
    credential: firebase.auth.UserCredential;
    expiry: number;
}

let cachedCredentials: CachedCredential | null = null;

const TwoHour = 2*60*60*60;

export const CredentialKey = 'tst-ims-user-credentials'

const credentialsJson = window.localStorage.getItem(CredentialKey);
try {
    if (credentialsJson) {
        const credentials = JSON.parse(credentialsJson)
        if (!isExpired(credentials.expiry)) {
            cachedCredentials = credentials
        } else {
            cachedCredentials = null
            window.localStorage.removeItem(CredentialKey)
        }
    }
} catch(e) {
    console.log("Failed to get user login")
    console.log(e)
}

export function clearCachedCredential() {
    cachedCredentials = null
    window.localStorage.removeItem(CredentialKey);
}

function isExpired(expiry: number) {
    return (Date.now() - expiry) > TwoHour;
}

function getCachedCredential() {
    if (cachedCredentials && !isExpired(cachedCredentials.expiry) ) {
        return  cachedCredentials;
    }

    return null;
}

export default function UserProvider(props :any) {

    const [userState, setUserState] = useState<AuthenticatedUser>(cachedCredentials?.credential?.user || null)

    useEffect(() => {         
        getCredentials().then( (credentials) => {
            if (credentials.user != null) {
                cachedCredentials = { credential: credentials, expiry: Date.now() }
                window.localStorage.setItem(CredentialKey, JSON.stringify(cachedCredentials))
                setUserState(credentials.user);
            } 
        })
        auth.onAuthStateChanged((authenticatedUser) => {
                const credential = getCachedCredential()?.credential 
                const user = authenticatedUser || credential?.user
                if (authenticatedUser == null && credential) {
                    setUserState(credential.user)
                } else {
                    setUserState(authenticatedUser)
                }
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
            {(user) => <RedirectOrRoute {...props} user={user} />
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
    const { children, user, ...rest } = props;
    const initialAuthState: AuthenticationState = user ? {status: "LOGGED_IN"}  : {status: "LOGGED_OUT"}
    const [authenticationStatus, dispatchAuthStatus] = useReducer((authState: AuthenticationState, action: AuthenticationStatus) => {
        // eslint-disable-next-line no-param-reassign
        authState.status = action;
        return authState;
    }, initialAuthState)
    useEffect(() => {
        if (!user) {
            getCredentials().then(result => {
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
        render={() => {
            if (authenticationStatus.status === "LOGGED_OUT") {
                return (
                    <Route
                    {...rest}
                    render={({location: redirectLocation }) => (<Redirect
                                to={{
                                    pathname: "/login",
                                    state: {from: redirectLocation}
                                }}
                            />) }
                />
                )
            } if (authenticationStatus.status === "LOGGED_IN"){
                return (
                    <Route
                    {...props}
                    />
                )
            } 
                return (<div>
                    Loading page....
                </div>);
            
        } }
        />
    );

}