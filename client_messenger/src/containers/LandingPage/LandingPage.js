import React,{useState} from 'react';
import classes from './LandingPage.module.css';
import Navigation from '../../components/Navigation/Navigation';
import {Form,Button,Image} from 'react-bootstrap';
import axios from 'axios';

const LandingPage = props=>{
    const [state,setState]= useState({
        login: '',
        password: ''
    });

    const inputHandler = event =>{
      setState({
        ...state,
        [event.target.name]: event.target.value
      });
    }
    
    const login = ()=>{
      axios.post('http://localhost:3000/auth/login',{
        login: state.login,
        password: state.password
      })
      .then(response=>{
        localStorage.setItem('token',response.data.token);
        window.location.reload(false);
        console.log(response); 
      })
      .catch(err=>{
        console.log(err);
      })
    }

    return (
        <>
        <Navigation home history={props.history}/>
        <Image width='300' height='300' src={require('../../images/messenger.png')} className={classes.image}/>
      <div className={classes.LandingPage}>
        <Form style={{marginTop: '25px'}}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control type="text" placeholder="Enter Login" className={classes.input} style={{width: '50%'}} name="login" onChange={inputHandler} value={state.login}/>
          </Form.Group>
          <Form.Group controlId="formBasicLogin">
            <Form.Control type="text" placeholder="Enter Password" className={classes.input} style={{width: '50%'}} name="password" onChange={inputHandler} value={state.password}/>
          </Form.Group>
          <Button className={classes.button} onClick={login}>
            Login
         </Button>
        </Form>
      </div>
      </>
    )
};

export default LandingPage;