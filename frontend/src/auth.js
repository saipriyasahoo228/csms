import axios from 'axios';
import {API_BASE_URL} from "src/constants";
import { jwtDecode } from "jwt-decode";
import api from "src/api";

const storeToken = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

};

const getToken = () => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
});

const removeToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const removeUserLocalStorage = () => {
  localStorage.removeItem('userRole');
  localStorage.removeItem('whiteLevelId');
}

const login = async (mobile_number, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/token/`,
      {
        'mobile_number': mobile_number,
        'password': password
      }
    );
    const { access, refresh } = response.data;
    storeToken(access, refresh);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () =>{
  removeToken();
  removeUserLocalStorage();
  window.location = "/";
}

const getNewAccessToken = async () => {
  try {
    const { refreshToken } = getToken();
    if(! refreshToken){
      logout();
    }
    const decodedRefreshToken = jwtDecode(refreshToken);
    if (decodedRefreshToken.exp < Date.now() / 1000) {
      logout();
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/token/refresh/`,
      { refresh: refreshToken }
    );
    const accessToken = response.data.access;
    storeToken(accessToken, refreshToken); // Store the same refresh token
    return accessToken;
  } catch (error) {
    console.error('Refresh token error:', error);
    // Handle token refresh failure, e.g., redirect to login
    logout();
  }
};

const getLoggedInUserInfo = async () => {
  try {
    const response = await api.get(
      `${API_BASE_URL}/authenticated/`
    );
    return response.data;
  } catch (error) {
    if (error.isAxiosError && error.response) {
      // Handle API response errors
      console.error('Error in getting user info.');
    } else {
      // Handle network errors
      console.error('Network error:', error);
    }
    throw error;
  }
};

const isUserAuthenticated = async () => {
  const response = await getLoggedInUserInfo();
  return response.data.authenticated;
}

export {
  login,
  logout,
  getNewAccessToken,
  getToken,
  removeToken,
  storeToken,
  getLoggedInUserInfo,
  isUserAuthenticated,
};
