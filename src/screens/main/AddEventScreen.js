import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as CalendarAPI from 'expo-calendar';
import { useNavigation, useRoute } from '@react-navigation/native';

const primaryColor = '#48AAA6';
const accentColor = '#F2B705';
const backgroundColor = '#F7F7F7';

const AddEventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { weatherData, city } = route.params || {}; // Full weather forecast data and city

  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const [eventNotes, setEventNotes] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [calendarId, setCalendarId] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await CalendarAPI.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Calendar permission is required to add events.');
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

  const handleAddEvent = async () => {
    if (!eventTitle) {
      Alert.alert('Error', 'Please fill in the event title.');
      return;
    }
    // Combine the eventDate and eventTime into one Date object
    let newEventDate = new Date(eventDate);
    newEventDate.setHours(eventTime.getHours(), eventTime.getMinutes());
    const endDate = new Date(newEventDate);
    endDate.setHours(endDate.getHours() + 1);
    try {
      await CalendarAPI.createEventAsync(calendarId, {
        title: eventTitle,
        startDate: newEventDate,
        endDate: endDate,
        notes: eventNotes,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error creating event: ', error);
      Alert.alert('Error', 'Could not create event.');
    }
  };

  // Compute the date string and forecast for the picked date
  const eventDateStr = eventDate.toISOString().split('T')[0];
  const weatherForEvent = weatherData ? weatherData[eventDateStr] : null;

  // Format the eventTime as HH:MM
  const formattedTime = eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.modalTitle}>Add Event</Text>
        <TextInput
          style={styles.input}
          placeholder="Event Title"
          placeholderTextColor="#888"
          value={eventTitle}
          onChangeText={setEventTitle}
        />
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => {
            setTempTime(eventTime);
            setShowTimePicker(true);
          }}
        >
          <Text style={styles.timePickerText}>Select Time: {formattedTime}</Text>
        </TouchableOpacity>
        <Modal transparent={true} animationType="slide" visible={showTimePicker}>
          <View style={styles.timePickerModalContainer}>
            <View style={styles.timePickerModalContent}>
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                themeVariant="dark"
                onChange={(event, selectedTime) => {
                  if (selectedTime) {
                    setTempTime(selectedTime);
                  }
                }}
              />
              <View style={styles.modalTimeButtons}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    setEventTime(tempTime);
                    setShowTimePicker(false);
                  }}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowCalendar(!showCalendar)}>
          <Text style={styles.datePickerText}>Event Date: {eventDateStr}</Text>
        </TouchableOpacity>
        {showCalendar && (
          <Calendar
            onDayPress={(day) => {
              setEventDate(new Date(day.dateString));
              setShowCalendar(false);
            }}
            markedDates={{
              [eventDateStr]: {
                selected: true,
                selectedColor: primaryColor,
              },
            }}
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
            style={styles.modalCalendar}
          />
        )}
        {weatherForEvent && (
          <View style={styles.weatherInfoContainer}>
            <Text style={styles.weatherCondition}>
              {city ? `${city}: ` : ''}{weatherForEvent.condition}
            </Text>
            <Text style={styles.weatherTemp}>
              High: {weatherForEvent.maxTemp}°C, Low: {weatherForEvent.minTemp}°C
            </Text>
          </View>
        )}
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Notes"
          placeholderTextColor="#888"
          value={eventNotes}
          onChangeText={setEventNotes}
          multiline
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={() => navigation.goBack()}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, { backgroundColor: primaryColor }]} onPress={handleAddEvent}>
            <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: backgroundColor,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: backgroundColor,
  },
  timePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: backgroundColor,
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: backgroundColor,
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
  },
  modalCalendar: {
    marginBottom: 12,
    height: 300,
  },
  weatherInfoContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  weatherTemp: {
    fontSize: 16,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#ccc',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#000',
  },
  timePickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  timePickerModalContent: {
    marginHorizontal: 20,
    backgroundColor: '#333', // Dark background for contrast
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTimeButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  confirmButton: {
    backgroundColor: primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#555',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddEventScreen;