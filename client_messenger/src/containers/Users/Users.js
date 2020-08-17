import React,{useEffect, useState} from 'react';
import axios from 'axios';
import User from '../../components/User/User';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000/');

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
    const setUser = personId =>{
        props.setUser(personId);
        axios.get('http://localhost:3000/user/conversation',{headers:{
            "person2": personId,
            "Authorization": "Bearer "+ localStorage.getItem('token')
        }})
        .then(response=>{
           props.setMessages(response.data.messages);
        })
        .catch(err=>{
            console.log(err);
        })
    };
    return (
        <>
        {users.map(friend=> {
            if (friend.accepted===true)
            {
            return (
                <User key={friend.friend._id} click={()=>{setUser(friend.friend._id.toString())}} id={friend.friend._id} > {
                    // to fire onClick event on <p> component lol
                }
                    {friend.friend.name} {friend.friend.surname}
                </User>
            );
            }
        })}
        </>
    )
}

const mapDispatchToProps = dispatch =>{
    return {
        setUser: (personId)=>dispatch(actions.setUser(personId)),
        setMessages: (messages)=>dispatch(actions.setMessages(messages))
    }
};

export default connect(null,mapDispatchToProps)(Users);