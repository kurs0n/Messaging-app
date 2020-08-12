import React from 'react';
import Navigation from '../Navigation/Navigation';

const notFind = props=>{
    return (
        <>
        <Navigation history={props.history}/>
        <h1>Oooops... Don't find this site</h1>
        </>
    );
};

export default notFind;