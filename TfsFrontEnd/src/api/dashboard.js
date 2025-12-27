import axios from 'axios';
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentFashionIcon = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_BASE_URL}/api/fashion-icon/current`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};