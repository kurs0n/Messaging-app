import React,{useState} from 'react';
import classes from './LandingPage.module.css';
import Navigation from '../../components/Navigation/Navigation';
import {Form,Button} from 'react-bootstrap';

const LandingPage = props=>{
    const [state,setState]= useState({
        login: '',
        password: ''
    });
    return (
        <>
        <Navigation/>
      <div className={classes.LandingPage}>
        <p>
          Messenger
        </p>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email: </Form.Label>
            <Form.Control type="email" placeholder="Enter email" style={{
              width: '50%',
              margin: 'auto'
            }}/>
          </Form.Group>
          <Form.Group controlId="formBasicLogin">
            <Form.Label>Login: </Form.Label>
            <Form.Control type="text" placeholder="Enter login" style={{
              width: '50%',
              margin: 'auto'
            }}/>
          </Form.Group>
          <Button>
            login
         </Button>
        </Form>
      </div>
      </>
    )
};

export default LandingPage;