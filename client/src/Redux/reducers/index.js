import {combineReducers} from 'redux';

function authentication(state=false,action) {
    switch(action.type) {
        case 'LOGIN': return true;
        case 'LOGOUT': return false;
        default: return state;
    }
}

function userProfile(state={},action) {
    switch(action.type) {
        case 'ADD_USER': return action.user;
        case 'REMOVE_USER': return {};
        default: return state;
    }
}

export default combineReducers({authentication,userProfile});