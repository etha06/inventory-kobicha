<template>
  <div class="space-y-6">
    <!-- Top Card -->
    <div class="bg-white p-5 rounded-[24px] border border-sage-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <!-- Mobile Burger Button -->
        <button
          @click="store.openMobileNav()"
          class="lg:hidden w-9 h-9 rounded-2xl bg-sage-50 hover:bg-sage-100 text-forest-900 flex items-center justify-center transition-all border border-sage-200/80 shadow-sm flex-shrink-0 active:scale-95"
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
        <span class="text-xs font-semibold px-3 py-1.5 rounded-full bg-sage-50 text-forest-800 border border-sage-200">
          Rata-rata digunakan otomatis di Kalkulator
        </span>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-4 rounded-[20px] border border-sage-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama fragrance oil..."
          class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        />
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
      </div>

      <!-- Filter Pyramid (Without "Note" word) -->
      <div>
        <select
          v-model="filterPyramid"
          class="w-full px-3 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        >
          <option value="">-- Semua Piramida --</option>
          <option v-for="p in PYRAMID_OPTIONS" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>

      <!-- Sort By -->
      <div>
        <select
          v-model="sortBy"
          class="w-full px-3 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        >
          <option value="price_asc">Harga Termurah → Termahal</option>
          <option value="price_desc">Harga Termahal → Termurah</option>
          <option value="name_asc">Nama FO (A - Z)</option>
        </select>
      </div>
    </div>

    <!-- List Harga Table -->
    <div class="bg-white rounded-[24px] border border-sage-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-4 w-10 text-center">#</th>
              <th class="py-3.5 px-4">Nama Fragrance Oil</th>
              <th class="py-3.5 px-4">Jenis Liquid</th>
              <th class="py-3.5 px-4 text-center">Pyramid</th>
              <th class="py-3.5 px-4">Toko Supplier</th>
              <th class="py-3.5 px-4">Varian Beli Terdaftar</th>
              <th class="py-3.5 px-4 text-right">Rata-rata Harga</th>
              <th class="py-3.5 px-4 text-left w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="processedFoList.length === 0">
              <td colspan="8" class="py-12 text-center text-stone-400">
                <Tag class="w-8 h-8 mx-auto mb-2 opacity-50" />
                Tidak ada data harga ditemukan.
              </td>
            </tr>

            <tr
              v-for="(item, idx) in processedFoList"
              :key="item.id"
              class="table-row-hover transition-colors"
            >
              <td class="py-3.5 px-4 text-center text-stone-400 font-mono">
                {{ idx + 1 }}
              </td>

              <td class="py-3.5 px-4">
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

              <td class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border text-[10px]">
                  {{ item.jenisLiquid }}
                </span>
              </td>

              <!-- Pyramid (Without "Note" word) -->
              <td class="py-3.5 px-4 text-center">
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                  :class="PYRAMID_BADGE_MAP[item.pyramid].bg"
                >
                  {{ item.pyramid }}
                </span>
              </td>

              <td class="py-3.5 px-4 text-stone-600 font-medium">
                {{ item.storeName }}
              </td>

              <td class="py-3.5 px-4">
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

              <td class="py-3.5 px-4 text-right">
                <div class="inline-block bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-right">
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
                  class="p-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                  title="Lihat di Stok FO"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { PYRAMID_OPTIONS, NOTE_COLOR_MAP, PYRAMID_BADGE_MAP } from '../utils/constants';
import { formatRupiah } from '../utils/formatters';
import { Search, Eye, Tag, Menu } from 'lucide-vue-next';

const store = useKobichaStore();
const { stockFragranceOil } = storeToRefs(store);

const searchQuery = ref('');
const filterPyramid = ref('');
const sortBy = ref('price_asc');

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
</script>
