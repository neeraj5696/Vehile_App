import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

function Party_Section() {
  const navigation = useNavigation();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  // No active tab by default
  const [activeTab, setActiveTab] = useState(null);

  const renderVehicleItem = useCallback(({ item }) => (
    <View style={styles.vehicleItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.vehicleIcon}>🚗</Text>
        <Text style={styles.vehicleName}>{item?.name ?? '—'}</Text>
      </View>
      <Text style={styles.vehicleDetails}>
        {(item?.type ?? '—') + ' - ' + (item?.number ?? '—')}
      </Text>
    </View>
  ), []);

  return (
    <LinearGradient colors={["#7b2ff2", "#f357a8"]} style={{flex: 1}}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#7b2ff2" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Party Section</Text>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowDetails(!showDetails)}
              activeOpacity={0.8}
              style={styles.detailsListButton}
            >
              <View style={styles.detailsListHeaderRow}>
                <Text style={styles.detailsListIcon}>📋</Text>
                <Text style={styles.detailsListTitle}>Details List</Text>
              </View>
            </TouchableOpacity>
            {showDetails && (
              <View style={styles.tabColumn}>
                <TouchableOpacity
                  style={[styles.subTab, styles.professionalTab]}
                  onPress={() => navigation.navigate('VehicleList')}
                  activeOpacity={0.85}
                >
                  <View style={styles.tabContentRow}>
                    <Text style={styles.tabIcon}>🚗</Text>
                    <Text style={styles.professionalTabText}>Vehicles</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.subTab, styles.professionalTab]}
                  onPress={() => navigation.navigate('PartyList')}
                  activeOpacity={0.85}
                >
                  <View style={styles.tabContentRow}>
                    <Text style={styles.tabIcon}>👥</Text>
                    <Text style={styles.professionalTabText}>Parties</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {/* No inline data display, handled by navigation */}
          </View>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => navigation.navigate('Vehicle')}
            >
              <View style={styles.updateButtonRow}>
                <Text style={styles.updateButtonIcon}>➕</Text>
                <Text style={styles.updateButtonText}>
                  Update New Details
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

export default Party_Section;

const styles = StyleSheet.create({
    detailsListButton: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 20,
      marginHorizontal: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    detailsListHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      justifyContent: 'center',
    },
    detailsListIcon: {
      fontSize: 26,
      color: '#6c47ff',
      marginRight: 12,
    },
    detailsListTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#6c47ff',
      letterSpacing: 0.3,
    },
    tabContentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      justifyContent: 'center',
    },
    professionalTab: {
      backgroundColor: '#d9cce8',
      borderWidth: 0,
      borderColor: '#e0e6ed',
      marginBottom: 14,
      marginHorizontal: 16,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    professionalTabActive: {
      backgroundColor: '#007bff',
      borderColor: '#007bff',
      elevation: 2,
    },
    professionalTabText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2d1b4e',
      letterSpacing: 0.2,
    },
    // Override text color for active tab
    professionalTabActiveText: {
      color: '#fff',
    },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: 'transparent',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
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
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  updateButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  updateButtonIcon: {
    fontSize: 26,
    color: '#6c47ff',
    marginRight: 6,
  },
  updateButtonText: {
    color: '#6c47ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    paddingVertical: 12,
  },
  tabColumn: {
    flexDirection: 'column',
    marginBottom: 16,
    gap: 8,
  },
  subTab: {
    flex: 1,
    padding: 12,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 8,
  },
  subTabText: {
    color: '#333',
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  vehicleIcon: {
    fontSize: 18,
    marginRight: 8,
  },
});
