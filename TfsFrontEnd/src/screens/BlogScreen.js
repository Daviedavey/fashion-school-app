import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, Image } from 'react-native'; // Ensure Modal is imported
import { useFocusEffect } from '@react-navigation/native';
import { getPosts } from '../api/blog'; 
import PostItem from '../components/PostItem';
import { Button } from 'react-native-paper';

const BlogScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch blog posts.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPosts();
    }, [fetchPosts])
  );
  
  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <PostItem item={item} onImagePress={handleImagePress} />
  );

  if (loading) {
    return <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }
  
  if (!posts || posts.length === 0) {
      return <View style={[styles.container, styles.center]}><Text style={styles.emptyText}>No blog posts yet.</Text></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        onRefresh={fetchPosts}
        refreshing={loading}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
            <Button 
                icon="close" 
                mode="contained" 
                onPress={() => setModalVisible(false)} 
                style={styles.closeButton}
            >
                Close
            </Button>
        </View>
      </Modal>
    </View>
  );
};

// Use the same styles as before, including the modal styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  list: { paddingVertical: 10, paddingHorizontal: 10 },
  emptyText: { fontSize: 16, color: '#888' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: '100%', height: '80%' },
  closeButton: { position: 'absolute', bottom: 40 },
});

export default BlogScreen;