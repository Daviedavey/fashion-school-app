import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Platform} from 'react-native';
import {Button, TextInput, Text, HelperText} from 'react-native-paper';
import axios from 'axios';
import { login } from '../api/auth';
import { jwtDecode } from 'jwt-decode';


let test;
const LoginScreen = ({navigation, onLoginSuccess}) => {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
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
        console.log(navigation.getState());


        try {

            const response = await login(username, password); // API call
            console.log('Login response:', response); 

            if (!response || !response.data || !response.data.token) {
            throw new Error('Invalid response from server');
             }

             const token = response.data.token;
             const userData = response.data;// The whole user data object from the response

             const isTeacherFlag = userData.role === 'TEACHER'; // role dertermination 
             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
             await onLoginSuccess(token, isTeacherFlag); // ✅ Notify App.js
             console.log('Login successful', userData);
             await AsyncStorage.setItem('userToken', userData.token);
             await AsyncStorage.setItem('userRole', userData.role); // Also store role separately
             await AsyncStorage.setItem('username', userData.username); // We store the username to check for post ownership.
             await AsyncStorage.setItem('name', userData.name);// Storing the name can be useful for display purposes later.  
             const decoded = jwtDecode(token);
             console.log('Token expires at:', new Date(decoded.exp * 1000));
             console.log('Current time:', new Date());
             // Debug storage contents
             console.log(await AsyncStorage.getAllKeys());
        } catch (err) {
  // =======================================================
  // ### THIS IS OUR DETAILED DEBUGGING LOG ###
  // =======================================================
  console.log("--- LOGIN ERROR CATCH BLOCK ---");
  
  if (err.response) {
    // This block runs for server responses (4xx, 5xx errors)
    console.log("STATUS CODE:", err.response.status);
    console.log("RESPONSE DATA:", JSON.stringify(err.response.data, null, 2));
    console.log("RESPONSE HEADERS:", JSON.stringify(err.response.headers, null, 2));

    // Your logic to set the error message
    const errorMessage = err.response.data?.error || err.response.data?.message || 'Invalid username or password.';
    setError(errorMessage);

  } else if (err.request) {
    // This block runs for network errors (no response)
    console.log("NETWORK ERROR - NO RESPONSE RECEIVED. Request object:", err.request);
    setError('Cannot connect to the server. Please check your network.');
  } else {
    // This block runs for other errors (e.g., setting up the request)
    console.log("CLIENT-SIDE ERROR:", err.message);
    setError('An unexpected error occurred. Please try again.');
  }
  console.log("-------------------------------");
  // =======================================================

} finally {
  setLoading(false);
}
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>The Fashion School</Text>

                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                    style={styles.input}
                    autoCapitalize="none"
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                />

                {error ? (
                    <HelperText type="error" visible={!!error}>
                        {error}
                    </HelperText>
                ) : null}

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    Login
                </Button>

                <Button
                    mode="text"
                    onPress={() => navigation.navigate('Register')}
                    style={styles.secondaryButton}
                >
                    Don't have an account? Register
                </Button>
                
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.secondaryButton}
                >
                    Forgot your Password? Reset Password
                </Button>

                <Button
    mode="outlined"
    onPress={async () => {
        await AsyncStorage.clear();
        Alert.alert("Success", "AsyncStorage has been cleared.");
    }}
    style={{ marginTop: 20, borderColor: 'red' }}
    textColor="red"
>
    (DEBUG) Clear All Storage
</Button>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
    },
    secondaryButton: {
        marginTop: 15,
    },
});

export default LoginScreen;