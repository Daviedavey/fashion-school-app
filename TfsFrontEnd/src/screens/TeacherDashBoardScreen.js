import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';

// Import the component you want to embed
import UpdateBlogScreen from './UpdateBlogScreen';

const TeacherDashBoardScreen = ({ navigation, route }) => { // Pass route for completeness

  return (
    // This is the main container for the whole screen.
    // `flex: 1` makes it take up all available screen space.
    // The default `flexDirection` is 'column'.
    <View style={styles.container}>
      {/* 
        This is the scrollable content area.
        `flex: 1` tells it to expand and take up all the space
        that the buttonContainer does NOT occupy. This gives the
        FlatList inside UpdateBlogScreen a fixed boundary to work within.
      */}
      <View style={styles.mainContent}>
        <UpdateBlogScreen navigation={navigation} route={route} />
      </View>

      {/* 
        This is the fixed footer. It comes after the flex: 1 view,
        so it will be pushed to the bottom. It will NOT scroll.
      */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('UploadAssignments')}>
          <Image source={require('../assets/images/assignments.png')} style={styles.iconImage} /> 
        </TouchableOpacity>

        <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('UploadBlog')}>
          <Image source={require('../assets/images/blog.png')} style={styles.iconImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('ViewPortfolio')}>
          <Image source={require('../assets/images/portfolio.png')} style={styles.iconImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.IconButton} onPress={() => navigation.navigate('UpdateFashionIcon')}>
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
  
  // The main screen container
   container: { flex: 1, backgroundColor: '#ffffff' },
  mainContent: { flex: 1 },
  updateButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  // The fixed footer
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // space-around is great for icon bars
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff', // background to ensure it's not transparent
  },
  IconButton: {
    padding: 5,
  },
  iconImage: {
    width:  35,
    height: 35,
    resizeMode: 'contain',
  },
});

export default TeacherDashBoardScreen;