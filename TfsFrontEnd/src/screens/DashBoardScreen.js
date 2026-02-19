import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentFashionIcon } from '../api/dashboard';
import Icon from 'react-native-vector-icons/Ionicons'; // Using Ionicons for the Instagram icon

const DashBoardScreen = ({ navigation }) => {
  const [iconData, setIconData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchIcon = async () => {
        try {
          const data = await getCurrentFashionIcon();
          setIconData(data);
        } catch (error) {
          if (error.response?.status !== 404) {
             Alert.alert('Error', 'Could not load dashboard content.');
          }
          setIconData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchIcon();
    }, [])
  );

  const openInstagram = () => {
    // Replace with the actual Instagram profile URL
    const instagramURL = 'https://www.instagram.com/thefashionschool'; 
    Linking.openURL(instagramURL).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.screenContainer}>
      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : iconData ? (
          <View style={styles.featureContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTextSmall}>this weeks</Text>
                <Text style={styles.headerTextLarge}>FASHION ICON</Text>
              </View>
              <TouchableOpacity onPress={openInstagram}>
                <Icon name="logo-instagram" size={30} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Main Content Row */}
            <View style={styles.mainContentRow}>
              <View style={styles.imageAndTextColumn}>
                <Image source={{ uri: iconData.imageUrl }} style={styles.mainImage} />
                <Text style={styles.descriptionText}>{iconData.description}</Text>
              </View>
              <View style={styles.verticalTextContainer}>
                <Text style={styles.verticalText}>{iconData.name.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Welcome! The Fashion Icon of the Week will appear here soon.</Text>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Navigation Bar */}
      <View style={styles.buttonContainer}>
       <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('Assignments')}>
          <Image source={require('../assets/images/assignments.png')} style={styles.iconImage} /> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('Blog')}>
          <Image source={require('../assets/images/blog.png')} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('Portfolio')}>
          <Image source={require('../assets/images/portfolio.png')} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('Favourites')}>
          <Image source={require('../assets/images/favourites.png')} style={styles.iconImage} /> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('Agenda')}>
          <Image source={require('../assets/images/agenda.png')} style={styles.iconImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { flexGrow: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, color: '#888', textAlign: 'center' },
  
  featureContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTextSmall: {
    fontSize: 22,
    fontFamily: 'Times New Roman', // Placeholder, we'll add custom fonts later
    fontStyle: 'italic',
  },
  headerTextLarge: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold', // Placeholder
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mainContentRow: {
    flexDirection: 'row',
    flex: 1,
  },
  imageAndTextColumn: {
    flex: 1,
    marginRight: 15,
  },
  mainImage: {
    width: '100%',
    aspectRatio: 3 / 4, // A portrait aspect ratio, adjust as needed
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  verticalTextContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalText: {
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 4,
    transform: [{ rotate: '-90deg' }],
    width: 300, // Give it enough width to not be cut off after rotation
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
});

export default DashBoardScreen;