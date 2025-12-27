import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const IconButton = ({ image, label, onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <FastImage
        style={styles.icon}
        source={image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default IconButton;