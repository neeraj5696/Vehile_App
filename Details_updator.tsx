import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

interface DetailsUpdatorProps {
  onBack: () => void;
}

function DetailsUpdator({ onBack }: DetailsUpdatorProps) {
  const [date, setDate] = useState(new Date().toDateString());
  const [driverDetails, setDriverDetails] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Current Date</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateText}>{date}</Text>
          </TouchableOpacity>
        </View>

        {/* Driver Details Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Driver Details</Text>
          <TextInput
            style={styles.input}
            value={driverDetails}
            onChangeText={setDriverDetails}
            placeholder="Enter driver name"
            placeholderTextColor="#999"
          />
        </View>

        {/* Vehicle No Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Vehicle No</Text>
          <TextInput
            style={styles.input}
            value={vehicleNo}
            onChangeText={setVehicleNo}
            placeholder="Enter vehicle number"
            placeholderTextColor="#999"
          />
        </View>

        {/* Pair Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pair</Text>
          
          <View style={styles.pairContainer}>
            <View style={styles.pairField}>
              <Text style={styles.label}>From</Text>
              <TextInput
                style={styles.input}
                value={fromLocation}
                onChangeText={setFromLocation}
                placeholder="From location"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.pairField}>
              <Text style={styles.label}>To</Text>
              <TextInput
                style={styles.input}
                value={toLocation}
                onChangeText={setToLocation}
                placeholder="To location"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  dateInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  pairContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pairField: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DetailsUpdator;