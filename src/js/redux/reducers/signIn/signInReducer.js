import {CHANGE_EMAIL_VALUE, CHANGE_PASSWORD_VALUE} from "../../../constants/signIn";

const defaultState = {
    email: "",
    password: ""
};

const signInReducer = (state=defaultState, action) => {
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
        default:
            return state;
    }
};

export default signInReducer;
