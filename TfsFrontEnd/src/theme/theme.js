
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme, //default light theme
  roundness: 8, //  adjust the roundness of elements like buttons and cards
  colors: {
    ...DefaultTheme.colors, // Inherit the default colors

    // --- CUSTOM COLORS ---

    // Primary color: Used for buttons, active states, main highlights
    primary: '#09090aff', // Blackish

    // Accent color (in MD2) or Tertiary (in MD3): Used for FABs, important toggles
    tertiary: '#8B3A42', // The Pomegranate/Maroon

    // Backgrounds
    background: '#FFFFFF', // Clean White
    surface: '#F6F6F8', // A slightly off-white for cards and surfaces to stand out

    // Text
    onSurface: '#2B2B2B', // The Deep Charcoal for primary text
    
    // define other colors if needed
    // secondary: '#C0C2D8', // The Lavender Blue
    // error: '#B00020',
  },
};