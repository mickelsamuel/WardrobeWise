// src/screens/main/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [userName, setUserName] = useState('');
  const weather = {
    temperature: '23°C',
    forecast: 'partly sunny',
  };
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        setUserName(storedName ? storedName : 'Guest');
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName('Guest');
      }
    };
    fetchUserName();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with greeting and weather widget */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning, {userName}!</Text>
        <View style={styles.weatherContainer}>
          <Ionicons name="sunny-outline" size={20} color="#F2B705" />
          <Text style={styles.weatherText}>
            {weather.temperature}, {weather.forecast}
          </Text>
        </View>
      </View>

      {/* Customize Outfit Button with Navigation */}
      <TouchableOpacity 
        style={styles.customizeButton}
        onPress={() => navigation.navigate('OutfitCustomizer')}
      >
        <Text style={styles.customizeButtonText}>Customize Outfit</Text>
      </TouchableOpacity>

      {/* Today's Outfit Recommendation Card */}
      <View style={styles.outfitCard}>
        <View style={styles.outfitImagesRow}>
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.outfitImage}
            resizeMode="cover"
            accessibilityLabel="Outfit Image 1"
          />
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.outfitImage}
            resizeMode="cover"
            accessibilityLabel="Outfit Image 2"
          />
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.outfitImage}
            resizeMode="cover"
            accessibilityLabel="Outfit Image 3"
          />
        </View>
        <View style={styles.outfitInfo}>
          <Text style={styles.outfitCaption}>
            AI recommended for {weather.temperature}, {weather.forecast}
          </Text>
          <TouchableOpacity style={styles.shuffleButton}>
            <Ionicons name="refresh-outline" size={20} color="#48AAA6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingBottom: 16,
  },
  header: {
    marginTop: 40, // Moves header down
    padding: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#48AAA6',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  weatherText: {
    fontSize: 16,
    marginLeft: 4,
    color: '#555',
  },
  customizeButton: {
    margin: 16,
    backgroundColor: '#F2B705',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  customizeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  outfitCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  outfitImagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  outfitImage: {
    width: '30%',
    height: 100,
    borderRadius: 8,
  },
  outfitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outfitCaption: {
    fontSize: 16,
    color: '#555',
  },
  shuffleButton: {
    padding: 8,
  },
});