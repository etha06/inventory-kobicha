<template>
  <div class="space-y-6">
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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Stock Barang Campuran & Kemasan</h3>
          <p class="text-xs text-sage-600">Stok alkohol, fixative DPG, pelarut bahan baku dengan kalkulasi harga/ml serta botol packaging</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="px-4 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Barang Campuran</span>
        </button>
      </div>
    </div>

    <!-- Search, Filter & Sort Bar -->
    <div class="bg-white p-4 rounded-[20px] border border-sage-100 shadow-sm space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <!-- Search -->
        <div class="relative sm:col-span-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama barang / toko..."
            class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
          />
          <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
        </div>

        <!-- Filter Tipe (Semua / Bahan Baku / Packaging) -->
        <div>
          <CustomSelect
            v-model="filterTipe"
            :options="tipeOptions"
            placeholder="Semua Tipe Barang"
          />
        </div>

        <!-- Filter Jenis Barang (from allJenisBarangList) -->
        <div>
          <CustomSelect
            v-model="filterJenis"
            :options="jenisOptions"
            placeholder="Semua Jenis Barang"
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

      <!-- Quick Filter Pills: Current Stock Level -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-stone-400 font-semibold text-[11px] mr-1">Status Stok Bahan Baku:</span>
          <button
            @click="filterStockStatus = ''"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            :class="filterStockStatus === '' ? 'bg-stone-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
          >
            Semua
          </button>
          <button
            @click="filterStockStatus = 'Banyak'"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
            :class="filterStockStatus === 'Banyak' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Banyak</span>
          </button>
          <button
            @click="filterStockStatus = 'Dikit'"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
            :class="filterStockStatus === 'Dikit' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Dikit</span>
          </button>
          <button
            @click="filterStockStatus = 'Habis'"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
            :class="filterStockStatus === 'Habis' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Habis</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-4 w-10 text-left">#</th>
              <th class="py-3.5 px-4 text-left">Nama Barang</th>
              <th class="py-3.5 px-4 text-left">Tipe</th>
              <th class="py-3.5 px-4 text-left">Jenis Barang</th>
              <th class="py-3.5 px-4 text-left">Volume Kemasan</th>
              <th class="py-3.5 px-4 text-left">Current Stock</th>
              <th class="py-3.5 px-4 text-left">Toko Supplier</th>
              <th class="py-3.5 px-4 text-left">Harga Beli</th>
              <th class="py-3.5 px-4 text-left">Updated At</th>
              <th class="py-3.5 px-4 text-left w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="filteredList.length === 0">
              <td colspan="10" class="py-12 text-center text-stone-400">
                <Package class="w-8 h-8 mx-auto mb-2 opacity-50" />
                Tidak ada data barang campuran ditemukan.
              </td>
            </tr>

            <template v-for="(item, idx) in filteredList" :key="item.id">
              <!-- Main Row (Click to expand) -->
              <tr
                @click="toggleRow(item.id)"
                class="table-row-hover transition-colors cursor-pointer"
                :class="expandedItemId === item.id ? 'bg-amber-50/60 font-medium' : ''"
              >
                <td class="py-3.5 px-4 text-left text-stone-400 font-mono">
                  {{ idx + 1 }}
                </td>

                <!-- 1. Kolom Nama Barang (Setelah No) -->
                <td class="py-3.5 px-4 text-left">
                  <div class="flex items-center gap-2">
                    <ChevronRight
                      class="w-3.5 h-3.5 text-amber-700 transition-transform duration-150 flex-shrink-0"
                      :class="expandedItemId === item.id ? 'rotate-90' : ''"
                    />
                    <span class="font-bold text-stone-900 text-xs">{{ item.namaBarang }}</span>
                  </div>
                </td>

                <!-- 2. Kolom Tipe -->
                <td class="py-3.5 px-4 text-left">
                  <span
                    v-if="isItemBahanBaku(item)"
                    class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 whitespace-nowrap inline-flex items-center gap-1"
                  >
                    Bahan Baku
                  </span>
                  <span
                    v-else
                    class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-medium border border-indigo-200 whitespace-nowrap inline-flex items-center gap-1"
                  >
                    Kemasan
                  </span>
                </td>

                <!-- 3. Kolom Jenis Barang -->
                <td class="py-3.5 px-4 text-left">
                  <span class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-medium whitespace-nowrap">
                    {{ item.jenis }}
                  </span>
                </td>

                <!-- Volume Kemasan / ml kalkulasi -->
                <td class="py-3.5 px-4 text-left">
                  <div v-if="isItemBahanBaku(item) && item.ukuranMl" class="space-y-0.5 text-left">
                    <span class="font-mono font-bold text-stone-800 block text-xs">{{ item.ukuranMl }} ml</span>
                    <span class="text-[10px] text-amber-800 font-mono font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block">
                      {{ formatRupiah(store.getCampuranAveragePricePerMl(item.id)) }}/ml
                    </span>
                  </div>
                  <span v-else class="text-stone-400 text-xs">-</span>
                </td>

                <!-- Current Stock (Bahan Baku = Banyak/Dikit/Habis badge, Kemasan = Pcs) -->
                <td class="py-3.5 px-4 text-left">
                  <span
                    v-if="isItemBahanBaku(item)"
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold border inline-flex items-center gap-1"
                    :class="STOCK_STATUS_MAP[item.currentStock || (item.jumlahStok <= 0 ? 'Habis' : (item.jumlahStok <= 5 ? 'Dikit' : 'Banyak'))]?.bg"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="STOCK_STATUS_MAP[item.currentStock || (item.jumlahStok <= 0 ? 'Habis' : (item.jumlahStok <= 5 ? 'Dikit' : 'Banyak'))]?.dot"
                    ></span>
                    {{ item.currentStock || (item.jumlahStok <= 0 ? 'Habis' : (item.jumlahStok <= 5 ? 'Dikit' : 'Banyak')) }}
                  </span>
                  <span v-else class="font-mono font-bold text-stone-800 text-xs">
                    {{ item.jumlahStok }} pcs
                  </span>
                </td>

                <td class="py-3.5 px-4 text-left text-stone-600">
                  <span class="font-medium text-stone-700 truncate max-w-[120px] block" :title="item.storeName">
                    {{ item.storeName }}
                  </span>
                </td>

                <td class="py-3.5 px-4 text-left font-mono font-bold text-stone-900">
                  {{ formatRupiah(item.hargaPerPcs) }}
                </td>

                <td class="py-3.5 px-4 text-left text-[11px] text-stone-500 whitespace-nowrap">
                  {{ formatDateIndo(item.updatedAt || item.createdAt) }}
                </td>

                <!-- Aksi Column (Positioned Right, Aligned Left, Lucide Icons) -->
                <td class="py-3.5 px-4 text-left" @click.stop>
                  <div class="flex items-center justify-start gap-1.5">
                    <button
                      @click="openEditModal(item)"
                      class="p-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Edit Barang"
                    >
                      <Pencil class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="confirmDelete(item)"
                      class="p-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                      title="Hapus Barang"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expandable Inline Detail Sub-Row -->
              <tr v-if="expandedItemId === item.id" class="bg-amber-50/30 border-b border-amber-200/70">
                <td colspan="10" class="p-5">
                  <div class="bg-white rounded-xl p-4 border border-amber-200/80 shadow-sm space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div class="space-y-1.5 flex-1">
                        <h4 class="font-bold text-stone-900 text-xs flex items-center gap-2">
                          <Package class="w-4 h-4 text-amber-700" />
                          <span>Detail: {{ item.namaBarang }}</span>
                          <span class="text-[11px] font-normal text-stone-500">({{ item.jenis }})</span>
                        </h4>
                        <p v-if="item.deskripsi" class="text-xs text-stone-600 leading-relaxed">
                          {{ item.deskripsi }}
                        </p>
                        <p v-else class="text-xs text-stone-400 italic">
                          Tidak ada deskripsi tambahan.
                        </p>

                        <div class="pt-2 flex flex-wrap gap-4 text-xs">
                          <span class="text-stone-500">Toko Supplier: <strong class="text-stone-800">{{ item.storeName }}</strong></span>
                          <span class="text-stone-500">Harga Beli: <strong class="text-stone-800 font-mono">{{ formatRupiah(item.hargaPerPcs) }}</strong></span>
                          <span v-if="isItemBahanBaku(item) && item.ukuranMl" class="text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                            Kalkulasi Modal / 1 ml: <strong class="font-mono">{{ formatRupiah(store.getCampuranAveragePricePerMl(item.id)) }}</strong> (dari kemasan {{ item.ukuranMl }} ml)
                          </span>
                        </div>
                      </div>

                      <div v-if="item.gambar" class="w-20 h-20 rounded-xl overflow-hidden border">
                        <img :src="item.gambar" alt="Product" class="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Add / Edit) -->
    <Modal
      :isOpen="isModalOpen"
      :title="isEditing ? 'Edit Barang Campuran' : 'Tambah Barang Campuran'"
      subtitle="Input stok pelarut, DPG, botol, pipet, atau packaging"
      maxWidth="2xl"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="saveItem" class="space-y-4">
        <!-- Tipe Barang (Bahan Baku vs Kemasan) -->
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
          <label class="block text-xs font-bold text-stone-800">Kategori Tipe Barang:</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              class="flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all"
              :class="form.isBahanBaku ? 'bg-amber-50 border-amber-400 shadow-sm' : 'bg-white border-stone-200 hover:bg-stone-100'"
            >
              <input
                type="radio"
                :value="true"
                v-model="form.isBahanBaku"
                class="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span class="text-xs font-bold text-stone-900 block">🧪 Bahan Baku / Cairan</span>
                <span class="text-[11px] text-stone-500">Pelarut alkohol, DPG, fixative, aquades (Bisa dihitung /ml di kalkulator HPP)</span>
              </div>
            </label>

            <label
              class="flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all"
              :class="!form.isBahanBaku ? 'bg-indigo-50 border-indigo-400 shadow-sm' : 'bg-white border-stone-200 hover:bg-stone-100'"
            >
              <input
                type="radio"
                :value="false"
                v-model="form.isBahanBaku"
                class="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span class="text-xs font-bold text-stone-900 block">📦 Kemasan / Perlengkapan</span>
                <span class="text-[11px] text-stone-500">Botol kaca, sprayer, box, stiker, pipet ukur</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Nama Barang</label>
          <input
            v-model="form.namaBarang"
            type="text"
            required
            placeholder="Misal: Ethanol Absolute 96% Super Fine Grade"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-medium"
          />
        </div>

        <!-- Jenis Barang (Input Text + Suggestion Badges) & Toko Supplier -->
        <div class="space-y-3">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-semibold text-forest-800">Jenis Barang</label>
              <span class="text-[10px] text-sage-500">Pilih yang sudah ada atau ketik baru</span>
            </div>

            <div class="relative">
              <input
                v-model="form.jenis"
                type="text"
                required
                list="campuranJenisDatalist"
                placeholder="Ketik atau pilih jenis barang..."
                class="w-full px-3.5 py-2 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 text-sm font-medium bg-white"
              />
              <datalist id="campuranJenisDatalist">
                <option v-for="j in allJenisBarangList" :key="j" :value="j">{{ j }}</option>
              </datalist>
            </div>

            <!-- Quick Suggestion Badges -->
            <div v-if="allJenisBarangList.length > 0" class="flex flex-wrap gap-1.5 mt-2 max-h-28 overflow-y-auto p-1.5 bg-sage-50/60 rounded-xl border border-sage-200/60">
              <button
                v-for="j in allJenisBarangList"
                :key="j"
                type="button"
                @click="form.jenis = j"
                class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border"
                :class="form.jenis === j ? 'bg-peach-500 text-white border-peach-500 shadow-sm' : 'bg-white text-forest-800 border-sage-200 hover:border-peach-300 hover:bg-peach-50/40'"
              >
                {{ j }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Toko Supplier</label>
            <CustomSelect
              v-model="form.storeId"
              :options="storeOptions"
              placeholder="-- Pilih Toko Supplier --"
              :searchable="true"
            />
          </div>
        </div>

        <!-- Volume ml / Current Stock (Bahan Baku) vs Jumlah Stok Pcs (Kemasan) & Harga -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div v-if="form.isBahanBaku">
            <label class="block text-xs font-semibold text-amber-950 mb-1">Volume Kemasan Beli (ml)</label>
            <div class="relative">
              <input
                v-model.number="form.ukuranMl"
                type="number"
                min="1"
                required
                placeholder="1000"
                class="w-full px-3.5 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-mono font-bold pr-8"
              />
              <span class="absolute right-3 top-2.5 text-stone-400 text-xs font-bold">ml</span>
            </div>
            <span class="text-[10px] text-stone-500 mt-1 block">Misal: 1000 ml = 1 Liter</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Harga Beli per Kemasan (Rp)</label>
            <input
              v-model.number="form.hargaPerPcs"
              type="number"
              min="0"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-semibold font-mono"
            />
          </div>

          <!-- Current Stock Radio for Bahan Baku -->
          <div v-if="form.isBahanBaku">
            <label class="block text-xs font-semibold text-amber-950 mb-1">Current Stock Bahan Baku</label>
            <div class="grid grid-cols-3 gap-1.5 pt-0.5">
              <label
                v-for="status in CURRENT_STOCK_OPTIONS"
                :key="status"
                class="flex items-center justify-center gap-1 p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all select-none"
                :class="form.currentStock === status ? STOCK_STATUS_MAP[status].bg + ' border-2 shadow-xs' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'"
              >
                <input
                  type="radio"
                  :value="status"
                  v-model="form.currentStock"
                  class="sr-only"
                />
                <span class="w-1.5 h-1.5 rounded-full" :class="STOCK_STATUS_MAP[status].dot"></span>
                <span>{{ status }}</span>
              </label>
            </div>
          </div>

          <!-- Jumlah Stok Pcs for Kemasan -->
          <div v-else>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Jumlah Stok Kemasan (Pcs)</label>
            <div class="relative">
              <input
                v-model.number="form.jumlahStok"
                type="number"
                min="0"
                required
                class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-mono font-bold pr-10"
              />
              <span class="absolute right-3 top-2.5 text-stone-400 text-xs font-bold">pcs</span>
            </div>
          </div>
        </div>

        <!-- Live Price per ml Preview if Bahan Baku -->
        <div v-if="form.isBahanBaku && form.ukuranMl > 0" class="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-amber-950 block">✨ Estimasi Rata-rata Biaya per 1 ml:</span>
            <span class="text-[11px] text-amber-700">{{ formatRupiah(form.hargaPerPcs) }} / {{ form.ukuranMl }} ml</span>
          </div>
          <span class="text-base font-bold font-mono text-amber-950">
            {{ formatRupiah(Math.round(form.hargaPerPcs / form.ukuranMl)) }} / ml
          </span>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Link Gambar Produk (Opsional)</label>
          <input
            v-model="form.gambar"
            type="url"
            placeholder="https://... (URL gambar)"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Deskripsi / Catatan (Opsional)</label>
          <textarea
            v-model="form.deskripsi"
            rows="2"
            placeholder="Spesifikasi, grade kebersihan, tanggal expired, dsb..."
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          ></textarea>
        </div>

        <div class="pt-3 border-t flex justify-end gap-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm"
          >
            Simpan Barang Campuran
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Hapus Barang Campuran?"
      :message="`Apakah Anda yakin ingin menghapus '${itemToDelete?.namaBarang}' dari stok?`"
      @confirm="doDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { StockCampuran, CurrentStockEnum } from '../types';
import { CURRENT_STOCK_OPTIONS, STOCK_STATUS_MAP } from '../utils/constants';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { Plus, Search, Pencil, Trash2, ChevronRight, Package, Menu } from 'lucide-vue-next';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import CustomSelect from '../components/common/CustomSelect.vue';

const store = useKobichaStore();
const { stockCampuran, stores, allJenisBarangList } = storeToRefs(store);

const searchQuery = ref('');
const filterTipe = ref('');
const filterJenis = ref('');
const filterStockStatus = ref('');
const sortBy = ref('name_asc');
const expandedItemId = ref<string | null>(null);

const tipeOptions = [
  { value: '', label: 'Semua Tipe Barang' },
  { value: 'bahan_baku', label: 'Bahan Baku / Cairan' },
  { value: 'packaging', label: 'Kemasan / Lainnya' }
];

const jenisOptions = computed(() => [
  { value: '', label: 'Semua Jenis Barang' },
  ...allJenisBarangList.value.map(j => ({ value: j, label: j }))
]);

const sortOptions = [
  { value: 'name_asc', label: 'Nama Barang (A - Z)' },
  { value: 'name_desc', label: 'Nama Barang (Z - A)' },
  { value: 'stock_desc', label: 'Stok Terbanyak' },
  { value: 'stock_asc', label: 'Stok Tersedikit (Alert)' },
  { value: 'price_desc', label: 'Harga Tertinggi' },
  { value: 'price_asc', label: 'Harga Termurah' },
  { value: 'updated_at', label: 'Terakhir Diperbarui' }
];

const storeOptions = computed(() => [
  { value: '', label: '-- Pilih Toko Supplier --' },
  ...stores.value.map(s => ({ value: s.id, label: s.namaToko }))
]);

function isItemBahanBaku(c: StockCampuran): boolean {
  if (c.isBahanBaku === true) return true;
  if (c.isBahanBaku === false) return false;
  const j = (c.jenis || '').toLowerCase();
  const n = (c.namaBarang || '').toLowerCase();
  return (
    j.includes('pelarut') ||
    j.includes('fixative') ||
    j.includes('solvent') ||
    j.includes('kimia') ||
    j.includes('aditif') ||
    n.includes('ethanol') ||
    n.includes('alkohol') ||
    n.includes('dpg') ||
    n.includes('water') ||
    n.includes('aquades')
  );
}

function toggleRow(id: string) {
  expandedItemId.value = expandedItemId.value === id ? null : id;
}

const filteredList = computed(() => {
  let list = [...stockCampuran.value];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      c => c.namaBarang.toLowerCase().includes(q) || c.storeName.toLowerCase().includes(q) || c.jenis.toLowerCase().includes(q)
    );
  }

  if (filterTipe.value === 'bahan_baku') {
    list = list.filter(c => isItemBahanBaku(c));
  } else if (filterTipe.value === 'packaging') {
    list = list.filter(c => !isItemBahanBaku(c));
  }

  if (filterJenis.value) {
    list = list.filter(c => c.jenis === filterJenis.value);
  }

  if (filterStockStatus.value) {
    list = list.filter(c => {
      if (isItemBahanBaku(c)) {
        const status = c.currentStock || (c.jumlahStok <= 0 ? 'Habis' : (c.jumlahStok <= 5 ? 'Dikit' : 'Banyak'));
        return status === filterStockStatus.value;
      }
      return true;
    });
  }

  list.sort((a, b) => {
    if (sortBy.value === 'name_asc') return a.namaBarang.localeCompare(b.namaBarang);
    if (sortBy.value === 'name_desc') return b.namaBarang.localeCompare(a.namaBarang);
    if (sortBy.value === 'stock_desc') return b.jumlahStok - a.jumlahStok;
    if (sortBy.value === 'stock_asc') return a.jumlahStok - b.jumlahStok;
    if (sortBy.value === 'price_desc') return b.hargaPerPcs - a.hargaPerPcs;
    if (sortBy.value === 'price_asc') return a.hargaPerPcs - b.hargaPerPcs;
    if (sortBy.value === 'updated_at') return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    return 0;
  });

  return list;
});

// Modal State
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  namaBarang: '',
  jenis: 'Pelarut / Solvent',
  isBahanBaku: true,
  currentStock: 'Banyak' as CurrentStockEnum,
  ukuranMl: 1000,
  storeId: '',
  jumlahStok: 10,
  hargaPerPcs: 65000,
  gambar: '',
  deskripsi: ''
});

function openAddModal() {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    namaBarang: '',
    jenis: allJenisBarangList.value[0] || 'Pelarut / Solvent',
    isBahanBaku: true,
    currentStock: 'Banyak',
    ukuranMl: 1000,
    storeId: '',
    jumlahStok: 10,
    hargaPerPcs: 65000,
    gambar: '',
    deskripsi: ''
  };
  isModalOpen.value = true;
}

function openEditModal(c: StockCampuran) {
  isEditing.value = true;
  editingId.value = c.id;
  const isBahan = isItemBahanBaku(c);
  form.value = {
    namaBarang: c.namaBarang,
    jenis: c.jenis,
    isBahanBaku: isBahan,
    currentStock: c.currentStock || (c.jumlahStok <= 0 ? 'Habis' : (c.jumlahStok <= 5 ? 'Dikit' : 'Banyak')),
    ukuranMl: c.ukuranMl || 1000,
    storeId: c.storeId || '',
    jumlahStok: c.jumlahStok,
    hargaPerPcs: c.hargaPerPcs,
    gambar: c.gambar || '',
    deskripsi: c.deskripsi || ''
  };
  isModalOpen.value = true;
}

function saveItem() {
  if (!form.value.namaBarang.trim() || !form.value.jenis.trim()) return;
  const selectedStore = stores.value.find(s => s.id === form.value.storeId);
  const storeName = selectedStore?.namaToko || 'Toko Lainnya';

  const isBahan = form.value.isBahanBaku;
  const hargaPerMl = isBahan && form.value.ukuranMl > 0
    ? Math.round(form.value.hargaPerPcs / form.value.ukuranMl)
    : undefined;

  const currentStock = isBahan ? form.value.currentStock : undefined;
  const jumlahStok = isBahan
    ? (form.value.currentStock === 'Habis' ? 0 : (form.value.currentStock === 'Dikit' ? 3 : 20))
    : form.value.jumlahStok;

  if (isEditing.value && editingId.value) {
    store.updateStockCampuran(editingId.value, {
      namaBarang: form.value.namaBarang,
      jenis: form.value.jenis,
      isBahanBaku: isBahan,
      currentStock,
      ukuranMl: isBahan ? form.value.ukuranMl : undefined,
      hargaPerMl,
      storeId: form.value.storeId || undefined,
      storeName,
      jumlahStok,
      hargaPerPcs: form.value.hargaPerPcs,
      gambar: form.value.gambar || undefined,
      deskripsi: form.value.deskripsi || undefined
    });
  } else {
    store.addStockCampuran({
      namaBarang: form.value.namaBarang,
      jenis: form.value.jenis,
      isBahanBaku: isBahan,
      currentStock,
      ukuranMl: isBahan ? form.value.ukuranMl : undefined,
      hargaPerMl,
      storeId: form.value.storeId || undefined,
      storeName,
      jumlahStok,
      hargaPerPcs: form.value.hargaPerPcs,
      gambar: form.value.gambar || undefined,
      deskripsi: form.value.deskripsi || undefined
    });
  }
  isModalOpen.value = false;
}

// Delete State
const isDeleteModalOpen = ref(false);
const itemToDelete = ref<StockCampuran | null>(null);

function confirmDelete(item: StockCampuran) {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
}

function doDelete() {
  if (itemToDelete.value) {
    store.deleteStockCampuran(itemToDelete.value.id);
  }
  isDeleteModalOpen.value = false;
}
</script>
