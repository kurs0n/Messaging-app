import React from 'react';
import Message from '../Message/Message';
import classes from './Messenger.module.css';
import {Form} from 'react-bootstrap'; 

const messenger = props =>{
    return(
        <div style={{
            borderWidth:'1px',
            borderColor: 'black'
        }}>
            <div className={classes.messenger}>
                {props.messages.map(message=>{
                    return (
                        <Message key={message._id}>
                            {message.message}
                        </Message>
                    )
                })}
            </div>
                <Form className={classes.form} onSubmit={(event)=>{
                            event.preventDefault();
                            console.log('message');
                        }}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Enter Some text" className={classes.input} name="textInput" />
                    </Form.Group>
                </Form>
        </div>

    )
};

export default messenger;