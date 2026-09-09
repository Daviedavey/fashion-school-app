module.exports = {
   presets: ['module:@react-native/babel-preset'],
   plugins: [
    'react-native-reanimated/plugin', // <--- This MUST be here and MUST be last
  ],
};
