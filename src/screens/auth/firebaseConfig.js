// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import Constants from 'expo-constants';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// إعدادات Firebase (يمكنك أخذها من Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDAJhctpg9gaDTaRa_sv9dYVxaoANFCzWc",
  authDomain: "aanuni-33c7e.firebaseapp.com",
  projectId: "aanuni-33c7e",
  storageBucket: "aanuni-33c7e.firebasestorage.app",
  messagingSenderId: "687728850541",
  appId: "1:687728850541:web:f743d4faa7323b7713f164",
  measurementId: "G-NP7KF8KWZS"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
