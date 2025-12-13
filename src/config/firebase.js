import { firebase } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp();
}

// Get Firestore and Auth instances
const db = firestore();
const authInstance = auth();

// Collection references
export const tripEntriesCollection = db.collection('tripEntries');
export const vehiclesCollection = db.collection('vehicles');
export const partiesCollection = db.collection('parties');

// Trip service with batch operations
const tripService = {
  // Add new trip with batch write for consistency
  addTrip: async (tripData) => {
    const batch = db.batch();
    
    try {
      // 1. Add to tripEntries
      const tripRef = tripEntriesCollection.doc();
      const tripEntry = {
        ...tripData,
        timestamp: Date.now(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      batch.set(tripRef, tripEntry);
      
      // 2. Update vehicles collection
      const vehicleRef = vehiclesCollection.doc(tripData.vehicleNo);
      batch.set(vehicleRef, {
        vehicleNo: tripData.vehicleNo,
        loadCount: firestore.FieldValue.increment(1),
        lastTripAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
      // 3. Update parties collection
      const partyRef = partiesCollection.doc(tripData.from);
      batch.set(partyRef, {
        from: tripData.from,
        loadCount: firestore.FieldValue.increment(1),
        lastTripAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
      await batch.commit();
      return tripRef.id;
    } catch (error) {
      throw error;
    }
  },
  
  // Get trips by vehicle
  getTripsByVehicle: async (vehicleNo) => {
    try {
      const querySnapshot = await tripEntriesCollection
        .where('vehicleNo', '==', vehicleNo)
        .orderBy('createdAt', 'desc')
        .get();
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },
  
  // Get trips by party (from location)
  getTripsByParty: async (from) => {
    try {
      const querySnapshot = await tripEntriesCollection
        .where('from', '==', from)
        .orderBy('createdAt', 'desc')
        .get();
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },
  
  // Get all vehicles
  getVehicles: async () => {
    try {
      const querySnapshot = await vehiclesCollection
        .orderBy('lastTripAt', 'desc')
        .get();
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },
  
  // Get all parties
  getParties: async () => {
    try {
      const querySnapshot = await partiesCollection
        .orderBy('lastTripAt', 'desc')
        .get();
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },
};

export { db, authInstance as auth, tripService };