import { 
    CHANGE_EMAIL_VALUE, 
    CHANGE_PASSWORD_VALUE, 
    SHOW_PASSWORD_VALUE, 
    CHECK_AUTH } from "../../../constants/signIn";

const defaultState = {
    email: "",
    password: "",
    showPassword: false,
    signin: false, 
};

const signInReducer = (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_EMAIL_VALUE:
            return {
                ...state,
                email: action.payload
            }
        case CHANGE_PASSWORD_VALUE:
            return {
                ...state,
                password: action.payload
            }
        case SHOW_PASSWORD_VALUE:
            return {
                ...state,
                showPassword: action.payload
            }
        case CHECK_AUTH:
            return Object.assign({}, state, {
                signin: action.payload
            });
        default: 
            return state;
    }
};

export default signInReducer;
