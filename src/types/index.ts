export type NotesEnum = 
  | 'Woody'
  | 'Floral'
  | 'Gourmand'
  | 'Oriental'
  | 'Fruity'
  | 'Aquatic'
  | 'Aromatic'
  | 'Citrus'
  | 'Green'
  | 'Leathery'
  | 'Powdery';

export type PyramidEnum = 'Top' | 'Middle' | 'Bottom';

export type JenisLiquidEnum = 
  | 'Essential oil'
  | 'Fragrance Oil'
  | 'Kimia Sintetis'
  | 'Steering Base';

export type CurrentStockEnum = 'Banyak' | 'Dikit' | 'Habis';

export interface StoreSupplier {
  id: string;
  jenisBarang: string;
  namaToko: string;
  linkToko: string;
  gambar?: string;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockCampuran {
  id: string;
  jenis: string;
  namaBarang: string;
  isBahanBaku?: boolean; // true = Bahan Baku Cairan / Pelarut / Aditif, false = Packaging / Lainnya
  currentStock?: CurrentStockEnum; // 'Banyak' | 'Dikit' | 'Habis' khusus Bahan Baku
  ukuranMl?: number; // Volume kemasan dalam ml (misal 1000 ml = 1 liter)
  hargaPerMl?: number; // Auto: hargaPerPcs / (ukuranMl || 1)
  jumlahStok: number;
  storeId?: string;
  storeName: string;
  hargaPerPcs: number;
  gambar?: string;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceTier {
  id: string;
  ml: number;
  harga: number;
  hargaPerMl: number;
}

export interface StockFragranceOil {
  id: string;
  jenisLiquid: JenisLiquidEnum;
  nama: string;
  storeId?: string;
  storeName: string;
  botolMl: number;
  currentStock: CurrentStockEnum;
  notes: NotesEnum[];
  pyramid: PyramidEnum;
  priceTiers: PriceTier[];
  gambar?: string;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormulaBaseIngredient {
  id: string;
  namaBahan: string;
  stockCampuranId?: string;
  isFragranceOilConcentrate?: boolean;
  percentage: number;
}

export interface FormulaBase {
  id: string;
  nama: string;
  deskripsi?: string;
  ingredients: FormulaBaseIngredient[];
  totalPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface RacikanItem {
  id: string;
  fragranceOilId: string;
  fragranceOilName: string;
  tetes: number;
  calculatedMl?: number;
  calculatedPercentage?: number;
  pricePerMl?: number;
}

export interface RacikanFragrance {
  id: string;
  nama: string;
  formulaBaseId?: string;
  formulaBaseName?: string;
  targetTotalMl: number;
  foConcentrationPercentage: number;
  fragranceOils: RacikanItem[];
  notes: NotesEnum[];
  isCommission: boolean;
  tanggalDibuat: string; // "September 2026"
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackagingHppItem {
  id: string;
  namaItem: string;
  jumlah: number;
  hargaSatuan: number;
  total: number;
}

export interface HppLiquidIngredientDetail {
  nama: string;
  jenis: 'FO' | 'Campuran';
  volumeMl: number;
  biaya: number;
}

export interface HppCalculation {
  id: string;
  nama: string;
  formulaBaseId?: string;
  formulaBaseName?: string;
  racikanId?: string;
  racikanName?: string;
  targetBottleMl: number;
  subtotalLiquid: number;
  subtotalPackaging: number;
  grandTotalHpp: number;
  hppPerMl: number;
  targetMarginPercentage: number;
  recommendedSellingPrice: number;
  packagingItems: PackagingHppItem[];
  liquidDetails: HppLiquidIngredientDetail[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  color?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarDeadline {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  reminderTime?: string;
  category: 'beli_stok' | 'maturasi' | 'deadline_order' | 'lainnya';
  isCompleted: boolean;
  notes?: string;
  createdAt: string;
}

export interface BundleProductItem {
  id: string;
  hppCalculationId: string;
  namaProduk: string;
  qty: number;
  ukuranBotolMl?: number;
  hppPerItem?: number;
}

export interface ReadyToSellProduct {
  id: string;
  isBundle: boolean;
  nama: string;
  hppCalculationId?: string; // Jika produk tunggal, terhubung ke katalog HPP
  bundleItems?: BundleProductItem[]; // Jika paket bundle
  jumlahStok: number;
  hargaJual: number;
  series: string;
  gambar?: string;
  pertamaKaliDijual: string; // YYYY-MM-DD
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

