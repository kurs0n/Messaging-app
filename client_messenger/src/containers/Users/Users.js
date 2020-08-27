import React,{useEffect, useState} from 'react';
import axios from 'axios';
import User from '../../components/User/User';
import Emoji from '../../components/Emoji/Emoji';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import {url} from '../../ApiUrl';

const Users = props =>{
    const [users,setUsers] = useState([]);
    useEffect(()=>{ //component did mount setting users with our friends
        axios.get(url+'/user/friends',{headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }})
        .then(response =>{
            setUsers(response.data.friends);
        })
        .catch(err=>{
            console.log(err);
        });
    },[]);
    const setUser = personId =>{ // setting user conversation after click on it in friends tab
        props.setUser(personId);
        axios.get(url+'/user/conversation',{headers:{
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
            if (friend.accepted===true) // if we have friends which has accepted status
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
                if(users.length===users_not_accepted) // avoiding multiple users who is not accepted
                {
                    return(<p style={{fontWeight: 'bold',textAlign: 'center',fontSize: 25, marginTop: '50%'}}>You don't have friends<Emoji symbol="😮"/> Add them!<Emoji symbol="🤯"/></p>);
                }
            }
            return null;
        }) : <p style={{fontWeight: 'bold',textAlign: 'center',fontSize: 25, marginTop: '50%'}}>You don't have friends<Emoji symbol="😮"/> Add them!<Emoji symbol="🤯"/></p>}
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