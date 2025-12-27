if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}

import {decode, encode} from 'base-64'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TeacherStack from './src/navigation/TeacherStack';
import StudentStack from './src/navigation/StudentStack';
import SplashScreen from './src/screens/SplashScreen';
import AuthStack from './src/navigation/AuthStack'; 
import { isTeacher } from './src/api/auth';
import { verifyToken } from './src/api/auth';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { logout } from './src/api/auth';

const RootStack = createStackNavigator(); 


const ionicons = (props) => (
  <MaterialCommunityIcons {...props} />
);

export default function App() {
  const [isTeacherUser, setIsTeacherUser] = useState(null); // Start as null (unknown)
  const [isLoading, setIsLoading] = useState(true); // Track initial check

  // Check authatication state on app load
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Verify token is still valid
        const isValid = verifyToken(token); 
      
        if (isValid) {
          const teacherFlag = isTeacher(token);
          setIsTeacherUser(teacherFlag);
        } else {
          await AsyncStorage.removeItem('userToken');
          setIsTeacherUser(null);
        }
      } else {
        setIsTeacherUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsTeacherUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  checkAuth();
}, []);

   const handleLoginSuccess = async (token, isTeacherFlag) => {
    await AsyncStorage.setItem('userToken', token);
    //axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsTeacherUser(isTeacherFlag);
  };

  const handleLogout = async () => {
    await logout(); // Call the function to clear storage
    setIsTeacherUser(null); // This will switch the navigator to AuthStack
  };


  if (isLoading) {
    return <SplashScreen />; // Show while checking token
  }

  return (
    <PaperProvider settings={{ icon: ionicons }}>
    <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isTeacherUser === null ? (
            <RootStack.Screen name="AuthStack">
              {/* Pass handleLoginSuccess to AuthStack */}
              {() => <AuthStack onLoginSuccess={handleLoginSuccess} />}
            </RootStack.Screen>
          ) : isTeacherUser ? (
            <RootStack.Screen name="TeacherStack">
              {/* ### PASS handleLogout to TeacherStack ### */}
              {() => <TeacherStack onLogout={handleLogout} />}
            </RootStack.Screen>
          ) : (
            <RootStack.Screen name="StudentStack">
              {/* ### PASS handleLogout to StudentStack ### */}
              {() => <StudentStack onLogout={handleLogout} />}
            </RootStack.Screen>
          )}
        </RootStack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}