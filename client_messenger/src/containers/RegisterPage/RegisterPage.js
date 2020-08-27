import React,{useState} from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Emoji from '../../components/Emoji/Emoji';
import {Form,Button} from 'react-bootstrap';
import classes from './RegisterPage.module.css';
import axios from 'axios';
import {url} from '../../ApiUrl';

const RegisterPage = props=>{
    const [state,setState] = useState({
      email: '',
      name: '',
      surname: '',
      login: '',
      password: ''
    });
    const inputHandler = event =>{
      setState({
        ...state,
        [event.target.name]: event.target.value
      });
    }

    const submitUser = ()=>{
      axios.post(url+'/auth/signup',{
      ...state
      })
      .then(response=>{
        localStorage.setItem('token',response.data.token);
        props.history.push('/');
        window.location.reload(false);
      })
      .catch(err=>{
        console.log(err);
      })
    }

    return(
        <>
        <Navigation home history={props.history}/>
        <div style={{margin: 'auto',marginTop: '30px',textAlign: 'center'}}>
          <h1>Register<Emoji symbol="👽"/></h1>
          <h2>and start messaging<Emoji symbol="✉️"/><Emoji symbol="📫"/></h2>
        </div>
        <div className={classes.div}>
        <Form style={{marginTop: '25px'}}>
          <Form.Group>
            <Form.Control type="email" placeholder="Enter Email" style={{width: '50%',margin: 'auto'}}  name="email" value={state.email} onChange={inputHandler}/>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" placeholder="Enter Name" style={{width: '50%', margin: 'auto'}} name="name" value={state.name} onChange={inputHandler}/>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" placeholder="Enter Surname" style={{width: '50%',margin: 'auto'}}  name="surname" value={state.surname} onChange={inputHandler}/>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" placeholder="Enter Login" style={{width: '50%',margin: 'auto'}}  name="login" value={state.login} onChange={inputHandler}/>
          </Form.Group>
          <Form.Group>
            <Form.Control type="password" placeholder="Enter Password" style={{width: '50%',margin: 'auto'}}  name="password" value={state.password} onChange={inputHandler}/>
          </Form.Group>
          <Button variant='dark' style={{marginBottom: '30px'}} onClick={submitUser}>
            Register
         </Button>
        </Form> 
        </div>
        </>
    )
};

export default RegisterPage;