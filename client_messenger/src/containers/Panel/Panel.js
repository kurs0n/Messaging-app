import React,{useState} from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Users from '../Users/Users';
import Sidebar from '../../components/Sidebar/Sidebar';
import Messenger from '../Messenger/Messenger';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import classes from './Panel.module.css';


const Panel = props=>{
    return (
        <>
            <Button className={classes.Button} onClick={()=>{
                localStorage.removeItem('token');
                window.location.reload(false);
            }}>logout</Button>
            <Navigation home history={props.history}/>
            <Sidebar title="Friends">
                <Users/>
            </Sidebar>  
            <Messenger messages={props.messages}/>
        </>
    )
};

const mapStateToProps = state =>{
    return {
        messages: state.messages
    }
};

export default connect(mapStateToProps)(Panel);