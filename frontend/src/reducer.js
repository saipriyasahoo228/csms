// src/redux/reducer.js
import { SET_ROLE } from './store';

 const initialState = {
   sidebarShow: true,
   theme: 'light',
   role: '', // Default role, change as per your logic
   
 };
 console.log(SET_ROLE);

 const changeState = (state = initialState, action) => {
   switch (action.type) {
     case SET_ROLE:
       return { ...state, role: action.payload };
     case 'set':
      return { ...state, ...action.rest };
       default:
       return state;
  }
 };

 export default changeState;

