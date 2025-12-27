const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // We are creating a "blacklist" of files and folders that Metro should NEVER look at.
    blockList: [
      // This regex matches any file that is in a __tests__ directory
      /.*\/__tests__\/.*/,
      // This regex matches any file that ends with .test.js, .test.ts, .test.tsx, etc.
      /.*\.test\.[tj]sx?$/,
    ]
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
