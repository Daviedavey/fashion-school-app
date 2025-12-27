import axios from 'axios';
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthenticatedApi = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createAssignment = async (title, description,images, level) => {
  const formData = new FormData();

  // Append the text fields
  formData.append('title', title);
  formData.append('description', description);
  formData.append('level', level); 

  // Append each image to the form data.
  // The key "images" must be used for each file to be received as a list on the backend.
  images.forEach(image => {
    formData.append('images', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });
  });

  try {
    const api = await getAuthenticatedApi();
    const response = await api.post('/api/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error.response?.data || error.message);
    throw error;
  }
};

export const getAssignments = async () => {
  try {
    const api = await getAuthenticatedApi();
    // This GET request is authenticated, as per our SecurityConfig
    const response = await api.get('/api/assignments');
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error.response?.data || error.message);
    throw error;
  }
};