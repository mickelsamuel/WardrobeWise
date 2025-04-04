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
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogContainer}>
          <Image source={item.image} style={styles.dialogImage} />
          <Text style={styles.dialogTitle}>{item.name}</Text>
          <Text style={styles.dialogInfo}>Last Time Worn: {item.lastWorn}</Text>
          <Text style={styles.dialogInfo}>Wear: {item.timesWorn}</Text>
          <Text style={styles.dialogInfo}>Price: ${item.price}</Text>
          <TouchableOpacity
            style={styles.dialogCloseButton}
            onPress={onClose}
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
  },
  dialogContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  dialogImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  dialogInfo: {
    fontSize: 16,
    color: '#777',
    marginBottom: 4,
  },
  dialogCloseButton: {
    marginTop: 16,
    backgroundColor: '#48AAA6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dialogCloseText: {
    fontSize: 16,
    color: '#fff',
  },
});