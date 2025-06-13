import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { normalizeHimenio, normalizeHabito, normalizeNativaExotica } from '../app/types/fungi-enums';
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

console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '***' : 'MISSING'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateFungiEnums() {
  console.log('Starting fungi enum migration...');
  
  try {
    // Fetch all fungi documents
    const fungiCollection = collection(db, 'fungi');
    const snapshot = await getDocs(fungiCollection);
    
    console.log(`Found ${snapshot.size} fungi documents to migrate`);
    
    // Process in batches of 500 (Firestore limit)
    const batch = writeBatch(db);
    let updateCount = 0;
    let batchCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      const updates: any = {};
      let needsUpdate = false;
      
      // Convert himenio
      if (data.himenio) {
        const normalized = normalizeHimenio(data.himenio);
        if (normalized && normalized !== data.himenio) {
          updates.himenio = normalized;
          needsUpdate = true;
          console.log(`Himenio: "${data.himenio}" → ${normalized}`);
        }
      }
      
      // Convert habito
      if (data.habito) {
        const normalized = normalizeHabito(data.habito);
        if (normalized && normalized !== data.habito) {
          updates.habito = normalized;
          needsUpdate = true;
          console.log(`Habito: "${data.habito}" → ${normalized}`);
        }
      }
      
      // Convert nativaExotica
      if (data.nativaExotica) {
        const normalized = normalizeNativaExotica(data.nativaExotica);
        if (normalized && normalized !== data.nativaExotica) {
          updates.nativaExotica = normalized;
          needsUpdate = true;
          console.log(`NativaExotica: "${data.nativaExotica}" → ${normalized}`);
        }
      }
      
      // Add to batch if updates are needed
      if (needsUpdate) {
        batch.update(doc(db, 'fungi', docSnapshot.id), updates);
        updateCount++;
        batchCount++;
        
        // Commit batch every 500 documents
        if (batchCount === 500) {
          await batch.commit();
          console.log(`Committed batch of ${batchCount} updates`);
          batchCount = 0;
        }
      }
    }
    
    // Commit any remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${batchCount} updates`);
    }
    
    console.log(`\n✅ Migration complete! Updated ${updateCount} documents.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run migration
migrateFungiEnums();