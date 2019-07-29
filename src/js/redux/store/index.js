import { createStore } from "redux";
import signInReducer  from '../reducers/signIn/signInReducer';

const store = createStore(
    signInReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && 
    window.__REDUX_DEVTOOLS_EXTENSION__(),  
);

export default store;