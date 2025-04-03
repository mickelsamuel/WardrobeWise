// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted',
  'VirtualizedLists should never be nested',
]);

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}