import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentFashionIcon } from '../api/dashboard'; // Import our new function

// The main component
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
          // It's okay if not found (404), just means teacher hasn't set one yet
          if (error.response?.status !== 404) {
             Alert.alert('Error', 'Could not load dashboard content.');
          }
          setIconData(null); // Ensure it's null on error
        } finally {
          setLoading(false);
        }
      };
      fetchIcon();
    }, [])
  );

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* === FASHION ICON SECTION === */}
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" style={styles.loader}/>
          ) : iconData ? (
            <View style={styles.iconFeature}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTextSmall}>this weeks</Text>
                <Text style={styles.headerTextLarge}>FASHION ICON</Text>
              </View>

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
            <Text style={styles.noContentText}>Welcome! Content will appear here soon.</Text>
          )}
        </View>
      </ScrollView>

      {/* === FIXED BOTTOM NAVIGATION === */}
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

// Stylesheet
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { flexGrow: 1 },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  loader: { marginTop: 50 },
  noContentText: { fontSize: 16, color: '#888', textAlign: 'center' },
  iconFeature: { width: '100%' },
  headerTextContainer: { alignItems: 'center', marginBottom: 20 },
  headerTextSmall: { fontSize: 22, fontStyle: 'italic', letterSpacing: 1 },
  headerTextLarge: { fontSize: 36, fontWeight: 'bold', letterSpacing: 2 },
  mainContentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  imageAndTextColumn: {
      flex: 1, // Takes up most of the space
  },
  mainImage: {
      width: '100%',
      height: 300,
      resizeMode: 'cover',
      borderRadius: 8,
  },
  descriptionText: {
      marginTop: 15,
      fontSize: 16,
      lineHeight: 24,
      color: '#333',
  },
  verticalTextContainer: {
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },
  verticalText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: '#000',
      transform: [{ rotate: '-90deg' }],
      letterSpacing: 4,
      // Adjust width to prevent text from being cut off after rotation
      width: 300, 
      textAlign: 'center',
  },
  // --- Fixed Bottom Button Bar ---
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 40,
    padding: 40,
    borderTopWidth: 0.1,
    //borderTopColor: '#e0e0e0',
    //backgroundColor: '#ffffff',
  },
  
});

export default DashBoardScreen;