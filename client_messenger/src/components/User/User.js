import React from 'react';
import classes from './User.module.css';

const user = props=>{
    return(
        <p className={classes.user}>
            {props.children}
        </p>
    )
}; 

export default user;