// src/screens/RegisterScreen.js
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Button, TextInput, HelperText, Switch } from 'react-native-paper';
import Dropdown from "react-native-paper-dropdown";
import { register } from '../api/auth';
import { getGroups } from '../api/groups'; 
import { theme } from '../theme/theme';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Role & Onboarding State
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherCode, setTeacherCode] = useState('');
  const [groupId, setGroupId] = useState(null);

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
        if (isMounted) {
          console.error("Failed to load groups in useEffect:", error);
        }
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
      case 'password': if (!value) { error = 'Password is required'; } else { let e = []; if (value.length < 6) e.push('at least 6 characters'); if (!/[A-Z]/.test(value)) e.push('one uppercase letter'); if (!/\d/.test(value)) e.push('one number'); if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) e.push('one special character'); if (e.length > 0) error = `Requires: ${e.join(', ')}`; } break;
      case 'confirmPassword': if (!value) error = 'Please confirm your password'; else if (currentPassword && value !== currentPassword) error = 'Passwords do not match'; break;
      case 'teacherCode': if (isTeacher && !value) error = 'Teacher Access Code is required'; break;
      case 'groupId': if (!isTeacher && !value) error = 'You must select a group.'; break;
    }
    return error;
  }, [isTeacher]);

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    const error = validateField(name, value, name === 'confirmPassword' ? formData.password : undefined);
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleTeacherCodeChange = (text) => {
    setTeacherCode(text);
    const error = validateField('teacherCode', text);
    setErrors(prev => ({ ...prev, teacherCode: error }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    let formIsValid = true;

    // Validate standard text fields
    Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key], formData.password);
        if (error) { newErrors[key] = error; formIsValid = false; }
    });

    // Validate Teacher Code vs Group ID based on role toggle
    if (isTeacher) {
      if (!teacherCode) {
        newErrors.teacherCode = 'Teacher Access Code is required.';
        formIsValid = false;
      }
    } else {
      if (!groupId) {
        newErrors.groupId = 'You must select a group.';
        formIsValid = false;
      }
    }

    setErrors(newErrors);
    if (!formIsValid) return;

    setLoading(true);
    try {
      await register(
        formData.username, 
        formData.name, 
        formData.surname, 
        formData.email, 
        formData.password, 
        isTeacher ? null : groupId, 
        isTeacher ? teacherCode : null
      );
      
      Alert.alert(
        'Registration Successful', 
        isTeacher ? 'Teacher account created! You can now log in.' : 'Student account created! You can now log in.', 
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (typeof apiErrors === 'object' && !apiErrors.message) {
          setErrors(prev => ({...prev, ...apiErrors}));
        } else if (apiErrors.message) { 
          Alert.alert('Registration Failed', apiErrors.message); 
        }
      } else { 
        Alert.alert('Error', 'Registration failed. Please check your connection.'); 
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
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

        {/* --- TEACHER / STUDENT ROLE TOGGLE --- */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Register as Teacher?</Text>
          <Switch
            value={isTeacher}
            onValueChange={(val) => {
              setIsTeacher(val);
              setErrors(prev => ({ ...prev, teacherCode: '', groupId: '' }));
            }}
            color={theme.colors.primary}
          />
        </View>

        {/* --- DYNAMIC SECTION BASED ON ROLE --- */}
        {isTeacher ? (
          <View style={styles.teacherCodeSection}>
            <TextInput
              label="Teacher Passcode"
              value={teacherCode}
              onChangeText={handleTeacherCodeChange}
              mode="outlined"
              secureTextEntry
              error={!!errors.teacherCode}
              placeholder="Enter school access code"
            />
            <HelperText type="error" visible={!!errors.teacherCode}>
              {errors.teacherCode}
            </HelperText>
          </View>
        ) : (
          <>
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
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Could not load Groups.</Text>
              </View>   
            )}
          </>
        )}
        
        <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>
          Register
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Login')} style={styles.secondaryButton}>
          Already have an account? Login
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  innerContainer: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  teacherCodeSection: {
    marginBottom: 10,
  },
  button: { marginTop: 20, paddingVertical: 5 },
  secondaryButton: { marginTop: 15 },
  errorContainer: { padding: 15, marginVertical: 10, backgroundColor: '#FFEBEE', borderRadius: 4 },
  errorText: { color: '#B71C1C', textAlign: 'center' },
});

export default RegisterScreen;