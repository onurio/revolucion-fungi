import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '~/firebase.client';
import type { FungiField } from '~/types';

const FIELDS_COLLECTION = 'fungiFields';

// Get all dynamic fields
export async function getDynamicFields(): Promise<FungiField[]> {
  const q = query(collection(db, FIELDS_COLLECTION), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as FungiField));
}

// Get a single field by ID
export async function getDynamicField(id: string): Promise<FungiField | null> {
  const docRef = doc(db, FIELDS_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data()
  } as FungiField;
}

// Create or update a dynamic field
export async function saveDynamicField(field: Partial<FungiField>): Promise<void> {
  const id = field.id || doc(collection(db, FIELDS_COLLECTION)).id;
  const now = new Date();
  
  const fieldData = {
    ...field,
    id,
    createdAt: field.createdAt || now,
    updatedAt: now,
  };
  
  await setDoc(doc(db, FIELDS_COLLECTION, id), fieldData);
}

// Delete a dynamic field
export async function deleteDynamicField(id: string): Promise<void> {
  await deleteDoc(doc(db, FIELDS_COLLECTION, id));
}

// Validate field value based on field type
export function validateFieldValue(field: FungiField, value: any): boolean {
  if (field.required && (value === null || value === undefined || value === '')) {
    return false;
  }
  
  if (value === null || value === undefined || value === '') {
    return true; // Empty values are valid for non-required fields
  }
  
  switch (field.type) {
    case 'string':
      return typeof value === 'string';
    
    case 'number':
      const num = Number(value);
      if (isNaN(num)) return false;
      if (field.min !== undefined && num < field.min) return false;
      if (field.max !== undefined && num > field.max) return false;
      return true;
    
    case 'boolean':
      return typeof value === 'boolean' || value === 'true' || value === 'false';
    
    case 'enum':
      return field.enumOptions?.includes(value) || false;
    
    case 'date':
      return value instanceof Date || !isNaN(Date.parse(value));
    
    default:
      return false;
  }
}

// Convert field value to the correct type
export function convertFieldValue(field: FungiField, value: any): any {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  switch (field.type) {
    case 'string':
    case 'enum':
      return String(value);
    
    case 'number':
      return Number(value);
    
    case 'boolean':
      if (typeof value === 'boolean') return value;
      return value === 'true';
    
    case 'date':
      if (value instanceof Date) return value;
      return new Date(value);
    
    default:
      return value;
  }
}