import React from 'react';
import classes from './User.module.css';

const user = props=>{
    return(
        <p className={classes.user} onClick={props.click}>
            {props.children}
        </p>
    )
}; 

export default user;