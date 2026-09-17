// src/screens/LoginScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { TextInput, Text, HelperText } from 'react-native-paper';
import axios from 'axios';
import { login } from '../api/auth';
import { jwtDecode } from 'jwt-decode';
import { theme } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await login(username.trim(), password);
      if (!response?.data?.token) {
        throw new Error('Invalid response from server');
      }
      const userData = response.data;
      const isTeacherFlag = userData.role === 'TEACHER';
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      await onLoginSuccess(userData.token, isTeacherFlag);
      
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 1. TOP LOGO */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.jpg')}
              style={styles.logo}
            />
          </View>

          {/* 2. EDGE-TO-EDGE FULL-BLEED ARTWORK */}
          <Image
            source={require('../assets/images/login-illustration.jpg')}
            style={styles.illustration}
          />

          {/* 3. FORM & BUTTONS (PADDED) */}
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

            {/* Custom Hanger-Arrow Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.primary} size="small" />
              ) : (
                <Image
                  source={require('../assets/images/arrow.jpg')}
                  style={styles.arrowImage}
                />
              )}
            </TouchableOpacity>

            {/* Footer Links */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerText}>
                  Don't have an account? <Text style={{ fontWeight: 'bold' }}>Register</Text>
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.footerSubText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
  },
  // 1. ELEGANT TOP SPACING (Clears Dynamic Island / Notch cleanly)
  logoContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 62 : 32, // More breathing room from the top
    paddingBottom: 14,
    backgroundColor: '#fff',
  },
  logo: {
    width: 240,
    height: 48,
    resizeMode: 'contain',
  },
  // 2. BALANCED FULL-BLEED ARTWORK
  illustration: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.05, // Slightly refined height for perfect screen balance
    resizeMode: 'cover',
  },
  // 3. TIGHT, COHESIVE FORM SPACING
  formContainer: {
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: 'transparent',
    marginVertical: 6, // Clean, even spacing between username and password
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 4,
  },
  loginButton: {
    alignSelf: 'center',
    marginTop: 22,
    marginBottom: 8, 
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  arrowImage: {
    width: 90,
    height: 36,
    resizeMode: 'contain',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginVertical: 4,
  },
  footerSubText: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },
});

export default LoginScreen;