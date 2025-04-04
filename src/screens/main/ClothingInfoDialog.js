// src/screens/main/ClothingInfoDialog.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';

const ClothingInfoDialog = ({ visible, onClose, item }) => {
  if (!item) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogContainer}>
          <Image 
            source={item.image} 
            style={styles.dialogImage} 
            accessibilityLabel={`${item.name} image`} 
          />
          <Text style={styles.dialogTitle}>{item.name}</Text>
          <Text style={styles.dialogInfo}>Last Worn: {item.lastWorn}</Text>
          <Text style={styles.dialogInfo}>Times Worn: {item.timesWorn}</Text>
          <Text style={styles.dialogInfo}>Price: ${item.price}</Text>
          <Text style={styles.dialogInfo}>Cost Per Wear: ${item.costPerWear}</Text>
          <TouchableOpacity
            style={styles.dialogCloseButton}
            onPress={onClose}
            accessibilityLabel="Close dialog"
          >
            <Text style={styles.dialogCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ClothingInfoDialog;

const styles = StyleSheet.create({
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialogContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  dialogImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 12,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48AAA6',
    marginBottom: 8,
    textAlign: 'center',
  },
  dialogInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  dialogCloseButton: {
    marginTop: 16,
    backgroundColor: '#F2B705',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dialogCloseText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});