// src/screens/auth/SignInScreen.js
import React, { useState, useRef } from 'react';
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
import { signInWithEmail, useGoogleAuth, resetPassword } from '../../services/authService';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const { handleGoogleSignIn } = useGoogleAuth();

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { user, error } = await signInWithEmail(email, password);
      if (error) {
        Alert.alert('Sign In Failed', error.message);
      } else if (user) {
        // Optionally store token if available
        if (user.token) {
          await AsyncStorage.setItem('userToken', user.token);
        }
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
        // Optionally store token if available
        if (result.user.token) {
          await AsyncStorage.setItem('userToken', result.user.token);
        }
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error', 'Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };  

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address to reset your password');
      return;
    }
    setResetLoading(true);
    try {
      const { success, error } = await resetPassword(email);
      if (success) {
        Alert.alert('Password Reset', 'Check your email for instructions to reset your password');
      } else if (error) {
        Alert.alert('Error', error.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setResetLoading(false);
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

        <Text style={styles.title}>Welcome Back</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={emailInputRef}
            style={[styles.input, { flex: 1 }]}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            selectTextOnFocus={true}
          />
        </View>

        {/* Password Input with Toggle */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={passwordInputRef}
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            selectTextOnFocus={true}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Google Sign In Button */}
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
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Forgot Password & Register Links */}
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={handleForgotPassword} disabled={resetLoading}>
            <Text style={styles.linkText}>
              {resetLoading ? 'Sending reset link...' : 'Forgot Password?'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Don’t have an account? Sign up here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

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
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    padding: 8,
  },
  signInButton: {
    backgroundColor: '#F2B705',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  linkContainer: {
    marginTop: 10,
  },
  linkText: {
    color: '#48AAA6',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
  },
});