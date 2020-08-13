import React,{useEffect, useState} from 'react';
import axios from 'axios';
import User from '../../components/User/User';

const Users = props =>{
    const [users,setUsers] = useState([]);
    useEffect(()=>{
        axios.get('http://localhost:3000/user/friends',{headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }})
        .then(response =>{
            setUsers(response.data.friends);
        })
        .catch(err=>{
            console.log(err);
        });
    },[]);
    return (
        <>
        {users.map(friend=> {
            return (
                <User>
                    {friend.friend.name} {friend.friend.surname}
                </User>
            );
        })}
        </>
    )
}

export default Users;