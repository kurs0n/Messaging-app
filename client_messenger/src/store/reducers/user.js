import * as actionTypes from '../actions/actionTypes';

const INITIAL_STATE = {
    personId: '',
    messages: []
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

const reducer = (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case actionTypes.SET_USER_TO_SEND_MESSAGE: {
            return setPerson(state,action);
        }
        case actionTypes.SET_MESSAGES: {
            return setMessages(state,action);
        }
        case actionTypes.ADD_MESSAGE: {
            return addMessage(state,action)
        }
        default: {
            return state;
        }
    }
}

export default reducer;