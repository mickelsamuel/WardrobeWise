// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerWithEmail, useGoogleAuth } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { handleGoogleSignIn } = useGoogleAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { user, error } = await registerWithEmail(email, password, name);
      if (error) {
        Alert.alert('Registration Failed', error.message);
      } else if (user) {
        await AsyncStorage.setItem('userToken', user.token);
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignInPress = async () => {
    setLoading(true);
    try {
      const result = await handleGoogleSignIn();
      if (result.error) {
        Alert.alert('Google Sign In Failed', result.error.message);
      } else if (result.user) {
        await AsyncStorage.setItem('userToken', result.user.token);
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error', 'Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="WardrobeWise Logo"
          />
          <Text style={styles.appName}>WardrobeWise</Text>
        </View>
        
        <Text style={styles.title}>Create Your Account</Text>
        
        <TextInput
          style={[styles.input, { width: '100%' }]}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          selectTextOnFocus={true}
        />
        
        <TextInput
          style={[styles.input, { width: '100%' }]}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          selectTextOnFocus={true}
        />
        
        <TextInput
          style={[styles.input, { width: '100%' }]}
          placeholder="Password (min. 6 characters)"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          selectTextOnFocus={true}
        />
        
        <TextInput
          style={[styles.input, { width: '100%' }]}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          selectTextOnFocus={true}
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>
        
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleSignInPress}
          disabled={loading}
        >
          <Image 
            source={require('../../../assets/google-logo.png')}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signInLink} 
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#48AAA6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48AAA6',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#F2B705',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  signInLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  signInText: {
    color: '#48AAA6',
    fontSize: 14,
    textAlign: 'center',
  },
  signInTextBold: {
    fontWeight: 'bold',
  },
});