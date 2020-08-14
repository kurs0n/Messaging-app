import React,{useState, useEffect} from 'react';
import Message from '../Message/Message';
import classes from './Messenger.module.css';
import {Form} from 'react-bootstrap'; 
import axios from 'axios';
import {connect} from 'react-redux';
import openSocket from 'socket.io-client';
import * as actions from '../../store/actions/index';

const socket = openSocket('http://localhost:3000/');
const Messenger = props =>{
    const [input,setInput] = useState('');
    useEffect(()=>{
        socket.emit('connect');
        socket.on('message',(data)=>{
            props.addMessage(data);
        });
    },[]);
    const submitMessage = event =>{
        event.preventDefault();
        axios.post('http://localhost:3000/user/message',{
         id: props.personId,
         message: input 
        },{
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        })
        .then(response =>{
            axios.get('http://localhost:3000/user/conversation',{headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'person2': props.personId 
            }}).then(response=>{
                props.setMessages(response.data.messages);
                setInput('');
            }).catch(err=>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const handlingInput = event =>{
        setInput(event.target.value);
    }
    return(
        <div style={{
            borderWidth:'1px',
            borderColor: 'black'
        }}>
            <div className={classes.messenger}>
                {props.messages.map(message=>{
                    return (
                        <Message key={message._id}>
                            <p style={{fontWeight: 'bold', display: 'inline'}}>{message.person.name}:</p> {message.message}
                        </Message>
                    )
                })}
            </div>
                <Form className={classes.form} onSubmit={submitMessage}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Enter Some text" className={classes.input} name="textInput" value={input} onChange={handlingInput}/>
                    </Form.Group>
                </Form>
        </div>

    )
};
const mapStateToProps = state =>{
    return {
        personId: state.personId,
        messages: state.messages
    }
};

const mapDispatchToProps = dispatch=>{
    return {
        setMessages: (messages)=>dispatch(actions.setMessages(messages)),
        addMessage: (data)=>dispatch(actions.addMessage(data))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Messenger);