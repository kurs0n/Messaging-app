import React,{useState, useEffect,useRef} from 'react';
import Message from '../../components/Message/Message';
import classes from './Messenger.module.css';
import {Form,Image} from 'react-bootstrap'; 
import axios from 'axios';
import {connect} from 'react-redux';
import openSocket from 'socket.io-client';
import * as actions from '../../store/actions/index';

const socket = openSocket('http://localhost:3000/');
const Messenger = props =>{
    const [input,setInput] = useState('');
    const messagesEndRef = useRef(null);
    const scrollToBottom = ()=>{ // scroll
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    const submitMessage = event =>{
        event.preventDefault();
        if (input === '')
        {
            return null
        }
        axios.post('http://localhost:3000/user/message',{
         id: props.id,
         message: input 
        },{
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        })
        .then(response =>{
            axios.get('http://localhost:3000/user/conversation',{headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'person2': props.id 
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

    useEffect(()=>{
        socket.emit('connect');
        socket.on('message',(data)=>{ //    IT WORKS !!!
            axios.get('http://localhost:3000/user/conversation',{headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'person2': data.person._id 
            }}).then(response=>{
                if(props.personId === data.person._id)
                {
                props.setMessages(response.data.messages);
                setInput('');
                }
            }).catch(err=>{
                console.log(err);
            })
            /*if(props.id===data.person._id && data.personGetMessage.toString()===props.meId.toString())
            {
            props.addMessage(data);
            }*/
        });
        return ()=>socket.off('message');
    },[props.personId]);

    useEffect(scrollToBottom,[props.messages]); // scroll if our messages are changed

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
                <div ref={messagesEndRef}/> {
                    //smooth
                }
            </div>
                <Form className={props.personId ? classes.form : classes.formunactive} onSubmit={submitMessage}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Enter Some text" className={classes.input} name="textInput" value={input} onChange={handlingInput}/>
                    </Form.Group>
                </Form>
                <Image src={require('../../images/send.png')} className={classes.image} onClick={submitMessage}/>
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
        addMessage: (data)=>dispatch(actions.addMessage(data)),
        setPerson: (id)=>dispatch(actions.setUser(id))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Messenger);