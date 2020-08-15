import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import {Form,Button,Spinner} from 'react-bootstrap';
import classes from './Social.module.css';
import axios from 'axios';

const Social = props =>{
    const [state,setState] = useState({
        input: '',
        accounts: [],
        loading: false
    });
    const handleChange = event=>{
        setState({
            ...state,
            input: event.target.value
        });

    }
    useEffect(()=>{
        setState({
            ...state,
            loading: true
        });
        const timer = setTimeout(()=>{
            axios.get("http://localhost:3000/user/users",{headers: {
                "Authorization": "Bearer "+localStorage.getItem('token'),
                "input": state.input
            }}).then(response=>{
                setState({
                    ...state,
                    accounts: response.data.accounts,
                    loading: false
                });
            })
            .catch(err=>{
                console.log(err);
            })
        },400);
        return ()=> clearTimeout(timer);
    },[state.input]);
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
            {state.accounts.map(people=>{
                return (
                    <li className={classes.li}>
                        <p>{people.name}</p>
                        <p>{people.surname}</p>
                        <Button className={classes.Button}>Add Friend</Button>
                    </li>
                )
            })}
        </ul>
        <div style={{textAlign: 'center'}}>
        {
                state.loading ? <Spinner animation="border" style={{width: '3rem', height: '3rem'}}/> : null
        }
        </div>
    </>
    )
        }
        else {
            return(
                <>
                <Navigation social history={props.history}/>
                <h1>Login first</h1>
                </>
            )
        }
};

export default Social;