import React,{useState, useEffect,useRef} from 'react';
import Message from '../../components/Message/Message';
import classes from './Messenger.module.css';
import Emoji from '../../components/Emoji/Emoji';
import {Form,Image} from 'react-bootstrap'; 
import axios from 'axios';
import {connect} from 'react-redux';
import openSocket from 'socket.io-client';
import {url} from '../../ApiUrl';
import * as actions from '../../store/actions/index';

const socket = openSocket(url);
const Messenger = props =>{
    const [input,setInput] = useState('');
    const messagesEndRef = useRef(null);
    const scrollToBottom = ()=>{
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    const submitMessage = event =>{
        event.preventDefault();
        if (input === '')
        {
            return null
        }
        axios.post(url+'/user/message',{
         id: props.personId,
         message: input 
        },{
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        })
        .then(response =>{
            props.addMessage(response.data);
            setInput('');
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
        socket.on('message',(data)=>{
                if(props.personId === data.person._id && data.personGetMessage.toString()===props.meId.toString())
                {
                props.addMessage(data);
                setInput('');
                }
        });
        return ()=>socket.off('message');
    },[props.personId,props]);

    useEffect(scrollToBottom,[props.messages]); // scroll if our messages are changed

    let messages = null;
    if (props.messages.length){
        messages= props.messages.map(message=>{
            return (
                <Message key={message._id}>
                    <p style={{fontWeight: 'bold', display: 'inline'}}>{message.person.name}:</p> {message.message}
                </Message>
            )
        })
    }
    else
    {
        messages = (<p>Type something !<Emoji symbol="✋"/></p>)
    }
    return(
        <div style={{
            borderWidth:'1px',
            borderColor: 'black'
        }}>
            <div className={classes.messenger}>
                {messages}
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
        messages: state.messages,
        meId: state.meId
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