import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const OutfitAnalyticsScreen = () => {
  const navigation = useNavigation();

  // Sample Data for Line Chart (Monthly Outfit Frequency)
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [5, 11, 7, 15, 12],
      },
    ],
  };

  // Sample Data for Most Worn Items (Bar Chart)
  const mostWornData = {
    labels: ['T-Shirt', 'Jeans', 'Sneakers'],
    datasets: [
      {
        data: [20, 18, 15],
      },
    ],
  };

  // Sample Data for Least Worn Items (Bar Chart)
  const leastWornChartData = {
    labels: ['Jacket', 'Sneakers', 'Sweater'],
    datasets: [
      {
        data: [2, 3, 1],
      },
    ],
  };

  // Sample Data for Category Distribution (Pie Chart)
  const categoryData = [
    { name: 'Tops', population: 40, color: '#48AAA6', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Bottoms', population: 30, color: '#F2B705', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Accessories', population: 30, color: '#A569BD', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

  // Sample Tips for Better Usage
  const tips = [
    'Try pairing least worn items with your favorites!',
    'Rotate your outfits to get better cost-per-wear.',
    'Sustainable fashion means making use of what you own!',
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Navigation Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Outfit History/Analytics</Text>
        </View>

        {/* Monthly Outfit Frequency - Line Chart */}
        <Text style={styles.sectionTitle}>Monthly Outfit Frequency</Text>
        <LineChart
          data={lineChartData}
          width={Dimensions.get('window').width - 32}
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
          style={styles.chartStyle}
        />

        {/* Most Worn Items - Bar Chart */}
        <Text style={styles.sectionTitle}>Most Worn Items</Text>
        <BarChart
          data={mostWornData}
          width={Dimensions.get('window').width - 32}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(72, 170, 166, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chartStyle}
          verticalLabelRotation={0}
        />

        {/* Least Worn Items - Bar Chart */}
        <Text style={styles.sectionTitle}>Least Worn Items</Text>
        <BarChart
          data={leastWornChartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(242, 183, 5, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chartStyle}
          verticalLabelRotation={0}
        />

        {/* Category Distribution - Pie Chart */}
        <Text style={styles.sectionTitle}>Category Distribution</Text>
        <PieChart
          data={categoryData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chartStyle}
        />

        {/* Cost-Per-Wear & Sustainability Score */}
        <Text style={styles.sectionTitle}>Metrics</Text>
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
    backgroundColor: '#F7F7F7', 
  },
  scrollContainer: {
    padding: 16, 
    paddingBottom: 30,
  },
  backButton: {
    marginTop: 20,
    minHeight: 44, 
    justifyContent: 'center',
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
    marginVertical: 10,
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 20,
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