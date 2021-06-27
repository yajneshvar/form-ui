import { Grid } from '@material-ui/core';
import { useParams } from '@reach/router';
import { AnyRecord } from 'node:dns';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../providers/UserProvider';
import User, { UserValue } from './User';

export function UserList() {

    let url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";
    const [users, setUsers] = useState<UserValue[]>([]);

    useEffect(() => {
        fetch(`${url}/users`, {
            method: 'GET'
        }).then( (response) => {
            if (response.ok) {
                response.json().then( users => setUsers(users))
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
    let { id } = props.params;
    let url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";
    const [user, setUser] = useState<UserValue|null>(null);

    useEffect(() => {
        fetch(`${url}/user/${id}`, {
            method: 'GET'
        }).then( (response) => {
            if (response.ok) {
                response.json().then( user => setUser(user))
            }
        }).catch(err => {
            alert("Failed to fetch customers")
        })
    }, [url, id])

    return (
            user && <User user={user}/>
    )
}


