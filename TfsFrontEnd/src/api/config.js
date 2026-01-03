import { Platform } from 'react-native';

// Define the base URLs for each platform
const IOS_BASE_URL = 'http://localhost:8080';
const ANDROID_BASE_URL = 'http://10.0.2.2:8080';

// Use React Native's Platform module to select the correct URL
export const API_BASE_URL = Platform.OS === 'ios' ? IOS_BASE_URL : ANDROID_BASE_URL;

// You can add a log to confirm which URL is being used
console.log(`API running on ${Platform.OS} with base URL: ${API_BASE_URL}`);