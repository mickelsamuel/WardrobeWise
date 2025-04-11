// src/screens/main/OutfitCustomizerScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  FlatList, 
  Image,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Get screen width to calculate item width
const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 48 = padding (16) * 2 + spacing between items (16)

const typeFilters = ["Tops", "Bottoms", "Shoes", "Accessories"];
const colorFilters = ["Red", "Blue", "Green", "Black", "White"];
const frequencyFilters = ["Most Worn", "Least Worn"];

const [selectedWeather, setSelectedWeather] = useState(null);
const [selectedOccasion, setSelectedOccasion] = useState(null);

const dummyItems = [
  { id: '1', name: 'Red Dress', timesWorn: 5, type: 'Tops', color: 'Red', lastWorn: '2025-03-15', price: 75, image: require('../../../assets/red_dress.jpg') },
  { id: '2', name: 'Blue Jeans', timesWorn: 3, type: 'Bottoms', color: 'Blue', lastWorn: '2025-03-12', price: 50, image: require('../../../assets/blue_jeans.jpg') },
  { id: '3', name: 'White Shirt', timesWorn: 8, type: 'Tops', color: 'White', lastWorn: '2025-03-18', price: 30, image: require('../../../assets/white_shirt.jpg') },
  { id: '4', name: 'Black Jacket', timesWorn: 2, type: 'Tops', color: 'Black', lastWorn: '2025-03-20', price: 120, image: require('../../../assets/black_jacket.jpg') },
  { id: '5', name: 'Green Skirt', timesWorn: 6, type: 'Bottoms', color: 'Green', lastWorn: '2025-03-10', price: 40, image: require('../../../assets/green_skirt.jpg') },
  { id: '6', name: 'Red Sneakers', timesWorn: 4, type: 'Shoes', color: 'Red', lastWorn: '2025-03-19', price: 100, image: require('../../../assets/red_sneakers.webp') },
];

const OutfitCustomizerScreen = () => {
  const navigation = useNavigation();
  

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filtering logic
  let filteredItems = dummyItems.filter(item => {
    if (searchText.trim() && !item.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    if (selectedType && item.type !== selectedType) {
      return false;
    }
    if (selectedColor && item.color !== selectedColor) {
      return false;
    }
    return true;
  });

  if (selectedFrequency === "Most Worn") {
    filteredItems.sort((a, b) => b.timesWorn - a.timesWorn);
  } else if (selectedFrequency === "Least Worn") {
    filteredItems.sort((a, b) => a.timesWorn - b.timesWorn);
  }

  const handleConfirmOutfit = () => {
    console.log('Outfit confirmed!', selectedItem);
  };

  const handleReshuffle = () => {
    console.log('Outfit reshuffled!');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => setSelectedItem(item)}
      style={[
        styles.itemThumbnailContainer,
        selectedItem?.id === item.id && styles.selectedItemContainer
      ]}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={item.image}
          style={styles.itemThumbnail}
          resizeMode="cover"
          accessibilityLabel={`${item.name} thumbnail`}
        />
      </View>
      <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
      <View style={styles.timesWornContainer}>
        <Ionicons name="time-outline" size={16} color="#48AAA6" />
        <Text style={styles.timesWornText}>{item.timesWorn}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Navigation */}
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
        {/* Preview Pane */}
        <View style={styles.previewPane}>
          {selectedItem ? (
            <Image 
              source={selectedItem.image}
              style={styles.previewImage}
              resizeMode="contain"
              accessibilityLabel="Selected Outfit Preview"
            />
          ) : (
            <Text style={styles.previewPlaceholder}>
              Select an item to preview your outfit
            </Text>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filter Section: Type */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Filter by Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterChipsContainer}
          >
            {typeFilters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterChip,
                  selectedType === filter && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedType(selectedType === filter ? null : filter)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedType === filter && styles.filterChipTextSelected,
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

 {/* Filter Section: Color */}
<View style={styles.filterSection}>
  <Text style={styles.filterSectionTitle}>Filter by Color</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterChipsContainer}
  >
    {["Red", "Blue", "Green", "Black"].map((filter, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.filterChip,
          selectedColor === filter && styles.filterChipSelected,
        ]}
        onPress={() => setSelectedColor(selectedColor === filter ? null : filter)}
      >
        <Text style={[
          styles.filterChipText,
          selectedColor === filter && styles.filterChipTextSelected,
        ]}>
          {filter}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>

{/* Filter Section: Weather */}
<View style={styles.filterSection}>
  <Text style={styles.filterSectionTitle}>Filter by Weather</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterChipsContainer}
  >
    {["Sunny", "Rainy", "Cold", "Hot"].map((filter, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.filterChip,
          selectedWeather === filter && styles.filterChipSelected,
        ]}
        onPress={() => setSelectedWeather(selectedWeather === filter ? null : filter)}
      >
        <Text style={[
          styles.filterChipText,
          selectedWeather === filter && styles.filterChipTextSelected,
        ]}>
          {filter}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>

{/* Filter Section: Occasion */}
<View style={styles.filterSection}>
  <Text style={styles.filterSectionTitle}>Filter by Occasion</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterChipsContainer}
  >
    {["Casual", "Formal", "Sport", "Party"].map((filter, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.filterChip,
          selectedOccasion === filter && styles.filterChipSelected,
        ]}
        onPress={() => setSelectedOccasion(selectedOccasion === filter ? null : filter)}
      >
        <Text style={[
          styles.filterChipText,
          selectedOccasion === filter && styles.filterChipTextSelected,
        ]}>
          {filter}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterChipsContainer}
          >
            {colorFilters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterChip,
                  selectedColor === filter && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedColor(selectedColor === filter ? null : filter)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedColor === filter && styles.filterChipTextSelected,
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        
        {/* Sort Section: Frequency */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Sort by Frequency</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterChipsContainer}
          >
            {frequencyFilters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterChip,
                  selectedFrequency === filter && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedFrequency(selectedFrequency === filter ? null : filter)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFrequency === filter && styles.filterChipTextSelected,
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Items Grid */}
        <Text style={styles.gridTitle}>
          {filteredItems.length} {filteredItems.length === 1 ? 'Item' : 'Items'} Found
        </Text>
        
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.itemsGrid}
          columnWrapperStyle={styles.columnWrapper}
        />
        <View style={styles.actionButtonsContainer}>
  <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOutfit}>
    <Text style={styles.confirmButtonText}>Confirm Outfit</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.reshuffleButton} onPress={handleReshuffle}>
    <Text style={styles.reshuffleButtonText}>Reshuffle</Text>
  </TouchableOpacity>
</View>
<View style={styles.summaryContainer}>
  {selectedItem ? (
    <>
      <Text style={styles.summaryTitle}>Selected Item:</Text>
      <Text style={styles.summaryText}>• {selectedItem.name}</Text>
      <Text style={styles.summaryText}>• Worn {selectedItem.timesWorn} times</Text>
      <Text style={styles.summaryText}>• Last worn on {selectedItem.lastWorn}</Text>
      <Text style={styles.summaryText}>• ${selectedItem.price}</Text>
    </>
  ) : (
    <Text style={styles.summaryPlaceholder}>No item selected yet</Text>
  )}
</View>

<TouchableOpacity 
  style={styles.addButton} 
  onPress={() => navigation.navigate('Closet')}
>
  <Text style={styles.addButtonText}>Go to Closet to Add More</Text>
</TouchableOpacity>

        {/* CTA Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[
              styles.confirmButton,
              !selectedItem && styles.disabledButton
            ]} 
            onPress={handleConfirmOutfit}
            disabled={!selectedItem}
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
    paddingBottom: 32,
  },
  previewPane: {
    height: 240,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  previewImage: {
    width: '85%',
    height: '85%',
  },
  previewPlaceholder: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  filterChip: {
    backgroundColor: '#48AAA6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  filterChipSelected: {
    backgroundColor: '#F2B705',
  },
  filterChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 8,
    marginBottom: 12,
  },
  itemsGrid: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemThumbnailContainer: {
    width: itemWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedItemContainer: {
    borderColor: '#F2B705',
    borderWidth: 2,
    backgroundColor: '#FFFBF0',
  },
  imageContainer: {
    width: '100%',
    height: itemWidth - 20, // Account for padding
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  itemThumbnail: {
    width: '100%',
    height: '100%',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
    width: '100%',
  },
  timesWornContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timesWornText: {
    fontSize: 14,
    color: '#48AAA6',
    marginLeft: 4,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#F2B705',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  reshuffleButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#48AAA6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  summaryPlaceholder: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#999',
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#48AAA6',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
