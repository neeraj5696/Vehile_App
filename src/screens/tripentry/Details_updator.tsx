import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Provider as PaperProvider,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';

interface LocationPair {
  id: number;
  from: string;
  to: string;
}

interface Trip {
  id: number;
  date: string;
  driverDetails: string;
  vehicleNo: string;
  pairs: LocationPair[];
}

interface DetailsUpdatorProps {
  onBack: () => void;
}

const { width } = Dimensions.get('window');

function DetailsUpdator({ onBack }: DetailsUpdatorProps) {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 1,
      date: new Date().toDateString(),
      driverDetails: '',
      vehicleNo: '',
      pairs: [{ id: 1, from: '', to: '' }]
    }
  ]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSuggestions, setCustomerSuggestions] = useState<{[key: string]: string[]}>({});
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState<{[key: string]: boolean}>({});
  const flatListRef = useRef<FlatList>(null);
  const customerDebounceRef = useRef<{[key: string]: number}>({});

  const addTrip = () => {
    const newId = Math.max(...trips.map(t => t.id)) + 1;
    const newTrip: Trip = {
      id: newId,
      date: new Date().toDateString(),
      driverDetails: '',
      vehicleNo: '',
      pairs: [{ id: 1, from: '', to: '' }]
    };
    setTrips([...trips, newTrip]);
    const newIndex = trips.length;
    setCurrentTripIndex(newIndex);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }, 100);
  };

  const deleteTrip = () => {
    if (trips.length > 1) {
      const newTrips = trips.filter((_, index) => index !== currentTripIndex);
      setTrips(newTrips);
      const newIndex = currentTripIndex > 0 ? currentTripIndex - 1 : 0;
      setCurrentTripIndex(newIndex);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      }, 100);
    }
  };

  const updateTrip = (field: keyof Trip, value: any) => {
    setTrips(trips.map((trip, index) => 
      index === currentTripIndex ? { ...trip, [field]: value } : trip
    ));
  };

  const addPair = () => {
    const currentTrip = trips[currentTripIndex];
    const currentPairs = currentTrip.pairs || [];
    const newId = currentPairs.length > 0 ? Math.max(...currentPairs.map(p => p.id)) + 1 : 1;
    const newPairs = [...currentPairs, { id: newId, from: '', to: '' }];
    updateTrip('pairs', newPairs);
  };

  const updatePair = (id: number, field: 'from' | 'to', value: string) => {
    const currentTrip = trips[currentTripIndex];
    const updatedPairs = currentTrip.pairs.map(pair => 
      pair.id === id ? { ...pair, [field]: value } : pair
    );
    updateTrip('pairs', updatedPairs);
  };

  const deletePair = (id: number) => {
    const currentTrip = trips[currentTripIndex];
    const updatedPairs = currentTrip.pairs.filter(pair => pair.id !== id);
    updateTrip('pairs', updatedPairs);
  };

  const searchCustomers = useCallback(async (query: string, key: string) => {
    if (!query.trim()) {
      setCustomerSuggestions(prev => ({ ...prev, [key]: [] }));
      return [];
    }

    try {
      const snapshot = await db.collection('companies')
        .where('name', '>=', query)
        .where('name', '<=', query + '\uf8ff')
        .limit(5)
        .get();
      
      const suggestions = snapshot.docs.map(doc => doc.data().name);
      setCustomerSuggestions(prev => ({ ...prev, [key]: suggestions }));
      return suggestions;
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  }, []);

  const handleCustomerChange = (pairId: number, field: 'from' | 'to', value: string) => {
    updatePair(pairId, field, value);
    
    const key = `${pairId}-${field}`;
    if (customerDebounceRef.current[key]) {
      clearTimeout(customerDebounceRef.current[key]);
    }
    
    customerDebounceRef.current[key] = setTimeout(async () => {
      const suggestions = await searchCustomers(value, key);
      setShowCustomerSuggestions(prev => ({
        ...prev,
        [key]: suggestions.length > 0
      }));
    }, 300);
  };

  const selectCustomer = (pairId: number, field: 'from' | 'to', customerName: string) => {
    updatePair(pairId, field, customerName);
    const key = `${pairId}-${field}`;
    setShowCustomerSuggestions(prev => ({
      ...prev,
      [key]: false
    }));
  };

  const testCustomers = async () => {
    try {
      const snapshot = await db.collection('customers').limit(10).get();
      console.log('Total customers in database:', snapshot.docs.length);
      snapshot.docs.forEach(doc => {
        console.log('Customer:', doc.data());
      });
      Alert.alert('Debug', `Found ${snapshot.docs.length} customers in database. Check console for details.`);
    } catch (error:any) {
      console.error('Error fetching customers:', error);
      Alert.alert('Error', 'Failed to fetch customers: ' + error.message);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(customerDebounceRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  return (
    <PaperProvider>
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip {currentTripIndex + 1} of {trips.length}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={addTrip}>
            <Text style={[styles.headerBtnText, { color: '#1976d2' }]}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={testCustomers}>
            <Text style={[styles.headerBtnText, { color: '#1976d2' }]}>?</Text>
          </TouchableOpacity>
          {trips.length > 1 && (
            <TouchableOpacity style={styles.headerDeleteBtn} onPress={deleteTrip}>
              <Text style={[styles.headerBtnText, { color: '#ffffff' }]}>-</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={trips}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentTripIndex(index);
        }}
        renderItem={({ item: trip, index }) => (
          <View key={`trip-${trip.id}`} style={[styles.tripContainer, { width }]}>
            <ScrollView 
              style={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Date Section */}
              <View style={styles.section}>
                <TextInput
                  label="Current Date"
                  value={trip.date}
                  mode="outlined"
                  editable={false}
                  style={styles.paperInput}
                />
              </View>

              {/* Driver Details Section */}
              <View style={styles.section}>
                <TextInput
                  label="Driver Details"
                  value={trip.driverDetails}
                  onChangeText={(value) => {
                    if (index === currentTripIndex) {
                      updateTrip('driverDetails', value);
                    }
                  }}
                  mode="outlined"
                  style={styles.paperInput}
                />
              </View>

              {/* Vehicle No Section */}
              <View style={styles.section}>
                <TextInput
                  label="Vehicle No"
                  value={trip.vehicleNo}
                  onChangeText={(value) => {
                    if (index === currentTripIndex) {
                      updateTrip('vehicleNo', value);
                    }
                  }}
                  mode="outlined"
                  style={styles.paperInput}
                />
              </View>

              {/* Pairs Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Routes</Text>
                
                {trip.pairs.map((pair: LocationPair, pairIndex: number) => (
                  <Card key={pair.id} style={styles.pairCard}>
                    <Card.Content>
                      <View style={styles.pairHeader}>
                        <Text style={styles.pairNumber}>Route {pairIndex + 1}</Text>
                        <View style={styles.pairActions}>
                          {pairIndex > 0 && (
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePair(pair.id)}>
                              <Text style={styles.deleteBtnText}>-</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity style={styles.addBtn} onPress={addPair}>
                            <Text style={styles.addBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.pairInputs}>
                        <View style={[styles.autocompleteContainer, { zIndex: 2000 }]}>
                          <TextInput
                            label="From"
                            value={pair.from}
                            onChangeText={(value) => handleCustomerChange(pair.id, 'from', value)}
                            mode="outlined"
                            style={styles.paperInput}
                          />
                          {showCustomerSuggestions[`${pair.id}-from`] && (
                            <View style={[styles.suggestionsContainer, { zIndex: 2001 }]}>
                              {(customerSuggestions[`${pair.id}-from`] || []).map((suggestion, idx) => (
                                <TouchableOpacity
                                  key={idx}
                                  style={styles.suggestionItem}
                                  onPress={() => selectCustomer(pair.id, 'from', suggestion)}
                                >
                                  <Text style={styles.suggestionText}>{suggestion}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                        <View style={[styles.autocompleteContainer, { zIndex: 1000 }]}>
                          <TextInput
                            label="To"
                            value={pair.to}
                            onChangeText={(value) => handleCustomerChange(pair.id, 'to', value)}
                            mode="outlined"
                            style={styles.paperInput}
                          />
                          {showCustomerSuggestions[`${pair.id}-to`] && (
                            <View style={[styles.suggestionsContainer, { zIndex: 1001 }]}>
                              {(customerSuggestions[`${pair.id}-to`] || []).map((suggestion, idx) => (
                                <TouchableOpacity
                                  key={idx}
                                  style={styles.suggestionItem}
                                  onPress={() => selectCustomer(pair.id, 'to', suggestion)}
                                >
                                  <Text style={styles.suggestionText}>{suggestion}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>

              {/* Submit Button */}
              <Button
                mode="contained"
                onPress={async () => {
                  try {
                    if (isSubmitting) return;

                    // Validate trip data
                    if (!trip.vehicleNo?.trim()) {
                      throw new Error('Vehicle number is required');
                    }
                    if (!trip.driverDetails?.trim()) {
                      throw new Error('Driver details are required');
                    }
                    
                    // Validate routes
                    if (trip.pairs.length === 0) {
                      throw new Error('At least one route is required');
                    }
                    
                    for (const [i, pair] of trip.pairs.entries()) {
                      if (!pair.from?.trim()) {
                        throw new Error(`Route ${i + 1}: 'From' location is required`);
                      }
                      if (!pair.to?.trim()) {
                        throw new Error(`Route ${i + 1}: 'To' location is required`);
                      }
                    }

                    setIsSubmitting(true);

                    const now = firestore.FieldValue.serverTimestamp();
                    const firstPair = trip.pairs[0];
                    
                    // Create batch for atomic operations
                    const batch = db.batch();
                    
                    // Generate trip ID
                    const tripId = `${trip.date.replace(/\s+/g, '')}_${trip.vehicleNo.trim()}_${Date.now()}`;
                    
                    // 1. Save main trip
                    const tripRef = db.collection('trips').doc(tripId);
                    batch.set(tripRef, {
                      date: trip.date,
                      driver: trip.driverDetails.trim(),
                      vehicle: trip.vehicleNo.trim(),
                      from: firstPair.from.trim(),
                      to: firstPair.to.trim(),
                      createdAt: now
                    });
                    
                    // 2. Update/Create vehicle
                    const vehicleQuery = await db.collection('vehicles')
                      .where('number', '==', trip.vehicleNo.trim())
                      .get();
                    
                    let vehicleRef;
                    if (vehicleQuery.empty) {
                      vehicleRef = db.collection('vehicles').doc();
                      batch.set(vehicleRef, {
                        number: trip.vehicleNo.trim(),
                        tripCount: 1,
                        lastTrip: trip.date,
                        createdAt: now
                      });
                    } else {
                      vehicleRef = vehicleQuery.docs[0].ref;
                      batch.update(vehicleRef, {
                        tripCount: firestore.FieldValue.increment(1),
                        lastTrip: trip.date
                      });
                    }
                    
                    // 3. Update/Create FROM company
                    const fromQuery = await db.collection('companies')
                      .where('name', '==', firstPair.from.trim())
                      .get();
                    
                    let fromRef;
                    if (fromQuery.empty) {
                      fromRef = db.collection('companies').doc();
                      batch.set(fromRef, {
                        name: firstPair.from.trim(),
                        tripCount: 1,
                        lastTrip: trip.date,
                        createdAt: now
                      });
                    } else {
                      fromRef = fromQuery.docs[0].ref;
                      batch.update(fromRef, {
                        tripCount: firestore.FieldValue.increment(1),
                        lastTrip: trip.date
                      });
                    }
                    
                    // 4. Update/Create TO company
                    const toQuery = await db.collection('companies')
                      .where('name', '==', firstPair.to.trim())
                      .get();
                    
                    let toRef;
                    if (toQuery.empty) {
                      toRef = db.collection('companies').doc();
                      batch.set(toRef, {
                        name: firstPair.to.trim(),
                        tripCount: 1,
                        lastTrip: trip.date,
                        createdAt: now
                      });
                    } else {
                      toRef = toQuery.docs[0].ref;
                      batch.update(toRef, {
                        tripCount: firestore.FieldValue.increment(1),
                        lastTrip: trip.date
                      });
                    }
                    
                    // Commit batch
                    await batch.commit();
                    
                    // Here you would typically submit the trip data to your backend
                    // For example: await tripService.submitTrip(trip);
                    
                    // Simulate API call
                    await new Promise<void>(resolve => setTimeout(resolve, 1000));
                    
                    // Show success message
                    Alert.alert(
                      'Success', 
                      `Trip ${index + 1} submitted successfully!`,
                      [
                        { 
                          text: 'OK', 
                          onPress: () => {
                            // Optionally navigate or reset form
                            // navigation.goBack();
                          }
                        }
                      ]
                    );
                    
                  } catch (error) {
                    console.error('Error submitting trip:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to submit trip. Please try again.';
                    Alert.alert(
                      'Error',
                      errorMessage,
                      [{ text: 'OK' }]
                    );
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                style={styles.submitButton}
                disabled={isSubmitting} // You can add a loading state here if needed
              >
                Submit Trip {index + 1}
              </Button>
            </ScrollView>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    padding: 16,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerBtn: {
    backgroundColor: '#ffffff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerDeleteBtn: {
    backgroundColor: '#d32f2f',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tripContainer: {
    flex: 1,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paperInput: {
    marginBottom: 8,
  },
  pairCard: {
    marginBottom: 8,
  },
  pairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pairActions: {
    flexDirection: 'row',
  },
  addBtn: {
    backgroundColor: '#1976d2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#d32f2f',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteBtnText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pairNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1976d2',
  },
  pairInputs: {
    flexDirection: 'column',
  },

  submitButton: {
    marginTop: 16,
    marginBottom: 20,
  },
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1000,
    marginBottom: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
    zIndex: 9999,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default DetailsUpdator;