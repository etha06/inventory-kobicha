import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  Unsubscribe 
} from 'firebase/firestore';

export type CloudSyncStatus = 'connected' | 'syncing' | 'offline' | 'error';

export const COLLECTIONS = {
  STORES: 'stores',
  STOCK_CAMPURAN: 'stock_campuran',
  STOCK_FO: 'stock_fragrance_oil',
  FORMULA_BASES: 'formula_bases',
  RACIKAN_CATALOG: 'racikan_catalog',
  HPP_CATALOG: 'hpp_catalog',
  READY_TO_SELL: 'ready_to_sell',
  QUICK_NOTES: 'quick_notes',
  DEADLINES: 'deadlines'
} as const;

// Helper to sanitize payload from undefined fields
export function sanitize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Save single document to a collection
export async function saveDocToFirestore(collectionName: string, id: string, data: any): Promise<void> {
  try {
    const cleanData = sanitize({ ...data, updatedAt: new Date().toISOString() });
    await setDoc(doc(db, collectionName, id), cleanData, { merge: true });
  } catch (error) {
    console.error(`Error saving doc to ${collectionName}:`, error);
    throw error;
  }
}

// Delete single document from a collection
export async function deleteDocFromFirestore(collectionName: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error(`Error deleting doc from ${collectionName}:`, error);
    throw error;
  }
}

// Bulk sync all collections (e.g. on initial upload, clear, or import)
export async function bulkSyncAllCollections(state: {
  stores: any[];
  stockCampuran: any[];
  stockFragranceOil: any[];
  formulaBases: any[];
  racikanCatalog: any[];
  hppCatalog: any[];
  readyToSellProducts: any[];
  quickNotes: any[];
  deadlines: any[];
}): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    const map: Record<string, any[]> = {
      [COLLECTIONS.STORES]: state.stores || [],
      [COLLECTIONS.STOCK_CAMPURAN]: state.stockCampuran || [],
      [COLLECTIONS.STOCK_FO]: state.stockFragranceOil || [],
      [COLLECTIONS.FORMULA_BASES]: state.formulaBases || [],
      [COLLECTIONS.RACIKAN_CATALOG]: state.racikanCatalog || [],
      [COLLECTIONS.HPP_CATALOG]: state.hppCatalog || [],
      [COLLECTIONS.READY_TO_SELL]: state.readyToSellProducts || [],
      [COLLECTIONS.QUICK_NOTES]: state.quickNotes || [],
      [COLLECTIONS.DEADLINES]: state.deadlines || []
    };

    for (const [collName, items] of Object.entries(map)) {
      for (const item of items) {
        if (item && item.id) {
          batch.set(doc(db, collName, item.id), sanitize(item), { merge: true });
        }
      }
    }

    await batch.commit();
  } catch (error) {
    console.error('Error bulk syncing to Firestore:', error);
    throw error;
  }
}

// Subscribe to all collections simultaneously in real-time
export function subscribeToCollections(
  callbacks: {
    onStores?: (data: any[]) => void;
    onStockCampuran?: (data: any[]) => void;
    onStockFo?: (data: any[]) => void;
    onFormulaBases?: (data: any[]) => void;
    onRacikan?: (data: any[]) => void;
    onHpp?: (data: any[]) => void;
    onReadyToSell?: (data: any[]) => void;
    onQuickNotes?: (data: any[]) => void;
    onDeadlines?: (data: any[]) => void;
  },
  onError?: (err: any) => void
): Unsubscribe {
  const unsubs: Unsubscribe[] = [];

  const attach = (collName: string, cb?: (data: any[]) => void) => {
    if (!cb) return;
    const unsub = onSnapshot(
      collection(db, collName),
      (snapshot) => {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        cb(items);
      },
      (err) => {
        console.error(`Subscription error on ${collName}:`, err);
        if (onError) onError(err);
      }
    );
    unsubs.push(unsub);
  };

  attach(COLLECTIONS.STORES, callbacks.onStores);
  attach(COLLECTIONS.STOCK_CAMPURAN, callbacks.onStockCampuran);
  attach(COLLECTIONS.STOCK_FO, callbacks.onStockFo);
  attach(COLLECTIONS.FORMULA_BASES, callbacks.onFormulaBases);
  attach(COLLECTIONS.RACIKAN_CATALOG, callbacks.onRacikan);
  attach(COLLECTIONS.HPP_CATALOG, callbacks.onHpp);
  attach(COLLECTIONS.READY_TO_SELL, callbacks.onReadyToSell);
  attach(COLLECTIONS.QUICK_NOTES, callbacks.onQuickNotes);
  attach(COLLECTIONS.DEADLINES, callbacks.onDeadlines);

  return () => {
    unsubs.forEach(u => u());
  };
}
