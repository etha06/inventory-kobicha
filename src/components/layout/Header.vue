<template>
  <header class="sticky top-0 z-30 h-20 bg-white/85 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between transition-all">
    <!-- Left: Mobile Menu Trigger & Page Title -->
    <div class="flex items-center gap-3 sm:gap-4">
      <button
        @click="$emit('open-mobile')"
        class="lg:hidden w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
            {{ getCategoryLabel }}
          </span>
          <h2 class="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            {{ getPageTitle }}
          </h2>
        </div>
        <p class="text-xs text-stone-500 hidden sm:block mt-0.5">
          {{ getPageSubtitle }}
        </p>
      </div>
    </div>

    <!-- Right: Quick Action Buttons & Status -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Quick Add Campuran -->
      <button
        @click="store.isQuickAddCampuranOpen = true"
        class="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all border border-stone-200/80 shadow-sm"
      >
        <Plus class="w-3.5 h-3.5 text-stone-600" />
        <span>Stok Campuran</span>
      </button>

      <!-- Quick Add Fragrance Oil -->
      <button
        @click="store.isQuickAddFoOpen = true"
        class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md shadow-amber-900/20 transition-all transform active:scale-95"
      >
        <Plus class="w-3.5 h-3.5 text-amber-200" />
        <span class="hidden sm:inline">Stok Fragrance Oil</span>
        <span class="sm:hidden">FO</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { Menu, Plus } from 'lucide-vue-next';

defineEmits(['open-mobile']);

const store = useKobichaStore();
const { activeTab } = storeToRefs(store);

const getCategoryLabel = computed(() => {
  switch (activeTab.value) {
    case 'home': return 'Dashboard';
    case 'wheretobuy': return 'Supplier';
    case 'stock-campuran':
    case 'stock-fo':
    case 'list-harga-fo': return 'Inventory';
    case 'formula-base':
    case 'katalog-racikan':
    case 'kalkulator-racikan': return 'Formulation';
    case 'katalog-hpp':
    case 'kalkulator-hpp': return 'Finance & HPP';
    default: return 'Kobicha';
  }
});

const getPageTitle = computed(() => {
  switch (activeTab.value) {
    case 'home': return 'Home & Agenda';
    case 'wheretobuy': return 'Where to Buy (Toko Supplier)';
    case 'stock-campuran': return 'Stock Barang Campuran';
    case 'stock-fo': return 'Stock Fragrance Oil';
    case 'list-harga-fo': return 'List Harga Fragrance Oil';
    case 'formula-base': return 'Katalog Formula Base';
    case 'katalog-racikan': return 'Katalog Racikan Fragrance';
    case 'kalkulator-racikan': return 'Kalkulator Racikan Parfum';
    case 'katalog-hpp': return 'Katalog Harga Modal (HPP)';
    case 'kalkulator-hpp': return 'Kalkulator HPP & Profit';
    default: return 'Kobicha Parfum';
  }
});

const getPageSubtitle = computed(() => {
  switch (activeTab.value) {
    case 'home': return 'Catatan harian, target deadline interaktif, dan statistik stok.';
    case 'wheretobuy': return 'Direktori toko dan supplier bahan baku parfum.';
    case 'stock-campuran': return 'Stok pelarut, fixative, botol packaging, dan perlengkapan.';
    case 'stock-fo': return 'Katalog konsentrat aroma, piramida notes, dan riwayat harga beli per ml.';
    case 'list-harga-fo': return 'Perbandingan efisiensi harga beli per 1 ml untuk seluruh fragrance oil.';
    case 'formula-base': return 'Komposisi persentase pelarut & konsentrat standar 100%.';
    case 'katalog-racikan': return 'Katalog resep racikan aroma parfum dan formula yang telah dibuat.';
    case 'kalkulator-racikan': return 'Kalkulator racikan aroma manual maupun berbasis template resep.';
    case 'katalog-hpp': return 'Riwayat perhitungan harga pokok penjualan dan profit margin.';
    case 'kalkulator-hpp': return 'Hitung harga modal produksi cairan dan packaging botol parfum.';
    default: return 'Sistem Manajemen Stok & Formulasi Parfum Kobicha';
  }
});
</script>
