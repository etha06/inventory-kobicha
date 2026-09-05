<template>
  <div class="space-y-6">
    <!-- Top Action Card -->
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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Stock Fragrance Oil (Bibit Parfum)</h3>
          <p class="text-xs text-sage-600">Database konsentrat aroma, piramida wangi, dan riwayat harga beli per ml</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Fragrance Oil</span>
        </button>
      </div>
    </div>

    <!-- Search & Multi-Filter Bar -->
    <div class="bg-white p-4 rounded-xl border border-sage-100 shadow-sm space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama FO / toko..."
            class="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
          />
          <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
        </div>

        <!-- Filter Jenis Liquid -->
        <div>
          <CustomSelect
            v-model="filterLiquid"
            :options="liquidOptions"
            placeholder="Semua Jenis Liquid"
          />
        </div>

        <!-- Filter Pyramid (Without "Note" word) -->
        <div>
          <CustomSelect
            v-model="filterPyramid"
            :options="pyramidOptions"
            placeholder="Semua Piramida"
          />
        </div>

        <!-- Filter Notes -->
        <div>
          <CustomSelect
            v-model="filterNotes"
            :options="notesOptions"
            placeholder="Semua Olfactory Notes"
            :searchable="true"
          />
        </div>
      </div>

      <!-- Quick Filter Stock Status & Sort By -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
        <div class="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span class="text-[11px] font-semibold text-stone-400 mr-1">Status Stock:</span>
          <button
            @click="filterStock = ''"
            class="px-2.5 py-1 rounded-md font-medium transition-all"
            :class="filterStock === '' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
          >
            Semua ({{ stockFragranceOil.length }})
          </button>
          <button
            @click="filterStock = 'Banyak'"
            class="px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1"
            :class="filterStock === 'Banyak' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Banyak</span>
          </button>
          <button
            @click="filterStock = 'Dikit'"
            class="px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1"
            :class="filterStock === 'Dikit' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Dikit</span>
          </button>
          <button
            @click="filterStock = 'Habis'"
            class="px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1"
            :class="filterStock === 'Habis' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Habis</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[11px] text-stone-400 font-semibold">Urutkan:</span>
          <div class="w-48">
            <CustomSelect
              v-model="sortBy"
              :options="sortOptions"
              placeholder="Urutkan..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs min-w-[880px]">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-4 text-left">Nama FO</th>
              <th class="py-3.5 px-4 text-left">Jenis Liquid</th>
              <th class="py-3.5 px-4 text-left">Toko Supplier</th>
              <th class="py-3.5 px-4 text-left">Botol (ml)</th>
              <th class="py-3.5 px-4 text-left">Current Stock</th>
              <th class="py-3.5 px-4 text-left">Jumlah Racikan</th>
              <th class="py-3.5 px-4 text-left">Notes</th>
              <th class="py-3.5 px-4 text-left">Pyramid</th>
              <th class="py-3.5 px-4 text-left">Updated At</th>
              <th class="py-3.5 px-4 text-left w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="filteredList.length === 0">
              <td colspan="10" class="py-12 text-center text-stone-400">
                <Droplet class="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p class="text-xs text-stone-400">Tidak ada data Fragrance Oil ditemukan.</p>
              </td>
            </tr>

            <template v-for="item in paginatedList" :key="item.id">
              <!-- Main Row (Click to expand) -->
              <tr
                @click="toggleRow(item.id)"
                class="table-row-hover transition-colors cursor-pointer"
                :class="expandedItemId === item.id ? 'bg-amber-50/60 font-medium' : ''"
              >
                <!-- 1. Kolom Nama FO -->
                <td class="py-3.5 px-4 text-left">
                  <div class="flex items-center gap-2">
                    <ChevronRight
                      class="w-3.5 h-3.5 text-amber-700 transition-transform duration-150"
                      :class="expandedItemId === item.id ? 'rotate-90' : ''"
                    />
                    <span class="font-bold text-stone-900 text-xs">{{ item.nama }}</span>
                  </div>
                </td>

                <!-- 2. Kolom Jenis Liquid -->
                <td class="py-3.5 px-4 text-left">
                  <span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-medium whitespace-nowrap">
                    {{ item.jenisLiquid }}
                  </span>
                </td>

                <td class="py-3.5 px-4 text-left text-stone-600">
                  <span class="font-medium text-stone-700 truncate max-w-[120px] block" :title="item.storeName">
                    {{ item.storeName }}
                  </span>
                </td>

                <td class="py-3.5 px-4 text-left font-mono font-semibold">
                  {{ item.botolMl }} ml
                </td>

                <td class="py-3.5 px-4 text-left">
                  <span
                    class="px-2 py-0.5 rounded text-[11px] font-bold border inline-flex items-center gap-1"
                    :class="STOCK_STATUS_MAP[item.currentStock].bg"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="STOCK_STATUS_MAP[item.currentStock].dot"></span>
                    {{ item.currentStock }}
                  </span>
                </td>

                <!-- Jumlah Racikan (Angka saja tanpa label) -->
                <td class="py-3.5 px-4 text-left font-mono font-bold text-stone-800 text-xs">
                  {{ store.getFoUsageCount(item.id) }}
                </td>

                <td class="py-3.5 px-4 text-left">
                  <div class="flex flex-wrap gap-1 max-w-[160px]">
                    <span
                      v-for="n in item.notes"
                      :key="n"
                      class="px-1.5 py-0.5 rounded text-[10px] font-medium border"
                      :class="[NOTE_COLOR_MAP[n].bg, NOTE_COLOR_MAP[n].text, NOTE_COLOR_MAP[n].border]"
                    >
                      {{ n }}
                    </span>
                  </div>
                </td>

                <!-- Pyramid (Without "Note" word) -->
                <td class="py-3.5 px-4 text-left">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap"
                    :class="PYRAMID_BADGE_MAP[item.pyramid].bg"
                  >
                    {{ item.pyramid }}
                  </span>
                </td>

                <td class="py-3.5 px-4 text-left text-[10px] text-stone-500 whitespace-nowrap">
                  {{ formatDateIndo(item.updatedAt || item.createdAt) }}
                </td>

                <!-- Aksi Column (Positioned Right, Aligned Left, Lucide Icons) -->
                <td class="py-3.5 px-4 text-left" @click.stop>
                  <div class="flex items-center justify-start gap-1.5">
                    <button
                      @click="openEditModal(item)"
                      class="p-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Edit Fragrance Oil"
                    >
                      <Pencil class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="confirmDelete(item)"
                      class="p-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                      title="Hapus Fragrance Oil"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expandable Inline Detail Sub-Row -->
              <tr v-if="expandedItemId === item.id" class="bg-amber-50/30 border-b border-amber-200/70">
                <td colspan="10" class="p-4 sm:p-5">
                  <div class="bg-white rounded-lg p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div class="space-y-2 flex-1">
                        <div class="flex items-center gap-2">
                          <Droplet class="w-4 h-4 text-amber-700" />
                          <span class="text-base font-bold text-stone-900 font-serif">{{ item.nama }}</span>
                          <span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-xs border">{{ item.jenisLiquid }}</span>
                          <span class="px-2 py-0.5 rounded font-bold text-xs" :class="PYRAMID_BADGE_MAP[item.pyramid].bg">
                            {{ item.pyramid }}
                          </span>
                        </div>

                        <p v-if="item.deskripsi" class="text-xs text-stone-600 leading-relaxed">
                          {{ item.deskripsi }}
                        </p>
                        <p v-else class="text-xs text-stone-400 italic">
                          Tidak ada catatan karakteristik aroma.
                        </p>

                        <div class="flex flex-wrap gap-4 text-xs text-stone-600 pt-1">
                          <span>Toko Supplier: <strong class="text-stone-800">{{ item.storeName }}</strong></span>
                          <span>Kemasan Utama: <strong class="text-stone-800">{{ item.botolMl }} ml</strong></span>
                          <span>Harga / ml: <strong class="text-amber-800">{{ formatRupiah(store.getFoAveragePricePerMl(item.id)) }} / ml</strong></span>
                        </div>
                      </div>

                      <div v-if="item.gambar" class="w-20 h-20 rounded-lg overflow-hidden border">
                        <img :src="item.gambar" alt="Product" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Price Tiers Table & History -->
                    <div class="pt-3 border-t border-stone-100">
                      <h5 class="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                        Rincian Varian Harga Beli:
                      </h5>
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div
                          v-for="tier in item.priceTiers"
                          :key="tier.id"
                          class="p-3 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between"
                        >
                          <div>
                            <span class="text-xs font-bold text-stone-900 block">{{ tier.ml }} ml</span>
                            <span class="text-xs text-stone-600">{{ formatRupiah(tier.harga) }}</span>
                          </div>
                          <div class="text-right">
                            <span class="text-[10px] uppercase font-bold text-amber-700 block">Kalkulasi / ml</span>
                            <span class="text-xs font-bold text-amber-950">{{ formatRupiah(tier.hargaPerMl) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination for Table -->
      <Pagination
        v-model:currentPage="currentPage"
        :totalItems="filteredList.length"
        :itemsPerPage="itemsPerPage"
      />
    </div>

      <!-- Modal Form (Add / Edit) -->
    <Modal
      :isOpen="isModalOpen"
      :title="isEditing ? 'Edit Fragrance Oil' : 'Tambah Fragrance Oil Baru'"
      subtitle="Input detail aroma, olfactory notes & pyramid, serta varian harga beli"
      maxWidth="3xl"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="saveItem" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Nama Fragrance Oil</label>
            <input
              v-model="form.nama"
              type="text"
              required
              placeholder="Misal: Damask Rose Velvet Absolute"
              class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Jenis Liquid</label>
            <CustomSelect
              v-model="form.jenisLiquid"
              :options="JENIS_LIQUID_OPTIONS"
              placeholder="Pilih Jenis Liquid"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Toko Supplier</label>
            <CustomSelect
              v-model="form.storeId"
              :options="storeOptions"
              placeholder="-- Pilih Toko Supplier --"
              :searchable="true"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Ukuran Botol (ml)</label>
            <input
              v-model.number="form.botolMl"
              type="number"
              min="1"
              required
              class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Status Stock</label>
            <CustomSelect
              v-model="form.currentStock"
              :options="currentStockOptions"
              placeholder="Pilih Status Stock"
            />
          </div>
        </div>

        <!-- Pyramid & Notes -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Pyramid</label>
            <CustomSelect
              v-model="form.pyramid"
              :options="PYRAMID_OPTIONS"
              placeholder="Pilih Piramida"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Olfactory Notes <span class="text-rose-500 font-bold">*</span>
              <span class="text-[11px] font-normal text-stone-500">(Wajib dipilih minimal 1)</span>
            </label>
            <div
              class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 border rounded-lg transition-colors"
              :class="form.notes.length === 0 ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' : 'border-stone-200 bg-stone-50/50'"
            >
              <button
                v-for="note in NOTES_OPTIONS"
                :key="note"
                type="button"
                @click="toggleNote(note)"
                class="px-2 py-0.5 rounded-md text-xs font-medium transition-all"
                :class="form.notes.includes(note) ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'"
              >
                {{ note }}
              </button>
            </div>
            <p v-if="form.notes.length === 0" class="text-[10px] text-rose-600 mt-1 font-semibold flex items-center gap-1">
              * Silakan pilih minimal 1 kategori aroma wangi di atas
            </p>
          </div>
        </div>

        <!-- Multiple Price Tiers Section -->
        <div class="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-xs font-bold text-stone-900">Varian Harga Beli (Multiple Tiers)</h4>
              <p class="text-[11px] text-stone-500">Harga per ml otomatis dihitung dan digunakan sebagai referensi rata-rata kalkulasi</p>
            </div>
            <button
              type="button"
              @click="addPriceTier"
              class="px-2.5 py-1 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition-colors"
            >
              + Tambah Varian
            </button>
          </div>

          <div class="space-y-2">
            <div
              v-for="(tier, idx) in form.priceTiers"
              :key="tier.id"
              class="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-stone-200 shadow-xs"
            >
              <div class="w-28">
                <span class="text-[10px] text-stone-500 block">Ukuran (ml)</span>
                <input
                  v-model.number="tier.ml"
                  type="number"
                  min="1"
                  required
                  @input="recalculateTier(tier)"
                  class="w-full px-2 py-1 text-xs border rounded-md font-mono"
                  placeholder="ml"
                />
              </div>
              <div class="flex-1">
                <span class="text-[10px] text-stone-500 block">Harga Beli Total (Rp)</span>
                <input
                  v-model.number="tier.harga"
                  type="number"
                  min="0"
                  required
                  @input="recalculateTier(tier)"
                  class="w-full px-2 py-1 text-xs border rounded-md font-semibold"
                  placeholder="Rp"
                />
              </div>
              <div class="w-32 text-right bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-200">
                <span class="text-[9px] text-amber-700 block uppercase font-bold">Harga / ml</span>
                <span class="text-xs font-bold text-amber-950">{{ formatRupiah(tier.hargaPerMl) }}</span>
              </div>
              <button
                v-if="form.priceTiers.length > 1"
                type="button"
                @click="removePriceTier(idx)"
                class="text-stone-400 hover:text-rose-600 p-1 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Deskripsi / Karakter Aroma (Opsional)</label>
          <textarea
            v-model="form.deskripsi"
            rows="2"
            placeholder="Aroma opening, drydown, kombinasi yang cocok..."
            class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          ></textarea>
        </div>

        <div class="pt-3 border-t flex justify-end gap-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
          >
            Simpan Fragrance Oil
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Hapus Fragrance Oil?"
      :message="`Apakah Anda yakin ingin menghapus '${itemToDelete?.nama}' dari stock?`"
      @confirm="doDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { StockFragranceOil, NotesEnum, PyramidEnum, JenisLiquidEnum, CurrentStockEnum, PriceTier } from '../types';
import {
  NOTES_OPTIONS,
  PYRAMID_OPTIONS,
  JENIS_LIQUID_OPTIONS,
  NOTE_COLOR_MAP,
  PYRAMID_BADGE_MAP,
  STOCK_STATUS_MAP
} from '../utils/constants';
import { formatRupiah, formatDateIndo, normalizeJenisBarang } from '../utils/formatters';
import { Plus, Search, Pencil, Trash2, ChevronRight, Droplet, Menu } from 'lucide-vue-next';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import CustomSelect from '../components/common/CustomSelect.vue';
import Pagination from '../components/common/Pagination.vue';

const store = useKobichaStore();
const { stockFragranceOil, stores } = storeToRefs(store);

const searchQuery = ref('');
const filterLiquid = ref('');
const filterPyramid = ref('');
const filterNotes = ref('');
const filterStock = ref('');
const sortBy = ref('name_asc');
const expandedItemId = ref<string | null>(null);

// Pagination State (Max 10 rows per page)
const currentPage = ref(1);
const itemsPerPage = 10;

const liquidOptions = [
  { value: '', label: 'Semua Jenis Liquid' },
  ...JENIS_LIQUID_OPTIONS.map(opt => ({ value: opt, label: opt }))
];

const pyramidOptions = [
  { value: '', label: 'Semua Piramida' },
  ...PYRAMID_OPTIONS.map(opt => ({ value: opt, label: opt }))
];

const notesOptions = [
  { value: '', label: 'Semua Olfactory Notes' },
  ...NOTES_OPTIONS.map(opt => ({ value: opt, label: opt }))
];

const sortOptions = [
  { value: 'name_asc', label: 'Nama FO (A - Z)' },
  { value: 'name_desc', label: 'Nama FO (Z - A)' },
  { value: 'stock_status', label: 'Status Stock (Habis -> Banyak)' },
  { value: 'usage_desc', label: 'Paling Sering Digunakan di Racikan' },
  { value: 'bottle_desc', label: 'Ukuran Botol Terbesar' },
  { value: 'updated_at', label: 'Terakhir Diperbarui' }
];

const storeOptions = computed(() => {
  const allowed = ['fragrance oil', 'essential oil', 'bibit parfum', 'kimia sintetis', 'bibit'];
  let list = stores.value.filter(s => {
    const items = normalizeJenisBarang(s.jenisBarang).map(x => x.toLowerCase());
    return items.some(x => allowed.some(a => x.includes(a)));
  });
  if (list.length === 0) {
    list = stores.value;
  }
  if (form.value.storeId && !list.some(s => s.id === form.value.storeId)) {
    const curr = stores.value.find(s => s.id === form.value.storeId);
    if (curr) list = [curr, ...list];
  }
  return [
    { value: '', label: '-- Pilih Toko Supplier --' },
    ...list.map(s => ({ value: s.id, label: s.namaToko }))
  ];
});

const currentStockOptions = [
  { value: 'Banyak', label: 'Banyak', badge: 'Stock Aman' },
  { value: 'Dikit', label: 'Dikit (Menipis)', badge: 'Perlu Restock' },
  { value: 'Habis', label: 'Habis', badge: 'Kosong' }
];

function toggleRow(id: string) {
  expandedItemId.value = expandedItemId.value === id ? null : id;
}

const filteredList = computed(() => {
  let list = [...stockFragranceOil.value];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      f => f.nama.toLowerCase().includes(q) || f.storeName.toLowerCase().includes(q)
    );
  }

  if (filterLiquid.value) {
    list = list.filter(f => f.jenisLiquid === filterLiquid.value);
  }

  if (filterPyramid.value) {
    list = list.filter(f => f.pyramid === filterPyramid.value);
  }

  if (filterNotes.value) {
    list = list.filter(f => f.notes.includes(filterNotes.value as NotesEnum));
  }

  if (filterStock.value) {
    list = list.filter(f => f.currentStock === filterStock.value);
  }

  list.sort((a, b) => {
    if (sortBy.value === 'name_asc') return a.nama.localeCompare(b.nama);
    if (sortBy.value === 'name_desc') return b.nama.localeCompare(a.nama);
    if (sortBy.value === 'stock_status') {
      const rank = { Habis: 1, Dikit: 2, Banyak: 3 };
      return rank[a.currentStock] - rank[b.currentStock];
    }
    if (sortBy.value === 'usage_desc') {
      return store.getFoUsageCount(b.id) - store.getFoUsageCount(a.id);
    }
    if (sortBy.value === 'bottle_desc') return b.botolMl - a.botolMl;
    if (sortBy.value === 'updated_at') return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    return 0;
  });

  return list;
});

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredList.value.slice(start, start + itemsPerPage);
});

watch([searchQuery, filterLiquid, filterPyramid, filterNotes, filterStock, sortBy], () => {
  currentPage.value = 1;
});

// Modal Form State
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  nama: '',
  jenisLiquid: 'Fragrance Oil' as JenisLiquidEnum,
  storeId: '',
  botolMl: 10,
  currentStock: 'Banyak' as CurrentStockEnum,
  pyramid: 'Middle' as PyramidEnum,
  notes: [] as NotesEnum[],
  gambar: '',
  deskripsi: '',
  priceTiers: [
    { id: 'tier-' + Date.now(), ml: 10, harga: 30000, hargaPerMl: 3000 }
  ] as PriceTier[]
});

function toggleNote(note: NotesEnum) {
  if (form.value.notes.includes(note)) {
    form.value.notes = form.value.notes.filter(n => n !== note);
  } else {
    form.value.notes.push(note);
  }
}

function addPriceTier() {
  form.value.priceTiers.push({
    id: 'tier-' + Date.now(),
    ml: 10,
    harga: 30000,
    hargaPerMl: 3000
  });
}

function removePriceTier(idx: number) {
  form.value.priceTiers.splice(idx, 1);
}

function recalculateTier(tier: PriceTier) {
  if (tier.ml > 0 && tier.harga >= 0) {
    tier.hargaPerMl = Math.round(tier.harga / tier.ml);
  } else {
    tier.hargaPerMl = 0;
  }
}

function openAddModal() {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    nama: '',
    jenisLiquid: 'Fragrance Oil',
    storeId: '',
    botolMl: 10,
    currentStock: 'Banyak',
    pyramid: 'Middle',
    notes: [],
    gambar: '',
    deskripsi: '',
    priceTiers: [
      { id: 'tier-' + Date.now(), ml: 10, harga: 30000, hargaPerMl: 3000 }
    ]
  };
  isModalOpen.value = true;
}

function openEditModal(f: StockFragranceOil) {
  isEditing.value = true;
  editingId.value = f.id;
  form.value = {
    nama: f.nama,
    jenisLiquid: f.jenisLiquid,
    storeId: f.storeId || '',
    botolMl: f.botolMl,
    currentStock: f.currentStock,
    pyramid: f.pyramid,
    notes: [...f.notes],
    gambar: f.gambar || '',
    deskripsi: f.deskripsi || '',
    priceTiers: f.priceTiers && f.priceTiers.length > 0 ? JSON.parse(JSON.stringify(f.priceTiers)) : [
      { id: 'tier-' + Date.now(), ml: f.botolMl || 10, harga: 30000, hargaPerMl: Math.round(30000 / (f.botolMl || 10)) }
    ]
  };
  isModalOpen.value = true;
}

function saveItem() {
  if (!form.value.nama.trim()) {
    store.showToast('Nama Fragrance Oil wajib diisi', 'error');
    return;
  }
  if (form.value.notes.length === 0) {
    store.showToast('Olfactory Notes wajib dipilih minimal 1 kategori aroma!', 'error');
    return;
  }

  const selectedStore = stores.value.find(s => s.id === form.value.storeId);
  const storeName = selectedStore?.namaToko || 'Toko Lainnya';

  if (isEditing.value && editingId.value) {
    store.updateStockFragranceOil(editingId.value, {
      nama: form.value.nama,
      jenisLiquid: form.value.jenisLiquid,
      storeId: form.value.storeId || undefined,
      storeName,
      botolMl: form.value.botolMl,
      currentStock: form.value.currentStock,
      pyramid: form.value.pyramid,
      notes: form.value.notes,
      priceTiers: form.value.priceTiers,
      gambar: form.value.gambar || undefined,
      deskripsi: form.value.deskripsi || undefined
    });
  } else {
    store.addStockFragranceOil({
      nama: form.value.nama,
      jenisLiquid: form.value.jenisLiquid,
      storeId: form.value.storeId || undefined,
      storeName,
      botolMl: form.value.botolMl,
      currentStock: form.value.currentStock,
      pyramid: form.value.pyramid,
      notes: form.value.notes,
      priceTiers: form.value.priceTiers,
      gambar: form.value.gambar || undefined,
      deskripsi: form.value.deskripsi || undefined
    });
  }
  isModalOpen.value = false;
}

// Delete State
const isDeleteModalOpen = ref(false);
const itemToDelete = ref<StockFragranceOil | null>(null);

function confirmDelete(item: StockFragranceOil) {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
}

function doDelete() {
  if (itemToDelete.value) {
    store.deleteStockFragranceOil(itemToDelete.value.id);
  }
  isDeleteModalOpen.value = false;
}
</script>
