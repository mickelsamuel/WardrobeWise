// src/screens/auth/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Animated, 
  Easing 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const checkUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.replace('Home');
      } else {
        navigation.replace('SignIn');
      }
    } catch (error) {
      navigation.replace('SignIn');
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      checkUser();
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="WardrobeWise Logo"
        />
        <Text style={styles.title}>WardrobeWise</Text>
        <ActivityIndicator size="large" color="#F2B705" style={styles.loader} />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#48AAA6',
    marginBottom: 12,
  },
  loader: {
    marginTop: 20,
  },
});