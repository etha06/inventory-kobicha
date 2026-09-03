<template>
  <div class="space-y-6">
    <!-- Top Card -->
    <div class="bg-white p-5 rounded-xl border border-sage-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <!-- Mobile Burger Button -->
        <button
          @click="store.openMobileNav()"
          class="lg:hidden w-9 h-9 rounded-lg bg-sage-50 hover:bg-sage-100 text-forest-900 flex items-center justify-center transition-all border border-sage-200/80 shadow-sm flex-shrink-0 active:scale-95"
          title="Buka Menu"
        >
          <Menu class="w-4 h-4" />
        </button>

        <div>
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">List Harga & Analisis Biaya per ml FO</h3>
          <p class="text-xs text-sage-600">Katalog komparasi efisiensi harga beli per 1 ml untuk mempermudah perhitungan HPP parfum</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-sage-50 text-forest-800 border border-sage-200">
          Rata-rata digunakan otomatis di Kalkulator
        </span>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-4 rounded-xl border border-sage-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama fragrance oil..."
          class="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        />
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
      </div>

      <!-- Filter Pyramid (Without "Note" word) -->
      <div>
        <CustomSelect
          v-model="filterPyramid"
          :options="pyramidOptions"
          placeholder="Semua Piramida"
        />
      </div>

      <!-- Sort By -->
      <div>
        <CustomSelect
          v-model="sortBy"
          :options="sortOptions"
          placeholder="Urutkan..."
        />
      </div>
    </div>

    <!-- List Harga Table -->
    <div class="bg-white rounded-xl border border-sage-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-4 text-left">Nama Fragrance Oil</th>
              <th class="py-3.5 px-4 text-left">Jenis Liquid</th>
              <th class="py-3.5 px-4 text-left">Pyramid</th>
              <th class="py-3.5 px-4 text-left">Toko Supplier</th>
              <th class="py-3.5 px-4 text-left">Varian Beli Terdaftar</th>
              <th class="py-3.5 px-4 text-left">Rata-rata Harga</th>
              <th class="py-3.5 px-4 text-left w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="processedFoList.length === 0">
              <td colspan="7" class="py-12 text-center text-stone-400">
                <Tag class="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p class="text-xs text-stone-400">Tidak ada data harga ditemukan.</p>
              </td>
            </tr>

            <tr
              v-for="item in paginatedFoList"
              :key="item.id"
              class="table-row-hover transition-colors"
            >
              <td class="py-3.5 px-4 text-left">
                <div class="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <span>{{ item.nama }}</span>
                </div>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="n in item.notes"
                    :key="n"
                    class="text-[9px] px-1.5 py-0.5 rounded font-medium border"
                    :class="[NOTE_COLOR_MAP[n].bg, NOTE_COLOR_MAP[n].text, NOTE_COLOR_MAP[n].border]"
                  >
                    {{ n }}
                  </span>
                </div>
              </td>

              <td class="py-3.5 px-4 text-left">
                <span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border text-[10px]">
                  {{ item.jenisLiquid }}
                </span>
              </td>

              <!-- Pyramid (Without "Note" word) -->
              <td class="py-3.5 px-4 text-left">
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold border inline-block"
                  :class="PYRAMID_BADGE_MAP[item.pyramid].bg"
                >
                  {{ item.pyramid }}
                </span>
              </td>

              <td class="py-3.5 px-4 text-left text-stone-600 font-medium">
                {{ item.storeName }}
              </td>

              <td class="py-3.5 px-4 text-left">
                <div class="space-y-1 max-w-[220px]">
                  <div
                    v-for="tier in item.priceTiers"
                    :key="tier.id"
                    class="text-[11px] flex items-center justify-between bg-stone-50 px-2 py-0.5 rounded border border-stone-200"
                  >
                    <span class="font-bold text-stone-700">{{ tier.ml }} ml</span>
                    <span class="text-stone-500 font-mono">{{ formatRupiah(tier.harga) }}</span>
                    <span class="font-bold text-amber-800 font-mono">({{ formatRupiah(tier.hargaPerMl) }})</span>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-4 text-left">
                <div class="inline-block bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg text-left">
                  <span class="text-sm font-bold text-amber-950 font-mono block">
                    {{ formatRupiah(item.avgPricePerMl) }}
                  </span>
                  <span class="text-[9px] text-amber-700 uppercase font-bold tracking-wider">Rata-rata</span>
                </div>
              </td>

              <!-- Aksi Column (Positioned Right, Aligned Left, Lucide Icons) -->
              <td class="py-3.5 px-4 text-left">
                <button
                  @click="store.navigateTo('stock-fo')"
                  class="p-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                  title="Lihat di Stock FO"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination for Table -->
      <Pagination
        v-model:currentPage="currentPage"
        :totalItems="processedFoList.length"
        :itemsPerPage="itemsPerPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { PYRAMID_OPTIONS, NOTE_COLOR_MAP, PYRAMID_BADGE_MAP } from '../utils/constants';
import { formatRupiah } from '../utils/formatters';
import { Search, Eye, Tag, Menu } from 'lucide-vue-next';
import CustomSelect from '../components/common/CustomSelect.vue';
import Pagination from '../components/common/Pagination.vue';

const store = useKobichaStore();
const { stockFragranceOil } = storeToRefs(store);

const searchQuery = ref('');
const filterPyramid = ref('');
const sortBy = ref('price_asc');

// Pagination State (Max 10 rows per page)
const currentPage = ref(1);
const itemsPerPage = 10;

const pyramidOptions = [
  { value: '', label: 'Semua Piramida' },
  ...PYRAMID_OPTIONS.map(p => ({ value: p, label: p }))
];

const sortOptions = [
  { value: 'price_asc', label: 'Harga Termurah → Termahal' },
  { value: 'price_desc', label: 'Harga Termahal → Termurah' },
  { value: 'name_asc', label: 'Nama FO (A - Z)' }
];

const processedFoList = computed(() => {
  let list = stockFragranceOil.value.map(fo => {
    const avg = store.getFoAveragePricePerMl(fo.id);
    return {
      ...fo,
      avgPricePerMl: avg
    };
  });

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(f => f.nama.toLowerCase().includes(q) || f.storeName.toLowerCase().includes(q));
  }

  if (filterPyramid.value) {
    list = list.filter(f => f.pyramid === filterPyramid.value);
  }

  list.sort((a, b) => {
    if (sortBy.value === 'price_asc') return a.avgPricePerMl - b.avgPricePerMl;
    if (sortBy.value === 'price_desc') return b.avgPricePerMl - a.avgPricePerMl;
    if (sortBy.value === 'name_asc') return a.nama.localeCompare(b.nama);
    return 0;
  });

  return list;
});

const paginatedFoList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return processedFoList.value.slice(start, start + itemsPerPage);
});

watch([searchQuery, filterPyramid, sortBy], () => {
  currentPage.value = 1;
});
</script>
