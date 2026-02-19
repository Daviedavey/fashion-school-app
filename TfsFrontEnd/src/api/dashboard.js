import axios from 'axios';
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get an authenticated axios instance
const getAuthenticatedApi = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Function for the student dashboard
export const getCurrentFashionIcon = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_BASE_URL}/api/fashion-icon/current`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Function for the teacher 
export const updateFashionIcon = async (name, description, image) => {
  const formData = new FormData();
  
  formData.append('name', name);
  formData.append('description', description);
  formData.append('image', {
    uri: image.uri,
    type: image.type,
    name: image.fileName,
  });

  try {
    const api = await getAuthenticatedApi();
    const response = await api.post('/api/fashion-icon', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating fashion icon:', error.response?.data || error.message);
    throw error;
  }
};