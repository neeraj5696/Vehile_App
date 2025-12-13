import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { db } from '../../config/firebase';
import firestore from '@react-native-firebase/firestore';

const AddCustomer = ({ navigation }) => {
  const [customerData, setCustomerData] = useState({
    msName: '',
    address1: '',
    address2: '',
    gstin: '',
    phoneNo: '',
    email: '',
  });

  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateGSTIN = (gstin) => {
    // GSTIN validation regex (simplified version)
    const gstinRegex = /^[0-9]/
    
    //{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    //{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const validatePhone = (phone) => {
    // Phone number validation (10 digits, starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCustomer = async () => {
    if (isSaving) return; // Prevent multiple submissions
    
    // Validate required fields
    if (!customerData.msName?.trim()) {
      Alert.alert('Error', 'Customer name is required');
      return;
    }
    if (!customerData.address1?.trim()) {
      Alert.alert('Error', 'Address line 1 is required');
      return;
    }
    if (!customerData.gstin?.trim()) {
      Alert.alert('Error', 'GSTIN is required');
      return;
    } else if (!validateGSTIN(customerData.gstin.trim())) {
      Alert.alert('Error', 'Please enter a valid GSTIN');
      return;
    }
    if (!customerData.phoneNo?.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    } else if (!validatePhone(customerData.phoneNo.trim())) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    if (!validateEmail(customerData.email?.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsSaving(true);
      
      // Save customer data to Firestore
      const customerDataToSave = {
        msName: customerData.msName.trim(),
        address1: customerData.address1.trim(),
        address2: customerData.address2?.trim() || '',
        gstin: customerData.gstin.trim(),
        phoneNo: customerData.phoneNo.trim(),
        email: customerData.email?.trim() || '',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };
      
      const docRef = await db.collection('customers').add(customerDataToSave);
      
      Alert.alert('Success', 'Customer saved successfully!', [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]);
    } catch (error) {
      console.error('Error saving customer:', error);
      Alert.alert(
        'Error', 
        error.message || 'Failed to save customer. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Customer</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form */}
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>M/s Name *</Text>
          <TextInput
            style={styles.input}
            value={customerData.msName}
            onChangeText={(value) => handleInputChange('msName', value)}
            placeholder="Enter company name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address 1 *</Text>
          <TextInput
            style={styles.input}
            value={customerData.address1}
            onChangeText={(value) => handleInputChange('address1', value)}
            placeholder="Enter address line 1"
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address 2</Text>
          <TextInput
            style={styles.input}
            value={customerData.address2}
            onChangeText={(value) => handleInputChange('address2', value)}
            placeholder="Enter address line 2"
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>GSTIN *</Text>
          <TextInput
            style={styles.input}
            value={customerData.gstin}
            onChangeText={(value) => handleInputChange('gstin', value)}
            placeholder="Enter GSTIN number"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone No *</Text>
          <TextInput
            style={styles.input}
            value={customerData.phoneNo}
            onChangeText={(value) => handleInputChange('phoneNo', value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            value={customerData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.button, styles.saveButton, isSaving && styles.disabledButton]}
        onPress={handleSaveCustomer}
        disabled={isSaving}
      >  
        <Text style={styles.saveButtonText}>Save Customer</Text>
      </TouchableOpacity>
    </View>
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
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#1976d2',
  },
  disabledButton: {
    backgroundColor: '#9e9e9e',
    opacity: 0.7,
  },
  button: {
    margin: 20,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddCustomer;