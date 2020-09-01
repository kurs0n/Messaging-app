import React, { useState, useEffect,useCallback } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Emoji from '../../components/Emoji/Emoji';
import {Form,Button,Spinner} from 'react-bootstrap';
import classes from './Social.module.css';
import axios from 'axios';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import {url} from '../../ApiUrl';

const Social = props =>{
    const [state,setState] = useState({
        input: '',
        accounts: [],
        friends: [],
        IdOfMe: '',
        loading: false
    });
    const handleChange = event=>{
        setState({
            ...state,
            input: event.target.value
        });

    }

    const loginButtonHandler = useCallback(()=>{
        props.history.push('/');
    },[props]);

    const getUsersAndFriends = useCallback(() => {
        let accounts; // we must do it like this because this is not working if we want to setState
            axios.get(url+"/user/users",{headers: {
                "Authorization": "Bearer "+localStorage.getItem('token'),
                "input": state.input
            }}).then(response=>{
                accounts = response.data.accounts;
                axios.get(url+'/user/friends',{ // getting friends and users to filter it in social tab 
                    headers:{
                        "Authorization": 'Bearer '+ localStorage.getItem('token')
                    }
                }).then(response=>{
                    setState(prevState =>{return {
                        ...prevState,
                        friends: response.data.friends,
                        accounts: accounts,
                        loading: false
                    }});
                }).catch(err=>{
                    console.log(err);
                })
            });
    },[state.input]); 

    const getMe = useCallback(()=>{
        axios.get(url+'/user/me',{headers:{
            "Authorization": 'Bearer '+ localStorage.getItem('token')
        }}).then(response=>{
            props.setMe(response.data.id);
        })
        .catch(err=>{
            console.log(err);
        })
    },[props]);

    const addFriend = (id) =>{
        axios.post(url+'/user/add_friend',{
            id: id.toString()
        },{headers:{
            "Authorization": 'Bearer '+localStorage.getItem('token')
        }})
        .then(response=>{
            getUsersAndFriends();
            })
            .catch(err=>{
                console.log(err);
            });
    }

    const acceptFriend = (id)=>{
        axios.patch(url+'/user/accept_friend',{
            id: id.toString()
        },{headers:{
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }}).then(response=>{
                getUsersAndFriends();
            })
            .catch(err=>{
                console.log(err);
            });
}

    const filterUsers = ()=>{ // filter user to not get yourself and displaying it actual status in relation to Account logged
        let temp = [];
        state.accounts.map(account=>{
            return state.friends.map(friend=>{
                if (account._id.toString() === friend.friend._id.toString())
                {
                 temp.push(account._id); // if we have friend 
                }
                return null;
            });
        });
        const filtered = state.accounts.filter(people=> people._id.toString() !== props.id.toString()); // filter to not get yourself 
        return filtered.map(people=>{
            let temp2 = false;
            let temp3 = null; 
            return (
                <li className={classes.li} key={people._id}>
                    <p>{people.name}</p>
                    <p>{people.surname}</p>
                    {
                        state.friends.map(friend=>{
                            if(people._id.toString()===friend.friend._id.toString())
                            {
                                if(friend.send===true&&friend.accepted===false)
                                {
                                    temp3 = (<p style={{fontWeight: 'bold'}}>Waiting for accept <Emoji symbol="👍🏻"/></p>);
                                    temp2 = true;
                                }
                                else if(friend.send===false&&friend.accepted===false)
                                {
                                    temp3 = (<Button variant="dark" className={classes.Button} onClick={()=>acceptFriend(people._id)}>Accept<Emoji symbol="🤝"/></Button>);
                                    temp2 = true;
                                }
                                else if(friend.accepted===true)
                                {
                                    temp3 = (<p style={{fontWeight: 'bold'}}>This is your friend <Emoji symbol="👨🏽‍💻"/></p>);
                                    temp2 = true;
                                }
                            }
                            return null;
                        })
                    }
                    {
                        temp2 ? temp3 : <Button variant="dark" className={classes.Button} onClick={()=>
                            addFriend(people._id)}>Add Friend<Emoji symbol="👋"/></Button>
                    } 

                </li>
            )
        });
    };

    useEffect(()=>{
        let timer;
        if (localStorage.token)
        {
            setState(prevState=>{return{
                ...prevState,
                loading: true
            }});
            timer = setTimeout(()=>{
                getUsersAndFriends();
            },400);
        }
        return ()=> clearTimeout(timer);
    },[getUsersAndFriends]);

    useEffect(()=>{
        if (localStorage.token)
        {
        getMe();
        }
    },[getMe]);

    const users = filterUsers();

    if (localStorage.token)
    {
    return (
        <>
        <Navigation social history={props.history}/>
        <div className={classes.container}>
            <Button variant="dark" className={classes.Button_logout} onClick={()=>{
                    localStorage.removeItem('token');
                    window.location.reload(false);
            }}>logout</Button>
        </div>
        <Form className={classes.socialinput}>
            <Form.Group controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Search Friends by typing their names 🧙‍♂️" value={state.input} onChange={handleChange}/>
            </Form.Group>
        </Form>
        <ul className={classes.ul}>
            {
                users.length ? users : state.loading ? null : <h1 className={classes.not_find_user}>We can't find users <Emoji symbol="😵"/></h1>
            }
        </ul>
        <div style={{textAlign: 'center'}}>
        {
                state.loading ? <Spinner animation="border" style={{width: '3rem', height: '3rem',color: 'black'}}/> : null
        }
        </div>
    </>
    )
        }
        else {
            return(
                <>
                <Navigation social history={props.history}/>
                <h1 style={{marginTop: '9%',textAlign: 'center',fontSize: 50}}>Login first <Emoji symbol="📜"/></h1>
                <h1 style={{marginTop: '9%',textAlign: 'center',fontSize: 50}}>And Start Messaging <Emoji symbol="✏️"/> </h1>
                <div style={{textAlign: 'center'}}>
                    <Button variant="dark" style={{marginTop: '75px', width: '30%'}} onClick={loginButtonHandler}>Login</Button>
                </div>
                </>
            )
        }
};

const mapStateToProps = state=>{
    return {
        id: state.meId
    }
}
const mapDispatchToProps = dispatch=>{
    return {
        setMe: (id)=>dispatch(actions.addMe(id))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Social);