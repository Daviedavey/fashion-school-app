// src/screens/ManageAssignmentsScreen.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAssignments, deleteAssignment } from '../api/assignment';
import { theme } from '../theme/theme';

const ManageAssignmentsScreen = ({ navigation }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState('');

  const fetchData = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      setCurrentUsername(username);

      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch assignments.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Assignment",
      "Are you sure you want to delete this assignment? The images will be permanently removed from cloud storage.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAssignment(id);
              // Removes the deleted assignment from the list instantly
              setAssignments(prev => prev.filter(a => a.id !== id));
            } catch (error) {
              Alert.alert("Error", "Failed to delete the assignment.");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isOwner = currentUsername === item.createdBy;

    return (
      <View style={styles.card}>
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <Image source={{ uri: item.imageUrls[0] }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.placeholderImage]}>
            <Icon name="image-outline" size={40} color="#ccc" />
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.textSection}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.meta}>Level: {item.level}</Text>
            <Text style={styles.meta}>By: {item.createdBy}</Text>
          </View>

          {isOwner && (
            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => handleDelete(item.id)}
            >
              <Icon name="trash-can-outline" size={24} color="#D93B3B" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={assignments}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No assignments found.</Text>}
        onRefresh={fetchData}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginLeft: 10,
  }
});

export default ManageAssignmentsScreen;