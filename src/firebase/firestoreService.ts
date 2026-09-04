import { db } from './config';
import { doc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

export type CloudSyncStatus = 'connected' | 'syncing' | 'offline' | 'error';

const COLLECTION_NAME = 'kobicha_inventory';

export interface AppStateData {
  stores?: any[];
  stockCampuran?: any[];
  stockFragranceOil?: any[];
  formulaBases?: any[];
  racikanCatalog?: any[];
  hppCatalog?: any[];
  readyToSellProducts?: any[];
  quickNotes?: any[];
  deadlines?: any[];
  updatedAt?: string;
  version?: string;
}

/**
 * Save a specific sub-state or all data to Cloud Firestore
 */
export async function saveStateToFirestore(state: AppStateData): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, 'app_state');
    await setDoc(
      docRef,
      {
        ...state,
        updatedAt: new Date().toISOString(),
        version: '1.1'
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving state to Firestore:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time changes from Cloud Firestore
 */
export function subscribeToFirestore(
  onData: (data: AppStateData | null) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const docRef = doc(db, COLLECTION_NAME, 'app_state');
  
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as AppStateData);
      } else {
        // Document does not exist in Firestore yet (First time initialization)
        onData(null);
      }
    },
    (err) => {
      console.error('Firestore subscription error:', err);
      if (onError) onError(err);
    }
  );
}
