import React from 'react';
import classes from './Sidebar.module.css';

const sidebar = props =>{
    return(
        <div className={classes.sidebar}>
            <h1 className={classes.h1}>{props.title}</h1>
            {props.children}
        </div>
    )
};

export default sidebar;