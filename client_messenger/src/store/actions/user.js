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

export const addMessage = (data) => {
    return {
        type: actionTypes.ADD_MESSAGE,
        message: data
    }
}

export const addMe = (id) =>{
    return {
        type: actionTypes.ADD_ME,
        id: id
    }
}