import React,{useEffect,useState} from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Users from '../Users/Users';
import FriendsBar from '../../components/FriendsBar/FriendsBar';
import Emoji from '../../components/Emoji/Emoji';
import Messenger from '../Messenger/Messenger';
import InformationUser from '../../components/InformationUser/InformationUser';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import classes from './Panel.module.css';
import axios from 'axios';
import {url} from '../../ApiUrl';
import * as actions from '../../store/actions/index';


const Panel = props=>{
    const [state,setState] = useState({
        name: '',
        surname: ''
    }); 
    useEffect(()=>{
        axios.get(url+'/user/me',{
            headers:{
                'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        })
        .then(response=>{
            props.setMe(response.data.id);
            setState({
                name: response.data.name,
                surname: response.data.surname
            })
        })
    },[props])
    return (
        <>
            <div className={classes.container}>
                <Button variant="dark" className={classes.Button} onClick={()=>{
                    localStorage.removeItem('token');
                    window.location.reload(false);
                }}>logout</Button>
            </div>
            <Navigation home history={props.history}/>
            <FriendsBar title="Friends">
                <Users/>
            </FriendsBar>  
            <InformationUser name={state.name} surname={state.surname}/>
        {props.personId&&props.meId ? <Messenger messages={props.messages}/> : <h1 className={classes.h1}>Choose friend or Add him <Emoji symbol="🧔"/></h1> }
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