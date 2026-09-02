<template>
  <header class="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-sage-100/80 px-4 sm:px-8 flex items-center justify-between transition-all">
    <!-- Left: Mobile Menu Trigger & Page Title -->
    <div class="flex items-center gap-3 sm:gap-4">
      <button
        @click="$emit('open-mobile')"
        class="lg:hidden w-10 h-10 rounded-2xl bg-sage-50 hover:bg-sage-100 text-sage-800 flex items-center justify-center transition-colors border border-sage-200"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div>
        <div class="flex items-center gap-2">
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-800 border border-sage-200/80">
            {{ getCategoryLabel }}
          </span>
          <h2 class="text-base sm:text-lg font-bold text-forest-800 font-serif tracking-tight">
            {{ getPageTitle }}
          </h2>
        </div>
        <p class="text-xs text-sage-600 hidden sm:block mt-0.5 font-sans">
          {{ getPageSubtitle }}
        </p>
      </div>
    </div>

    <!-- Right: Date Indicator (Image 1 Style) -->
    <div class="flex items-center gap-3 sm:gap-4">
      <!-- Live Date String (Image 1 Header style) -->
      <div class="flex items-center gap-1.5 text-xs font-medium text-sage-700 bg-sage-50/80 px-3.5 py-1.5 rounded-full border border-sage-200/60">
        <Calendar class="w-3.5 h-3.5 text-sage-600" />
        <span>{{ todayFormatted }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { Menu, Calendar } from 'lucide-vue-next';

defineEmits(['open-mobile']);

const store = useKobichaStore();
const { activeTab } = storeToRefs(store);

const todayFormatted = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'short'
  });
});

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
