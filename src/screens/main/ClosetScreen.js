// src/screens/main/ClosetScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Image 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ClothingInfoDialog from './ClothingInfoDialog';

const typeFilters = ["Tops", "Bottoms", "Shoes", "Accessories"];
const colorFilters = ["Red", "Blue", "Green", "Black", "White"];
const frequencyFilters = ["Most Worn", "Least Worn"];

const dummyItems = [
  { id: '1', name: 'Red Dress', timesWorn: 5, type: 'Tops', color: 'Red', lastWorn: '2025-03-15', price: 75, image: require('../../../assets/red_dress.jpg') },
  { id: '2', name: 'Blue Jeans', timesWorn: 3, type: 'Bottoms', color: 'Blue', lastWorn: '2025-03-12', price: 50, image: require('../../../assets/blue_jeans.jpg') },
  { id: '3', name: 'White Shirt', timesWorn: 8, type: 'Tops', color: 'White', lastWorn: '2025-03-18', price: 30, image: require('../../../assets/white_shirt.jpg') },
  { id: '4', name: 'Black Jacket', timesWorn: 2, type: 'Tops', color: 'Black', lastWorn: '2025-03-20', price: 120, image: require('../../../assets/black_jacket.jpg') },
  { id: '5', name: 'Green Skirt', timesWorn: 6, type: 'Bottoms', color: 'Green', lastWorn: '2025-03-10', price: 40, image: require('../../../assets/green_skirt.jpg') },
  { id: '6', name: 'Red Sneakers', timesWorn: 4, type: 'Shoes', color: 'Red', lastWorn: '2025-03-19', price: 100, image: require('../../../assets/red_sneakers.webp') },
];

const ClosetScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const navigation = useNavigation();

  const filteredItems = dummyItems.filter(item => {
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openDialog(item)}>
      <View style={styles.itemThumbnailContainer}>
        <Image 
          source={item.image}
          style={styles.itemThumbnail}
          resizeMode="cover"
          accessibilityLabel={`${item.name} thumbnail`}
        />
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.timesWornContainer}>
          <Ionicons name="time-outline" size={16} color="#48AAA6" />
          <Text style={styles.timesWornText}>{item.timesWorn}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const openDialog = (item) => {
    const costPerWear = item.timesWorn ? (item.price / item.timesWorn).toFixed(2) : item.price.toFixed(2);
    // Pass the computed costPerWear to the dialog by extending the item
    setSelectedItem({ ...item, costPerWear });
    setDialogVisible(true);
  };
  
  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Closet</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your closet..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          selectTextOnFocus={true}
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

      {/* Clothing Items Grid */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.itemsGrid}
        columnWrapperStyle={{
          justifyContent: 'space-evenly',
        }}
      />

      <ClothingInfoDialog
        visible={dialogVisible}
        onClose={closeDialog}
        item={selectedItem}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddClothing')}
        accessibilityLabel="Add new clothing item"
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ClosetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
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
  },
  filterChip: {
    backgroundColor: '#48AAA6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
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
  itemsGrid: {
    paddingBottom: 80,
  },
  itemThumbnailContainer: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    margin: 8,
    alignItems: 'center',
  },
  itemThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
  },
  timesWornContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timesWornText: {
    fontSize: 14,
    color: '#48AAA6',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#F2B705',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});