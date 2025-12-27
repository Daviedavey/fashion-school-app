// src/api/groups.js
import axios from 'axios';
import { API_BASE_URL } from './config';

export const getGroups = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/groups`);
    console.log('Successfully fetched groups:', response.data);
     console.log('RAW SERVER RESPONSE:', response);
    return response.data;
  } catch (error) {
    
    // DETAILED ERROR LOGGING ###
    console.log("--- FAILED TO FETCH GROUPS (API aLEVEL) ---");
    if (error.response) {
      console.log("Status Code:", error.response.status);
      console.log("Response Data:", JSON.stringify(error.response.data));
    } else if (error.request) {
      console.log("No response received. Request details:", error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
    console.log("-----------------------------------------");
    
    throw error; // Re-throw so the component can still handle it (e.g., show the Alert)
  }
};