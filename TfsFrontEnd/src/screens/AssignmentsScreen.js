import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Dimensions, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAssignments } from '../api/assignment';
import Icon from 'react-native-vector-icons/Ionicons';

// Get the screen width once
const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 22; // (Screen width / 2 columns) - (margins)

const AssignmentsScreen = ({ navigation }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch assignments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (assignments.length === 0) {
          setLoading(true);
      }
      
      fetchAssignments();
    }, [fetchAssignments])
  );


  const renderItem = ({ item }) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.card}
      onPress={() => navigation.navigate('AssignmentDetail', { assignment: item })}
    >
        {/* container for the image */}
      <View style={styles.imageContainer}>
          {/* We'll display the FIRST image of the assignment as a preview */}
          {item.imageUrls && item.imageUrls.length > 0 ? (
              <Image source={{ uri: item.imageUrls[0] }} style={styles.cardImage} />
          ) : (
              // Placeholder for assignments with no image
              <View style={[styles.cardImage, styles.imagePlaceholder]}>
                  <Icon name="image-outline" size={40} color="#ccc" />
              </View>
          )}
      </View>

      {/* The content below the image */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardAuthor} numberOfLines={1}> Posted by: {item.createdBy}</Text>
     
      </View>

    </TouchableOpacity>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={assignments}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No assignments found.</Text>}
        onRefresh={fetchAssignments}
        refreshing={loading}
        numColumns={2}
         // This key is for the FlatList itself to re-render correctly on column changes
        key={'_'} 
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { 
      paddingHorizontal: 8, // Adjust horizontal padding for the grid
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 7, // Margin around each card
    width: cardWidth, // Set a fixed width for each card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
      width: '100%',
      height: 150, // Give the image a fixed height
  },
  cardImage: {
      width: '100%',
      height: '100%',
  },
  imagePlaceholder: {
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
  },
  cardContent: { 
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 5,
  },
  cardTitle: { 
      fontSize: 16, 
      fontWeight: 'bold',
  },
  cardAuthor: { 
      fontSize: 12, 
      color: '#666',
      marginBottom: 5,
  },
  creationDate: {
        fontSize: 12,
        color: '#888',
    },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },
});

export default AssignmentsScreen;