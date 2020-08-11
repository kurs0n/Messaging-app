import React from 'react';
import classes from './Navigation.module.css';

const navigationBar = props=>{
    return (
        <div className={classes.nav}>
            <p>
                Soon
            </p>
            {props.home ? <p className={classes.active}>Home</p> : 
            <p>
                Home
            </p> }
            <p>
                About
            </p>
        </div>
    )
}; 

export default navigationBar;