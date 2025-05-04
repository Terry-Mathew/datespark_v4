import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics"; // Import analytics

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project configuration values
// Store these values in a .env.local file at the root of your project
// Example .env.local:
// VITE_FIREBASE_API_KEY="YOUR_API_KEY"
// VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
// VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
// VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
// VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
// VITE_FIREBASE_APP_ID="YOUR_APP_ID"
// VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" // Add Measurement ID for Analytics

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Add Measurement ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics and export (check for support)
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, auth, db, analytics }; // Export analytics

