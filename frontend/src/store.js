import { legacy_createStore as createStore } from 'redux';

// Define action types
const SET_ROLE = 'SET_ROLE';
const SET_USER_INFO = 'SET_USER_INFO';

// Action creators
export const setRole = (role) => ({
  type: SET_ROLE,
  payload: role,
});
export const setUserInfo = (userInfo) => ({
  type: SET_USER_INFO,
  payload: userInfo,
});


const initialState = {
  sidebarShow: true,
  theme: 'light',
  role: '',
  userInfo: {
    whitelevel_id: '',
    company_id: '',
    company_name: '',
    role: '',
  },
};

const changeState = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      window.localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case SET_ROLE:
      window.localStorage.setItem("userRole", action.payload);
      return { ...state, role: action.payload };
    case 'set':
      return { ...state, ...action };
    default:
      return state;
  }
};


const store = createStore(changeState);
export default store;
