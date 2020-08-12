import React from 'react';
import Navigation from '../../components/Navigation/Navigation';

const panel = props=>{
    return (
        <>
            <Navigation home history={props.history}/>
            <h1>Panel</h1>
        </>
    )
};

export default panel;