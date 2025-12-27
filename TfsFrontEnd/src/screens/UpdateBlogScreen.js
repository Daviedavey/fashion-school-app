// src/screens/UpdateBlogScreen.js

import React, { useState, useEffect, useCallback } from 'react';
// ### ADD THESE IMPORTS ###
import { View, StyleSheet, FlatList, Image, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // A great icon library
import { useFocusEffect } from '@react-navigation/native'; // To refresh data

import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ### IMPORT OUR NEW API FUNCTION ###
import { deletePost } from '../api/blog';


const UpdateBlogScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // ### ADD STATE TO HOLD THE CURRENT USER'S USERNAME ###
  const [currentUsername, setCurrentUsername] = useState(null);

  // Function to fetch posts from the server
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Get both the current user's username and the posts
      const username = await AsyncStorage.getItem('username');
      setCurrentUsername(username);

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/api/blog`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Could not fetch blog posts.');
    } finally {
      setLoading(false);
    }
  };
  
  // useFocusEffect will re-run fetchPosts every time the screen comes into view.
  // This is great for ensuring the data is fresh if a user navigates away and back.
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  // ### CREATE THE FUNCTION TO HANDLE THE DELETE ACTION ###
  const handleDelete = (postId) => {
    // Show a confirmation dialog first! This is critical for destructive actions.
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deletePost(postId);
              // If the API call succeeds, remove the post from the local state
              // This provides an immediate UI update without a full refresh.
              setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
              Alert.alert("Success", "Post deleted successfully.");
            } catch (error) {
              const errorMessage = error.response?.data?.message || "Failed to delete the post.";
              Alert.alert("Error", errorMessage);
            }
          },
          style: "destructive"
        }
      ]
    );
  };


  const renderItem = ({ item }) => {
    const imageUrl = `${API_BASE_URL}/api/images/${item.imagePath}`;
    
    // Check if the current user is the author of the post
    const isAuthor = currentUsername === item.username;

    //Debuging to see if username matches
    console.log(
      `[Post ID: ${item.id}] Checking ownership... ` +
      `Current User: '${currentUsername}', Post Author: '${item.username}', ` +
      `Is Author? ${isAuthor}`
    );

    return (
      <View style={styles.postContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.postImage}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        {/* Container for text and delete button */}
        <View style={styles.footerContainer}>
            <Text style={styles.postText}>{item.text}</Text>
            {/* ### CONDITIONALLY RENDER THE DELETE BUTTON ### */}
            {isAuthor && (
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Icon name="trash-outline" size={24} color="#D93B3B" />
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  };

  // The rest of your component (return statement) remains the same
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          // Add a refresh control for pull-to-refresh functionality
          onRefresh={fetchPosts}
          refreshing={loading}
        />
      )}
    </View>
  );
};


// ### ADD NEW STYLES ###
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // A slightly off-white background
  },
  list: {
    padding: 10,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  postText: {
    fontSize: 16,
    flex: 1, // Allows text to take up available space
    marginRight: 10, // Add some space between text and button
  },
  deleteButton: {
    padding: 5, // Makes the touch area larger
  },
  // ... your other styles if any
});

export default UpdateBlogScreen;