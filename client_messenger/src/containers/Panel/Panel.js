import React,{useState} from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Users from '../Users/Users';
import Sidebar from '../../components/Sidebar/Sidebar';

const Panel = props=>{
    const [state,setState]= useState({
        showSidebar: false
    });

    return (
        <>
            <Navigation home history={props.history}/>
            <Sidebar title="Friends">
                <Users/>
            </Sidebar>
        </>
    )
};

export default Panel;