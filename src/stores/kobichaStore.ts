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
  CalendarDeadline
} from '../types';
import {
  INITIAL_STORES,
  INITIAL_CAMPURAN,
  INITIAL_FRAGRANCE_OILS,
  INITIAL_FORMULA_BASES,
  INITIAL_RACIKAN,
  INITIAL_HPP,
  INITIAL_QUICK_NOTES,
  INITIAL_DEADLINES
} from './sampleData';

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
  | 'kalkulator-hpp';

export const useKobichaStore = defineStore('kobicha', () => {
  // Navigation State
  const activeTab = ref<NavigationTab>('home');
  const prefilledRacikanId = ref<string | null>(null);
  const prefilledFormulaBaseId = ref<string | null>(null);
  const prefilledHppRacikanId = ref<string | null>(null);
  const prefilledHppBaseId = ref<string | null>(null);

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

  // Load from LocalStorage or initialize with Sample Data
  function loadDatabase() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        stores.value = parsed.stores || INITIAL_STORES;
        stockCampuran.value = parsed.stockCampuran || INITIAL_CAMPURAN;
        stockFragranceOil.value = parsed.stockFragranceOil || INITIAL_FRAGRANCE_OILS;
        formulaBases.value = parsed.formulaBases || INITIAL_FORMULA_BASES;
        racikanCatalog.value = parsed.racikanCatalog || INITIAL_RACIKAN;
        hppCatalog.value = parsed.hppCatalog || INITIAL_HPP;
        quickNotes.value = parsed.quickNotes || INITIAL_QUICK_NOTES;
        deadlines.value = parsed.deadlines || INITIAL_DEADLINES;
      } else {
        resetToSampleData(false);
      }
    } catch (e) {
      console.error('Error loading database from localStorage:', e);
      resetToSampleData(false);
    }
  }

  function saveDatabase() {
    try {
      const payload = {
        stores: stores.value,
        stockCampuran: stockCampuran.value,
        stockFragranceOil: stockFragranceOil.value,
        formulaBases: formulaBases.value,
        racikanCatalog: racikanCatalog.value,
        hppCatalog: hppCatalog.value,
        quickNotes: quickNotes.value,
        deadlines: deadlines.value,
        version: '1.0'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving database to localStorage:', e);
    }
  }

  function resetToSampleData(notify = true) {
    stores.value = JSON.parse(JSON.stringify(INITIAL_STORES));
    stockCampuran.value = JSON.parse(JSON.stringify(INITIAL_CAMPURAN));
    stockFragranceOil.value = JSON.parse(JSON.stringify(INITIAL_FRAGRANCE_OILS));
    formulaBases.value = JSON.parse(JSON.stringify(INITIAL_FORMULA_BASES));
    racikanCatalog.value = JSON.parse(JSON.stringify(INITIAL_RACIKAN));
    hppCatalog.value = JSON.parse(JSON.stringify(INITIAL_HPP));
    quickNotes.value = JSON.parse(JSON.stringify(INITIAL_QUICK_NOTES));
    deadlines.value = JSON.parse(JSON.stringify(INITIAL_DEADLINES));
    saveDatabase();
    if (notify) showToast('Database telah di-reset ke data contoh awal', 'info');
  }

  // Auto-save on every state change
  watch(
    [stores, stockCampuran, stockFragranceOil, formulaBases, racikanCatalog, hppCatalog, quickNotes, deadlines],
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

  const lowStockFoCount = computed(() => {
    return stockFragranceOil.value.filter(fo => fo.currentStock === 'Dikit' || fo.currentStock === 'Habis').length;
  });

  const lowStockCampuranCount = computed(() => {
    return stockCampuran.value.filter(c => c.jumlahStok <= 5).length;
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

  // --- CRUD STORES ---
  function addStore(store: Omit<StoreSupplier, 'id' | 'createdAt' | 'updatedAt'>) {
    const newStore: StoreSupplier = {
      ...store,
      id: 'store-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    stores.value.unshift(newStore);
    showToast(`Toko "${newStore.namaToko}" berhasil ditambahkan!`);
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
      showToast('Data toko berhasil diperbarui!');
    }
  }

  function deleteStore(id: string) {
    const store = stores.value.find(s => s.id === id);
    stores.value = stores.value.filter(s => s.id !== id);
    showToast(`Toko "${store?.namaToko || ''}" berhasil dihapus`, 'info');
  }

  // --- CRUD STOCK CAMPURAN ---
  function addStockCampuran(item: Omit<StockCampuran, 'id' | 'createdAt' | 'updatedAt'>) {
    const hargaPerMl = item.isBahanBaku && item.ukuranMl && item.ukuranMl > 0
      ? Math.round(item.hargaPerPcs / item.ukuranMl)
      : item.hargaPerMl;

    const newItem: StockCampuran = {
      ...item,
      hargaPerMl,
      id: 'camp-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    stockCampuran.value.unshift(newItem);
    showToast(`Bahan campuran "${newItem.namaBarang}" berhasil ditambahkan!`);
    return newItem;
  }

  function updateStockCampuran(id: string, updates: Partial<StockCampuran>) {
    const idx = stockCampuran.value.findIndex(c => c.id === id);
    if (idx !== -1) {
      const merged = { ...stockCampuran.value[idx], ...updates };
      if (merged.isBahanBaku && merged.ukuranMl && merged.ukuranMl > 0) {
        merged.hargaPerMl = Math.round(merged.hargaPerPcs / merged.ukuranMl);
      }
      stockCampuran.value[idx] = {
        ...merged,
        updatedAt: new Date().toISOString()
      };
      showToast('Data bahan campuran berhasil diperbarui!');
    }
  }

  function deleteStockCampuran(id: string) {
    const item = stockCampuran.value.find(c => c.id === id);
    stockCampuran.value = stockCampuran.value.filter(c => c.id !== id);
    showToast(`Bahan "${item?.namaBarang || ''}" berhasil dihapus`, 'info');
  }

  // --- CRUD STOCK FRAGRANCE OIL ---
  function addStockFragranceOil(item: Omit<StockFragranceOil, 'id' | 'createdAt' | 'updatedAt'>) {
    const newItem: StockFragranceOil = {
      ...item,
      id: 'fo-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    stockFragranceOil.value.unshift(newItem);
    showToast(`Fragrance oil "${newItem.nama}" berhasil ditambahkan!`);
    return newItem;
  }

  function updateStockFragranceOil(id: string, updates: Partial<StockFragranceOil>) {
    const idx = stockFragranceOil.value.findIndex(f => f.id === id);
    if (idx !== -1) {
      stockFragranceOil.value[idx] = {
        ...stockFragranceOil.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      showToast('Data fragrance oil berhasil diperbarui!');
    }
  }

  function deleteStockFragranceOil(id: string) {
    const fo = stockFragranceOil.value.find(f => f.id === id);
    stockFragranceOil.value = stockFragranceOil.value.filter(f => f.id !== id);
    showToast(`Fragrance oil "${fo?.nama || ''}" berhasil dihapus`, 'info');
  }

  // --- CRUD FORMULA BASE ---
  function addFormulaBase(base: Omit<FormulaBase, 'id' | 'createdAt' | 'updatedAt'>) {
    const newBase: FormulaBase = {
      ...base,
      id: 'base-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    formulaBases.value.unshift(newBase);
    showToast(`Formula Base "${newBase.nama}" berhasil disimpan!`);
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
      showToast('Formula Base berhasil diperbarui!');
    }
  }

  function deleteFormulaBase(id: string) {
    const b = formulaBases.value.find(x => x.id === id);
    formulaBases.value = formulaBases.value.filter(x => x.id !== id);
    showToast(`Formula Base "${b?.nama || ''}" berhasil dihapus`, 'info');
  }

  // --- CRUD RACIKAN FRAGRANCE ---
  function addRacikanFragrance(racikan: Omit<RacikanFragrance, 'id' | 'createdAt' | 'updatedAt'>) {
    const newRacikan: RacikanFragrance = {
      ...racikan,
      id: 'racikan-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    racikanCatalog.value.unshift(newRacikan);
    showToast(`Racikan "${newRacikan.nama}" berhasil disimpan ke Katalog!`);
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
      showToast('Data racikan berhasil diperbarui!');
    }
  }

  function deleteRacikanFragrance(id: string) {
    const r = racikanCatalog.value.find(x => x.id === id);
    racikanCatalog.value = racikanCatalog.value.filter(x => x.id !== id);
    showToast(`Racikan "${r?.nama || ''}" berhasil dihapus`, 'info');
  }

  // --- CRUD HPP CALCULATION ---
  function addHppCalculation(hpp: Omit<HppCalculation, 'id' | 'createdAt' | 'updatedAt'>) {
    const newHpp: HppCalculation = {
      ...hpp,
      id: 'hpp-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    hppCatalog.value.unshift(newHpp);
    showToast(`Kalkulasi HPP "${newHpp.nama}" berhasil disimpan ke Katalog HPP!`);
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
      showToast('Kalkulasi HPP berhasil diperbarui!');
    }
  }

  function deleteHppCalculation(id: string) {
    const h = hppCatalog.value.find(x => x.id === id);
    hppCatalog.value = hppCatalog.value.filter(x => x.id !== id);
    showToast(`Perhitungan HPP "${h?.nama || ''}" berhasil dihapus`, 'info');
  }

  // --- CRUD QUICK NOTES ---
  function addQuickNote(note: Omit<QuickNote, 'id' | 'createdAt' | 'updatedAt'>) {
    const newNote: QuickNote = {
      ...note,
      id: 'note-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    quickNotes.value.unshift(newNote);
    showToast('Catatan berhasil ditambahkan!');
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
    }
  }

  function deleteQuickNote(id: string) {
    quickNotes.value = quickNotes.value.filter(n => n.id !== id);
    showToast('Catatan dihapus', 'info');
  }

  // --- CRUD CALENDAR DEADLINES ---
  function addDeadline(deadline: Omit<CalendarDeadline, 'id' | 'createdAt'>) {
    const newDeadline: CalendarDeadline = {
      ...deadline,
      id: 'dl-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    deadlines.value.push(newDeadline);
    showToast('Target deadline & pengingat berhasil dibuat!');
    return newDeadline;
  }

  function toggleDeadline(id: string) {
    const dl = deadlines.value.find(d => d.id === id);
    if (dl) {
      dl.isCompleted = !dl.isCompleted;
      showToast(dl.isCompleted ? 'Deadline ditandai selesai! 🎉' : 'Deadline dibuka kembali');
    }
  }

  function deleteDeadline(id: string) {
    deadlines.value = deadlines.value.filter(d => d.id !== id);
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
      if (parsed.stockFragranceOil || parsed.stockCampuran || parsed.stores) {
        if (Array.isArray(parsed.stores)) stores.value = parsed.stores;
        if (Array.isArray(parsed.stockCampuran)) stockCampuran.value = parsed.stockCampuran;
        if (Array.isArray(parsed.stockFragranceOil)) stockFragranceOil.value = parsed.stockFragranceOil;
        if (Array.isArray(parsed.formulaBases)) formulaBases.value = parsed.formulaBases;
        if (Array.isArray(parsed.racikanCatalog)) racikanCatalog.value = parsed.racikanCatalog;
        if (Array.isArray(parsed.hppCatalog)) hppCatalog.value = parsed.hppCatalog;
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
    prefilledRacikanId,
    prefilledFormulaBaseId,
    prefilledHppRacikanId,
    prefilledHppBaseId,
    isQuickAddFoOpen,
    isQuickAddCampuranOpen,
    navigateTo,
    openCalculatorWithRacikan,
    openHppWithRacikan,

    // States
    stores,
    stockCampuran,
    stockFragranceOil,
    formulaBases,
    racikanCatalog,
    hppCatalog,
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
    renameJenisBarangCascade,
    totalStoresCount,
    totalCampuranCount,
    totalFoCount,
    totalRacikanCount,
    totalHppCount,
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

    addQuickNote,
    updateQuickNote,
    deleteQuickNote,

    addDeadline,
    toggleDeadline,
    deleteDeadline,

    // Persistence & Backup
    exportDatabase,
    importDatabase,
    resetToSampleData
  };
});
