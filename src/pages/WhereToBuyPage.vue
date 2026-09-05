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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Direktori Toko & Supplier</h3>
          <p class="text-xs text-sage-600">Database supplier bibit parfum, bahan kimia pelarut, botol, dan kemasan</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="isManageCategoriesModalOpen = true"
          class="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all border border-stone-200 flex items-center gap-1.5 shadow-2xs"
          title="Kelola & Hapus Jenis Barang"
        >
          <Tag class="w-3.5 h-3.5 text-stone-600" />
          <span>Kelola Jenis Barang</span>
        </button>

        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Toko</span>
        </button>
      </div>
    </div>

    <!-- Search, Filter & Sort Bar -->
    <div class="bg-white p-4 rounded-xl border border-sage-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama toko / jenis barang..."
          class="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        />
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
      </div>

      <!-- Filter Jenis -->
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

    <!-- Stores Table -->
    <div class="bg-white rounded-xl border border-sage-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs min-w-[640px]">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-4 text-left">Nama Toko</th>
              <th class="py-3.5 px-4 text-left">Jenis Barang</th>
              <th class="py-3.5 px-4 text-left">Link Toko</th>
              <th class="py-3.5 px-4 text-left">Stock Terkait</th>
              <th class="py-3.5 px-4 text-left w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="filteredStores.length === 0">
              <td colspan="5" class="py-12 text-center text-stone-400">
                <Store class="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p class="text-xs text-stone-400">Tidak ada data toko ditemukan.</p>
              </td>
            </tr>

            <template v-for="store in paginatedStores" :key="store.id">
              <!-- Main Row (Clickable to expand) -->
              <tr
                @click="toggleRow(store.id)"
                class="table-row-hover transition-colors cursor-pointer"
                :class="expandedStoreId === store.id ? 'bg-amber-50/60 font-medium' : ''"
              >
                <td class="py-3.5 px-4 text-left">
                  <div class="flex items-center gap-2">
                    <ChevronRight
                      class="w-3.5 h-3.5 text-amber-700 transition-transform duration-150 flex-shrink-0"
                      :class="expandedStoreId === store.id ? 'rotate-90' : ''"
                    />
                    <div
                      v-if="store.gambar"
                      @click.stop="previewImg(store.gambar, store.namaToko)"
                      class="w-7 h-7 rounded-lg overflow-hidden border border-stone-200 bg-white flex-shrink-0 cursor-pointer hover:opacity-85 hover:scale-105 transition-all shadow-2xs"
                      title="Klik untuk memperbesar logo toko"
                    >
                      <img :src="store.gambar" :alt="store.namaToko" class="w-full h-full object-cover" />
                    </div>
                    <span class="font-bold text-stone-900 text-xs">{{ store.namaToko }}</span>
                  </div>
                </td>

                <td class="py-3.5 px-4 text-left text-stone-600">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="j in normalizeJenisBarang(store.jenisBarang)"
                      :key="j"
                      class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-medium"
                    >
                      {{ j }}
                    </span>
                    <span v-if="normalizeJenisBarang(store.jenisBarang).length === 0" class="text-stone-400 text-xs">-</span>
                  </div>
                </td>

                <td class="py-3.5 px-4 text-left" @click.stop>
                  <a
                    v-if="store.linkToko"
                    :href="store.linkToko"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-medium text-[11px] transition-colors"
                  >
                    <span>Kunjungi Toko</span>
                    <ExternalLink class="w-3 h-3" />
                  </a>
                  <span v-else class="text-stone-400 text-xs">-</span>
                </td>

                <td class="py-3.5 px-4 text-left font-mono font-bold text-stone-800 text-xs">
                  {{ getLinkedProductsCount(store.id) }} Produk
                </td>

                <!-- Aksi Column (Positioned Right, Aligned Left, Lucide Icons) -->
                <td class="py-3.5 px-4 text-left" @click.stop>
                  <div class="flex items-center justify-start gap-1.5">
                    <button
                      @click="openEditModal(store)"
                      class="p-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Edit Toko"
                    >
                      <Pencil class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="confirmDelete(store)"
                      class="p-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                      title="Hapus Toko"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expandable Inline Detail Sub-Row -->
              <tr v-if="expandedStoreId === store.id" class="bg-amber-50/30 border-b border-amber-200/70">
                <td colspan="5" class="p-4 sm:p-5">
                  <div class="bg-white rounded-lg p-4 border border-amber-200/80 shadow-xs space-y-3">
                    <div class="flex items-start justify-between">
                      <div>
                        <h4 class="font-bold text-stone-900 text-xs flex items-center gap-2">
                          <Store class="w-4 h-4 text-amber-700" />
                          <span>Detail Toko: {{ store.namaToko }}</span>
                        </h4>
                        <p v-if="store.deskripsi" class="text-xs text-stone-600 mt-1 leading-relaxed">
                          {{ store.deskripsi }}
                        </p>
                        <p v-else class="text-xs text-stone-400 italic mt-1">
                          Tidak ada deskripsi tambahan.
                        </p>
                      </div>

                      <div
                        v-if="store.gambar"
                        @click.stop="previewImg(store.gambar, store.namaToko)"
                        class="w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-white flex-shrink-0 cursor-pointer hover:opacity-90 hover:scale-105 transition-all shadow-xs group relative"
                        title="Klik untuk memperbesar logo toko"
                      >
                        <img :src="store.gambar" alt="Store logo" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye class="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <!-- List of items bought from this store -->
                    <div class="pt-3 border-t border-stone-100">
                      <span class="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-2">
                        Daftar Barang dari Toko Ini:
                      </span>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div
                          v-for="fo in getLinkedFo(store.id)"
                          :key="fo.id"
                          class="p-2 rounded-md bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                        >
                          <span class="font-medium text-stone-800">{{ fo.nama }}</span>
                          <span class="text-[10px] text-stone-500 font-mono">{{ fo.botolMl }}ml • {{ fo.currentStock }}</span>
                        </div>

                        <div
                          v-for="c in getLinkedCampuran(store.id)"
                          :key="c.id"
                          class="p-2 rounded-md bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                        >
                          <span class="font-medium text-stone-800">{{ c.namaBarang }}</span>
                          <span class="text-[10px] text-stone-500 font-mono">Stock: {{ c.jumlahStok }} pcs</span>
                        </div>

                        <div
                          v-if="getLinkedFo(store.id).length === 0 && getLinkedCampuran(store.id).length === 0"
                          class="col-span-2 text-stone-400 text-xs italic"
                        >
                          Belum ada stock barang yang ditautkan ke toko ini.
                        </div>
                      </div>
                    </div>

                    <div class="text-[10px] text-stone-400 pt-1 flex justify-between">
                      <span>Dibuat: {{ formatDateIndo(store.createdAt) }}</span>
                      <span>Diperbarui: {{ formatDateIndo(store.updatedAt) }}</span>
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
        :totalItems="filteredStores.length"
        :itemsPerPage="itemsPerPage"
      />
    </div>

    <!-- Modal Form (Add / Edit) -->
    <Modal
      :isOpen="isModalOpen"
      :title="isEditing ? 'Edit Toko Supplier' : 'Tambah Toko Baru'"
      subtitle="Data supplier untuk direktori belanja bahan parfum"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmitStore" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Nama Toko / Supplier</label>
          <input
            v-model="form.namaToko"
            type="text"
            required
            placeholder="Misal: Aromatics Botanica ID / Kimia Farma"
            class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <!-- Multi-Select / Multi-Tags Jenis Barang -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-semibold text-stone-700">Jenis Barang (Bisa Pilih Lebih dari 1)</label>
            <span class="text-[10px] text-stone-400">Pilih rekomendasi di bawah atau ketik baru</span>
          </div>

          <!-- Selected Tags Display -->
          <div v-if="form.jenisBarangList.length > 0" class="flex flex-wrap gap-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200 mb-2">
            <span
              v-for="j in form.jenisBarangList"
              :key="j"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-peach-500 text-white text-xs font-semibold shadow-2xs"
            >
              <span>{{ j }}</span>
              <button
                type="button"
                @click="removeJenisTag(j)"
                class="hover:bg-peach-700 rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[10px]"
                title="Hapus kategori ini"
              >
                &times;
              </button>
            </span>
          </div>

          <!-- Input to Add Custom Tag -->
          <div class="flex gap-2">
            <div class="relative flex-1">
              <input
                v-model="customJenisInput"
                type="text"
                list="jenisBarangDatalist"
                placeholder="Ketik jenis barang lalu tekan Enter / Tambah..."
                @keydown.enter.prevent="addCustomJenisTag"
                class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-medium"
              />
              <datalist id="jenisBarangDatalist">
                <option v-for="j in allJenisBarangList" :key="j" :value="j">{{ j }}</option>
              </datalist>
            </div>
            <button
              type="button"
              @click="addCustomJenisTag"
              class="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
            >
              + Tambah
            </button>
          </div>

          <!-- Quick Suggestion Badges -->
          <div class="mt-2.5">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold text-stone-400 block">Klik untuk tambah / hapus cepat:</span>
              <button
                type="button"
                @click="isManageCategoriesModalOpen = true"
                class="text-[10px] text-amber-700 hover:text-amber-800 font-semibold underline flex items-center gap-1"
              >
                <Tag class="w-2.5 h-2.5" />
                <span>Kelola Kategori</span>
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-stone-50 rounded-lg border border-stone-100">
              <button
                v-for="j in allJenisBarangList"
                :key="j"
                type="button"
                @click="toggleJenisTag(j)"
                class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all border"
                :class="form.jenisBarangList.includes(j) ? 'bg-peach-500 text-white border-peach-500 shadow-xs' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'"
              >
                {{ form.jenisBarangList.includes(j) ? '✓ ' + j : '+ ' + j }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Link Toko (URL Marketplace / Web)</label>
          <input
            v-model="form.linkToko"
            type="url"
            placeholder="https://shopee.co.id/nama_toko atau https://tokopedia.com/..."
            class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Link Gambar / Logo Toko (Opsional)</label>
          <input
            v-model="form.gambar"
            type="url"
            placeholder="https://... (URL gambar)"
            class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Deskripsi / Catatan Toko (Opsional)</label>
          <textarea
            v-model="form.deskripsi"
            rows="3"
            placeholder="Kualitas barang, kontak WhatsApp, ketentuan minimal order, dsb..."
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
            Simpan Toko
          </button>
        </div>
      </form>
    </Modal>

    <!-- Modal Kelola Jenis Barang -->
    <Modal
      :isOpen="isManageCategoriesModalOpen"
      title="Kelola Jenis Barang / Kategori"
      subtitle="Tambah kategori baru atau hapus jenis barang yang tidak terikat toko"
      @close="isManageCategoriesModalOpen = false"
    >
      <div class="space-y-4">
        <!-- Input Tambah Kategori Baru -->
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
          <label class="block text-xs font-bold text-stone-800">Tambah Jenis Barang Baru</label>
          <div class="flex gap-2">
            <input
              v-model="newCategoryInput"
              type="text"
              placeholder="Misal: Pipet Tetes / Kemasan Kardus..."
              @keydown.enter.prevent="handleAddNewCategory"
              class="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white font-medium"
            />
            <button
              type="button"
              @click="handleAddNewCategory"
              class="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        <!-- Info Card -->
        <div class="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle class="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p class="text-[11px] leading-relaxed">
            <span class="font-bold">Ketentuan Hapus:</span> Jenis barang hanya bisa dihapus jika <strong>tidak ada toko supplier</strong> yang sedang terikat menggunakannya.
          </p>
        </div>

        <!-- Daftar Kategori -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-stone-700 px-1">
            <span>Daftar Kategori ({{ allJenisBarangList.length }})</span>
            <span class="text-[10px] text-stone-400 font-normal">Status & Aksi</span>
          </div>

          <div class="max-h-72 overflow-y-auto divide-y divide-stone-100 border border-stone-200 rounded-xl bg-white">
            <div
              v-for="cat in allJenisBarangList"
              :key="cat"
              class="p-3 flex items-center justify-between hover:bg-stone-50/80 transition-colors gap-3"
            >
              <div class="min-w-0">
                <div class="font-bold text-stone-800 text-xs truncate">{{ cat }}</div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span
                    v-if="store.getStoreCountUsingJenis(cat) > 0"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                  >
                    <Store class="w-2.5 h-2.5" />
                    {{ store.getStoreCountUsingJenis(cat) }} Toko Terikat
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    ✓ 0 Toko (Bisa Dihapus)
                  </span>

                  <span
                    v-if="store.getStockCampuranCountUsingJenis(cat) > 0"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200"
                  >
                    {{ store.getStockCampuranCountUsingJenis(cat) }} Stock Terkait
                  </span>
                </div>
              </div>

              <!-- Action Button -->
              <div class="flex-shrink-0">
                <button
                  v-if="store.getStoreCountUsingJenis(cat) > 0 || store.getStockCampuranCountUsingJenis(cat) > 0"
                  type="button"
                  @click="handleAttemptDeleteLockedCategory(cat)"
                  class="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-100 text-stone-400 border border-stone-200 flex items-center gap-1 cursor-not-allowed hover:bg-stone-200/60"
                  title="Tidak bisa dihapus karena masih digunakan"
                >
                  <Lock class="w-3 h-3 text-stone-400" />
                  <span>Terkunci</span>
                </button>

                <button
                  v-else
                  type="button"
                  @click="confirmDeleteCategory(cat)"
                  class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center gap-1 transition-colors active:scale-95 shadow-2xs"
                  title="Hapus Kategori"
                >
                  <Trash2 class="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>

            <div v-if="allJenisBarangList.length === 0" class="p-6 text-center text-xs text-stone-400">
              Belum ada jenis barang.
            </div>
          </div>
        </div>

        <div class="pt-2 border-t flex justify-end">
          <button
            type="button"
            @click="isManageCategoriesModalOpen = false"
            class="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold"
          >
            Selesai
          </button>
        </div>
      </div>
    </Modal>

    <!-- Category Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="isDeleteCategoryModalOpen"
      title="Hapus Jenis Barang?"
      :message="`Apakah Anda yakin ingin menghapus jenis barang '${categoryToDelete}'? Jenis barang ini tidak terikat dengan toko manapun.`"
      @confirm="doDeleteCategory"
      @cancel="isDeleteCategoryModalOpen = false"
    />

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Hapus Toko Supplier?"
      :message="`Apakah Anda yakin ingin menghapus toko '${storeToDelete?.namaToko}'?`"
      @confirm="doDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { StoreSupplier } from '../types';
import { formatDateIndo, normalizeJenisBarang } from '../utils/formatters';
import { Plus, Search, Pencil, Trash2, ExternalLink, ChevronRight, Store, AlertTriangle, Menu, Tag, Lock, Eye } from 'lucide-vue-next';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import CustomSelect from '../components/common/CustomSelect.vue';
import Pagination from '../components/common/Pagination.vue';

const store = useKobichaStore();
const { stores, stockFragranceOil, stockCampuran, allJenisBarangList } = storeToRefs(store);

function previewImg(url?: string, title?: string) {
  if (url) store.openImagePreview(url, title);
}

const searchQuery = ref('');
const filterJenis = ref('');
const sortBy = ref('name_asc');
const expandedStoreId = ref<string | null>(null);

// Pagination State (Max 10 rows per page)
const currentPage = ref(1);
const itemsPerPage = 10;

const jenisOptions = computed(() => [
  { value: '', label: 'Semua Jenis Barang' },
  ...allJenisBarangList.value.map(j => ({ value: j, label: j }))
]);

const sortOptions = [
  { value: 'name_asc', label: 'Nama Toko (A - Z)' },
  { value: 'name_desc', label: 'Nama Toko (Z - A)' },
  { value: 'newest', label: 'Terbaru Ditambahkan' },
  { value: 'oldest', label: 'Terlama' }
];

function toggleRow(id: string) {
  expandedStoreId.value = expandedStoreId.value === id ? null : id;
}

const filteredStores = computed(() => {
  let list = [...stores.value];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      s => s.namaToko.toLowerCase().includes(q) || normalizeJenisBarang(s.jenisBarang).some(j => j.toLowerCase().includes(q))
    );
  }

  if (filterJenis.value) {
    list = list.filter(s => normalizeJenisBarang(s.jenisBarang).includes(filterJenis.value));
  }

  list.sort((a, b) => {
    if (sortBy.value === 'name_asc') return a.namaToko.localeCompare(b.namaToko);
    if (sortBy.value === 'name_desc') return b.namaToko.localeCompare(a.namaToko);
    if (sortBy.value === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy.value === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  return list;
});

const paginatedStores = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredStores.value.slice(start, start + itemsPerPage);
});

watch([searchQuery, filterJenis, sortBy], () => {
  currentPage.value = 1;
});

function getLinkedProductsCount(storeId: string): number {
  const fo = stockFragranceOil.value.filter(f => f.storeId === storeId).length;
  const camp = stockCampuran.value.filter(c => c.storeId === storeId).length;
  return fo + camp;
}

function getLinkedFo(storeId: string) {
  return stockFragranceOil.value.filter(f => f.storeId === storeId);
}

function getLinkedCampuran(storeId: string) {
  return stockCampuran.value.filter(c => c.storeId === storeId);
}

// Modal State
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const customJenisInput = ref('');

const form = ref<{
  namaToko: string;
  jenisBarangList: string[];
  linkToko: string;
  gambar: string;
  deskripsi: string;
}>({
  namaToko: '',
  jenisBarangList: [],
  linkToko: '',
  gambar: '',
  deskripsi: ''
});

function addCustomJenisTag() {
  const val = customJenisInput.value.trim();
  if (val && !form.value.jenisBarangList.includes(val)) {
    form.value.jenisBarangList.push(val);
  }
  customJenisInput.value = '';
}

function removeJenisTag(tag: string) {
  form.value.jenisBarangList = form.value.jenisBarangList.filter(t => t !== tag);
}

function toggleJenisTag(tag: string) {
  if (form.value.jenisBarangList.includes(tag)) {
    removeJenisTag(tag);
  } else {
    form.value.jenisBarangList.push(tag);
  }
}

function openAddModal() {
  isEditing.value = false;
  editingId.value = null;
  customJenisInput.value = '';
  form.value = {
    namaToko: '',
    jenisBarangList: [],
    linkToko: '',
    gambar: '',
    deskripsi: ''
  };
  isModalOpen.value = true;
}

function openEditModal(s: StoreSupplier) {
  isEditing.value = true;
  editingId.value = s.id;
  customJenisInput.value = '';
  form.value = {
    namaToko: s.namaToko,
    jenisBarangList: normalizeJenisBarang(s.jenisBarang),
    linkToko: s.linkToko,
    gambar: s.gambar || '',
    deskripsi: s.deskripsi || ''
  };
  isModalOpen.value = true;
}

function handleSubmitStore() {
  if (!form.value.namaToko.trim()) {
    store.showToast('Silakan masukkan nama toko', 'warning');
    return;
  }
  if (customJenisInput.value.trim()) {
    addCustomJenisTag();
  }
  if (form.value.jenisBarangList.length === 0) {
    store.showToast('Pilih minimal 1 jenis barang untuk toko ini', 'warning');
    return;
  }
  executeSaveStore();
}

function executeSaveStore() {
  if (isEditing.value && editingId.value) {
    store.updateStore(editingId.value, {
      namaToko: form.value.namaToko.trim(),
      jenisBarang: form.value.jenisBarangList,
      linkToko: form.value.linkToko.trim(),
      gambar: form.value.gambar?.trim() || undefined,
      deskripsi: form.value.deskripsi?.trim() || undefined
    });
  } else {
    store.addStore({
      namaToko: form.value.namaToko.trim(),
      jenisBarang: form.value.jenisBarangList,
      linkToko: form.value.linkToko.trim(),
      gambar: form.value.gambar?.trim() || undefined,
      deskripsi: form.value.deskripsi?.trim() || undefined
    });
  }
  isModalOpen.value = false;
}

// Delete State
const isDeleteModalOpen = ref(false);
const storeToDelete = ref<StoreSupplier | null>(null);

function confirmDelete(s: StoreSupplier) {
  storeToDelete.value = s;
  isDeleteModalOpen.value = true;
}

function doDelete() {
  if (storeToDelete.value) {
    store.deleteStore(storeToDelete.value.id);
  }
  isDeleteModalOpen.value = false;
}

// Manage Categories State & Handlers
const isManageCategoriesModalOpen = ref(false);
const newCategoryInput = ref('');
const isDeleteCategoryModalOpen = ref(false);
const categoryToDelete = ref('');

function handleAddNewCategory() {
  const val = newCategoryInput.value.trim();
  if (!val) {
    store.showToast('Masukkan nama jenis barang', 'warning');
    return;
  }
  const success = store.addJenisBarang(val);
  if (success) {
    newCategoryInput.value = '';
  }
}

function handleAttemptDeleteLockedCategory(cat: string) {
  const check = store.canDeleteJenisBarang(cat);
  if (!check.canDelete) {
    store.showToast(check.reason || 'Kategori tidak dapat dihapus karena masih terikat', 'warning');
  }
}

function confirmDeleteCategory(cat: string) {
  const check = store.canDeleteJenisBarang(cat);
  if (!check.canDelete) {
    store.showToast(check.reason || 'Kategori tidak dapat dihapus', 'warning');
    return;
  }
  categoryToDelete.value = cat;
  isDeleteCategoryModalOpen.value = true;
}

function doDeleteCategory() {
  if (categoryToDelete.value) {
    store.deleteJenisBarang(categoryToDelete.value);
  }
  isDeleteCategoryModalOpen.value = false;
  categoryToDelete.value = '';
}
</script>
