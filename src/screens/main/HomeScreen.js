// src/screens/main/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';

// Mockup data - would come from API in real implementation
const outfitSuggestions = [
  {
    id: '1',
    images: [
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
    ],
    description: 'Perfect for today\'s weather'
  },
  {
    id: '2',
    images: [
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
    ],
    description: 'Casual comfort outfit'
  },
  {
    id: '3',
    images: [
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
      require('../../../assets/logo.png'),
    ],
    description: 'Trendy style for the day'
  },
];

const previousOutfitsData = [
  { id: '1', thumbnail: require('../../../assets/logo.png'), date: 'Mon' },
  { id: '2', thumbnail: require('../../../assets/logo.png'), date: 'Tue' },
  { id: '3', thumbnail: require('../../../assets/logo.png'), date: 'Wed' },
  { id: '4', thumbnail: require('../../../assets/logo.png'), date: 'Thu' },
  { id: '5', thumbnail: require('../../../assets/logo.png'), date: 'Fri' },
  { id: '6', thumbnail: require('../../../assets/logo.png'), date: 'Sat' },
  { id: '7', thumbnail: require('../../../assets/logo.png'), date: 'Sun' },
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

// Custom component for outfit card
const OutfitCard = ({ outfit, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={styles.outfitCard}
    activeOpacity={0.7}
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
      {outfit.description}
    </Text>
    <TouchableOpacity 
      style={styles.selectOutfitButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.selectOutfitButtonText}>Select</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

// Previous outfit thumbnail component
const OutfitThumbnail = ({ outfit, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={styles.outfitThumbnailContainer}
    activeOpacity={0.7}
  >
    <Image 
      source={outfit.thumbnail}
      style={styles.outfitThumbnail}
      resizeMode="cover"
      accessibilityLabel={`Outfit from ${outfit.date}`}
    />
    <Text style={styles.dayLabel}>{outfit.date}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentUser, userProfile } = useAuth();
  const firstName = (currentUser?.displayName || userProfile?.name || 'Guest').split(' ')[0];

  const [weather, setWeather] = useState({
    temperature: '',
    forecast: '',
    icon: '01d',
  });
  const [previousOutfits, setPreviousOutfits] = useState(previousOutfitsData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          setIsLoading(false);
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
      } finally {
        setIsLoading(false);
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
        { 
          text: "Confirm", 
          onPress: () => {
            // Show success message with animation
            Alert.alert(
              "Success!",
              "Your outfit has been set for today",
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };

  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with greeting and weather widget */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{getGreeting()}, {firstName}!</Text>
            
            {isLoading ? (
              <View style={styles.weatherContainer}>
                <ActivityIndicator size="small" color="#48AAA6" />
                <Text style={styles.loadingText}>Loading weather...</Text>
              </View>
            ) : (
              <View style={styles.weatherContainer}>
                <Image 
                  source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherText}>
                  {weather.temperature}, {weather.forecast}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Custom Outfit Button */}
        <TouchableOpacity 
          style={styles.customizeButton}
          onPress={() => navigation.navigate('OutfitCustomizer')}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={22} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.customizeButtonText}>Create Custom Outfit</Text>
        </TouchableOpacity>

        {/* AI Outfit Options */}
        <View style={styles.outfitOptionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Outfit Options</Text>
            <TouchableOpacity onPress={() => Alert.alert("Refresh", "Refreshing outfit suggestions...")}>
              <Ionicons name="refresh" size={22} color="#48AAA6" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.outfitCardsContainer}
          >
            {outfitSuggestions.map((outfit) => (
              <OutfitCard 
                key={outfit.id}
                outfit={outfit}
                onPress={() => handleConfirmOutfit(outfit)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Previous 7-Day Outfits Carousel */}
        <View style={styles.previousOutfitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Previous 7-Day Outfits</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}
          >
            {previousOutfits.map((outfit) => (
              <OutfitThumbnail
                key={outfit.id}
                outfit={outfit}
                onPress={() => navigation.navigate('OutfitDetail', { outfitId: outfit.id })}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.weeklyAnalyticsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Stats</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
              <Text style={styles.seeAllText}>More</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Outfits Logged</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Most Worn Item</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48AAA6',
    marginBottom: 4,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  weatherIcon: {
    width: 46,
    height: 46,
  },
  weatherText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
  },
  customizeButton: {
    margin: 16,
    marginTop: 24,
    backgroundColor: '#F2B705',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#F2B705',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  customizeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonIcon: {
    marginRight: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  outfitOptionsSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48AAA6',
  },
  seeAllText: {
    fontSize: 16,
    color: '#48AAA6',
    fontWeight: '500',
  },
  outfitCardsContainer: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  outfitCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  outfitImagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  outfitImage: {
    width: '30%',
    height: 110,
    borderRadius: 10,
  },
  outfitCaption: {
    fontSize: 16,
    color: '#333',
    marginVertical: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectOutfitButton: {
    backgroundColor: '#48AAA6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  selectOutfitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previousOutfitsSection: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  thumbnailsContainer: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  outfitThumbnailContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  outfitThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    fontWeight: '500',
  },
  weeklyAnalyticsSection: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48AAA6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});