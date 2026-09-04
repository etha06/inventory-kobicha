<template>
  <Modal
    :isOpen="isOpen"
    title="Riwayat Penambahan & Pembaruan Stock"
    subtitle="Catatan kronologis seluruh item Fragrance Oil, Bahan Baku, dan Kemasan yang ditambahkan ke inventaris"
    maxWidth="3xl"
    @close="$emit('close')"
  >
    <div class="space-y-4">
      <!-- Search & Category Filters -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama barang / toko supplier / jenis..."
            class="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
          />
          <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
        </div>

        <div class="flex items-center gap-1 bg-sage-50 p-1 rounded-lg text-xs font-semibold border border-sage-200/60 flex-wrap">
          <button
            type="button"
            @click="filterType = 'all'"
            class="px-3 py-1 rounded-md transition-all"
            :class="filterType === 'all' ? 'bg-peach-500 text-white shadow-xs font-bold' : 'text-sage-700 hover:text-forest-900'"
          >
            Semua ({{ allHistoryItems.length }})
          </button>
          <button
            type="button"
            @click="filterType = 'fo'"
            class="px-3 py-1 rounded-md transition-all"
            :class="filterType === 'fo' ? 'bg-peach-500 text-white shadow-xs font-bold' : 'text-sage-700 hover:text-forest-900'"
          >
            Fragrance Oil ({{ foCount }})
          </button>
          <button
            type="button"
            @click="filterType = 'campuran'"
            class="px-3 py-1 rounded-md transition-all"
            :class="filterType === 'campuran' ? 'bg-peach-500 text-white shadow-xs font-bold' : 'text-sage-700 hover:text-forest-900'"
          >
            Barang Lainnya ({{ campCount }})
          </button>
        </div>
      </div>

      <!-- History Items List -->
      <div class="border border-stone-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
        <div class="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
          <div
            v-if="filteredItems.length === 0"
            class="py-12 text-center text-stone-400 text-xs italic"
          >
            <History class="w-8 h-8 mx-auto mb-2 opacity-40 text-stone-400" />
            <p>Tidak ada riwayat penambahan stock yang sesuai pencarian.</p>
          </div>

          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="p-3.5 hover:bg-stone-50/80 transition-colors flex items-center justify-between gap-3"
          >
            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Type Badge -->
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold border"
                  :class="item.categoryBadgeClass"
                >
                  {{ item.categoryLabel }}
                </span>

                <span class="font-bold text-stone-900 text-xs truncate">{{ item.nama }}</span>

                <span
                  v-if="item.currentStock"
                  class="px-1.5 py-0.2 rounded text-[9px] font-bold border inline-flex items-center gap-1"
                  :class="STOCK_STATUS_MAP[item.currentStock]?.bg || 'bg-stone-100 text-stone-700'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="STOCK_STATUS_MAP[item.currentStock]?.dot || 'bg-stone-400'"></span>
                  {{ item.currentStock }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
                <span class="font-medium text-stone-700">{{ item.storeName }}</span>
                <span>•</span>
                <span class="font-mono text-stone-800 font-semibold">{{ item.quantityInfo }}</span>
                <span v-if="item.priceInfo">• <strong class="font-mono text-amber-900">{{ item.priceInfo }}</strong></span>
              </div>
            </div>

            <div class="text-right flex-shrink-0 space-y-1">
              <span class="text-[10px] text-stone-400 block font-mono">
                {{ item.formattedDate }}
              </span>
              <button
                type="button"
                @click="goToItemPage(item)"
                class="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-semibold transition-colors"
              >
                <span>Lihat</span>
                <ChevronRight class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-2 flex justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { STOCK_STATUS_MAP } from '../../utils/constants';
import { Search, History, ChevronRight } from 'lucide-vue-next';
import Modal from '../common/Modal.vue';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useKobichaStore();
const { stockFragranceOil, stockCampuran } = storeToRefs(store);

const searchQuery = ref('');
const filterType = ref<'all' | 'fo' | 'campuran'>('all');

interface HistoryEntry {
  id: string;
  source: 'fo' | 'campuran';
  nama: string;
  categoryLabel: string;
  categoryBadgeClass: string;
  storeName: string;
  quantityInfo: string;
  priceInfo: string;
  currentStock?: 'Banyak' | 'Dikit' | 'Habis';
  timestamp: number;
  formattedDate: string;
}

const allHistoryItems = computed<HistoryEntry[]>(() => {
  const list: HistoryEntry[] = [];

  // 1. Fragrance Oils
  stockFragranceOil.value.forEach(fo => {
    const rawDate = fo.updatedAt || fo.createdAt || new Date().toISOString();
    const avgPrice = store.getFoAveragePricePerMl(fo.id);
    list.push({
      id: fo.id,
      source: 'fo',
      nama: fo.nama,
      categoryLabel: fo.jenisLiquid || 'Fragrance Oil',
      categoryBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      storeName: fo.storeName || 'Toko Supplier',
      quantityInfo: `${fo.botolMl} ml`,
      priceInfo: avgPrice > 0 ? `${formatRupiah(avgPrice)}/ml` : '',
      currentStock: fo.currentStock,
      timestamp: new Date(rawDate).getTime(),
      formattedDate: formatDateIndo(rawDate)
    });
  });

  // 2. Stock Campuran & Kemasan
  stockCampuran.value.forEach(c => {
    const rawDate = c.updatedAt || c.createdAt || new Date().toISOString();
    list.push({
      id: c.id,
      source: 'campuran',
      nama: c.namaBarang,
      categoryLabel: c.isBahanBaku ? 'Bahan Baku' : 'Kemasan / Packaging',
      categoryBadgeClass: c.isBahanBaku ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-stone-100 text-stone-800 border-stone-300',
      storeName: c.storeName || 'Toko Supplier',
      quantityInfo: c.isBahanBaku && c.ukuranMl ? `${c.ukuranMl} ml (${c.jumlahStok} pcs)` : `${c.jumlahStok} pcs`,
      priceInfo: formatRupiah(c.hargaPerPcs),
      currentStock: c.currentStock,
      timestamp: new Date(rawDate).getTime(),
      formattedDate: formatDateIndo(rawDate)
    });
  });

  // Sort newest first
  return list.sort((a, b) => b.timestamp - a.timestamp);
});

const foCount = computed(() => stockFragranceOil.value.length);
const campCount = computed(() => stockCampuran.value.length);

const filteredItems = computed(() => {
  let list = allHistoryItems.value;

  if (filterType.value === 'fo') {
    list = list.filter(item => item.source === 'fo');
  } else if (filterType.value === 'campuran') {
    list = list.filter(item => item.source === 'campuran');
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      item =>
        item.nama.toLowerCase().includes(q) ||
        item.storeName.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
    );
  }

  return list;
});

function goToItemPage(item: HistoryEntry) {
  emit('close');
  if (item.source === 'fo') {
    store.navigateTo('stock-fo');
  } else {
    store.navigateTo('stock-campuran');
  }
}
</script>
