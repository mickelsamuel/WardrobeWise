// src/screens/HelpScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const HelpScreen = () => {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (subject.trim() === '' || message.trim() === '') {
      Alert.alert('Missing Information', 'Please enter both a subject and a message.');
      return;
    }
    Alert.alert(
      'Request Submitted',
      'Your help request has been sent. We will contact you soon.'
    );
    setSubject('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={20}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Help & Support</Text>

        <Text style={styles.bodyText}>
          Welcome to the Help & Support page for WardrobeWise. Here you can find FAQs, contact
          information, troubleshooting guides, and even send a direct request to our support team.
        </Text>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Contact Information</Text>
          <Text style={styles.bodyText}>Email: mickelsamuel.b@gmail.com</Text>
          <Text style={styles.bodyText}>Phone: 1-800-123-4567</Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: How do I catalog my wardrobe?</Text>
            <Text style={styles.faqAnswer}>
              A: Simply tap on the "Upload & Catalog" button, snap a photo of your clothing, and our
              app will automatically classify your item by category and color.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: How do I get smart outfit suggestions?</Text>
            <Text style={styles.faqAnswer}>
              A: Our smart algorithm considers your personal style, weather, and upcoming events to
              suggest the best outfit combinations for your day.
            </Text>
          </View>
        </View>

        {/* Request Form Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Send Us a Request</Text>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor="#888"
            accessibilityLabel="Subject input"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your issue or question..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholderTextColor="#888"
            accessibilityLabel="Message input"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit Help Request"
          >
            <Text style={styles.buttonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 16,
  },
  backText: {
    fontSize: 16,
    color: '#F2B705',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48AAA6',
    marginBottom: 20,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48AAA6',
    marginBottom: 10,
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#48AAA6',
  },
  faqAnswer: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    backgroundColor: '#F7F7F7',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#F2B705',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default HelpScreen;