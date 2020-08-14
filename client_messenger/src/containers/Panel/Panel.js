import React,{useState} from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Users from '../Users/Users';
import Sidebar from '../../components/Sidebar/Sidebar';
import Messenger from '../../components/Messenger/Messenger';
import {connect} from 'react-redux';


const Panel = props=>{
    return (
        <>
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