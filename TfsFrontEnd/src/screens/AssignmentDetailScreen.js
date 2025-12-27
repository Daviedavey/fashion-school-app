// src/screens/AssignmentDetailScreen.js
import React from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, Image, useWindowDimensions } from 'react-native';

const AssignmentDetailScreen = ({ route }) => {
  // Get the assignment object passed from the previous screen
  const { assignment } = route.params;
  const { width } = useWindowDimensions();
  const imageSize = width - 40; // Full width minus padding

  const renderImageItem = ({ item }) => (
    <View style={[styles.imageContainer, { width: width }]}>
        <Image source={{ uri: item }} style={[styles.image, {width: imageSize, height: imageSize}]} resizeMode="contain" />
    </View>
  );

  return (
    <ScrollView style={styles.container}>

         <View style={styles.header}>
        <Text style={styles.title}> </Text>
         <Text style={styles.title}>  </Text>
        
      </View>

      {assignment.imageUrls && assignment.imageUrls.length > 0 ? (
        <FlatList
          data={assignment.imageUrls}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => item + index}
          horizontal
          pagingEnabled // Snaps to each image
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noImagesText}>No images were attached to this assignment.</Text>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>{assignment.title}</Text>
        //<Text style={styles.meta}> Posted by: {assignment.createdBy}</Text>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{assignment.description}</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  meta: { fontSize: 14, color: '#555' },
  descriptionContainer: { padding: 20 },
  description: { fontSize: 16, lineHeight: 24 },
  imagesTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      paddingHorizontal: 20,
      marginTop: 10,
      marginBottom: 10,
  },
  imageContainer: {
      // The parent FlatList with `width: width` will center this
      alignItems: 'center',
      paddingBottom: 20,
  },
  image: {
    borderRadius: 10,
    backgroundColor: '#f0f0f0', // Placeholder color
  },
  noImagesText: {
    paddingHorizontal: 20,
    fontStyle: 'italic',
    color: '#888',
  }
});

export default AssignmentDetailScreen;