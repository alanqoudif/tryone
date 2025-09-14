// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import Constants from 'expo-constants';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// إعدادات Firebase (يمكنك أخذها من Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDAJhctpg9gaDTaRa_sv9dYVxaoANFCzWc",
  authDomain: "aanuni-33c7e.firebaseapp.com",
  projectId: "aanuni-33c7e",
  storageBucket: "aanuni-33c7e.appspot.com", // تصحيح مسار التخزين
  messagingSenderId: "687728850541",
  appId: "1:687728850541:web:f743d4faa7323b7713f164",
  measurementId: "G-NP7KF8KWZS"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// تصدير الوحدات
export { app, auth, firestore };

// إضافة وظيفة للتحقق من الاتصال
export const checkFirebaseConnection = async () => {
  try {
    const testDoc = doc(firestore, 'system', 'connection_test');
    await setDoc(testDoc, { timestamp: new Date() });
    return true;
  } catch (error) {
    console.error('فشل الاتصال بـ Firebase:', error);
    return false;
  }
};
