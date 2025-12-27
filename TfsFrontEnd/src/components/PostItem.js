// src/components/PostItem.js

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { API_BASE_URL } from '../api/config';

// Define a character limit. 150 is a good starting point.
const TEXT_TRUNCATION_LIMIT = 150;

const PostItem = ({ item, onImagePress }) => {
  // This state is just for toggling the user's view.
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTextExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const imageUrl = `${API_BASE_URL}/api/images/${item.imagePath}`;
  const postDate = new Date(item.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
  });

  // The decision to show the button is now based on simple character length.
  const shouldShowToggleButton = item.text.length > TEXT_TRUNCATION_LIMIT;

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.postAuthor}>{item.username}</Text>
        <Text style={styles.postDate}>{postDate}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={() => onImagePress(imageUrl)}>
          <Image source={{ uri: imageUrl }} style={styles.postImage} />
      </TouchableOpacity>

      <View style={styles.postFooter}>
        <Text 
          style={styles.postText} 
          // If not expanded, show only 2 lines. If expanded, show everything.
          numberOfLines={isExpanded ? undefined : 2}
        >
          {item.text}
        </Text>
        
        {/* Render the correct button ("Read More" or "Show Less") if needed */}
        {shouldShowToggleButton && (
          <TouchableOpacity onPress={toggleTextExpansion}>
            <Text style={styles.readMore}>
              {isExpanded ? 'show less' : 'read more...'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: { backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 12, paddingBottom: 8 },
  postAuthor: { fontWeight: 'bold', fontSize: 16 },
  postDate: { fontSize: 12, color: '#666' },
  postImage: { width: '100%', height: 250, backgroundColor: '#e0e0e0' },
  postFooter: { paddingHorizontal: 15, paddingVertical: 12 },
  postText: { fontSize: 15, lineHeight: 22 },
  readMore: { color: '#CCCCCC', fontWeight: 'bold', marginTop: 5 },
});

export default PostItem;