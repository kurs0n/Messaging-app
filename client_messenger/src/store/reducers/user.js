import * as actionTypes from '../actions/actionTypes';

const INITIAL_STATE = {
    personId: '',
    messages: [],
    meId: ''
};

const setPerson = (state,action) =>{
    return {
        ...state,
        personId: action.personId
    }
}

const setMessages = (state,action)=>{
    return {
        ...state,
        messages: action.messages
    }
}

const addMessage = (state,action)=>{
    return {
        ...state,
        messages: [...state.messages,action.message]
    }
}

const addMe = (state,action)=>{ 
    return {
        ...state,
        meId: action.id
    }
}

const reducer = (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case actionTypes.SET_USER_TO_SEND_MESSAGE: {
            return setPerson(state,action);
        }
        case actionTypes.SET_MESSAGES: {
            return setMessages(state,action);
        }
        case actionTypes.ADD_MESSAGE: {
            return addMessage(state,action);
        }
        case actionTypes.ADD_ME: {
            return addMe(state,action);
        }
        default: {
            return state;
        }
    }
}

export default reducer;