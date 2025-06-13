import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY?.replace(/"/g, ''),
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN?.replace(/"/g, ''),
  projectId: process.env.VITE_FIREBASE_PROJECT_ID?.replace(/"/g, ''),
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET?.replace(/"/g, ''),
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.replace(/"/g, ''),
  appId: process.env.VITE_FIREBASE_APP_ID?.replace(/"/g, '')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkSubstrateValues() {
  console.log('Checking substrate values...');
  
  try {
    // Fetch all fungi documents
    const fungiCollection = collection(db, 'fungi');
    const snapshot = await getDocs(fungiCollection);
    
    console.log(`Found ${snapshot.size} fungi documents`);
    
    // Extract unique substrate values
    const substrateValues = new Set<string>();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.sustrato) {
        substrateValues.add(data.sustrato);
      }
    });
    
    const sortedValues = Array.from(substrateValues).sort();
    
    console.log('\n=== SUBSTRATE VALUES ===');
    console.log('Total unique values:', sortedValues.length);
    console.log(JSON.stringify(sortedValues, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run check
checkSubstrateValues();