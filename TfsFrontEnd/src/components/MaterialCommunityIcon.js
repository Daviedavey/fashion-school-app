import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MaterialCommunityIcon = ({
  name,
  size = 24,
  color = '#000',
  allowFontScaling = true,
}) => {
  // Safety: if library didn't load or name is missing, avoid crash
  if (!MaterialCommunityIcons) {
    console.warn('MaterialCommunityIcons is undefined — check react-native-vector-icons installation');
    return null;
  }
  if (!name) {
    return null;
  }

  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      allowFontScaling={allowFontScaling}
    />
  );
};

export default MaterialCommunityIcon;
