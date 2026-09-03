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

export const INITIAL_STORES: StoreSupplier[] = [
  {
    id: 'store-1',
    jenisBarang: 'Fragrance Oil & Essential Oil Import',
    namaToko: 'Aromatics Botanica ID',
    linkToko: 'https://shopee.co.id/aromatics_botanica',
    gambar: '',
    deskripsi: 'Supplier resmi bibit parfum murni grade kosmetik dan minyak atsiri organik dari Perancis & Spanyol.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'store-2',
    jenisBarang: 'Bahan Kimia Pelarut & Fixative',
    namaToko: 'Kimia Farma Lab Supply',
    linkToko: 'https://tokopedia.com/kimiafarmalab',
    gambar: '',
    deskripsi: 'Pusat ethanol absolute 96-99% food grade, DPG, Gliserin, dan fixative pengikat aroma.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'store-3',
    jenisBarang: 'Botol Parfum Kaca & Sprayer Crimp',
    namaToko: 'Luxury Glass Packaging',
    linkToko: 'https://tokopedia.com/luxuryglass',
    gambar: '',
    deskripsi: 'Grosir botol parfum kaca tebal 30ml, 50ml, 100ml model kotak & silinder dengan atomizer mist halus.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_CAMPURAN: StockCampuran[] = [
  {
    id: 'camp-1',
    jenis: 'Pelarut / Solvent',
    namaBarang: 'Ethanol Absolute 96% Super Fine Grade',
    isBahanBaku: true,
    currentStock: 'Banyak',
    ukuranMl: 1000,
    hargaPerMl: 65,
    jumlahStok: 50,
    storeId: 'store-2',
    storeName: 'Kimia Farma Lab Supply',
    hargaPerPcs: 65000,
    deskripsi: 'Alkohol murni tidak menyengat hidung, khusus formulasi parfum mewah.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'camp-2',
    jenis: 'Fixative / Pengikat',
    namaBarang: 'Dipropylene Glycol (DPG) Odorless',
    isBahanBaku: true,
    currentStock: 'Banyak',
    ukuranMl: 1000,
    hargaPerMl: 85,
    jumlahStok: 25,
    storeId: 'store-2',
    storeName: 'Kimia Farma Lab Supply',
    hargaPerPcs: 85000,
    deskripsi: 'Pengikat aroma agar tahan 8-12 jam di kulit dan pakaian.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'camp-3',
    jenis: 'Botol & Packaging',
    namaBarang: 'Botol Kaca Kotak Amber 50ml + Black Spray',
    isBahanBaku: false,
    jumlahStok: 120,
    storeId: 'store-3',
    storeName: 'Luxury Glass Packaging',
    hargaPerPcs: 9500,
    deskripsi: 'Botol kaca berat amber premium dengan semprotan fine mist.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'camp-4',
    jenis: 'Pelarut / Solvent',
    namaBarang: 'Aquades Demineralized Water (Aqua Purified)',
    isBahanBaku: true,
    currentStock: 'Banyak',
    ukuranMl: 1000,
    hargaPerMl: 18,
    jumlahStok: 30,
    storeId: 'store-2',
    storeName: 'Kimia Farma Lab Supply',
    hargaPerPcs: 18000,
    deskripsi: 'Air murni bebas ion untuk menstabilkan konsentrasi pelarut.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_FRAGRANCE_OILS: StockFragranceOil[] = [
  {
    id: 'fo-1',
    jenisLiquid: 'Fragrance Oil',
    nama: 'Bergamot Calabria Pure',
    storeId: 'store-1',
    storeName: 'Aromatics Botanica ID',
    botolMl: 100,
    currentStock: 'Banyak',
    notes: ['Citrus', 'Aromatic'],
    pyramid: 'Top',
    priceTiers: [
      { id: 'tier-1', ml: 30, harga: 65000, hargaPerMl: 2167 },
      { id: 'tier-2', ml: 100, harga: 180000, hargaPerMl: 1800 }
    ],
    deskripsi: 'Citrus segar khas Italia Selatan yang cerah dan memberikan opening mewah.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fo-2',
    jenisLiquid: 'Fragrance Oil',
    nama: 'Damask Rose Velvet Absolute',
    storeId: 'store-1',
    storeName: 'Aromatics Botanica ID',
    botolMl: 50,
    currentStock: 'Banyak',
    notes: ['Floral', 'Powdery'],
    pyramid: 'Middle',
    priceTiers: [
      { id: 'tier-3', ml: 50, harga: 140000, hargaPerMl: 2800 },
      { id: 'tier-4', ml: 100, harga: 250000, hargaPerMl: 2500 }
    ],
    deskripsi: 'Aroma mawar merah beludru yang elegan dan romantis untuk heart note.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fo-3',
    jenisLiquid: 'Essential oil',
    nama: 'Indonesian Dark Patchouli (Nilam)',
    storeId: 'store-1',
    storeName: 'Aromatics Botanica ID',
    botolMl: 30,
    currentStock: 'Dikit',
    notes: ['Woody', 'Oriental'],
    pyramid: 'Bottom',
    priceTiers: [
      { id: 'tier-5', ml: 30, harga: 90000, hargaPerMl: 3000 },
      { id: 'tier-6', ml: 100, harga: 270000, hargaPerMl: 2700 }
    ],
    deskripsi: 'Minyak nilam Aceh tua dengan karakter earthy, woody, dan daya tahan sangat tinggi.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fo-4',
    jenisLiquid: 'Fragrance Oil',
    nama: 'Madagascar Bourbon Vanilla',
    storeId: 'store-1',
    storeName: 'Aromatics Botanica ID',
    botolMl: 100,
    currentStock: 'Banyak',
    notes: ['Gourmand', 'Oriental'],
    pyramid: 'Bottom',
    priceTiers: [
      { id: 'tier-7', ml: 100, harga: 195000, hargaPerMl: 1950 }
    ],
    deskripsi: 'Vanilla manis creamy dengan nuansa warm balsam yang cozy.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fo-5',
    jenisLiquid: 'Kimia Sintetis',
    nama: 'Iso E Super (Woody Molecule)',
    storeId: 'store-2',
    storeName: 'Kimia Farma Lab Supply',
    botolMl: 100,
    currentStock: 'Banyak',
    notes: ['Woody'],
    pyramid: 'Middle',
    priceTiers: [
      { id: 'tier-8', ml: 100, harga: 125000, hargaPerMl: 1250 }
    ],
    deskripsi: 'Molekul sintetis penguat aroma cedarwood transparan yang memberikan efek sillage halus.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fo-6',
    jenisLiquid: 'Fragrance Oil',
    nama: 'Sea Salt & Driftwood Aquatic',
    storeId: 'store-1',
    storeName: 'Aromatics Botanica ID',
    botolMl: 30,
    currentStock: 'Habis',
    notes: ['Aquatic', 'Aromatic'],
    pyramid: 'Top',
    priceTiers: [
      { id: 'tier-9', ml: 30, harga: 70000, hargaPerMl: 2333 }
    ],
    deskripsi: 'Aroma angin laut segar berpadu dengan kayu apung pantai.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_FORMULA_BASES: FormulaBase[] = [
  {
    id: 'base-1',
    nama: 'Eau de Parfum (EDP) 20% Standard',
    deskripsi: 'Formula standar EDP komersial dengan sillage dan longevity 6-8 jam.',
    ingredients: [
      { id: 'ing-1', namaBahan: 'Fragrance Oil Concentrate', isFragranceOilConcentrate: true, percentage: 20 },
      { id: 'ing-2', namaBahan: 'Ethanol Absolute 96% Super Fine Grade', stockCampuranId: 'camp-1', percentage: 75 },
      { id: 'ing-3', namaBahan: 'Dipropylene Glycol (DPG) Odorless', stockCampuranId: 'camp-2', percentage: 3 },
      { id: 'ing-4', namaBahan: 'Aquades Demineralized Water (Aqua Purified)', stockCampuranId: 'camp-4', percentage: 2 }
    ],
    totalPercentage: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'base-2',
    nama: 'Eau de Toilette (EDT) 10% Light',
    deskripsi: 'Formula segar ringan untuk daily wear, fresh splash, atau body mist.',
    ingredients: [
      { id: 'ing-5', namaBahan: 'Fragrance Oil Concentrate', isFragranceOilConcentrate: true, percentage: 10 },
      { id: 'ing-6', namaBahan: 'Ethanol Absolute 96% Super Fine Grade', stockCampuranId: 'camp-1', percentage: 85 },
      { id: 'ing-7', namaBahan: 'Dipropylene Glycol (DPG) Odorless', stockCampuranId: 'camp-2', percentage: 2 },
      { id: 'ing-8', namaBahan: 'Aquades Demineralized Water (Aqua Purified)', stockCampuranId: 'camp-4', percentage: 3 }
    ],
    totalPercentage: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'base-3',
    nama: 'Extrait de Parfum 30% Intense',
    deskripsi: 'Formula konsentrasi tinggi untuk parfum mewah dengan longevity 12+ jam.',
    ingredients: [
      { id: 'ing-9', namaBahan: 'Fragrance Oil Concentrate', isFragranceOilConcentrate: true, percentage: 30 },
      { id: 'ing-10', namaBahan: 'Ethanol Absolute 96% Super Fine Grade', stockCampuranId: 'camp-1', percentage: 65 },
      { id: 'ing-11', namaBahan: 'Dipropylene Glycol (DPG) Odorless', stockCampuranId: 'camp-2', percentage: 5 }
    ],
    totalPercentage: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_RACIKAN: RacikanFragrance[] = [
  {
    id: 'racikan-1',
    nama: 'Kobicha Signature No. 1 - Velvet Wood',
    formulaBaseId: 'base-1',
    formulaBaseName: 'Eau de Parfum (EDP) 20% Standard',
    targetTotalMl: 50,
    foConcentrationPercentage: 20,
    fragranceOils: [
      { id: 'item-1', fragranceOilId: 'fo-1', fragranceOilName: 'Bergamot Calabria Pure', tetes: 25 },
      { id: 'item-2', fragranceOilId: 'fo-2', fragranceOilName: 'Damask Rose Velvet Absolute', tetes: 35 },
      { id: 'item-3', fragranceOilId: 'fo-5', fragranceOilName: 'Iso E Super (Woody Molecule)', tetes: 20 },
      { id: 'item-4', fragranceOilId: 'fo-4', fragranceOilName: 'Madagascar Bourbon Vanilla', tetes: 20 }
    ],
    notes: ['Citrus', 'Floral', 'Woody', 'Gourmand'],
    isCommission: false,
    tanggalDibuat: 'September 2026',
    deskripsi: 'Kombinasi opening bergamot cerah yang melebur ke mawar beludru dengan drydown vanila kayu yang hangat dan memikat.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'racikan-2',
    nama: 'Dark Rose Nocturne (Custom Batch)',
    formulaBaseId: 'base-3',
    formulaBaseName: 'Extrait de Parfum 30% Intense',
    targetTotalMl: 30,
    foConcentrationPercentage: 30,
    fragranceOils: [
      { id: 'item-5', fragranceOilId: 'fo-2', fragranceOilName: 'Damask Rose Velvet Absolute', tetes: 45 },
      { id: 'item-6', fragranceOilId: 'fo-3', fragranceOilName: 'Indonesian Dark Patchouli (Nilam)', tetes: 30 },
      { id: 'item-7', fragranceOilId: 'fo-4', fragranceOilName: 'Madagascar Bourbon Vanilla', tetes: 25 }
    ],
    notes: ['Floral', 'Woody', 'Oriental', 'Gourmand'],
    isCommission: true,
    tanggalDibuat: 'Agustus 2026',
    deskripsi: 'Pesanan khusus aroma mawar gelap bernuansa oriental mistis dengan nilam Aceh dan bourbon vanilla.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_HPP: HppCalculation[] = [
  {
    id: 'hpp-1',
    nama: 'HPP Kobicha Signature No. 1 (Botol 50ml Amber)',
    formulaBaseId: 'base-1',
    formulaBaseName: 'Eau de Parfum (EDP) 20% Standard',
    racikanId: 'racikan-1',
    racikanName: 'Kobicha Signature No. 1 - Velvet Wood',
    targetBottleMl: 50,
    subtotalLiquid: 22850,
    subtotalPackaging: 16500,
    grandTotalHpp: 39350,
    hppPerMl: 787,
    targetMarginPercentage: 150,
    recommendedSellingPrice: 98500,
    packagingItems: [
      { id: 'pkg-1', namaItem: 'Botol Kaca Amber 50ml + Black Spray', jumlah: 1, hargaSatuan: 9500, total: 9500 },
      { id: 'pkg-2', namaItem: 'Hardbox Packaging Custom Kobicha', jumlah: 1, hargaSatuan: 4500, total: 4500 },
      { id: 'pkg-3', namaItem: 'Stiker Label Gold Foil + Pita Segel', jumlah: 1, hargaSatuan: 1500, total: 1500 },
      { id: 'pkg-4', namaItem: 'Biaya Bubble Wrap & Wrapping Dus', jumlah: 1, hargaSatuan: 1000, total: 1000 }
    ],
    liquidDetails: [
      { nama: 'Konsentrat Fragrance Oils (10ml)', jenis: 'FO', volumeMl: 10, biaya: 20150 },
      { nama: 'Ethanol 96% (37.5ml)', jenis: 'Campuran', volumeMl: 37.5, biaya: 2438 },
      { nama: 'DPG Fixative (1.5ml)', jenis: 'Campuran', volumeMl: 1.5, biaya: 255 },
      { nama: 'Aquades (1ml)', jenis: 'Campuran', volumeMl: 1, biaya: 7 }
    ],
    notes: 'Perhitungan standar untuk botol 50ml EDP dengan kemasan lengkap siap jual.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_QUICK_NOTES: QuickNote[] = [
  {
    id: 'note-1',
    title: '💡 Ide Formulasi Baru: Woody Citrus Tea',
    content: 'Coba padukan Bergamot 30 tetes + Iso E Super 20 tetes + sentuhan Nilam 5 tetes. Target buat tester 10ml dulu minggu ini.',
    color: 'amber',
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: '📝 Cek Stok Menipis',
    content: 'Stock Indonesian Patchouli tinggal dikit (sisa ~10ml). Segera reorder di Aromatics Botanica pas ada promo.',
    color: 'stone',
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_DEADLINES: CalendarDeadline[] = [
  {
    id: 'dl-1',
    title: 'Maturasi Batch No. 1 Velvet Wood Selesai',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 hari ke depan
    category: 'maturasi',
    reminderTime: '10:00',
    isCompleted: false,
    notes: 'Sudah dimaserasi 14 hari di tempat gelap sejuk. Siap difilter & botoling.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'dl-2',
    title: 'Restock Botol 50ml & Alkohol 96%',
    date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    category: 'beli_stok',
    reminderTime: '09:00',
    isCompleted: false,
    notes: 'Pesan 50 pcs botol amber dan 5 liter ethanol.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_READY_TO_SELL: ReadyToSellProduct[] = [
  {
    id: 'rts-1',
    isBundle: false,
    nama: 'Kobicha Signature No. 1 Velvet Wood Extrait (50ml)',
    hppCalculationId: 'hpp-1',
    jumlahStok: 24,
    hargaJual: 185000,
    series: 'Signature Wood Collection',
    gambar: '',
    pertamaKaliDijual: '2026-08-01',
    deskripsi: 'Parfum extrait de parfum 50ml dengan aroma woody hangat dan sentuhan mawar lembut.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rts-2',
    isBundle: true,
    nama: 'Duo Extrait Discovery Bundle (2x 50ml)',
    bundleItems: [
      {
        id: 'bundle-item-1',
        hppCalculationId: 'hpp-1',
        namaProduk: 'Kobicha Signature No. 1 (Botol 50ml Amber)',
        qty: 2,
        ukuranBotolMl: 50,
        hppPerItem: 38850
      }
    ],
    jumlahStok: 8,
    hargaJual: 335000,
    series: 'Gift & Holiday Edition',
    gambar: '',
    pertamaKaliDijual: '2026-08-15',
    deskripsi: 'Paket bundling 2 botol edisi spesial lengkap dengan luxury sleeve & gift card.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

