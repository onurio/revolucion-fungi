import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { normalizeSustratoTipo } from '../app/types/fungi-enums';
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

async function migrateSubstrateTypes() {
  console.log('Starting substrate type migration...');
  
  try {
    // Fetch all fungi documents
    const fungiCollection = collection(db, 'fungi');
    const snapshot = await getDocs(fungiCollection);
    
    console.log(`Found ${snapshot.size} fungi documents to migrate`);
    
    // Process in batches of 500 (Firestore limit)
    const batch = writeBatch(db);
    let updateCount = 0;
    let batchCount = 0;
    
    // Track categorization stats
    const categoryStats: Record<string, number> = {};
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Only update if sustrato exists but sustratoTipo doesn't
      if (data.sustrato && !data.sustratoTipo) {
        const sustratoTipo = normalizeSustratoTipo(data.sustrato);
        
        if (sustratoTipo) {
          batch.update(doc(db, 'fungi', docSnapshot.id), {
            sustratoTipo: sustratoTipo
          });
          
          updateCount++;
          batchCount++;
          
          // Track stats
          categoryStats[sustratoTipo] = (categoryStats[sustratoTipo] || 0) + 1;
          
          console.log(`${data.codigoFungario || docSnapshot.id}: "${data.sustrato}" → ${sustratoTipo}`);
          
          // Commit batch every 500 documents
          if (batchCount === 500) {
            await batch.commit();
            console.log(`Committed batch of ${batchCount} updates`);
            batchCount = 0;
          }
        } else {
          console.log(`⚠️  Could not categorize: "${data.sustrato}"`);
        }
      }
    }
    
    // Commit any remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${batchCount} updates`);
    }
    
    console.log(`\n✅ Migration complete! Updated ${updateCount} documents.`);
    
    // Show categorization statistics
    console.log('\n=== CATEGORIZATION STATS ===');
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} fungi`);
      });
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run migration
migrateSubstrateTypes();