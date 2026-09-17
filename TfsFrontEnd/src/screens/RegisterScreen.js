// src/screens/RegisterScreen.js
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { TextInput, HelperText, Switch, Text, ProgressBar, IconButton } from 'react-native-paper';
import Dropdown from 'react-native-paper-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { register } from '../api/auth';
import { getGroups } from '../api/groups';
import { theme } from '../theme/theme';

const TOTAL_STEPS = 4;

const RegisterScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    confirmEmail: '',
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
        if (isMounted) console.error("Failed to load groups:", error);
      } finally {
        if (isMounted) setGroupsLoading(false);
      }
    };
    fetchGroups();
    return () => { isMounted = false; };
  }, []);

  // Validation Engine
  const validateField = useCallback((name, value, currentPassword, currentEmail) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'First name is required';
        break;
      case 'surname':
        if (!value.trim()) error = 'Surname is required';
        break;
      case 'username':
        if (!value.trim()) error = 'Username is required';
        else if (value.trim().length < 3) error = 'Must be at least 3 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(value.trim())) error = 'Invalid email format';
        break;
      case 'confirmEmail':
        if (!value.trim()) error = 'Please confirm your email';
        else if (currentEmail && value.trim().toLowerCase() !== currentEmail.trim().toLowerCase()) {
          error = 'Email addresses do not match';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else {
          let reqs = [];
          if (value.length < 6) reqs.push('6+ chars');
          if (!/[A-Z]/.test(value)) reqs.push('1 uppercase');
          if (!/\d/.test(value)) reqs.push('1 number');
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) reqs.push('1 symbol');
          if (reqs.length > 0) error = `Requires: ${reqs.join(', ')}`;
        }
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (currentPassword && value !== currentPassword) error = 'Passwords do not match';
        break;
      case 'teacherCode':
        if (isTeacher && !value.trim()) error = 'Teacher Access Code is required';
        break;
      case 'groupId':
        if (!isTeacher && !value) error = 'Please select your student group';
        break;
    }
    return error;
  }, [isTeacher]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(
      name, 
      value, 
      name === 'confirmPassword' ? formData.password : undefined,
      name === 'confirmEmail' ? formData.email : undefined
    );
    setErrors(prev => ({ ...prev, [name]: error }));

    if (name === 'password' && formData.confirmPassword) {
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, value);
      setErrors(prev => ({ ...prev, confirmPassword: confirmErr }));
    }
    if (name === 'email' && formData.confirmEmail) {
      const confirmEmailErr = validateField('confirmEmail', formData.confirmEmail, undefined, value);
      setErrors(prev => ({ ...prev, confirmEmail: confirmEmailErr }));
    }
  };

  const handleNextStep = () => {
    const stepErrors = {};
    let isStepValid = true;

    if (currentStep === 1) {
      const nameErr = validateField('name', formData.name);
      const surnameErr = validateField('surname', formData.surname);
      if (nameErr) { stepErrors.name = nameErr; isStepValid = false; }
      if (surnameErr) { stepErrors.surname = surnameErr; isStepValid = false; }
    } else if (currentStep === 2) {
      const usernameErr = validateField('username', formData.username);
      const emailErr = validateField('email', formData.email);
      const confirmEmailErr = validateField('confirmEmail', formData.confirmEmail, undefined, formData.email);
      if (usernameErr) { stepErrors.username = usernameErr; isStepValid = false; }
      if (emailErr) { stepErrors.email = emailErr; isStepValid = false; }
      if (confirmEmailErr) { stepErrors.confirmEmail = confirmEmailErr; isStepValid = false; }
    } else if (currentStep === 3) {
      const passwordErr = validateField('password', formData.password);
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, formData.password);
      if (passwordErr) { stepErrors.password = passwordErr; isStepValid = false; }
      if (confirmErr) { stepErrors.confirmPassword = confirmErr; isStepValid = false; }
    }

    setErrors(prev => ({ ...prev, ...stepErrors }));

    if (isStepValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSubmit = async () => {
    const finalErrors = {};
    let isFinalValid = true;

    if (isTeacher) {
      if (!teacherCode.trim()) {
        finalErrors.teacherCode = 'Teacher Access Code is required.';
        isFinalValid = false;
      }
    } else {
      if (!groupId) {
        finalErrors.groupId = 'You must select a student group.';
        isFinalValid = false;
      }
    }

    setErrors(prev => ({ ...prev, ...finalErrors }));
    if (!isFinalValid) return;

    setLoading(true);
    try {
      await register(
        formData.username.trim(),
        formData.name.trim(),
        formData.surname.trim(),
        formData.email.trim(),
        formData.password,
        isTeacher ? null : groupId,
        isTeacher ? teacherCode.trim() : null
      );

      Alert.alert(
        'Registration Successful! 🎉',
        isTeacher ? 'Teacher account created! You can now log in.' : 'Student account created! You can now log in.',
        [{ text: 'Log In', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (typeof apiErrors === 'object' && !apiErrors.message) {
          setErrors(prev => ({ ...prev, ...apiErrors }));
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
      <View style={styles.screen}>
      {/* 1. Fixed Background that never distorts */}
      <ImageBackground
        source={require('../assets/images/login-illustration.jpg')}
        style={StyleSheet.absoluteFillObject}
        blurRadius={12}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFillObject, styles.overlay]} />

      {/* 2. Top Header & Progress Bar */}
      <View style={styles.headerBar}>
        <IconButton icon="arrow-left" size={24} iconColor="#1A1A1A" onPress={handlePrevStep} />
        <Text style={styles.stepIndicator}>Step {currentStep} of {TOTAL_STEPS}</Text>
        <View style={{ width: 48 }} />
      </View>

      <ProgressBar
        progress={currentStep / TOTAL_STEPS}
        color={theme.colors.primary}
        style={styles.progressBar}
      />

      {/* 3. Smooth Keyboard Handler */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
            <View style={styles.frostedCard}>
              {/* ================= STEP 1: IDENTITY ================= */}
              {currentStep === 1 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepTitle}>Welcome! 👋🏼</Text>
                  <Text style={styles.stepSubtitle}>What is your name?</Text>

                  <TextInput
                    label="First Name"
                    value={formData.name}
                    onChangeText={text => handleChange('name', text)}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.name}
                    autoFocus
                  />
                  <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>

                  <TextInput
                    label="Surname"
                    value={formData.surname}
                    onChangeText={text => handleChange('surname', text)}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.surname}
                  />
                  <HelperText type="error" visible={!!errors.surname}>{errors.surname}</HelperText>
                </View>
              )}

              {/* ================= STEP 2: CREDENTIALS & EMAIL CONFIRM ================= */}
              {currentStep === 2 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepTitle}>Account Setup 📬</Text>
                  <Text style={styles.stepSubtitle}>Create your username & email</Text>

                  <TextInput
                    label="Username"
                    value={formData.username}
                    onChangeText={text => handleChange('username', text)}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.username}
                    autoCapitalize="none"
                    autoFocus
                  />
                  <HelperText type="error" visible={!!errors.username}>{errors.username}</HelperText>

                  <TextInput
                    label="Email Address"
                    value={formData.email}
                    onChangeText={text => handleChange('email', text)}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

                  {/* NO COPY/PASTE ALLOWED */}
                  <TextInput
                    label="Confirm Email Address"
                    value={formData.confirmEmail}
                    onChangeText={text => handleChange('confirmEmail', text)}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.confirmEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    contextMenuHidden={true}
                    selectTextOnFocus={false}
                  />
                  <HelperText type="error" visible={!!errors.confirmEmail}>{errors.confirmEmail}</HelperText>
                </View>
              )}

              {/* ================= STEP 3: SECURITY ================= */}
              {currentStep === 3 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepTitle}>Security 🔒</Text>
                  <Text style={styles.stepSubtitle}>Create a strong password</Text>

                  {/* NO COPY/PASTE ALLOWED */}
                  <TextInput
                    label="Password"
                    value={formData.password}
                    onChangeText={text => handleChange('password', text)}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    error={!!errors.password}
                    autoFocus
                    contextMenuHidden={true}
                    selectTextOnFocus={false}
                  />
                  <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>

                  {/* NO COPY/PASTE ALLOWED */}
                  <TextInput
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChangeText={text => handleChange('confirmPassword', text)}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    error={!!errors.confirmPassword}
                    contextMenuHidden={true}
                    selectTextOnFocus={false}
                  />
                  <HelperText type="error" visible={!!errors.confirmPassword}>{errors.confirmPassword}</HelperText>
                </View>
              )}

              {/* ================= STEP 4: ROLE & GROUP ================= */}
              {currentStep === 4 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepTitle}>Almost Done! 🎨</Text>
                  <Text style={styles.stepSubtitle}>Select your class or role</Text>

                  <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Registering as a Teacher?</Text>
                    <Switch
                      value={isTeacher}
                      onValueChange={val => {
                        setIsTeacher(val);
                        setErrors(prev => ({ ...prev, teacherCode: '', groupId: '' }));
                      }}
                      color={theme.colors.primary}
                    />
                  </View>

                  {isTeacher ? (
                    <View style={{ marginTop: 10 }}>
                      <TextInput
                        label="Teacher Passcode"
                        value={teacherCode}
                        onChangeText={text => {
                          setTeacherCode(text);
                          setErrors(prev => ({ ...prev, teacherCode: '' }));
                        }}
                        mode="outlined"
                        secureTextEntry
                        error={!!errors.teacherCode}
                        placeholder="Enter school access code"
                        autoFocus
                      />
                      <HelperText type="error" visible={!!errors.teacherCode}>{errors.teacherCode}</HelperText>
                    </View>
                  ) : (
                    <View style={{ marginTop: 10 }}>
                      {groupsLoading ? (
                        <ActivityIndicator animating style={{ marginVertical: 20 }} />
                      ) : groups.length > 0 ? (
                        <>
                          <Dropdown
                            label="Select your Student Group"
                            mode="outlined"
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
                    </View>
                  )}
                </View>
              )}

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={currentStep < TOTAL_STEPS ? handleNextStep : handleSubmit}
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

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.loginLink}
              >
                <Text style={styles.loginLinkText}>
                  Have an account? <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(248, 246, 244, 0.72)',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingHorizontal: 8,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 24 : 16, // Stable top anchoring (no center jitter!)
    paddingBottom: Platform.OS === 'android' ? 40 : 20,
  },
  frostedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  stepContainer: {
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  actionContainer: {
    marginTop: 0,
    alignItems: 'center', // Centers both the arrow and text
  },
  arrowButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0, // Gives space between the arrow and the text below
  },
  arrowImage: {
    width: 100,
    height: 36,
    resizeMode: 'contain',
  },
  loginLink: {
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
  },
  errorText: {
    color: '#B71C1C',
    textAlign: 'center',
  },
});

export default RegisterScreen;