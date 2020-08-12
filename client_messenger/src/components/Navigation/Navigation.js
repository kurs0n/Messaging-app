import React from 'react';
import classes from './Navigation.module.css';

const navigationBar = props=>{
    const changeRoute = url =>{
        props.history.push(url);
    };

    return (
        <div className={classes.nav}>
            <p>
                Soon
            </p>
            {props.home ? <p className={classes.active}>Home</p> : 
            <p onClick={()=> changeRoute('/')}>
                Home
            </p> }
            {props.about ? <p className={classes.active}>About</p> :
            <p onClick={()=> changeRoute('/about')}>
                About
            </p>
            }
        </div>
    )
}; 

export default navigationBar;