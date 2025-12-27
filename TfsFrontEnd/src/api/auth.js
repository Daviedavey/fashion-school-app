import axios from 'axios';
import { API_BASE_URL } from './config';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isTeacher = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.role === 'TEACHER';
  } catch (e) {
    console.error('JWT decode error:', e)
    return false;
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); // Local expiration check first
  } catch {
    return false;
  }
};


export const register = async (username, name, surname, email, password, groupId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      username,
      name,
      surname,
      email,
      password,
      groupId,
    });
    return response;
  } catch (error) {
    // Re-throw the original, detailed error for the component to handle.
    console.error('API register call failed:', error.response?.status, error.response?.data);
    throw error;
  }
};

// api/auth.js
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username,
      password
    });
    // The only job of this function is to make the API call and return the response.
    // Let the component handle the logic of what to do with the response.
    return response; 
  } catch (error) {
    // This is the most important change. We are now re-throwing the
    // full, detailed error object that axios provides.
    // The component's catch block will now receive `error.response`.
    console.error('API login call failed:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const getUserRol = (token) => {
  const decoded = jwtDecode(token);
  return decoded.role; // Returns Teacher or Student
};

export const constisTeacher = (token) => {
  return getUserRol(token) === 'TEACHER';
};

export const logout = async () => {
  try {
    // We need to remove all the keys we set during login
    const keys = ['userToken', 'userRole', 'username', 'name'];
    await AsyncStorage.multiRemove(keys);
    
    // Optional: clear the axios default header it is set,
    // though it will be overwritten on the next login anyway.
     delete axios.defaults.headers.common['Authorization'];

    console.log('User data cleared from storage.');
  } catch (error) {
    console.error('Error clearing user data on logout:', error);
    // Even if there's an error, we should proceed with the logout UI change.
  }
};