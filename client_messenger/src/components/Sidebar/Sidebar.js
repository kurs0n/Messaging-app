import React from 'react';
import classes from './Sidebar.module.css';
import Emoji from '../Emoji/Emoji';

const sidebar = props =>{
    return(
        <div className={classes.sidebar}>
            <h1 className={classes.h1}>{props.title}<Emoji symbol="🙋🏼‍♂️"/></h1>
            {props.children}
        </div>
    )
};

export default sidebar;