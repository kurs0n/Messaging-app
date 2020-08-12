import React from 'react';
import Navigation from '../Navigation/Navigation';

const about = props =>{
    return (
        <>
        <Navigation about history={props.history}/>
        <h1>
            About me
        </h1>
        </>
    )
};

export default about;