import * as actionTypes from '../actions/actionTypes';

export const setUser = (personId) =>{
    return {
        type: actionTypes.SET_USER_TO_SEND_MESSAGE,
        personId: personId
    }
}

export const setMessages = (messages) =>{
    return {
        type: actionTypes.SET_MESSAGES,
        messages: messages
    }
}