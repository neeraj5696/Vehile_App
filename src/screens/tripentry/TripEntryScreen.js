import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { tripService } from '../../config/firebase';

const TripEntryScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    vehicleNo: '',
    driverName: '',
    from: '',
    to: '',
  });
  const [loading, setLoading] = useState(false);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.vehicleNo.trim()) {
      Alert.alert('Error', 'Vehicle number is required');
      return;
    }
    if (!formData.driverName.trim()) {
      Alert.alert('Error', 'Driver name is required');
      return;
    }
    if (!formData.from.trim()) {
      Alert.alert('Error', 'From location is required');
      return;
    }
    if (!formData.to.trim()) {
      Alert.alert('Error', 'To location is required');
      return;
    }

    setLoading(true);
    try {
      const tripData = {
        ...formData,
        vehicleNo: formData.vehicleNo.toUpperCase().trim(),
        driverName: formData.driverName.trim(),
        from: formData.from.trim(),
        to: formData.to.trim(),
        date: getCurrentDate(),
      };

      await tripService.addTrip(tripData);
      
      Alert.alert('Success', 'Trip added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setFormData({ vehicleNo: '', driverName: '', from: '', to: '' });
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding trip:', error);
      Alert.alert('Error', 'Failed to add trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Trip</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.form}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Date:</Text>
          <Text style={styles.dateValue}>{getCurrentDate()}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.vehicleNo}
            onChangeText={(text) => setFormData({ ...formData, vehicleNo: text })}
            placeholder="Enter vehicle number"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Driver Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.driverName}
            onChangeText={(text) => setFormData({ ...formData, driverName: text })}
            placeholder="Enter driver name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>From Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.from}
            onChangeText={(text) => setFormData({ ...formData, from: text })}
            placeholder="Enter from location"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>To Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.to}
            onChangeText={(text) => setFormData({ ...formData, to: text })}
            placeholder="Enter to location"
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Add Trip</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#1976d2',
    elevation: 4,
  },
  headerRight: {
    width: 60,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateValue: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TripEntryScreen;