import React, {useState} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Platform} from 'react-native';
import {Button, TextInput, Text, HelperText} from 'react-native-paper';
import axios from 'axios';
import {API_BASE_URL} from '../api/config';


const ForgotPasswordScreen = ({navigation}) => {
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

    const handleForgotPasswordScreen = async () => {
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                username,
                password
            });

            // Handle reset password 
            console.log('Reset Password Email successfully sent ', response.data);
            // and navigate to the home screen

        } catch (err) {
            console.log('Invalid Email', err.response?.data);
            setError(err.response?.data?.message || 'Reset failed. Please try again.');
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
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    autoCapitalize="none"
                />


                {error ? (
                    <HelperText type="error" visible={!!error}>
                        {error}
                    </HelperText>
                ) : null}

                <Button
                    mode="contained"
                    onPress={handleForgotPasswordScreen}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    Send Email
                </Button>

                <Button
                    mode="text"
                    onPress={() => navigation.navigate('VerifyEmail')}
                    style={styles.secondaryButton}
                >
                    Proceed
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

export default ForgotPasswordScreen;