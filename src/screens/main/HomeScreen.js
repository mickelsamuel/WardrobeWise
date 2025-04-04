// src/screens/main/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';

const outfitSuggestions = [
  {
    id: '1',
    images: [
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
    ],
  },
  {
    id: '2',
    images: [
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
    ],
  },
  {
    id: '3',
    images: [
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
    ],
  },
];

const previousOutfitsData = [
  { id: '1', thumbnail: require('../../../assets/logo.png') },
  { id: '2', thumbnail: require('../../../assets/logo.png') },
  { id: '3', thumbnail: require('../../../assets/logo.png') },
  { id: '4', thumbnail: require('../../../assets/logo.png') },
  { id: '5', thumbnail: require('../../../assets/logo.png') },
  { id: '6', thumbnail: require('../../../assets/logo.png') },
  { id: '7', thumbnail: require('../../../assets/logo.png') },
];

const mapWeatherCodeToWeather = (code) => {
  switch (code) {
    case 0:
      return { icon: "01d", condition: "Clear sky" };
    case 1:
    case 2:
    case 3:
      return { icon: "02d", condition: "Mainly clear to cloudy" };
    case 45:
    case 48:
      return { icon: "50d", condition: "Fog" };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { icon: "09d", condition: "Drizzle" };
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return { icon: "10d", condition: "Rain" };
    case 66:
    case 67:
      return { icon: "10d", condition: "Freezing rain" };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { icon: "13d", condition: "Snow" };
    case 95:
    case 96:
    case 99:
      return { icon: "11d", condition: "Thunderstorm" };
    default:
      return { icon: "01d", condition: "Clear sky" };
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentUser, userProfile } = useAuth();
  // Extract only the first name from the user's display name
  const firstName = (currentUser?.displayName || userProfile?.name || 'Guest').split(' ')[0];

  const [weather, setWeather] = useState({
    temperature: '',
    forecast: '',
    icon: '01d',
  });
  const [previousOutfits, setPreviousOutfits] = useState(previousOutfitsData);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];
        let index = data.daily.time.indexOf(today);
        if (index === -1) {
          index = 0;
        }
        const weatherCode = data.daily.weathercode[index];
        const maxTemp = data.daily.temperature_2m_max[index];
        const mapping = mapWeatherCodeToWeather(weatherCode);
        setWeather({
          temperature: `${Math.round(maxTemp)}°C`,
          forecast: mapping.condition,
          icon: mapping.icon,
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
  }, []);

  const handleConfirmOutfit = (outfit) => {
    Alert.alert(
      "Confirm Outfit",
      "Do you want to confirm this is the outfit for the day?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => Alert.alert("Outfit confirmed!") }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with greeting and weather widget */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning, {firstName}!</Text>
        <View style={styles.weatherContainer}>
          <Image 
            source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
            style={styles.weatherIcon}
          />
          <Text style={styles.weatherText}>
            {weather.temperature}, {weather.forecast}
          </Text>
        </View>
      </View>

      {/* Custom Outfit Button */}
      <TouchableOpacity 
        style={styles.customizeButton}
        onPress={() => navigation.navigate('OutfitCustomizer')}
      >
        <Text style={styles.customizeButtonText}>Custom Outfit</Text>
      </TouchableOpacity>

      {/* AI Outfit Options */}
      <View style={styles.outfitOptionsSection}>
        <Text style={styles.sectionTitle}>Today's Outfit Options</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {outfitSuggestions.map((outfit) => (
            <TouchableOpacity 
              key={outfit.id} 
              onPress={() => handleConfirmOutfit(outfit)}
              style={styles.outfitCard}
            >
              <View style={styles.outfitImagesRow}>
                {outfit.images.map((img, index) => (
                  <Image 
                    key={index}
                    source={img}
                    style={styles.outfitImage}
                    resizeMode="cover"
                    accessibilityLabel={`Outfit ${outfit.id} Image ${index + 1}`}
                  />
                ))}
              </View>
              <Text style={styles.outfitCaption}>
                AI recommended for {weather.temperature}, {weather.forecast}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Previous 7-Day Outfits Carousel */}
      <View style={styles.previousOutfitsSection}>
        <Text style={styles.sectionTitle}>Previous 7-Day Outfits</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {previousOutfits.map((outfit) => (
            <TouchableOpacity 
              key={outfit.id} 
              onPress={() => navigation.navigate('OutfitDetail', { outfitId: outfit.id })}
              style={styles.outfitThumbnailContainer}
            >
              <Image 
                source={outfit.thumbnail}
                style={styles.outfitThumbnail}
                resizeMode="cover"
                accessibilityLabel={`Outfit ${outfit.id}`}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    marginTop: 40,
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
  weatherIcon: {
    width: 50,
    height: 50,
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
  outfitOptionsSection: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#48AAA6',
    marginBottom: 8,
  },
  outfitCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 12,
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
  outfitCaption: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  previousOutfitsSection: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  outfitThumbnailContainer: {
    marginRight: 12,
  },
  outfitThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});