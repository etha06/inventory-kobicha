<template>
  <div class="space-y-8">
    <!-- Top Action Card -->
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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Katalog Harga Modal / HPP Parfum</h3>
          <p class="text-xs text-sage-600">Database rekaman HPP botolan, rincian biaya liquid & kemasan, serta simulasi harga jual</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- View Mode Toggle (Card vs Table) -->
        <div class="flex items-center bg-sage-50 p-1 rounded-2xl text-xs font-semibold text-sage-700 border border-sage-200/60">
          <button
            @click="viewMode = 'table'"
            class="px-3 py-1.5 rounded-xl transition-all"
            :class="viewMode === 'table' ? 'bg-white text-forest-900 shadow-sm font-bold' : 'hover:text-forest-900'"
          >
            Tabel
          </button>
          <button
            @click="viewMode = 'card'"
            class="px-3 py-1.5 rounded-xl transition-all"
            :class="viewMode === 'card' ? 'bg-white text-forest-900 shadow-sm font-bold' : 'hover:text-forest-900'"
          >
            Card
          </button>
        </div>

        <button
          @click="store.navigateTo('kalkulator-hpp')"
          class="px-4 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5"
        >
          <Calculator class="w-4 h-4" />
          <span>Hitung HPP Baru</span>
        </button>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-4 rounded-[20px] border border-sage-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama produk / formula..."
          class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        />
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
      </div>

      <!-- Filter Bottle Size -->
      <div>
        <CustomSelect
          v-model="filterBottleSize"
          :options="bottleSizeOptions"
          placeholder="Semua Ukuran Botol"
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

    <!-- VIEW 1: TABLE VIEW (Action on right, header text-left, lucide icons) -->
    <div v-if="viewMode === 'table'" class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-3 w-10 text-left"></th>
              <th class="py-3.5 px-4 text-left">Nama Produk</th>
              <th class="py-3.5 px-4 text-left">Racikan</th>
              <th class="py-3.5 px-4 text-left">Jenis Produk</th>
              <th class="py-3.5 px-4 text-left">Ukuran Botol</th>
              <th class="py-3.5 px-4 text-left">Modal Racikan</th>
              <th class="py-3.5 px-4 text-left">Modal Lainnya</th>
              <th class="py-3.5 px-4 text-left">Grand Total HPP</th>
              <th class="py-3.5 px-4 text-left w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="filteredHppList.length === 0">
              <td colspan="9" class="py-12 text-center text-stone-400">
                <Receipt class="w-8 h-8 mx-auto mb-2 opacity-50" />
                Belum ada rekaman data HPP. Klik "Hitung HPP Baru" untuk menghitung modal produksi botol parfum.
              </td>
            </tr>

            <tr
              v-for="item in filteredHppList"
              :key="item.id"
              class="table-row-hover transition-colors"
              :class="selectedForCompare.includes(item.id) ? 'bg-amber-50/60 font-medium' : ''"
            >
              <!-- Checkbox Compare -->
              <td class="py-3.5 px-4 text-left" @click.stop>
                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="selectedForCompare"
                  class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  title="Centang untuk bandingkan"
                />
              </td>

              <!-- Nama Produk -->
              <td class="py-3.5 px-4 text-left">
                <span class="font-bold text-stone-900 text-xs">{{ item.nama }}</span>
              </td>

              <!-- Racikan -->
              <td class="py-3.5 px-4 text-left">
                <span v-if="item.racikanName" class="font-semibold text-stone-800 text-xs">{{ item.racikanName }}</span>
                <span v-else class="text-stone-400 text-xs italic">Manual</span>
              </td>

              <!-- Jenis Produk (Formula Base) -->
              <td class="py-3.5 px-4 text-left">
                <span v-if="item.formulaBaseName" class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-medium whitespace-nowrap">
                  {{ item.formulaBaseName }}
                </span>
                <span v-else class="text-stone-400 text-xs">-</span>
              </td>

              <!-- Ukuran Botol -->
              <td class="py-3.5 px-4 text-left font-mono font-bold text-stone-700">
                {{ item.targetBottleMl }} ml
              </td>

              <!-- Modal Racikan -->
              <td class="py-3.5 px-4 text-left font-mono text-stone-700">
                {{ formatRupiah(item.subtotalLiquid) }}
              </td>

              <!-- Modal Packaging -->
              <td class="py-3.5 px-4 text-left font-mono text-stone-700">
                {{ formatRupiah(item.subtotalPackaging) }}
              </td>

              <!-- Grand Total HPP -->
              <td class="py-3.5 px-4 text-left">
                <span class="font-mono font-bold text-amber-950 text-xs px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 inline-block">
                  {{ formatRupiah(item.grandTotalHpp) }}
                </span>
              </td>

              <!-- Aksi Column (Positioned Right, Aligned Left, Lucide Icons) -->
                <td class="py-3.5 px-4 text-left" @click.stop>
                  <div class="flex items-center justify-start gap-1.5">
                    <button
                      @click="viewDetail(item)"
                      class="p-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Lihat Detail HPP"
                    >
                      <Eye class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="confirmDelete(item)"
                      class="p-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                      title="Hapus Data HPP"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- VIEW 2: CARD VIEW -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-if="filteredHppList.length === 0" class="col-span-full py-12 text-center text-stone-400 bg-white rounded-2xl border">
        <Receipt class="w-8 h-8 mx-auto mb-2 opacity-50" />
        Tidak ada data HPP ditemukan.
      </div>

      <div
        v-for="item in filteredHppList"
        :key="item.id"
        class="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                Botol {{ item.targetBottleMl }} ml
              </span>
              <h4 class="text-sm font-bold text-stone-900 mt-1 font-serif">{{ item.nama }}</h4>
            </div>
            
            <input
              type="checkbox"
              :value="item.id"
              v-model="selectedForCompare"
              class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              title="Centang untuk bandingkan"
            />
          </div>

          <!-- Cost Breakdown List -->
          <div class="mt-3 space-y-2 text-xs">
            <div class="flex justify-between text-stone-600">
              <span>🧪 Modal Racikan:</span>
              <span class="font-mono font-bold text-stone-900">{{ formatRupiah(item.subtotalLiquid) }}</span>
            </div>
            <div class="flex justify-between text-stone-600">
              <span>📦 Modal Lainnya:</span>
              <span class="font-mono font-bold text-stone-900">{{ formatRupiah(item.subtotalPackaging) }}</span>
            </div>
            <div class="flex justify-between text-stone-600 pt-1 border-t border-stone-100">
              <span class="font-bold text-stone-900">Grand Total HPP:</span>
              <span class="font-mono font-bold text-amber-950 text-sm">{{ formatRupiah(item.grandTotalHpp) }}</span>
            </div>
            <div class="flex justify-between text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              <span class="font-semibold text-[11px]">Rekomendasi Jual (Margin {{ item.targetMarginPercentage }}%):</span>
              <span class="font-mono font-bold">{{ formatRupiah(item.recommendedSellingPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span class="text-[10px] text-stone-400 font-mono">{{ formatDateIndo(item.createdAt) }}</span>
          <div class="flex items-center gap-1.5">
            <button
              @click="viewDetail(item)"
              class="p-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-600 hover:text-blue-700 text-xs transition-colors"
              title="Lihat Detail HPP"
            >
              <Eye class="w-3.5 h-3.5" />
            </button>
            <button
              @click="confirmDelete(item)"
              class="p-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs transition-colors"
              title="Hapus Data HPP"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- COMPARE SECTION (Side-by-Side Comparison Cards at Bottom) -->
    <!-- ========================================================= -->
    <div v-if="compareList.length > 0" class="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-2">
            <Scale class="w-3.5 h-3.5" />
            <span>Fitur Komparasi HPP & Profit</span>
          </div>
          <h3 class="text-xl font-bold font-serif text-white">Bandingkan Biaya HPP & Keuntungan (Side-by-Side)</h3>
          <p class="text-xs text-stone-400 mt-1">Centang 2 atau lebih data HPP di atas untuk membandingkan margin dan struktur modal</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-stone-400 font-mono">
            {{ selectedForCompare.length }} Analisis Dipilih
          </span>
          <button
            @click="selectedForCompare = []"
            class="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700"
          >
            Reset Pilihan
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="item in compareList"
          :key="item.id"
          class="bg-stone-800/90 rounded-2xl border border-stone-700/80 p-5 space-y-4 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-2 border-b border-stone-700/60 pb-3">
              <div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Botol {{ item.targetBottleMl }} ml
                </span>
                <h4 class="text-base font-bold text-white font-serif mt-1">{{ item.nama }}</h4>
              </div>
              <button
                @click="removeFromCompare(item.id)"
                class="text-stone-400 hover:text-stone-200 text-xs p-1"
                title="Hapus dari perbandingan"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Big Stat Badges -->
            <div class="grid grid-cols-2 gap-2 mt-3">
              <div class="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-center">
                <span class="text-[9px] uppercase font-bold text-stone-400 block">Total HPP</span>
                <span class="text-sm font-bold font-mono text-amber-400">{{ formatRupiah(item.grandTotalHpp) }}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-center">
                <span class="text-[9px] uppercase font-bold text-stone-400 block">Harga Jual</span>
                <span class="text-sm font-bold font-mono text-emerald-400">{{ formatRupiah(item.recommendedSellingPrice) }}</span>
              </div>
            </div>

            <!-- Cost Proportion Progress Bar -->
            <div class="mt-4 space-y-2">
              <div class="flex justify-between text-[11px] text-stone-300">
                <span>🧪 Modal Racikan: {{ formatRupiah(item.subtotalLiquid) }}</span>
                <span>📦 Modal Lainnya: {{ formatRupiah(item.subtotalPackaging) }}</span>
              </div>
              <div class="w-full bg-stone-900 h-2 rounded-full overflow-hidden flex border border-stone-700">
                <div
                  class="bg-amber-500 h-full"
                  :style="{ width: Math.round((item.subtotalLiquid / Math.max(item.grandTotalHpp, 1)) * 100) + '%' }"
                ></div>
                <div
                  class="bg-indigo-500 h-full"
                  :style="{ width: Math.round((item.subtotalPackaging / Math.max(item.grandTotalHpp, 1)) * 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Profit Summary -->
            <div class="mt-4 p-3 rounded-xl bg-stone-900/80 border border-stone-700/60 text-xs space-y-1">
              <div class="flex justify-between text-stone-300">
                <span>Target Margin:</span>
                <span class="font-bold text-white font-mono">{{ item.targetMarginPercentage }}%</span>
              </div>
              <div class="flex justify-between text-emerald-400">
                <span>Estimasi Profit / Botol:</span>
                <span class="font-bold font-mono">+{{ formatRupiah(item.recommendedSellingPrice - item.grandTotalHpp) }}</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-stone-700/60 flex items-center justify-end">
            <button
              @click="viewDetail(item)"
              class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Lihat Rincian Lengkap</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Breakdown Modal -->
    <Modal
      :isOpen="isDetailModalOpen"
      :title="`Rincian HPP: ${detailItem?.nama || ''}`"
      subtitle="Breakdown modal racikan dan modal lainnya"
      maxWidth="3xl"
      @close="isDetailModalOpen = false"
    >
      <div v-if="detailItem" class="space-y-5">
        <!-- Summary Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
            <span class="text-[10px] text-stone-500 uppercase font-bold block">Ukuran Botol</span>
            <span class="text-sm font-bold font-mono text-stone-900">{{ detailItem.targetBottleMl }} ml</span>
          </div>
          <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span class="text-[10px] text-amber-700 uppercase font-bold block">Modal Racikan</span>
            <span class="text-sm font-bold font-mono text-amber-950">{{ formatRupiah(detailItem.subtotalLiquid) }}</span>
          </div>
          <div class="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
            <span class="text-[10px] text-indigo-700 uppercase font-bold block">Modal Lainnya</span>
            <span class="text-sm font-bold font-mono text-indigo-950">{{ formatRupiah(detailItem.subtotalPackaging) }}</span>
          </div>
          <div class="p-3 rounded-xl bg-stone-900 border border-stone-800 text-center text-white">
            <span class="text-[10px] text-amber-400 uppercase font-bold block">Grand Total HPP</span>
            <span class="text-sm font-bold font-mono text-amber-400">{{ formatRupiah(detailItem.grandTotalHpp) }}</span>
          </div>
        </div>

        <!-- Liquid Ingredients Breakdown -->
        <div class="space-y-2">
          <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>Rincian Modal Racikan</span>
          </h5>
          <div class="overflow-x-auto border rounded-xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-stone-100 text-[10px] uppercase font-bold text-stone-500">
                <tr>
                  <th class="py-2 px-3 text-left">Bahan</th>
                  <th class="py-2 px-3 text-left">Jenis</th>
                  <th class="py-2 px-3 text-left">Volume (ml)</th>
                  <th class="py-2 px-3 text-left">Biaya</th>
                </tr>
              </thead>
              <tbody class="divide-y text-stone-800">
                <tr v-for="(liq, idx) in detailItem.liquidDetails" :key="idx">
                  <td class="py-2 px-3 text-left font-medium">{{ liq.nama }}</td>
                  <td class="py-2 px-3 text-left">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold inline-block" :class="liq.jenis === 'FO' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'">
                      {{ liq.jenis }}
                    </span>
                  </td>
                  <td class="py-2 px-3 text-left font-mono">{{ formatNumber(liq.volumeMl, 2) }} ml</td>
                  <td class="py-2 px-3 text-left font-mono font-bold">{{ formatRupiah(liq.biaya) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Packaging Items Breakdown -->
        <div class="space-y-2">
          <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>Rincian Modal Lainnya (Packaging, Botol, Stiker, dll.)</span>
          </h5>
          <div class="overflow-x-auto border rounded-xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-stone-100 text-[10px] uppercase font-bold text-stone-500">
                <tr>
                  <th class="py-2 px-3 text-left">Item / Kemasan / Operasional</th>
                  <th class="py-2 px-3 text-left">Jumlah</th>
                  <th class="py-2 px-3 text-left">Harga Satuan</th>
                  <th class="py-2 px-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y text-stone-800">
                <tr v-for="pkg in detailItem.packagingItems" :key="pkg.id">
                  <td class="py-2 px-3 text-left font-medium">{{ pkg.namaItem }}</td>
                  <td class="py-2 px-3 text-left font-mono">{{ pkg.jumlah }} pcs</td>
                  <td class="py-2 px-3 text-left font-mono">{{ formatRupiah(pkg.hargaSatuan) }}</td>
                  <td class="py-2 px-3 text-left font-mono font-bold">{{ formatRupiah(pkg.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="pt-3 border-t flex justify-end">
          <button
            @click="isDetailModalOpen = false"
            class="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Hapus Data HPP?"
      :message="`Apakah Anda yakin ingin menghapus data analisis '${itemToDelete?.nama}'?`"
      @confirm="doDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { HppCalculation } from '../types';
import { formatRupiah, formatNumber, formatDateIndo } from '../utils/formatters';
import { Calculator, Search, Eye, Trash2, Scale, Receipt, X, Menu } from 'lucide-vue-next';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import CustomSelect from '../components/common/CustomSelect.vue';

const store = useKobichaStore();
const { hppCatalog } = storeToRefs(store);

const viewMode = ref<'table' | 'card'>('table');
const searchQuery = ref('');
const filterBottleSize = ref<number | ''>('');
const sortBy = ref('newest');
const selectedForCompare = ref<string[]>([]);

const bottleSizeOptions = [
  { value: '', label: 'Semua Ukuran Botol' },
  { value: 30, label: 'Botol 30 ml' },
  { value: 50, label: 'Botol 50 ml' },
  { value: 100, label: 'Botol 100 ml' }
];

const sortOptions = [
  { value: 'newest', label: 'Terbaru Dihitung' },
  { value: 'hpp_asc', label: 'HPP / Botol Termurah' },
  { value: 'hpp_desc', label: 'HPP / Botol Termahal' },
  { value: 'name_asc', label: 'Nama Produk (A - Z)' }
];

const filteredHppList = computed(() => {
  let list = [...hppCatalog.value];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(h => 
      h.nama.toLowerCase().includes(q) ||
      h.racikanName?.toLowerCase().includes(q) ||
      h.formulaBaseName?.toLowerCase().includes(q)
    );
  }

  if (filterBottleSize.value) {
    list = list.filter(h => h.targetBottleMl === filterBottleSize.value);
  }

  list.sort((a, b) => {
    if (sortBy.value === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy.value === 'hpp_asc') return a.grandTotalHpp - b.grandTotalHpp;
    if (sortBy.value === 'hpp_desc') return b.grandTotalHpp - a.grandTotalHpp;
    if (sortBy.value === 'name_asc') return a.nama.localeCompare(b.nama);
    return 0;
  });

  return list;
});

const compareList = computed(() => {
  return hppCatalog.value.filter(h => selectedForCompare.value.includes(h.id));
});

function removeFromCompare(id: string) {
  selectedForCompare.value = selectedForCompare.value.filter(x => x !== id);
}

// Detail Modal State
const isDetailModalOpen = ref(false);
const detailItem = ref<HppCalculation | null>(null);

function viewDetail(item: HppCalculation) {
  detailItem.value = item;
  isDetailModalOpen.value = true;
}

// Delete State
const isDeleteModalOpen = ref(false);
const itemToDelete = ref<HppCalculation | null>(null);

function confirmDelete(item: HppCalculation) {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
}

function doDelete() {
  if (itemToDelete.value) {
    store.deleteHppCalculation(itemToDelete.value.id);
  }
  isDeleteModalOpen.value = false;
}
</script>
