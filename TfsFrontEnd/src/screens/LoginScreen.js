import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Text } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import axios from 'axios';
import { login } from '../api/auth';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/theme';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await login(username, password);
      if (!response?.data?.token) {
        throw new Error('Invalid response from server');
      }
      const userData = response.data;
      const isTeacherFlag = userData.role === 'TEACHER';
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      await onLoginSuccess(userData.token, isTeacherFlag);
      console.log('Login successful', userData);
      await AsyncStorage.setItem('userToken', userData.token);
      await AsyncStorage.setItem('userRole', userData.role);
      await AsyncStorage.setItem('username', userData.username);
      await AsyncStorage.setItem('name', userData.name);
      const decoded = jwtDecode(userData.token);
      console.log('Token expires at:', new Date(decoded.exp * 1000));
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Invalid username or password.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

   return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Main content area that expands to fill space */}
        <View style={styles.mainContent}>
          <Image
            source={require('../assets/images/logo.jpg')}
            style={styles.logo}
          />
          <Image
            source={require('../assets/images/login-illustration.jpg')}
            style={styles.illustration}
          />
        </View>

        {/* Form area that is pushed down by the main content */}
        <View style={styles.formContainer}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor={theme.colors.primary}
            theme={{ colors: { background: 'transparent' } }}
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor={theme.colors.primary}
            theme={{ colors: { background: 'transparent' } }}
          />

          {error ? (
            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          ) : null}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Image source={require('../assets/images/arrow.jpg')} style={styles.loginButtonImage} />
            )}
          </TouchableOpacity>
        </View>

        {/* Footer area at the very bottom */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>Don't have an account? Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.footerText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'space-between', // Distributes children vertically
  },
  mainContent: {
    alignItems: 'center',
    paddingTop: 50, // Space from the top
  },
  logo: {
    width: 250,
    height: 80,
    resizeMode: 'contain',
  },
  illustration: {
    width: '100%',
    height: 480, // fixed height for the main image
    resizeMode: 'contain',
  },
  formContainer: {
    width: '85%',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  loginButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 10,
  },
    loginButtonImage: {
     width: 180,  
     height: 35, 
     resizeMode: 'contain', // Ensures the image scales nicely
     position: 'absolute',
     right: 90
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginVertical: 5,
  },
});

export default LoginScreen;