import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import DetailsUpdator from './Details_updator';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  number: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'details'>('home');
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', name: 'Honda City', type: 'Car', number: 'MH12AB1234' },
    { id: '2', name: 'Royal Enfield', type: 'Bike', number: 'MH14CD5678' },
  ]);

  if (currentPage === 'details') {
    return <DetailsUpdator onBack={() => setCurrentPage('home')} />;
  }

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleItem}>
      <Text style={styles.vehicleName}>{item.name}</Text>
      <Text style={styles.vehicleDetails}>{item.type} - {item.number}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Party Section Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Party Section</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Details List Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details List</Text>
          <FlatList
            data={vehicles}
            renderItem={renderVehicleItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Update New Details Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => setCurrentPage('details')}
          >
            <Text style={styles.updateButtonText}>+ Update New Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  vehicleItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
