import React,{useState} from 'react';
import classes from './LandingPage.module.css';
import Navigation from '../../components/Navigation/Navigation';
import {Form,Button,Image} from 'react-bootstrap';

const LandingPage = props=>{
    const [state,setState]= useState({
        login: '',
        password: ''
    });
    return (
        <>
        <Navigation home/>
        <Image width='300' height='300' src={require('../../images/messenger.png')} className={classes.image}/>
      <div className={classes.LandingPage}>
        <Form style={{marginTop: '25px'}}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Enter email" className={classes.input} style={{width: '50%'}}/>
          </Form.Group>
          <Form.Group controlId="formBasicLogin">
            <Form.Control type="text" placeholder="Enter login" className={classes.input} style={{width: '50%'}}/>
          </Form.Group>
          <Button className={classes.button}>
            Login
         </Button>
        </Form>
      </div>
      </>
    )
};

export default LandingPage;