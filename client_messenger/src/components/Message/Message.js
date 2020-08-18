import React from 'react';

const message = props =>{
    return(
        <div style={{marginTop: 15}}>
        {props.children}
        </div>
    )
}

export default message;