<template>
  <div class="space-y-8">
    <!-- Top Action Card -->
    <div class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-bold text-stone-900 font-serif">Katalog Harga Modal / HPP Parfum</h3>
        <p class="text-xs text-stone-500">Database rekaman HPP botolan, rincian biaya liquid & kemasan, serta simulasi harga jual</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- View Mode Toggle (Card vs Table) -->
        <div class="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600">
          <button
            @click="viewMode = 'table'"
            class="px-3 py-1.5 rounded-lg transition-all"
            :class="viewMode === 'table' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'hover:text-stone-900'"
          >
            📋 Tabel
          </button>
          <button
            @click="viewMode = 'card'"
            class="px-3 py-1.5 rounded-lg transition-all"
            :class="viewMode === 'card' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'hover:text-stone-900'"
          >
            🎴 Card
          </button>
        </div>

        <button
          @click="store.navigateTo('kalkulator-hpp')"
          class="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-900/20 transition-all flex items-center gap-1.5"
        >
          <Calculator class="w-4 h-4" />
          <span>Hitung HPP Baru</span>
        </button>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama analisis HPP / formula..."
          class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
        />
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
      </div>

      <!-- Filter Bottle Size -->
      <div>
        <select
          v-model="filterBottleSize"
          class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
        >
          <option value="">-- Semua Ukuran Botol --</option>
          <option :value="30">Botol 30 ml</option>
          <option :value="50">Botol 50 ml</option>
          <option :value="100">Botol 100 ml</option>
        </select>
      </div>

      <!-- Sort By -->
      <div>
        <select
          v-model="sortBy"
          class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
        >
          <option value="newest">Terbaru Dihitung</option>
          <option value="hpp_asc">HPP / Botol Termurah</option>
          <option value="hpp_desc">HPP / Botol Termahal</option>
          <option value="name_asc">Nama Analisis (A - Z)</option>
        </select>
      </div>
    </div>

    <!-- VIEW 1: TABLE VIEW (Action on right, header text-left, lucide icons) -->
    <div v-if="viewMode === 'table'" class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-3 w-10 text-center"></th>
              <th class="py-3.5 px-4">Nama Analisis HPP</th>
              <th class="py-3.5 px-4 text-center">Ukuran Botol</th>
              <th class="py-3.5 px-4 text-right">Modal Liquid</th>
              <th class="py-3.5 px-4 text-right">Modal Lainnya</th>
              <th class="py-3.5 px-4 text-right">Grand Total HPP</th>
              <th class="py-3.5 px-4 text-right">HPP</th>
              <th class="py-3.5 px-4 text-right">Rekomendasi Jual</th>
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
              <td class="py-3.5 px-4 text-center" @click.stop>
                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="selectedForCompare"
                  class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  title="Centang untuk bandingkan"
                />
              </td>

              <!-- Nama Analisis & Formula -->
              <td class="py-3.5 px-4">
                <div class="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <span>{{ item.nama }}</span>
                </div>
                <div class="text-[10px] text-stone-500 mt-0.5 space-x-2">
                  <span v-if="item.racikanName">Racikan: <strong>{{ item.racikanName }}</strong></span>
                  <span v-if="item.formulaBaseName">Base: <strong>{{ item.formulaBaseName }}</strong></span>
                </div>
              </td>

              <!-- Ukuran Botol -->
              <td class="py-3.5 px-4 text-center font-mono font-bold text-stone-700">
                {{ item.targetBottleMl }} ml
              </td>

              <!-- Modal Liquid -->
              <td class="py-3.5 px-4 text-right font-mono text-stone-700">
                {{ formatRupiah(item.subtotalLiquid) }}
              </td>

              <!-- Modal Packaging -->
              <td class="py-3.5 px-4 text-right font-mono text-stone-700">
                {{ formatRupiah(item.subtotalPackaging) }}
              </td>

              <!-- Grand Total HPP -->
              <td class="py-3.5 px-4 text-right">
                <span class="font-mono font-bold text-amber-950 text-xs px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
                  {{ formatRupiah(item.grandTotalHpp) }}
                </span>
              </td>

              <!-- HPP (Tanpa / ml) -->
              <td class="py-3.5 px-4 text-right font-mono text-stone-600">
                {{ formatRupiah(item.hppPerMl) }}
              </td>

              <!-- Rekomendasi Jual -->
              <td class="py-3.5 px-4 text-right">
                <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {{ formatRupiah(item.recommendedSellingPrice) }}
                </span>
              </td>

              <!-- Aksi Column (Positioned Right, Aligned Left, Lucide Icons) -->
              <td class="py-3.5 px-4 text-left" @click.stop>
                <div class="flex items-center justify-start gap-1.5">
                  <button
                    @click="viewDetail(item)"
                    class="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
                    title="Lihat Detail HPP"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="confirmDelete(item)"
                    class="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
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
              <span>🧪 Modal Formula Liquid:</span>
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
              class="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs"
              title="Lihat Detail HPP"
            >
              <Eye class="w-3.5 h-3.5" />
            </button>
            <button
              @click="confirmDelete(item)"
              class="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs"
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
    <div class="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
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
            v-if="selectedForCompare.length > 0"
            @click="selectedForCompare = []"
            class="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700"
          >
            Reset Pilihan
          </button>
        </div>
      </div>

      <!-- Comparison Cards -->
      <div v-if="compareList.length === 0" class="py-10 text-center text-stone-500 bg-stone-950/40 rounded-2xl border border-stone-800/80">
        <Search class="w-8 h-8 mx-auto mb-2 opacity-50" />
        Pilih minimal 2 analisis HPP dari daftar di atas untuk melihat perbandingan side-by-side di sini.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <span>🧪 Liquid: {{ formatRupiah(item.subtotalLiquid) }}</span>
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
      subtitle="Breakdown modal cairan formula liquid dan modal lainnya"
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
            <span class="text-[10px] text-amber-700 uppercase font-bold block">Modal Liquid</span>
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
            <span>🧪 Rincian Modal Cairan Formula Liquid</span>
          </h5>
          <div class="overflow-x-auto border rounded-xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-stone-100 text-[10px] uppercase font-bold text-stone-500">
                <tr>
                  <th class="py-2 px-3">Bahan</th>
                  <th class="py-2 px-3 text-center">Jenis</th>
                  <th class="py-2 px-3 text-center">Volume (ml)</th>
                  <th class="py-2 px-3 text-right">Biaya</th>
                </tr>
              </thead>
              <tbody class="divide-y text-stone-800">
                <tr v-for="(liq, idx) in detailItem.liquidDetails" :key="idx">
                  <td class="py-2 px-3 font-medium">{{ liq.nama }}</td>
                  <td class="py-2 px-3 text-center">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold" :class="liq.jenis === 'FO' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'">
                      {{ liq.jenis }}
                    </span>
                  </td>
                  <td class="py-2 px-3 text-center font-mono">{{ formatNumber(liq.volumeMl, 2) }} ml</td>
                  <td class="py-2 px-3 text-right font-mono font-bold">{{ formatRupiah(liq.biaya) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Packaging Items Breakdown -->
        <div class="space-y-2">
          <h5 class="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>📦 Rincian Modal Lainnya (Packaging, Botol, Stiker, dll.)</span>
          </h5>
          <div class="overflow-x-auto border rounded-xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-stone-100 text-[10px] uppercase font-bold text-stone-500">
                <tr>
                  <th class="py-2 px-3">Item / Kemasan / Operasional</th>
                  <th class="py-2 px-3 text-center">Jumlah</th>
                  <th class="py-2 px-3 text-right">Harga Satuan</th>
                  <th class="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y text-stone-800">
                <tr v-for="pkg in detailItem.packagingItems" :key="pkg.id">
                  <td class="py-2 px-3 font-medium">{{ pkg.namaItem }}</td>
                  <td class="py-2 px-3 text-center font-mono">{{ pkg.jumlah }} pcs</td>
                  <td class="py-2 px-3 text-right font-mono">{{ formatRupiah(pkg.hargaSatuan) }}</td>
                  <td class="py-2 px-3 text-right font-mono font-bold">{{ formatRupiah(pkg.total) }}</td>
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
import { Calculator, Search, Eye, Trash2, Scale, Receipt, X } from 'lucide-vue-next';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';

const store = useKobichaStore();
const { hppCatalog } = storeToRefs(store);

const viewMode = ref<'table' | 'card'>('table');
const searchQuery = ref('');
const filterBottleSize = ref<number | ''>('');
const sortBy = ref('newest');
const selectedForCompare = ref<string[]>([]);

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
