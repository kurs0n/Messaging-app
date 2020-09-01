import React from 'react';
import classes from './FriendsBar.module.css';
import Emoji from '../Emoji/Emoji';

const FriendsBar = props =>{
    return(
        <div className={classes.FriendsBar}>
            <h1 className={classes.h1}>{props.title}<Emoji symbol="🙋🏼‍♂️"/></h1>
            {props.children}
        </div>
    )
};

export default FriendsBar;