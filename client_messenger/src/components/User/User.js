import React from 'react';
import classes from './User.module.css';
import {connect} from 'react-redux';

const user = props=>{
    let user = (
        <p className={classes.user} onClick={props.click}>
            {props.children}
        </p>
    );
    if(props.id.toString()===props.personId) // if we have user props.id
    {
        user = (
            <p className={classes.active} onClick={props.click}>
            {props.children}
        </p>
        )
    }   
    return(
        user
    )
}; 

const mapStateToProps = state=>{
    return {
        personId: state.personId
    }
};  

export default connect(mapStateToProps)(user);