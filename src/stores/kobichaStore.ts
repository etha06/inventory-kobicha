import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import {
  StoreSupplier,
  StockCampuran,
  StockFragranceOil,
  FormulaBase,
  RacikanFragrance,
  HppCalculation,
  QuickNote,
  CalendarDeadline,
  ReadyToSellProduct
} from '../types';
import {
  INITIAL_STORES,
  INITIAL_CAMPURAN,
  INITIAL_FRAGRANCE_OILS,
  INITIAL_FORMULA_BASES,
  INITIAL_RACIKAN,
  INITIAL_HPP,
  INITIAL_QUICK_NOTES,
  INITIAL_DEADLINES,
  INITIAL_READY_TO_SELL
} from './sampleData';
import { saveStateToFirestore, subscribeToFirestore, CloudSyncStatus } from '../firebase/firestoreService';

const STORAGE_KEY = 'kobicha_parfume_app_v1';

export type NavigationTab = 
  | 'home'
  | 'wheretobuy'
  | 'stock-campuran'
  | 'stock-fo'
  | 'list-harga-fo'
  | 'formula-base'
  | 'katalog-racikan'
  | 'kalkulator-racikan'
  | 'katalog-hpp'
  | 'kalkulator-hpp'
  | 'ready-to-sell';

export const useKobichaStore = defineStore('kobicha', () => {
  // Navigation & UI States
  const activeTab = ref<NavigationTab>('home');
  const isMobileNavOpen = ref(false);
  const prefilledRacikanId = ref<string | null>(null);
  const prefilledFormulaBaseId = ref<string | null>(null);
  const prefilledHppRacikanId = ref<string | null>(null);
  const prefilledHppBaseId = ref<string | null>(null);

  // Cloud Sync States
  const cloudSyncStatus = ref<CloudSyncStatus>('offline');
  const isRemoteSync = ref(false);
  const lastSyncedAt = ref<string | null>(null);
  let unsubscribeFirestore: (() => void) | null = null;
  let saveDebounceTimer: any = null;

  function openMobileNav() {
    isMobileNavOpen.value = true;
  }
  function closeMobileNav() {
    isMobileNavOpen.value = false;
  }
  function toggleMobileNav() {
    isMobileNavOpen.value = !isMobileNavOpen.value;
  }

  // Global Quick Add Modal Triggers
  const isQuickAddFoOpen = ref(false);
  const isQuickAddCampuranOpen = ref(false);

  // Data States
  const stores = ref<StoreSupplier[]>([]);
  const stockCampuran = ref<StockCampuran[]>([]);
  const stockFragranceOil = ref<StockFragranceOil[]>([]);
  const formulaBases = ref<FormulaBase[]>([]);
  const racikanCatalog = ref<RacikanFragrance[]>([]);
  const hppCatalog = ref<HppCalculation[]>([]);
  const readyToSellProducts = ref<ReadyToSellProduct[]>([]);
  const quickNotes = ref<QuickNote[]>([]);
  const deadlines = ref<CalendarDeadline[]>([]);

  // Toast Notification System
  const toasts = ref<{ id: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }[]>([]);

  function showToast(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') {
    const id = Math.random().toString(36).substring(2, 9);
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, 3500);
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  // Save to LocalStorage cache
  function saveDatabaseLocal() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const payload = {
        stores: stores.value,
        stockCampuran: stockCampuran.value,
        stockFragranceOil: stockFragranceOil.value,
        formulaBases: formulaBases.value,
        racikanCatalog: racikanCatalog.value,
        hppCatalog: hppCatalog.value,
        readyToSellProducts: readyToSellProducts.value,
        quickNotes: quickNotes.value,
        deadlines: deadlines.value,
        version: '1.1'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving database to localStorage:', e);
    }
  }

  // Sync to Cloud Firestore with debounce
  function syncToCloud() {
    if (isRemoteSync.value) return;
    cloudSyncStatus.value = 'syncing';
    if (saveDebounceTimer) clearTimeout(saveDebounceTimer);

    saveDebounceTimer = setTimeout(async () => {
      try {
        await saveStateToFirestore({
          stores: stores.value,
          stockCampuran: stockCampuran.value,
          stockFragranceOil: stockFragranceOil.value,
          formulaBases: formulaBases.value,
          racikanCatalog: racikanCatalog.value,
          hppCatalog: hppCatalog.value,
          readyToSellProducts: readyToSellProducts.value,
          quickNotes: quickNotes.value,
          deadlines: deadlines.value,
        });
        cloudSyncStatus.value = 'connected';
        lastSyncedAt.value = new Date().toISOString();
      } catch (e) {
        console.warn('Firestore sync failed, saved in local cache:', e);
        cloudSyncStatus.value = 'offline';
      }
    }, 400);
  }

  async function forceCloudSync() {
    cloudSyncStatus.value = 'syncing';
    try {
      await saveStateToFirestore({
        stores: stores.value,
        stockCampuran: stockCampuran.value,
        stockFragranceOil: stockFragranceOil.value,
        formulaBases: formulaBases.value,
        racikanCatalog: racikanCatalog.value,
        hppCatalog: hppCatalog.value,
        readyToSellProducts: readyToSellProducts.value,
        quickNotes: quickNotes.value,
        deadlines: deadlines.value,
      });
      cloudSyncStatus.value = 'connected';
      lastSyncedAt.value = new Date().toISOString();
      showToast('Data berhasil disinkronkan ke Cloud Firestore!', 'success');
    } catch (e) {
      cloudSyncStatus.value = 'error';
      showToast('Gagal menyinkronkan ke Cloud. Cek koneksi internet.', 'error');
    }
  }

  // Initialize Real-time Firestore Sync
  function initFirebaseSync() {
    if (unsubscribeFirestore) return;
    cloudSyncStatus.value = 'syncing';

    try {
      unsubscribeFirestore = subscribeToFirestore(
        (remoteData) => {
          if (remoteData) {
            isRemoteSync.value = true;
            if (Array.isArray(remoteData.stores)) stores.value = remoteData.stores;
            if (Array.isArray(remoteData.stockCampuran)) stockCampuran.value = remoteData.stockCampuran;
            if (Array.isArray(remoteData.stockFragranceOil)) stockFragranceOil.value = remoteData.stockFragranceOil;
            if (Array.isArray(remoteData.formulaBases)) formulaBases.value = remoteData.formulaBases;
            if (Array.isArray(remoteData.racikanCatalog)) racikanCatalog.value = remoteData.racikanCatalog;
            if (Array.isArray(remoteData.hppCatalog)) hppCatalog.value = remoteData.hppCatalog;
            if (Array.isArray(remoteData.readyToSellProducts)) readyToSellProducts.value = remoteData.readyToSellProducts;
            if (Array.isArray(remoteData.quickNotes)) quickNotes.value = remoteData.quickNotes;
            if (Array.isArray(remoteData.deadlines)) deadlines.value = remoteData.deadlines;
            if (remoteData.updatedAt) lastSyncedAt.value = remoteData.updatedAt;

            saveDatabaseLocal();
            cloudSyncStatus.value = 'connected';
            setTimeout(() => {
              isRemoteSync.value = false;
            }, 100);
          } else {
            // First time remote init -> push local data to Firestore
            syncToCloud();
          }
        },
        (err) => {
          console.warn('Firestore subscription inactive, working in local mode:', err);
          cloudSyncStatus.value = 'offline';
        }
      );
    } catch (e) {
      console.warn('Failed to initialize Firebase Sync:', e);
      cloudSyncStatus.value = 'offline';
    }
  }

  // Load from LocalStorage or initialize with Empty Data
  function loadDatabase() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          stores.value = parsed.stores || [];
          stockCampuran.value = parsed.stockCampuran || [];
          stockFragranceOil.value = parsed.stockFragranceOil || [];
          formulaBases.value = parsed.formulaBases || [];
          racikanCatalog.value = parsed.racikanCatalog || [];
          hppCatalog.value = parsed.hppCatalog || [];
          readyToSellProducts.value = parsed.readyToSellProducts || [];
          quickNotes.value = parsed.quickNotes || [];
          deadlines.value = parsed.deadlines || [];
        }
      } catch (e) {
        console.error('Error loading database from localStorage:', e);
      }
    }

    // Connect real-time Firebase Firestore
    initFirebaseSync();
  }

  function saveDatabase() {
    saveDatabaseLocal();
    syncToCloud();
  }

  function clearAllData(notify = true) {
    stores.value = [];
    stockCampuran.value = [];
    stockFragranceOil.value = [];
    formulaBases.value = [];
    racikanCatalog.value = [];
    hppCatalog.value = [];
    readyToSellProducts.value = [];
    quickNotes.value = [];
    deadlines.value = [];
    saveDatabase();
    if (notify) showToast('Database telah dikosongkan (Mulai dari 0)', 'info');
  }

  function resetToSampleData(notify = true) {
    clearAllData(false);
    if (notify) showToast('Database telah di-reset (Kosong)', 'info');
  }

  // Auto-save on every state change
  watch(
    [stores, stockCampuran, stockFragranceOil, formulaBases, racikanCatalog, hppCatalog, readyToSellProducts, quickNotes, deadlines],
    () => {
      saveDatabase();
    },
    { deep: true }
  );

  // Computed & Getters
  const foUsageCountMap = computed(() => {
    const counts: Record<string, number> = {};
    for (const r of racikanCatalog.value) {
      for (const fo of r.fragranceOils) {
        counts[fo.fragranceOilId] = (counts[fo.fragranceOilId] || 0) + 1;
      }
    }
    return counts;
  });

  function getFoUsageCount(foId: string): number {
    return foUsageCountMap.value[foId] || 0;
  }

  // Rata-rata 1ml dari semua price tiers FO
  function getFoAveragePricePerMl(foId: string): number {
    const fo = stockFragranceOil.value.find(f => f.id === foId);
    if (!fo || !fo.priceTiers || fo.priceTiers.length === 0) return 0;
    const sum = fo.priceTiers.reduce((acc, t) => acc + (t.hargaPerMl || (t.ml > 0 ? t.harga / t.ml : 0)), 0);
    return Math.round(sum / fo.priceTiers.length);
  }

  function getCampuranPrice(campuranId: string): number {
    const item = stockCampuran.value.find(c => c.id === campuranId);
    return item ? item.hargaPerPcs : 0;
  }

  function getCampuranAveragePricePerMl(campId: string): number {
    const item = stockCampuran.value.find(c => c.id === campId);
    if (!item) return 65;
    if (item.hargaPerMl && item.hargaPerMl > 0) return item.hargaPerMl;
    if (item.ukuranMl && item.ukuranMl > 0) return Math.round(item.hargaPerPcs / item.ukuranMl);
    return Math.round(item.hargaPerPcs / 1000);
  }

  const bahanBakuCampuranList = computed(() => {
    return stockCampuran.value.filter(c => {
      if (c.isBahanBaku === true) return true;
      if (c.isBahanBaku === false) return false;
      const j = (c.jenis || '').toLowerCase();
      const n = (c.namaBarang || '').toLowerCase();
      return (
        j.includes('pelarut') ||
        j.includes('fixative') ||
        j.includes('solvent') ||
        j.includes('kimia') ||
        j.includes('aditif') ||
        n.includes('ethanol') ||
        n.includes('alkohol') ||
        n.includes('dpg') ||
        n.includes('water') ||
        n.includes('aquades')
      );
    });
  });

  // Dynamic unified list of Jenis Barang purely derived from existing items
  const allJenisBarangList = computed(() => {
    const set = new Set<string>();
    stockCampuran.value.forEach(c => {
      if (c.jenis && c.jenis.trim()) set.add(c.jenis.trim());
    });
    stores.value.forEach(s => {
      if (s.jenisBarang && s.jenisBarang.trim()) set.add(s.jenisBarang.trim());
    });
    // If completely empty database, provide basic starter categories
    if (set.size === 0) {
      return [
        'Pelarut / Solvent',
        'Fixative / Pengikat',
        'Botol & Packaging',
        'Sprayer & Cap'
      ];
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  function renameJenisBarangCascade(oldName: string, newName: string) {
    if (!oldName || !newName || oldName === newName) return;
    let storeCount = 0;
    let campCount = 0;

    stores.value.forEach(s => {
      if (s.jenisBarang === oldName) {
        s.jenisBarang = newName;
        s.updatedAt = new Date().toISOString();
        storeCount++;
      }
    });

    stockCampuran.value.forEach(c => {
      if (c.jenis === oldName) {
        c.jenis = newName;
        c.updatedAt = new Date().toISOString();
        campCount++;
      }
    });

    showToast(`Jenis barang '${oldName}' berhasil diubah menjadi '${newName}' (${storeCount} toko, ${campCount} barang campuran diperbarui)!`, 'success');
  }

  const totalStoresCount = computed(() => stores.value.length);
  const totalCampuranCount = computed(() => stockCampuran.value.length);
  const totalFoCount = computed(() => stockFragranceOil.value.length);
  const totalRacikanCount = computed(() => racikanCatalog.value.length);
  const totalHppCount = computed(() => hppCatalog.value.length);
  const totalReadyToSellCount = computed(() => readyToSellProducts.value.length);
  const totalReadyToSellStock = computed(() => 
    readyToSellProducts.value.reduce((acc, p) => acc + (p.jumlahStok || 0), 0)
  );
  const totalReadyToSellValue = computed(() => 
    readyToSellProducts.value.reduce((acc, p) => acc + ((p.jumlahStok || 0) * (p.hargaJual || 0)), 0)
  );

  const allReadyToSellSeries = computed(() => {
    const set = new Set<string>();
    readyToSellProducts.value.forEach(p => {
      if (p.series && p.series.trim()) set.add(p.series.trim());
    });
    return Array.from(set).sort();
  });

  const lowStockFoCount = computed(() => {
    return stockFragranceOil.value.filter(fo => fo.currentStock === 'Dikit' || fo.currentStock === 'Habis').length;
  });

  const lowStockCampuranCount = computed(() => {
    return stockCampuran.value.filter(c => {
      if (c.isBahanBaku) {
        return c.currentStock === 'Dikit' || c.currentStock === 'Habis';
      }
      return c.jumlahStok <= 5;
    }).length;
  });

  const pendingDeadlinesCount = computed(() => {
    return deadlines.value.filter(d => !d.isCompleted).length;
  });

  // Navigation helpers
  function navigateTo(tab: NavigationTab) {
    activeTab.value = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openCalculatorWithRacikan(racikanId: string) {
    prefilledRacikanId.value = racikanId;
    navigateTo('kalkulator-racikan');
  }

  function openHppWithRacikan(racikanId: string, baseId?: string) {
    prefilledHppRacikanId.value = racikanId;
    if (baseId) prefilledHppBaseId.value = baseId;
    navigateTo('kalkulator-hpp');
  }

  // 1. Store Supplier CRUD
  function addStore(store: Omit<StoreSupplier, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = 'store-' + Date.now().toString(36);
    const now = new Date().toISOString();
    const newStore: StoreSupplier = {
      ...store,
      id,
      createdAt: now,
      updatedAt: now
    };
    stores.value.push(newStore);
    saveDatabase();
    showToast(`Toko '${newStore.namaToko}' berhasil ditambahkan!`);
    return newStore;
  }

  function updateStore(id: string, updates: Partial<StoreSupplier>) {
    const idx = stores.value.findIndex(s => s.id === id);
    if (idx !== -1) {
      stores.value[idx] = {
        ...stores.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
      showToast(`Toko '${stores.value[idx].namaToko}' berhasil diperbarui!`);
    }
  }

  function deleteStore(id: string) {
    const store = stores.value.find(s => s.id === id);
    const name = store ? store.namaToko : 'Toko';
    stores.value = stores.value.filter(s => s.id !== id);
    saveDatabase();
    showToast(`Toko '${name}' berhasil dihapus`, 'info');
  }

  // 2. Stock Campuran CRUD
  function addStockCampuran(item: Omit<StockCampuran, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = 'camp-' + Date.now().toString(36);
    const now = new Date().toISOString();
    const newItem: StockCampuran = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now
    };
    stockCampuran.value.push(newItem);
    saveDatabase();
    showToast(`Barang '${newItem.namaBarang}' berhasil ditambahkan ke stok!`);
    return newItem;
  }

  function updateStockCampuran(id: string, updates: Partial<StockCampuran>) {
    const idx = stockCampuran.value.findIndex(c => c.id === id);
    if (idx !== -1) {
      stockCampuran.value[idx] = {
        ...stockCampuran.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
      showToast(`Barang '${stockCampuran.value[idx].namaBarang}' berhasil diperbarui!`);
    }
  }

  function deleteStockCampuran(id: string) {
    const item = stockCampuran.value.find(c => c.id === id);
    const name = item ? item.namaBarang : 'Barang';
    stockCampuran.value = stockCampuran.value.filter(c => c.id !== id);
    saveDatabase();
    showToast(`Barang '${name}' berhasil dihapus`, 'info');
  }

  // 3. Stock Fragrance Oil CRUD
  function addStockFragranceOil(fo: Omit<StockFragranceOil, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = 'fo-' + Date.now().toString(36);
    const now = new Date().toISOString();
    const newFo: StockFragranceOil = {
      ...fo,
      id,
      createdAt: now,
      updatedAt: now
    };
    stockFragranceOil.value.push(newFo);
    saveDatabase();
    showToast(`Fragrance Oil '${newFo.nama}' berhasil ditambahkan ke stok!`);
    return newFo;
  }

  function updateStockFragranceOil(id: string, updates: Partial<StockFragranceOil>) {
    const idx = stockFragranceOil.value.findIndex(f => f.id === id);
    if (idx !== -1) {
      stockFragranceOil.value[idx] = {
        ...stockFragranceOil.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
      showToast(`Fragrance Oil '${stockFragranceOil.value[idx].nama}' berhasil diperbarui!`);
    }
  }

  function deleteStockFragranceOil(id: string) {
    const fo = stockFragranceOil.value.find(f => f.id === id);
    const name = fo ? fo.nama : 'Fragrance Oil';
    stockFragranceOil.value = stockFragranceOil.value.filter(f => f.id !== id);
    saveDatabase();
    showToast(`Fragrance Oil '${name}' berhasil dihapus`, 'info');
  }

  // 4. Formula Base CRUD
  function addFormulaBase(base: Omit<FormulaBase, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = 'base-' + Date.now().toString(36);
    const now = new Date().toISOString();
    const newBase: FormulaBase = {
      ...base,
      id,
      createdAt: now,
      updatedAt: now
    };
    formulaBases.value.push(newBase);
    saveDatabase();
    showToast(`Formula Base '${newBase.nama}' berhasil disimpan!`);
    return newBase;
  }

  function updateFormulaBase(id: string, updates: Partial<FormulaBase>) {
    const idx = formulaBases.value.findIndex(b => b.id === id);
    if (idx !== -1) {
      formulaBases.value[idx] = {
        ...formulaBases.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
      showToast(`Formula Base '${formulaBases.value[idx].nama}' berhasil diperbarui!`);
    }
  }

  function deleteFormulaBase(id: string) {
    const base = formulaBases.value.find(b => b.id === id);
    const name = base ? base.nama : 'Formula Base';
    formulaBases.value = formulaBases.value.filter(b => b.id !== id);
    saveDatabase();
    showToast(`Formula Base '${name}' berhasil dihapus`, 'info');
  }

  // 5. Racikan Fragrance CRUD
  function addRacikanFragrance(racikan: Omit<RacikanFragrance, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = 'racik-' + Date.now().toString(36);
    const now = new Date().toISOString();
    const newRacikan: RacikanFragrance = {
      ...racikan,
      id,
      createdAt: now,
      updatedAt: now
    };
    racikanCatalog.value.unshift(newRacikan);
    saveDatabase();
    showToast(`Racikan Parfum '${newRacikan.nama}' berhasil disimpan ke Katalog! 🧪`);
    return newRacikan;
  }

  function updateRacikanFragrance(id: string, updates: Partial<RacikanFragrance>) {
    const idx = racikanCatalog.value.findIndex(r => r.id === id);
    if (idx !== -1) {
      racikanCatalog.value[idx] = {
        ...racikanCatalog.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
      showToast(`Racikan '${racikanCatalog.value[idx].nama}' berhasil diperbarui!`);
    }
  }

  function deleteRacikanFragrance(id: string) {
    const r = racikanCatalog.value.find(item => item.id === id);
    const name = r ? r.nama : 'Racikan';
    racikanCatalog.value = racikanCatalog.value.filter(item => item.id !== id);
    saveDatabase();
    showToast(`Racikan '${name}' berhasil dihapus`, 'info');
  }

  // 6. HPP Calculation CRUD
  function addHppCalculation(hpp: Omit<HppCalculation, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = 'hpp-' + Date.now().toString(36);
    const now = new Date().toISOString();
    const newHpp: HppCalculation = {
      ...hpp,
      id,
      createdAt: now,
      updatedAt: now
    };
    hppCatalog.value.unshift(newHpp);
    saveDatabase();
    showToast(`Perhitungan HPP '${newHpp.nama}' berhasil disimpan ke Katalog! 💰`);
    return newHpp;
  }

  function updateHppCalculation(id: string, updates: Partial<HppCalculation>) {
    const idx = hppCatalog.value.findIndex(h => h.id === id);
    if (idx !== -1) {
      hppCatalog.value[idx] = {
        ...hppCatalog.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
      showToast(`HPP '${hppCatalog.value[idx].nama}' berhasil diperbarui!`);
    }
  }

  function deleteHppCalculation(id: string) {
    const h = hppCatalog.value.find(item => item.id === id);
    const name = h ? h.nama : 'HPP';
    hppCatalog.value = hppCatalog.value.filter(item => item.id !== id);
    saveDatabase();
    showToast(`Perhitungan HPP '${name}' berhasil dihapus`, 'info');
  }

  // 7. Ready To Sell CRUD
  function addReadyToSellProduct(product: Omit<ReadyToSellProduct, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = 'rts-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const newProduct: ReadyToSellProduct = {
      ...product,
      id,
      createdAt: now,
      updatedAt: now
    };
    readyToSellProducts.value.unshift(newProduct);
    saveDatabase();
    showToast(`Produk '${newProduct.nama}' berhasil ditambahkan ke Ready to Sell! 🎉`, 'success');
    return newProduct;
  }

  function updateReadyToSellProduct(id: string, updates: Partial<ReadyToSellProduct>) {
    const idx = readyToSellProducts.value.findIndex(p => p.id === id);
    if (idx !== -1) {
      readyToSellProducts.value[idx] = {
        ...readyToSellProducts.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
      showToast(`Produk '${readyToSellProducts.value[idx].nama}' berhasil diperbarui!`, 'success');
      return true;
    }
    return false;
  }

  function deleteReadyToSellProduct(id: string) {
    const p = readyToSellProducts.value.find(item => item.id === id);
    const name = p ? p.nama : 'Produk';
    readyToSellProducts.value = readyToSellProducts.value.filter(item => item.id !== id);
    saveDatabase();
    showToast(`Produk '${name}' berhasil dihapus`, 'info');
  }

  // 8. Quick Notes CRUD
  function addQuickNote(note: Omit<QuickNote, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = 'note-' + Date.now().toString(36);
    const now = new Date().toISOString();
    const newNote: QuickNote = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now
    };
    quickNotes.value.unshift(newNote);
    saveDatabase();
    showToast('Catatan baru berhasil ditambahkan! 📝');
    return newNote;
  }

  function updateQuickNote(id: string, updates: Partial<QuickNote>) {
    const idx = quickNotes.value.findIndex(n => n.id === id);
    if (idx !== -1) {
      quickNotes.value[idx] = {
        ...quickNotes.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
      showToast('Catatan diperbarui');
    }
  }

  function deleteQuickNote(id: string) {
    quickNotes.value = quickNotes.value.filter(n => n.id !== id);
    saveDatabase();
    showToast('Catatan dihapus', 'info');
  }

  // 9. Calendar Deadlines CRUD
  function addDeadline(dl: Omit<CalendarDeadline, 'id' | 'createdAt'>) {
    const id = 'dl-' + Date.now().toString(36);
    const newDeadline: CalendarDeadline = {
      ...dl,
      id,
      createdAt: new Date().toISOString()
    };
    deadlines.value.push(newDeadline);
    saveDatabase();
    showToast('Agenda / reminder berhasil ditambahkan ke kalender! 📅');
    return newDeadline;
  }

  function toggleDeadline(id: string) {
    const dl = deadlines.value.find(d => d.id === id);
    if (dl) {
      dl.isCompleted = !dl.isCompleted;
      saveDatabase();
      showToast(dl.isCompleted ? 'Deadline ditandai selesai! 🎉' : 'Deadline dibuka kembali');
    }
  }

  function deleteDeadline(id: string) {
    deadlines.value = deadlines.value.filter(d => d.id !== id);
    saveDatabase();
    showToast('Deadline dihapus', 'info');
  }

  // Export / Import Backup JSON
  function exportDatabase() {
    const data = {
      stores: stores.value,
      stockCampuran: stockCampuran.value,
      stockFragranceOil: stockFragranceOil.value,
      formulaBases: formulaBases.value,
      racikanCatalog: racikanCatalog.value,
      hppCatalog: hppCatalog.value,
      readyToSellProducts: readyToSellProducts.value,
      quickNotes: quickNotes.value,
      deadlines: deadlines.value,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_stock_kobicha_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Database berhasil di-export ke file JSON! 💾');
  }

  function importDatabase(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.stockFragranceOil || parsed.stockCampuran || parsed.stores || parsed.readyToSellProducts) {
        if (Array.isArray(parsed.stores)) stores.value = parsed.stores;
        if (Array.isArray(parsed.stockCampuran)) stockCampuran.value = parsed.stockCampuran;
        if (Array.isArray(parsed.stockFragranceOil)) stockFragranceOil.value = parsed.stockFragranceOil;
        if (Array.isArray(parsed.formulaBases)) formulaBases.value = parsed.formulaBases;
        if (Array.isArray(parsed.racikanCatalog)) racikanCatalog.value = parsed.racikanCatalog;
        if (Array.isArray(parsed.hppCatalog)) hppCatalog.value = parsed.hppCatalog;
        if (Array.isArray(parsed.readyToSellProducts)) readyToSellProducts.value = parsed.readyToSellProducts;
        if (Array.isArray(parsed.quickNotes)) quickNotes.value = parsed.quickNotes;
        if (Array.isArray(parsed.deadlines)) deadlines.value = parsed.deadlines;
        saveDatabase();
        showToast('Database berhasil di-import dan diperbarui! 🚀');
        return true;
      } else {
        showToast('Format file JSON tidak valid', 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      showToast('Gagal membaca file JSON backup', 'error');
      return false;
    }
  }

  // Initialize
  loadDatabase();

  return {
    // Navigation
    activeTab,
    isMobileNavOpen,
    openMobileNav,
    closeMobileNav,
    toggleMobileNav,
    navigateTo,
    prefilledRacikanId,
    prefilledFormulaBaseId,
    prefilledHppRacikanId,
    prefilledHppBaseId,
    isQuickAddFoOpen,
    isQuickAddCampuranOpen,
    openCalculatorWithRacikan,
    openHppWithRacikan,

    // States
    stores,
    stockCampuran,
    stockFragranceOil,
    formulaBases,
    racikanCatalog,
    hppCatalog,
    readyToSellProducts,
    quickNotes,
    deadlines,
    toasts,

    // Toast
    showToast,
    removeToast,

    // Computed
    getFoUsageCount,
    getFoAveragePricePerMl,
    getCampuranPrice,
    getCampuranAveragePricePerMl,
    bahanBakuCampuranList,
    allJenisBarangList,
    allReadyToSellSeries,
    renameJenisBarangCascade,
    totalStoresCount,
    totalCampuranCount,
    totalFoCount,
    totalRacikanCount,
    totalHppCount,
    totalReadyToSellCount,
    totalReadyToSellStock,
    totalReadyToSellValue,
    lowStockFoCount,
    lowStockCampuranCount,
    pendingDeadlinesCount,

    // CRUD
    addStore,
    updateStore,
    deleteStore,

    addStockCampuran,
    updateStockCampuran,
    deleteStockCampuran,

    addStockFragranceOil,
    updateStockFragranceOil,
    deleteStockFragranceOil,

    addFormulaBase,
    updateFormulaBase,
    deleteFormulaBase,

    addRacikanFragrance,
    updateRacikanFragrance,
    deleteRacikanFragrance,

    addHppCalculation,
    updateHppCalculation,
    deleteHppCalculation,

    addReadyToSellProduct,
    updateReadyToSellProduct,
    deleteReadyToSellProduct,

    addQuickNote,
    updateQuickNote,
    deleteQuickNote,

    addDeadline,
    toggleDeadline,
    deleteDeadline,

    // Cloud Sync
    cloudSyncStatus,
    lastSyncedAt,
    forceCloudSync,

    // Persistence & Backup
    exportDatabase,
    importDatabase,
    resetToSampleData,
    clearAllData
  };
});
