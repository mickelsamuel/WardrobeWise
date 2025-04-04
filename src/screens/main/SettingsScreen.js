import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '../../firebase/config';
import { updateUserProfile } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { currentUser, userProfile, logout } = useAuth();
  const defaultPlaceholder = 'https://via.placeholder.com/100';
  const [profileImage, setProfileImage] = useState(userProfile?.photoURL || defaultPlaceholder);
  const [isPublicProfile, setIsPublicProfile] = useState(userProfile?.isPublic || false);
  const [publicUsername, setPublicUsername] = useState(userProfile?.publicUsername || '');
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const reauthenticate = async (currentPassword) => {
    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPassword);
    return currentUser.reauthenticateWithCredential(credential);
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const q = query(collection(db, 'users'), where('publicUsername', '==', username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return true;
      let available = true;
      querySnapshot.forEach(docSnap => {
        if (docSnap.id !== currentUser.uid) {
          available = false;
        }
      });
      return available;
    } catch (error) {
      console.error("Error checking username availability: ", error);
      return false;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access media library is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
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

  const handlePublicProfileToggle = (value) => {
    if (value) {
      Alert.alert("Make Profile Public", "Making your profile public means that your outfit choices and public username will be visible to other users. Do you want to proceed?", [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => setIsPublicProfile(true) }
      ]);
    } else {
      setIsPublicProfile(false);
    }
  };

  const canChangeUsername = () => {
    if (userProfile?.lastUsernameChange) {
      const lastChange = new Date(userProfile.lastUsernameChange);
      const now = new Date();
      const days30 = 30 * 24 * 60 * 60 * 1000;
      return now - lastChange >= days30;
    }
    return true;
  };

  const handleUpdatePublicProfile = async () => {
    if (!canChangeUsername() && userProfile?.publicUsername && userProfile.publicUsername !== publicUsername) {
      Alert.alert("Username Change Limit", "You can only change your username once every 30 days.");
      return;
    }
    if (isPublicProfile) {
      const available = await checkUsernameAvailability(publicUsername);
      if (!available) {
        Alert.alert("Username Taken", "This username is already in use. Please choose another.");
        return;
      }
    }
    Alert.alert("Confirm Username", "Once confirmed, you will not be able to change your username for the next 30 days. Do you want to proceed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const updateData = {
              isPublic: isPublicProfile,
              publicUsername: publicUsername,
            };
            if (userProfile?.publicUsername !== publicUsername) {
              updateData.lastUsernameChange = new Date().toISOString();
            }
            await updateUserProfile(updateData);
            Alert.alert("Success", "Public profile updated successfully.");
          } catch (error) {
            Alert.alert("Update Failed", error.message);
          }
        }
      }
    ]);
  };

  const handleEmailUpdate = async () => {
    if (newEmail !== confirmNewEmail) {
      Alert.alert("Error", "New email and confirmation do not match.");
      return;
    }
    try {
      await reauthenticate(currentPasswordForEmail);
      await currentUser.updateEmail(newEmail);
      await updateUserProfile({ email: newEmail });
      Alert.alert("Success", "Email updated successfully.");
      setEmailModalVisible(false);
      resetEmailForm();
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New password and confirmation do not match.");
      return;
    }
    try {
      await reauthenticate(currentPasswordForPassword);
      await currentUser.updatePassword(newPassword);
      Alert.alert("Success", "Password updated successfully.");
      setPasswordModalVisible(false);
      resetPasswordForm();
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    }
  };

  const resetEmailForm = () => {
    setCurrentPasswordForEmail('');
    setNewEmail('');
    setConfirmNewEmail('');
    setShowEmailPassword(false);
  };

  const resetPasswordForm = () => {
    setCurrentPasswordForPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => { logout(); navigation.navigate('Home'); } }
    ]);
  };

  const dismissEmailModal = () => {
    Keyboard.dismiss();
    setEmailModalVisible(false);
    resetEmailForm();
  };

  const dismissPasswordModal = () => {
    Keyboard.dismiss();
    setPasswordModalVisible(false);
    resetPasswordForm();
  };

  // Function to prevent modal dismiss when clicking on the modal content
  const handleModalContentPress = (e) => {
    e.stopPropagation();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage}>
          <Image source={{ uri: profileImage }} style={styles.profilePic} />
          <Text style={styles.editProfileText}>Tap to update profile picture</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>
          {currentUser?.displayName || userProfile?.name || "User Name"}
        </Text>
        <Text style={styles.infoText}>
          {currentUser?.email || "user@example.com"}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.button} onPress={() => setEmailModalVisible(true)}>
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setPasswordModalVisible(true)}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <Text style={styles.infoText}>Make Profile Public</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#48AAA6" }}
            thumbColor={isPublicProfile ? "#027d7d" : "#505454"}
            value={isPublicProfile}
            onValueChange={handlePublicProfileToggle}
          />
        </View>
        {isPublicProfile && (
          <>
            <Text style={styles.label}>Public Username</Text>
            <TextInput 
              style={[styles.input, !canChangeUsername() && styles.disabledInput]}
              placeholder="Enter public username"
              placeholderTextColor="#888"
              value={publicUsername}
              onChangeText={(text) => {
                if (canChangeUsername()) {
                  setPublicUsername(text);
                } else {
                  Alert.alert("Username Change Limit", "You can only change your username once every 30 days.");
                }
              }}
              editable={canChangeUsername()}
              autoCapitalize="none"
            />
            <Text style={styles.noteText}>
              Once confirmed, you will not be able to change your username for 30 days.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleUpdatePublicProfile}>
              <Text style={styles.buttonText}>Save Public Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <TouchableOpacity style={styles.helpButton} onPress={() => navigation.navigate('Help')}>
        <Text style={styles.helpText}>Help & Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Email Change Modal */}
      <Modal
        visible={isEmailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={dismissEmailModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={dismissEmailModal}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback onPress={handleModalContentPress}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Change Email</Text>
                  
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Current Password"
                      placeholderTextColor="#888"
                      secureTextEntry={!showEmailPassword}
                      value={currentPasswordForEmail}
                      onChangeText={setCurrentPasswordForEmail}
                    />
                    <TouchableOpacity onPress={() => setShowEmailPassword(!showEmailPassword)} style={styles.eyeIcon}>
                      <Ionicons name={showEmailPassword ? "eye-off" : "eye"} size={24} color="#888" />
                    </TouchableOpacity>
                  </View>
                  
                  <TextInput
                    style={styles.modalInput}
                    placeholder="New Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={newEmail}
                    onChangeText={setNewEmail}
                  />
                  
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Confirm New Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={confirmNewEmail}
                    onChangeText={setConfirmNewEmail}
                  />
                  
                  <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButtonCancel} onPress={dismissEmailModal}>
                      <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButtonSave} onPress={handleEmailUpdate}>
                      <Text style={styles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        visible={isPasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={dismissPasswordModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={dismissPasswordModal}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback onPress={handleModalContentPress}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Change Password</Text>
                  
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Current Password"
                      placeholderTextColor="#888"
                      secureTextEntry={!showCurrentPassword}
                      value={currentPasswordForPassword}
                      onChangeText={setCurrentPasswordForPassword}
                    />
                    <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
                      <Ionicons name={showCurrentPassword ? "eye-off" : "eye"} size={24} color="#888" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="New Password"
                      placeholderTextColor="#888"
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                      <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={24} color="#888" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Confirm New Password"
                      placeholderTextColor="#888"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmNewPassword}
                      onChangeText={setConfirmNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                      <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#888" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButtonCancel} onPress={dismissPasswordModal}>
                      <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButtonSave} onPress={handlePasswordUpdate}>
                      <Text style={styles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  noteText: {
    fontSize: 12,
    color: '#555',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#eee',
  },
  button: {
    backgroundColor: '#48AAA6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
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
    marginBottom: 30, // Added extra padding at bottom
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles - completely revised
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 15,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#48AAA6',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  modalInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButtonSave: {
    backgroundColor: '#F2B705',
    paddingVertical: 15,
    flex: 1,
    marginLeft: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: 'transparent',
    borderColor: '#48AAA6',
    borderWidth: 1,
    paddingVertical: 15,
    flex: 1,
    marginRight: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextCancel: {
    color: '#48AAA6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;