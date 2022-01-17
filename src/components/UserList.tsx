import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useFetchWithAuth } from '../hooks/fetchWithAuth';
import User, { UserValue } from './User';

export function UserList() {

    const url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";
    const [users, setUsers] = useState<UserValue[]>([]);

    useEffect(() => {
        fetch(`${url}/users`, {
            method: 'GET'
        }).then( (response) => {
            if (response.ok) {
                response.json().then( fetchedUsers => setUsers(fetchedUsers))
            }
        }).catch(err => {
            alert("Failed to fetch customers")
        })
    }, [url])


    return (
        <Grid container>
            {
                users.map((user) =>  
                    <Grid item xs={3}><NavLink to={`/user/${user.id}`}>{`${user.firstName} ${user.lastName}`}</NavLink> </Grid>
                )
            }

        </Grid>
    )


}



export function UpdateUser(props: any) {
    const { id } = props.params;
    const url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";
    const [user, setUser] = useState<UserValue|null>(null);
    const {response, error} = useFetchWithAuth(`${url}/user/${id}`, {
        method: 'GET'
    })

    if (error) {
        alert("Failed to fetch customers")
    }
    
    useEffect(() => {
        if (response?.ok) {
            response.json().then( updatedUser => setUser(updatedUser))
        }
    }, [response])

    return (
            user && <User user={user}/>
    )
}


