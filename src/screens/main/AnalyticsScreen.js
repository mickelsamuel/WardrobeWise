import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const OutfitAnalyticsScreen = () => {
  const navigation = useNavigation();

  // Sample Data
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [5, 11, 7, 15, 12],
      },
    ],
  };

  const leastWornItems = [
    { id: '1', name: 'Blue Denim Jacket' },
    { id: '2', name: 'Red Sneakers' },
    { id: '3', name: 'Striped Sweater' },
  ];

  const tips = [
    'Try pairing least worn items with your favorites!',
    'Rotate your outfits to get better cost-per-wear.',
    'Sustainable fashion means making use of what you own!',
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Navigation Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Outfit History/Analytics</Text>
        </View>
        
        {/* Graph Section */}
        <Text style={styles.sectionTitle}>Outfit Frequency</Text>
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(242, 183, 5, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={{ 
            marginVertical: 10, 
            borderRadius: 20,
          }}
        />

        {/* Cost-Per-Wear & Sustainability Score */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Cost-Per-Wear</Text>
            <Text style={styles.metricValue}>$2.75</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Sustainability</Text>
            <Text style={styles.metricValue}>85%</Text>
          </View>
        </View>

        {/* Least Worn Items */}
        <Text style={styles.sectionTitle}>Least Worn Items</Text>
        <View style={styles.listContainer}>
          <FlatList
            data={leastWornItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItemBox}>
                <Text style={styles.listItem}>{item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* Tips Section */}
        <Text style={styles.sectionTitle}>Tips for Better Usage</Text>
        {tips.map((tip, index) => (
          <View style={styles.tipBox} key={index}>
            <Text style={styles.tipText}>• {tip}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 30, // Ensures scroll space at the bottom
  },
  backButton: {
    marginTop: 20,
  },
  backText: {
    color: '#F2B705',
    fontSize: 16,
  },
  header: {
    marginTop: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48AAA6',
    marginTop: 5,
  },
  listContainer: {
    marginVertical: 10,
  },
  listItemBox: {
    backgroundColor: '#FFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
  },
  tipBox: {
    backgroundColor: '#FFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipText: {
    fontSize: 16,
    color: '#555',
  },
});

export default OutfitAnalyticsScreen;