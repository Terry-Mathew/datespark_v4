import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getApp } from "firebase/app";
import { getFunctions as getOriginalFunctions, connectFunctionsEmulator } from "firebase/functions";

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
// VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" // Optional
// VITE_RAZORPAY_KEY_ID="YOUR_RAZORPAY_KEY_ID"

// --- Debug logging removed ---

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics with a more reliable approach that doesn't use promises
let analyticsInstance = null;

// Function to get analytics that components can call directly
const getAnalyticsInstance = async () => {
  if (analyticsInstance) return analyticsInstance;
  
  try {
    const isAnalyticsSupported = await isSupported();
    if (isAnalyticsSupported) {
      analyticsInstance = getAnalytics(app);
      console.log("Firebase Analytics initialized.");
      return analyticsInstance;
    } else {
      console.log("Firebase Analytics is not supported in this environment.");
      return null;
    }
  } catch (error) {
    console.error("Error initializing Firebase Analytics:", error);
    return null;
  }
};

// Initialize analytics immediately
getAnalyticsInstance();

// Export a simple analytics object that doesn't rely on Promise syntax
const analytics = {
  logEvent: async (eventName, eventParams) => {
    const analyticsInstance = await getAnalyticsInstance();
    if (analyticsInstance) {
      const { logEvent: firebaseLogEvent } = await import('firebase/analytics');
      firebaseLogEvent(analyticsInstance, eventName, eventParams);
    }
  }
};

// Add the proxy configuration
const IS_DEVELOPMENT = window.location.hostname === 'localhost';
const PROXY_URL = 'http://localhost:3000';

// Custom function to get Firebase Functions with optional emulator connection
export const getFunctions = () => {
  const functions = getOriginalFunctions(getApp());
  
  // If in development, connect to the functions emulator
  if (IS_DEVELOPMENT) {
    try {
      // Connect to local emulator without region path
      connectFunctionsEmulator(functions, 'localhost', 3000);
      
      // Set region to match our deployed functions
      functions.region = 'us-central1';
      
      // Log configuration for debugging
      console.log("Firebase Functions configured for development:");
      console.log("- Using emulator on localhost:3000");
      console.log("- Region: us-central1");
    } catch (error) {
      console.warn('Failed to connect to Functions emulator:', error);
    }
  }
  
  return functions;
};

export { app, auth, db, analytics };

