import React,{useEffect} from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Users from '../Users/Users';
import Sidebar from '../../components/Sidebar/Sidebar';
import Messenger from '../Messenger/Messenger';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import classes from './Panel.module.css';
import axios from 'axios';
import * as actions from '../../store/actions/index';


const Panel = props=>{
    useEffect(()=>{
        axios.get('http://localhost:3000/user/me',{
            headers:{
                'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        })
        .then(response=>{
            props.setMe(response.data.id);
        })
    },[])
    return (
        <>
            <Button variant="dark" className={classes.Button} onClick={()=>{
                localStorage.removeItem('token');
                window.location.reload(false);
            }}>logout</Button>
            <Navigation home history={props.history}/>
            <Sidebar title="Friends  🙋🏼‍♂️ ">
                <Users/>
            </Sidebar>  
        {props.personId&&props.meId ? <Messenger messages={props.messages}/> : <h1 className={classes.h1}>Choose friend or Add him  🧔 </h1> }

        </>
    )
};

const mapStateToProps = state =>{
    return {
        messages: state.messages,
        personId: state.personId,
        meId: state.meId
    }
};

const mapDispatchToProps = dispatch=>{
    return {
        setMe: (id)=>dispatch(actions.addMe(id))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Panel);