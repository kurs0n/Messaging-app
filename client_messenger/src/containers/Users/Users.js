import React,{useEffect, useState} from 'react';
import axios from 'axios';
import User from '../../components/User/User';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';

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
    let users_not_accepted = null;
    return (
        <>
        {users.length ? users.map(friend=> {
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
            else
            {
                users_not_accepted++;
                if(users.length===users_not_accepted)
                {
                    return(<p style={{fontWeight: 'bold',textAlign: 'center',fontSize: 25, marginTop: '50%'}}>You don't have friends😮 Add them!🤯</p>);
                }
            }
        }) : <p style={{fontWeight: 'bold',textAlign: 'center',fontSize: 25, marginTop: '50%'}}>You don't have friends😮 Add them!🤯</p>}
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