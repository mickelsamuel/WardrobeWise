// src/screens/main/OutfitCustomizerScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const filters = ['Shirts', 'Pants', 'Shoes', 'Accessories'];

const OutfitCustomizerScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const dummyItems = Array(4).fill(0);

  const handleSelectFilter = (filter) => {
    setSelectedFilter(prev => prev === filter ? null : filter);
  };

  const handleConfirmOutfit = () => {
    console.log('Outfit confirmed!');
  };

  const handleReshuffle = () => {
    console.log('Outfit reshuffled!');
  };

  return (
    <View style={styles.container}>
      {/* Custom Header with Back Navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#48AAA6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Outfit</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Outfit Preview Pane */}
        <View style={styles.previewPane}>
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.previewImage}
            resizeMode="contain"
            accessibilityLabel="Outfit Preview"
          />
        </View>

        {/* Filter Controls */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipSelected,
              ]}
              onPress={() => handleSelectFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.filterChipTextSelected,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Item Thumbnails Grid */}
        <View style={styles.itemsGrid}>
          {dummyItems.map((_, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.itemThumbnailContainer}
            >
              <Image 
                source={require('../../../assets/logo.png')}
                style={styles.itemThumbnail}
                resizeMode="cover"
                accessibilityLabel={`Item ${index + 1}`}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleConfirmOutfit}
          >
            <Text style={styles.buttonText}>Confirm Outfit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reshuffleButton} 
            onPress={handleReshuffle}
          >
            <Ionicons name="refresh-outline" size={20} color="#48AAA6" />
            <Text style={[styles.buttonText, { color: '#48AAA6', marginLeft: 6 }]}>
              Reshuffle
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default OutfitCustomizerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    marginTop: 40, 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48AAA6',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 40, 
  },
  previewPane: {
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  previewImage: {
    width: '80%',
    height: '80%',
  },
  filterContainer: {
    paddingVertical: 8,
  },
  filterChip: {
    backgroundColor: '#48AAA6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#F2B705',
  },
  filterChipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  itemThumbnailContainer: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  itemThumbnail: {
    width: 100,
    height: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  confirmButton: {
    backgroundColor: '#F2B705',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  reshuffleButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#48AAA6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});