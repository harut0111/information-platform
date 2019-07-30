import { CHANGE_EMAIL_VALUE, CHANGE_PASSWORD_VALUE, SHOW_PASSWORD_VALUE} from "../../../constants/signIn";

export const setEmailValue = email => {
    return {
        type: CHANGE_EMAIL_VALUE,
        payload: email
    }
}

export const setPasswordValue = password => {
    return {
        type: CHANGE_PASSWORD_VALUE,
        payload: password
    }
}

export const handleClickShowPassword = value => {
    return {
        type: SHOW_PASSWORD_VALUE,
        payload: value
    }
};



