import React, { createContext, useEffect, useState } from 'react'
import { auth, GetCredentials }  from "../login/Firebase";
import  firebase from 'firebase'


export type AuthenticatedUser = firebase.User | null;
export  interface UserStateType { user: AuthenticatedUser}
export const UserContext = createContext<UserStateType>({user: null});

export default function UserProvider(props :any) {

    const [userState, setUserState] = useState<UserStateType>({ user: null})

    useEffect(() => {
        auth.onAuthStateChanged((authenticatedUser) => {
                setUserState({ user: authenticatedUser})

        })
    }, [setUserState])

    return (
        <UserContext.Provider value={userState}>
            {props.children}
        </UserContext.Provider>
    )

}