// src/screens/main/AddClothingScreen.js

import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView,
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';

const itemTypeOptions = ["Tops", "Bottoms", "Shoes", "Accessories"];
const colorOptions = ["Red", "Blue", "Green", "Black", "White"];
const styleOptions = ["Casual", "Formal", "Sport", "Vintage"];
const placeholderImage = 'https://via.placeholder.com/200x150';


const AddClothingScreen = () => {
  // State variables for the image and form fields
  const [image, setImage] = useState(null);
  const [itemType, setItemType] = useState('');
  const [color, setColor] = useState('');
  const [clothingStyle, setClothingStyle] = useState('');
  const [price, setPrice] = useState('');
  const [wearCount, setWearCount] = useState('');

  const [aiDetectedType, setAIDetectedType] = useState('');
  const [aiDetectedColor, setAIDetectedColor] = useState('');
  const [aiDetectedPattern, setAIDetectedPattern] = useState('');
  // Request permissions for camera and media library
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need camera roll permissions to make this work!');
      }
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permission needed', 'We need camera permissions to make this work!');
      }
    })();
  }, []);

  // Launch the camera to take a new photo
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      // Handle both the old and new structure of the result
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImage(uri);
    }
    if (!result.cancelled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImage(uri);
      setAIDetectedType('Tops');           // Simulated AI
      setAIDetectedColor('Red');           // Simulated AI
      setAIDetectedPattern('Striped');     // Simulated AI
    }
  };

  // Launch the media library to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImage(uri);
    }
    if (!result.cancelled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImage(uri);
      setAIDetectedType('Tops');           // Simulated AI
      setAIDetectedColor('Red');           // Simulated AI
      setAIDetectedPattern('Striped');     // Simulated AI
    }
  };

  // Validate inputs and simulate saving the clothing item
  const handleSave = () => {
    if (!image) {
      Alert.alert('No Image', 'Please select or capture an image of the clothing item.');
      return;
    }
    if (!itemType.trim() || !color.trim() || !clothingStyle.trim()) {
      Alert.alert('Incomplete Fields', 'Please fill in all required fields: Item Type, Color, and Style.');
      return;
    }
    // Here you would normally send the data to your backend
    Alert.alert('Success', 'Clothing item added to your closet!');
    // Clear the form after saving
    setImage(null);
    setItemType('');
    setColor('');
    setClothingStyle('');
    setPrice('');
    setWearCount('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={20}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
  <Text style={{ color: '#48AAA6', fontWeight: '600' }}>← Back to Closet</Text>
</TouchableOpacity>
        <Text style={styles.title}>Add New Clothing Item</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imagePreviewContainer}>
          <Image 
            source={{ uri: image || placeholderImage }} 
            style={[styles.imagePreview, !image && styles.imagePlaceholder]} 
            accessibilityLabel="Clothing image preview" 
          />
          {image && <View style={styles.boundingBox} />}
          {!image && (
            <View style={styles.placeholderOverlay}>
              <Text style={styles.placeholderText}>Image Preview</Text>
            </View>
            {image && (
              <View style={{ marginBottom: 12, width: '100%' }}>
                <Text style={styles.label}>AI Detected:</Text>
                <Text style={styles.aiResult}>Type: {aiDetectedType}</Text>
                <Text style={styles.aiResult}>Color: {aiDetectedColor}</Text>
                <Text style={styles.aiResult}>Pattern: {aiDetectedPattern}</Text>
                <Text style={styles.label}>You can manually override below</Text>
              </View>
            )}
          )}
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Item Type *</Text>
          <View style={styles.chipContainer}>
            {itemTypeOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.chip, itemType === option && styles.chipSelected]} 
                onPress={() => setItemType(option)}
              >
                <Text style={[styles.chipText, itemType === option && styles.chipTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Color *</Text>
          <View style={styles.chipContainer}>
            {colorOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.chip, color === option && styles.chipSelected]} 
                onPress={() => setColor(option)}
              >
                <Text style={[styles.chipText, color === option && styles.chipTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Style *</Text>
          <View style={styles.chipContainer}>
            {styleOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.chip, clothingStyle === option && styles.chipSelected]} 
                onPress={() => setClothingStyle(option)}
              >
                <Text style={[styles.chipText, clothingStyle === option && styles.chipTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Price (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 29.99"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Times Worn (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 3"
            value={wearCount}
            onChangeText={setWearCount}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Add Clothing</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 22, // H1/H2 style
    fontWeight: 'bold',
    color: '#48AAA6', // Primary color (muted teal)
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#48AAA6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  imagePreviewContainer: {
    marginBottom: 16,
    alignItems: 'center',
    width: 200,
    height: 150,
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 4,
  },
  imagePlaceholder: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  boundingBox: {
    position: 'absolute',
    width: 200,
    height: 150,
    borderWidth: 2,
    borderColor: '#48AAA6',
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  placeholderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  form: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#48AAA6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#F2B705',
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#F2B705', // Accent color for CTA
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiResult: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});

export default AddClothingScreen;