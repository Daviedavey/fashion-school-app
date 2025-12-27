export const API_BASE_URL = 'http://localhost:8080';

// --- AFTER (The fix) ---
import { Platform } from 'react-native';

// Determine the base URL based on the platform
// export const API_BASE_URL = Platform.OS === 'android' 
//  ? 'http://10.0.2.2:8080' 
//  : 'http://localhost:8080'; // 'localhost' works for iOS simulator

