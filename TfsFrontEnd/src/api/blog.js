import axios from 'axios';
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A helper function to create an axios instance with the auth token
const getAuthenticatedApi = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
};

// The function to delete a blog post
export const deletePost = async (postId) => {
  try {
    const api = await getAuthenticatedApi();
    // The endpoint is DELETE /api/blog/{id}
    const response = await api.delete(`/api/blog/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error.response?.data || error.message);
    // Re-throw the error so the component can handle it (e.g., show an alert)
    throw error;
  }
};

// You can add other blog-related API calls here in the future
// export const getPosts = async () => { ... }

export const createPost = async (text, image) => {
  // 'image' will be an object from react-native-image-picker
  // It contains info like uri, type, and fileName

  const formData = new FormData();
  
  // 1. Append the text part
  formData.append('text', text);

  // 2. Append the image part
  // The backend expects a field named "image"
  formData.append('image', {
    uri: image.uri,
    type: image.type,
    name: image.fileName,
  });

  try {
    const api = await getAuthenticatedApi();
    
    // For multipart/form-data, we need to set the header explicitly
    const response = await api.post('/api/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating post:', error.response?.data || error.message);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    // This endpoint is public, so we don't need an authenticated instance of axios.
    // We can just call it directly.
    const response = await axios.get(`${API_BASE_URL}/api/blog`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error.response?.data || error.message);
    // Re-throw the error so the component can handle it.
    throw error;
  }
};