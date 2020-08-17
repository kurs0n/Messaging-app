import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import {Form,Button,Spinner} from 'react-bootstrap';
import classes from './Social.module.css';
import axios from 'axios';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';

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

    const loginButtonHandler = ()=>{
        props.history.push('/');
    }

    const addFriend = (id) =>{
        axios.post('http://localhost:3000/user/add_friend',{
            id: id.toString()
        },{headers:{
            "Authorization": 'Bearer '+localStorage.getItem('token')
        }})
        .then(response=>{
            let accounts;
            axios.get("http://localhost:3000/user/users",{headers: {
                "Authorization": "Bearer "+localStorage.getItem('token'),
                "input": state.input
            }}).then(response=>{
                accounts = response.data.accounts;
                axios.get('http://localhost:3000/user/friends',{
                    headers:{
                        "Authorization": 'Bearer '+ localStorage.getItem('token')
                    }
                }).then(response=>{
                    setState({
                        ...state,
                        friends: response.data.friends,
                        accounts: accounts,
                        loading: false
                    });
                }).catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
        })
    }

    const acceptFriend = (id)=>{ // yea mess
        axios.patch('http://localhost:3000/user/accept_friend',{
            id: id.toString()
        },{headers:{
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }}).then(response=>{
            let accounts;
            axios.get("http://localhost:3000/user/users",{headers: {
                "Authorization": "Bearer "+localStorage.getItem('token'),
                "input": state.input
            }}).then(response=>{
                accounts = response.data.accounts;
                axios.get('http://localhost:3000/user/friends',{
                    headers:{
                        "Authorization": 'Bearer '+ localStorage.getItem('token')
                    }
                }).then(response=>{
                    setState({
                        ...state,
                        friends: response.data.friends,
                        accounts: accounts,
                        loading: false
                    });
                }).catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const filterUsers = ()=>{
        let temp = [];
        state.accounts.map(account=>{
            state.friends.map(friend=>{
                if (account._id.toString() === friend.friend._id.toString())
                {
                 temp.push(account._id); // if we have friend 
                }
            })
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
                                    temp3 = (<p style={{fontWeight: 'bold'}}>Waiting for accept 👍🏻 </p>);
                                    temp2 = true;
                                }
                                else if(friend.send===false&&friend.accepted===false)
                                {
                                    temp3 = (<Button variant="dark" className={classes.Button} onClick={()=>acceptFriend(people._id)}>Accept</Button>);
                                    temp2 = true;
                                }
                                else if(friend.accepted===true)
                                {
                                    temp3 = (<p style={{fontWeight: 'bold'}}>This is your friend 👨🏽‍💻</p>);
                                    temp2 = true;
                                }
                            }
                        })
                    }
                    {
                        temp2 ? temp3 : <Button variant="dark" className={classes.Button} onClick={()=>
                            addFriend(people._id)}>Add Friend</Button>
                    }

                </li>
            )
        });
        /*return state.accounts.map(people=>{ previous lol
            let temp2 = false;
            return (
                <li className={classes.li} key={people._id}>
                    <p>{people.name}</p>
                    <p>{people.surname}</p>
                    {
                        temp.map(value=>{
                            if (value.toString()===people._id.toString())
                            {
                                temp2 = true;
                            }
                        })
                    }
                    {
                        temp2 ? <p>This is your friend</p> : <Button className={classes.Button}>Add Friend</Button>
                    }

                </li>
            )
        });*/
    };

    useEffect(()=>{
        setState({
            ...state,
            loading: true
        });
        const timer = setTimeout(()=>{
            let accounts;
            axios.get("http://localhost:3000/user/users",{headers: {
                "Authorization": "Bearer "+localStorage.getItem('token'),
                "input": state.input
            }}).then(response=>{
                accounts = response.data.accounts;
                axios.get('http://localhost:3000/user/friends',{
                    headers:{
                        "Authorization": 'Bearer '+ localStorage.getItem('token')
                    }
                }).then(response=>{
                    setState({
                        ...state,
                        friends: response.data.friends,
                        accounts: accounts,
                        loading: false
                    });
                }).catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
        },400);
        return ()=> clearTimeout(timer);
    },[state.input]);

    useEffect(()=>{
        axios.get('http://localhost:3000/user/me',{headers:{
            "Authorization": 'Bearer '+ localStorage.getItem('token')
        }}).then(response=>{
            props.setMe(response.data.id);
        })
        .catch(err=>{
            console.log(err);
        })
    },[]);

    const users = filterUsers();

    if (localStorage.token)
    {
    return (
        <>
        <Navigation social history={props.history}/>
        <Form className={classes.socialinput}>
            <Form.Group controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Search Friends by typing their names 🧙‍♂️" value={state.input} onChange={handleChange}/>
            </Form.Group>
        </Form>
        <ul className={classes.ul}>
            {
                users
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
                <h1 style={{marginTop: '9%',textAlign: 'center',fontSize: 50}}>Login first 📜 </h1>
                <h1 style={{marginTop: '9%',textAlign: 'center',fontSize: 50}}>And Start Messaging ✏️ </h1>
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