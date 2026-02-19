import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { updateFashionIcon } from '../api/dashboard';

const UpdateFashionIconScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Could not select image.');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    if (!name || !description || !image) {
      Alert.alert('Incomplete Form', 'Please fill all fields and select an image.');
      return;
    }
    setLoading(true);
    try {
      await updateFashionIcon(name, description, image);
      setLoading(false);
      Alert.alert(
        'Success!',
        'The Fashion Icon of the Week has been updated.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Upload Failed', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Fashion Icon</Text>
      <Text style={styles.subtitle}>Upload a single composite image for the student dashboard.</Text>

      <View style={styles.imagePickerContainer}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholderText}>Select an image</Text>
        )}
        <Button icon="camera" mode="outlined" onPress={handleChoosePhoto} style={styles.button}>
          Choose Photo
        </Button>
      </View>

      <TextInput
        label="Icon's Name (e.g., Naomi Campbell)"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.textInput}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.textInput}
      />

      {loading ? (
        <ActivityIndicator size="large" style={styles.button} />
      ) : (
        <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={loading}>
          Update Icon
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  imagePickerContainer: { alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed', borderRadius: 8, padding: 20 },
  imagePreview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 15, resizeMode: 'contain' },
  placeholderText: { color: '#888', marginBottom: 15 },
  textInput: { marginBottom: 20 },
  button: { marginTop: 10, paddingVertical: 5 },
});

export default UpdateFashionIconScreen;