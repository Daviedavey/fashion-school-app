import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { createPost } from '../api/blog'; // Import our new API function

const BlogUploadScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // Will store the selected image object
  const [loading, setLoading] = useState(false);

  // Function to handle image selection
  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Could not select image. Please try again.');
      } else {
        // The response.assets array contains the selected image(s)
        if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          console.log('Selected Image:', selectedImage);
          setImage(selectedImage);
        }
      }
    });
  };

  // Function to handle the final submission
  const handleSubmit = async () => {
    // Basic validation
    if (!text || !image) {
      Alert.alert('Incomplete Post', 'Please add some text and select an image.');
      return;
    }

    setLoading(true);

    try {
      // Call the API function with the text and image data
      await createPost(text, image);
      
      setLoading(false);
      Alert.alert(
        'Success!',
        'Your blog post has been uploaded.',
        // Navigate back to the dashboard after the user presses OK
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Upload Failed', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Blog Post</Text>

      {/* Image Preview */}
      <View style={styles.imagePickerContainer}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}
        <Button
          icon="camera"
          mode="outlined"
          onPress={handleChoosePhoto}
          style={styles.button}
        >
          Choose Photo
        </Button>
      </View>

      {/* Text Input */}
      <TextInput
        label="What's on your mind?"
        value={text}
        onChangeText={setText}
        mode="outlined"
        multiline
        numberOfLines={6}
        style={styles.textInput}
      />

      {/* Submit Button */}
      {loading ? (
        <ActivityIndicator size="large" style={styles.button} />
      ) : (
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          disabled={loading}
        >
          Post
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  placeholderText: {
    color: '#888',
    marginBottom: 15,
  },
  textInput: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default BlogUploadScreen;