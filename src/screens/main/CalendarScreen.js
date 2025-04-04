import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as Location from 'expo-location';
import * as CalendarAPI from 'expo-calendar';
import { useNavigation } from '@react-navigation/native';

const primaryColor = '#48AAA6';
const accentColor = '#F2B705';
const backgroundColor = '#F7F7F7';

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

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [calendarId, setCalendarId] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to fetch weather information.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      // Reverse geocode to obtain the city
      const addresses = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (addresses && addresses.length > 0) {
        setCity(addresses[0].city || addresses[0].region || '');
      }
      fetchWeather(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await CalendarAPI.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Calendar permission is required to access your events.');
        return;
      }
      const calendars = await CalendarAPI.getCalendarsAsync(CalendarAPI.EntityTypes.EVENT);
      let defaultCal = calendars.find(cal => cal.allowsModifications);
      if (!defaultCal && calendars.length > 0) {
        defaultCal = calendars[0];
      }
      if (defaultCal) {
        setCalendarId(defaultCal.id);
      }
    })();
  }, []);

  useEffect(() => {
    if (calendarId) {
      fetchEventsForDate(selectedDate);
    }
  }, [selectedDate, calendarId]);

  const fetchEventsForDate = async (dateString) => {
    const start = new Date(dateString);
    const end = new Date(dateString);
    end.setDate(end.getDate() + 1);
    try {
      const dayEvents = await CalendarAPI.getEventsAsync([calendarId], start, end);
      setEvents(dayEvents);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await response.json();
      let weatherByDate = {};
      if (data && data.daily && data.daily.time) {
        data.daily.time.forEach((date, index) => {
          const code = data.daily.weathercode[index];
          const maxTemp = data.daily.temperature_2m_max[index];
          const minTemp = data.daily.temperature_2m_min[index];
          const weatherMapping = mapWeatherCodeToWeather(code);
          weatherByDate[date] = { 
            icon: weatherMapping.icon, 
            condition: weatherMapping.condition, 
            maxTemp, 
            minTemp 
          };
        });
      }
      setWeatherData(weatherByDate);
    } catch (error) {
      console.error('Error fetching weather data: ', error);
    }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>
          {new Date(item.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  let markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: primaryColor,
    },
  };
  Object.keys(weatherData).forEach(date => {
    if (weatherData[date]) {
      markedDates[date] = {
        ...markedDates[date],
        marked: true,
        dotColor: accentColor,
      };
    }
  });

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: backgroundColor,
          calendarBackground: backgroundColor,
          textSectionTitleColor: primaryColor,
          selectedDayBackgroundColor: primaryColor,
          selectedDayTextColor: '#ffffff',
          todayTextColor: primaryColor,
          dayTextColor: '#000000',
          textDisabledColor: '#d9e1e8',
          dotColor: accentColor,
          selectedDotColor: '#ffffff',
          arrowColor: primaryColor,
          monthTextColor: primaryColor,
          indicatorColor: primaryColor,
        }}
        style={styles.calendar}
      />
      {weatherData[selectedDate] && (
        <View style={styles.weatherContainer}>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${weatherData[selectedDate].icon}@2x.png` }}
            style={styles.weatherIcon}
          />
          <View style={styles.weatherDetailsContainer}>
            <Text style={styles.weatherTitle}>Weather Forecast</Text>
            <Text style={styles.weatherDetails}>
              {city ? `${city}: ` : ''}High: {weatherData[selectedDate].maxTemp}°C, Low: {weatherData[selectedDate].minTemp}°C
            </Text>
            <Text style={styles.weatherDetails}>
              {weatherData[selectedDate].condition}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Events on {selectedDate}</Text>
        {events.length > 0 ? (
          <FlatList data={events} keyExtractor={(item) => item.id.toString()} renderItem={renderEventItem} />
        ) : (
          <Text style={styles.noEventsText}>No events scheduled.</Text>
        )}
      </View>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddEvent', { weatherData, city })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingTop: 55
  },
  calendar: {
    marginBottom: 10
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10
  },
  weatherIcon: {
    width: 50,
    height: 50
  },
  weatherDetailsContainer: {
    marginLeft: 8
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  weatherDetails: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000'
  },
  noEventsText: {
    fontSize: 16,
    color: '#555'
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  eventTime: {
    fontSize: 14,
    color: '#000'
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: accentColor,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff'
  }
});

export default CalendarScreen;