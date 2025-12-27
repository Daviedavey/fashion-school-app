// src/screens/UploadAssignmentsScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
// ### MODIFIED IMPORT: Added SegmentedButtons from react-native-paper ###
import { Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
// ### REMOVED IMPORT for the old library ###
// import SegmentedControlTab from 'react-native-segmented-control-tab'; 
import { createAssignment } from '../api/assignment';
import Icon from 'react-native-vector-icons/Ionicons';

const UploadAssignmentsScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  // ### MODIFIED STATE: Changed from index to the actual string value ###
  const [level, setLevel] = useState('BEGINNER'); 
  const [loading, setLoading] = useState(false);

  // Function to handle selecting multiple images (No changes needed here)
  const handleChoosePhotos = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 0 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
          setImages(prevImages => [...prevImages, ...response.assets]);
        }
      }
    );
  };
  
  // Function to remove a selected image from the preview (No changes needed here)
  const removeImage = (uriToRemove) => {
      setImages(prevImages => prevImages.filter(image => image.uri !== uriToRemove));
  }

  // ### MODIFIED/FIXED handleSubmit ###
  const handleSubmit = async () => {
    if (!title || !description || images.length === 0) {
      Alert.alert('Incomplete Assignment', 'Please provide a title, description, and at least one image.');
      return;
    }

    setLoading(true);

    try {
      // The API call is now simpler and correct. It passes the 'level' state directly.
      await createAssignment(title, description, images, level);
      setLoading(false);
      Alert.alert(
        'Success!',
        'The assignment has been created.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Creation Failed', 'Something went wrong. Please try again.');
    }
  };
  
  // renderImagePreview is unchanged
  const renderImagePreview = ({ item }) => (
      <View style={styles.previewImageContainer}>
          <Image source={{ uri: item.uri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(item.uri)}>
              <Icon name="close-circle" size={24} color="#D93B3B" />
          </TouchableOpacity>
      </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Assignment</Text>
      <TextInput label="Assignment Title" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
      <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" multiline numberOfLines={4} style={styles.input} />

      {/* ### REPLACED the old component with SegmentedButtons ### */}
      <Text style={styles.label}>Difficulty Level</Text>
      <SegmentedButtons
        value={level}
        onValueChange={setLevel}
        style={{ marginBottom: 15 }}
        buttons={[
          { value: 'BEGINNER', label: 'Beginner' },
          { value: 'ADVANCED', label: 'Advanced' },
          { value: 'EXPERT', label: 'Expert' },
        ]}
      />
      
      {/* Image Picker and Preview section is unchanged */}
       <View style={styles.imageSection}>
          <Button icon="images" mode="outlined" onPress={handleChoosePhotos} style={styles.input}>
            Add Images
          </Button>
          {images.length > 0 ? (
              <FlatList
                  data={images}
                  renderItem={renderImagePreview}
                  keyExtractor={item => item.uri}
                  horizontal={true}
                  style={styles.previewList}
                  showsHorizontalScrollIndicator={false}
              />
          ) : (
             <Text style={styles.placeholderText}>No images selected</Text>
          )}
       </View>

      {/* Submit Button is unchanged */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginVertical: 20 }}/>
      ) : (
        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
          Create Assignment
        </Button>
      )}
    </ScrollView>
  );
};

// ### CLEANED UP STYLES ###
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 15 },
  label: { fontSize: 16, color: '#666', marginBottom: 10, marginLeft: 5 }, // Increased margin-bottom for better spacing
  imageSection: {
      marginTop: 10,
      marginBottom: 20,
  },
  placeholderText: {
      textAlign: 'center',
      color: '#888',
      marginTop: 10,
  },
  previewList: {
      marginTop: 10,
  },
  previewImageContainer: {
      position: 'relative',
      marginRight: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeIcon: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: 'white',
      borderRadius: 12,
  },
  submitButton: { marginTop: 10, paddingVertical: 8 },
});

export default UploadAssignmentsScreen;