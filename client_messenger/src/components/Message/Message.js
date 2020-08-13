import React from 'react';

const message = props =>{
    return(
        <p>
            {props.children}
        </p>
    )
}

export default message;