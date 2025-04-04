// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Switch, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/firestoreService';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { currentUser, userProfile, logout } = useAuth();

  // Local state for toggles:
  // Initialize master toggle and subordinate toggles to false.
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [dailyOutfitEnabled, setDailyOutfitEnabled] = useState(false);
  const [weeklyAnalyticsEnabled, setWeeklyAnalyticsEnabled] = useState(false);
  
  // Local state for profile image with a default fallback.
  const defaultPlaceholder = 'https://via.placeholder.com/100';
  const [profileImage, setProfileImage] = useState(
    userProfile?.photoURL || defaultPlaceholder
  );

  // Request notification permissions when enabling notifications.
  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permission Denied",
        "Notifications permission was not granted. Please enable it in your settings."
      );
    }
  };

  const handleNotificationsToggle = async (value) => {
    if (value) {
      await requestNotificationPermissions();
      setNotificationsEnabled(true);
      setDailyOutfitEnabled(true);
      setWeeklyAnalyticsEnabled(true);
    } else {
      setNotificationsEnabled(false);
      setDailyOutfitEnabled(false);
      setWeeklyAnalyticsEnabled(false);
    }
  };

  // Pick image using the deprecated API with fallback for new API structure.
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access media library is required.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.cancelled) {
      const uri = result.uri || (result.assets && result.assets.length > 0 ? result.assets[0].uri : null);
      if (!uri) {
        Alert.alert('Error', 'No image URI was returned.');
        return;
      }
      const updateResult = await updateUserProfile({ photoURL: uri });
      if (updateResult.error) {
        Alert.alert('Error', 'Failed to update profile picture.');
        return;
      }
      setProfileImage(uri);
    }
  };

  // For subordinate toggles, we disable them if notifications are off.
  const handleDailyToggle = (value) => {
    if (!notificationsEnabled) {
      Alert.alert("Notifications Disabled", "Please enable notifications first.");
    } else {
      setDailyOutfitEnabled(value);
    }
  };

  const handleWeeklyToggle = (value) => {
    if (!notificationsEnabled) {
      Alert.alert("Notifications Disabled", "Please enable notifications first.");
    } else {
      setWeeklyAnalyticsEnabled(value);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => { logout(); navigation.navigate('Home'); } }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage}>
          <Image 
            source={{ uri: profileImage }} 
            style={styles.profilePic} 
          />
          <Text style={styles.editProfileText}>Tap to update profile picture</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>
          {currentUser?.displayName || userProfile?.name || "User Name"}
        </Text>
        <Text style={styles.infoText}>
          {currentUser?.email || "user@example.com"}
        </Text>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>Enable Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#48AAA6" }}
            thumbColor={notificationsEnabled ? "#027d7d" : "#505454"}
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.infoText}>Daily Outfit Suggestions</Text>
          <Switch
            disabled={!notificationsEnabled}
            trackColor={{ false: "#767577", true: "#48AAA6" }}
            thumbColor={notificationsEnabled && dailyOutfitEnabled ? "#027d7d" : "#505454"}
            value={notificationsEnabled ? dailyOutfitEnabled : false}
            onValueChange={handleDailyToggle}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.infoText}>Weekly Analytics</Text>
          <Switch
            disabled={!notificationsEnabled}
            trackColor={{ false: "#767577", true: "#48AAA6" }}
            thumbColor={notificationsEnabled && weeklyAnalyticsEnabled ? "#027d7d" : "#505454"}
            value={notificationsEnabled ? weeklyAnalyticsEnabled : false}
            onValueChange={handleWeeklyToggle}
          />
        </View>
      </View>

      {/* Sustainability Analytics */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.buttonText}>View Sustainability Analytics</Text>
      </TouchableOpacity>

      {/* Help/Support */}
      <TouchableOpacity style={styles.helpButton} onPress={() => navigation.navigate('Help')}>
        <Text style={styles.helpText}>Help & Support</Text>
      </TouchableOpacity>

      {/* Log Out */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  header: {
    marginTop: 40,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#48AAA6',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editProfileText: {
    fontSize: 14,
    color: '#48AAA6',
  },
  button: {
    backgroundColor: '#48AAA6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#48AAA6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  helpText: {
    color: '#48AAA6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#F2B705',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;