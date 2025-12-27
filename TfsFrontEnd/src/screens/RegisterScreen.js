import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Button, TextInput, HelperText, Portal } from 'react-native-paper';
import Dropdown from "react-native-paper-dropdown";
import { register } from '../api/auth';
import { getGroups } from '../api/groups'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [groupId, setGroupId] = useState(null); // Separate state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getGroups();
        if (!isMounted) return;
        const formattedGroups = fetchedGroups.map(group => ({ label: group.name, value: group.id }));
        setGroups(formattedGroups);
        if (fetchedGroups.length > 0) {
          setGroupId(fetchedGroups[0].id);
        }
      } catch (error) {
        console.error("Failed to load groups in useEffect:", error);
      } finally {
        if (isMounted) {
          setGroupsLoading(false);
        }
      }
    };
    fetchGroups();
    return () => { isMounted = false; };
  }, []);

  const validateField = useCallback((name, value, currentPassword) => {
    let error = '';
    switch (name) {
      case 'username': if (!value) error = 'Username is required'; else if (value.length < 3) error = 'Username must be at least 3 characters'; break;
      case 'name': if (!value) error = 'Name is required'; break;
      case 'surname': if (!value) error = 'Surname is required'; break;
      case 'email': if (!value) error = 'Email is required'; else if (!/^\S+@\S+\.\S+$/.test(value)) error = 'Invalid email format'; break;
      case 'password': if (!value) { error = 'Password is required'; } else { let e = []; if (value.length < 6) e.push('6+ chars'); if (!/[A-Z]/.test(value)) e.push('1 uppercase'); if (!/\d/.test(value)) e.push('1 number'); if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) e.push('1 special'); if (e.length > 0) error = `Requires: ${e.join(', ')}`; } break;
      case 'confirmPassword': if (!value) error = 'Please confirm password'; else if (currentPassword && value !== currentPassword) error = 'Passwords do not match'; break;
      case 'groupId': if (!value) error = 'You must select a group.'; break;
    }
    return error;
  }, []);

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    const error = validateField(name, value, name === 'confirmPassword' ? formData.password : undefined);
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  useEffect(() => {
    if (groupId !== null) {
      const error = validateField('groupId', groupId);
      setErrors(prevErrors => ({ ...prevErrors, groupId: error }));
    }
  }, [groupId, validateField]);

  const handleSubmit = async () => {
    const newErrors = {};
    let formIsValid = true;
    Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key], formData.password);
        if (error) { newErrors[key] = error; formIsValid = false; }
    });
    if (!groupId) {
        newErrors.groupId = 'You must select a group.';
        formIsValid = false;
    }
    setErrors(newErrors);
    if (!formIsValid) return;

    setLoading(true);
    try {
      await register(formData.username, formData.name, formData.surname, formData.email, formData.password, groupId);
      Alert.alert('Registration Successful', 'You can now log in.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (error) {
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (typeof apiErrors === 'object' && !apiErrors.message) {
          setErrors(prev => ({...prev, ...apiErrors}));
        } else if (apiErrors.message) { Alert.alert('Registration Failed', apiErrors.message); }
      } else { Alert.alert('Error', 'Registration failed. Please try again.'); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput label="Username" value={formData.username} onChangeText={(text) => handleChange('username', text)} mode="outlined" error={!!errors.username} autoCapitalize="none"/>
        <HelperText type="error" visible={!!errors.username}>{errors.username}</HelperText>
        <TextInput label="Name" value={formData.name} onChangeText={(text) => handleChange('name', text)} mode="outlined" error={!!errors.name}/>
        <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>
        <TextInput label="Surname" value={formData.surname} onChangeText={(text) => handleChange('surname', text)} mode="outlined" error={!!errors.surname}/>
        <HelperText type="error" visible={!!errors.surname}>{errors.surname}</HelperText>
        <TextInput label="Email" value={formData.email} onChangeText={(text) => handleChange('email', text)} mode="outlined" keyboardType="email-address" autoCapitalize="none" error={!!errors.email}/>
        <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>
        <TextInput label="Password" value={formData.password} onChangeText={(text) => handleChange('password', text)} mode="outlined" secureTextEntry error={!!errors.password}/>
        <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>
        <TextInput label="Confirm Password" value={formData.confirmPassword} onChangeText={(text) => handleChange('confirmPassword', text)} mode="outlined" secureTextEntry error={!!errors.confirmPassword}/>
        <HelperText type="error" visible={!!errors.confirmPassword}>{errors.confirmPassword}</HelperText>

        {groupsLoading ? (
          <ActivityIndicator animating={true} style={{ marginVertical: 20 }} />
        ) : groups.length > 0 ? (
          <>
               <Dropdown
                label={"Select your Group"}
                mode={"outlined"}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                value={groupId}
                setValue={setGroupId}
                list={groups} 
                inputProps={{ error: !!errors.groupId }}
            />
            <HelperText type="error" visible={!!errors.groupId}>{errors.groupId}</HelperText>
          </>
        ) : (
          <View style={styles.errorContainer}><Text style={styles.errorText}>Could not load Groups.</Text></View>   
        )}
        
        <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>Register</Button>
        <Button mode="text" onPress={() => navigation.navigate('Login')} style={styles.secondaryButton}>Already have an account? Login</Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  innerContainer: { padding: 20, justifyContent: 'center', paddingBottom:200, },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  button: { marginTop: 20, paddingVertical: 5 },
  secondaryButton: { marginTop: 15 },
  errorContainer:{padding: 15, marginVertical: 10, backgroundColor: '#FFEBEE', borderRadius: 4 },
  errorText: { color: '#B71C1C', textAlign: 'center'},
  dropdownInput: { backgroundColor: 'transparent' },
});

export default RegisterScreen;