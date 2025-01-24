// src/redux/actions.js
export const SET_ROLE = 'SET_ROLE';

export const setRole = (role) => ({
  type: SET_ROLE,
  payload: role,
});

