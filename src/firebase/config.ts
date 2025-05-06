import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyANgIhZAgnR21ShndTmwbeCVPTdXWwSwcg",
  authDomain: "futuristic-product-reviews.firebaseapp.com",
  databaseURL: "https://futuristic-product-reviews-default-rtdb.firebaseio.com",
  projectId: "futuristic-product-reviews",
  storageBucket: "futuristic-product-reviews.firebasestorage.app",
  messagingSenderId: "24228101134",
  appId: "1:24228101134:web:9526b376e7d673397e905f",
  measurementId: "G-9BZBG7CMGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);