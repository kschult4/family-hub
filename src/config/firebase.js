import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgfhlVrNGwhdux6qbmMuSx4wotxMy0pGU",
  authDomain: "family-hub-dashboard.firebaseapp.com",
  databaseURL: "https://family-hub-dashboard-default-rtdb.firebaseio.com",
  projectId: "family-hub-dashboard",
  storageBucket: "family-hub-dashboard.firebasestorage.app",
  messagingSenderId: "237122444853",
  appId: "1:237122444853:web:8d2836b0aea34422d0db7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export default app;