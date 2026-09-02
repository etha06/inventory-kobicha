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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Direktori Toko & Supplier</h3>
          <p class="text-xs text-sage-600">Database supplier bibit parfum, bahan kimia pelarut, botol, dan kemasan</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="px-4 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Toko</span>
        </button>
      </div>
    </div>

    <!-- Search, Filter & Sort Bar -->
    <div class="bg-white p-4 rounded-[20px] border border-sage-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama toko / jenis barang..."
          class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        />
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
      </div>

      <!-- Filter Jenis -->
      <div>
        <select
          v-model="filterJenis"
          class="w-full px-3 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        >
          <option value="">-- Semua Jenis Barang --</option>
          <option v-for="j in allJenisBarangList" :key="j" :value="j">{{ j }}</option>
        </select>
      </div>

      <!-- Sort By -->
      <div>
        <select
          v-model="sortBy"
          class="w-full px-3 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        >
          <option value="name_asc">Nama Toko (A - Z)</option>
          <option value="name_desc">Nama Toko (Z - A)</option>
          <option value="newest">Terbaru Ditambahkan</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>
    </div>

    <!-- Stores Table -->
    <div class="bg-white rounded-[24px] border border-sage-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-4 w-10 text-left">#</th>
              <th class="py-3.5 px-4 text-left">Nama Toko</th>
              <th class="py-3.5 px-4 text-left">Jenis Barang</th>
              <th class="py-3.5 px-4 text-left">Link Toko</th>
              <th class="py-3.5 px-4 text-left">Stok Terkait</th>
              <th class="py-3.5 px-4 text-left w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="filteredStores.length === 0">
              <td colspan="6" class="py-12 text-center text-stone-400">
                <Store class="w-8 h-8 mx-auto mb-2 opacity-50" />
                Tidak ada data toko ditemukan.
              </td>
            </tr>

            <template v-for="(store, idx) in filteredStores" :key="store.id">
              <!-- Main Row (Clickable to expand) -->
              <tr
                @click="toggleRow(store.id)"
                class="table-row-hover transition-colors cursor-pointer"
                :class="expandedStoreId === store.id ? 'bg-amber-50/60 font-medium' : ''"
              >
                <td class="py-3.5 px-4 text-left text-stone-400 font-mono">
                  <span class="text-[11px]">{{ idx + 1 }}</span>
                </td>

                <td class="py-3.5 px-4 text-left">
                  <div class="flex items-center gap-2">
                    <ChevronRight
                      class="w-3.5 h-3.5 text-amber-700 transition-transform duration-150"
                      :class="expandedStoreId === store.id ? 'rotate-90' : ''"
                    />
                    <span class="font-bold text-stone-900 text-xs">{{ store.namaToko }}</span>
                  </div>
                </td>

                <td class="py-3.5 px-4 text-left text-stone-600">
                  <span class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-medium">
                    {{ store.jenisBarang }}
                  </span>
                </td>

                <td class="py-3.5 px-4 text-left" @click.stop>
                  <a
                    v-if="store.linkToko"
                    :href="store.linkToko"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-medium text-[11px] transition-colors"
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
                      class="p-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Edit Toko"
                    >
                      <Pencil class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="confirmDelete(store)"
                      class="p-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                      title="Hapus Toko"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expandable Inline Detail Sub-Row -->
              <tr v-if="expandedStoreId === store.id" class="bg-amber-50/30 border-b border-amber-200/70">
                <td colspan="6" class="p-5">
                  <div class="bg-white rounded-xl p-4 border border-amber-200/80 shadow-sm space-y-3">
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

                      <div v-if="store.gambar" class="w-16 h-16 rounded-xl overflow-hidden border">
                        <img :src="store.gambar" alt="Store logo" class="w-full h-full object-cover" />
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
                          class="p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                        >
                          <span class="font-medium text-stone-800">{{ fo.nama }}</span>
                          <span class="text-[10px] text-stone-500 font-mono">{{ fo.botolMl }}ml • {{ fo.currentStock }}</span>
                        </div>

                        <div
                          v-for="c in getLinkedCampuran(store.id)"
                          :key="c.id"
                          class="p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                        >
                          <span class="font-medium text-stone-800">{{ c.namaBarang }}</span>
                          <span class="text-[10px] text-stone-500 font-mono">Stok: {{ c.jumlahStok }} pcs</span>
                        </div>

                        <div
                          v-if="getLinkedFo(store.id).length === 0 && getLinkedCampuran(store.id).length === 0"
                          class="col-span-2 text-stone-400 text-xs italic"
                        >
                          Belum ada stok barang yang ditautkan ke toko ini.
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
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <!-- Smart Combobox Jenis Barang -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-semibold text-stone-700">Jenis Barang</label>
            <span class="text-[10px] text-stone-400">Pilih yang sudah ada atau ketik baru</span>
          </div>

          <div class="relative">
            <input
              v-model="form.jenisBarang"
              type="text"
              required
              list="jenisBarangDatalist"
              placeholder="Ketik atau pilih jenis barang..."
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-medium"
            />
            <datalist id="jenisBarangDatalist">
              <option v-for="j in allJenisBarangList" :key="j" :value="j">{{ j }}</option>
            </datalist>
          </div>

          <!-- Quick Suggestion Badges -->
          <div class="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto p-1.5 bg-stone-50 rounded-xl border border-stone-100">
            <button
              v-for="j in allJenisBarangList"
              :key="j"
              type="button"
              @click="form.jenisBarang = j"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border"
              :class="form.jenisBarang === j ? 'bg-peach-500 text-white border-peach-500 shadow-sm' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'"
            >
              {{ j }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Link Toko (URL Marketplace / Web)</label>
          <input
            v-model="form.linkToko"
            type="url"
            placeholder="https://shopee.co.id/nama_toko atau https://tokopedia.com/..."
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Link Gambar / Logo Toko (Opsional)</label>
          <input
            v-model="form.gambar"
            type="url"
            placeholder="https://... (URL gambar)"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Deskripsi / Catatan Toko (Opsional)</label>
          <textarea
            v-model="form.deskripsi"
            rows="3"
            placeholder="Kualitas barang, kontak WhatsApp, ketentuan minimal order, dsb..."
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
            Simpan Toko
          </button>
        </div>
      </form>
    </Modal>

    <!-- Cascade Rename Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showCascadeRenameModal" class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
          <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-center text-stone-900 mb-2">Kamu yakin ubah jenis barang ini?</h3>
          <p class="text-xs text-stone-600 text-center mb-4 leading-relaxed">
            Anda mengubah jenis barang dari <strong>"{{ originalJenisBarang }}"</strong> menjadi <strong>"{{ form.jenisBarang }}"</strong>.
            Jika diubah, semua toko dan stok barang campuran yang menggunakan jenis barang ini akan otomatis diperbarui ke nama baru.
          </p>
          <div class="flex items-center justify-center gap-2.5">
            <button
              @click="cancelCascadeRename"
              class="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
            >
              Hanya Ubah Toko Ini
            </button>
            <button
              @click="confirmCascadeRename"
              class="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 shadow-sm"
            >
              Ya, Ubah Semua Terkait
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
import { ref, computed } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { StoreSupplier } from '../types';
import { formatDateIndo } from '../utils/formatters';
import { Plus, Search, Pencil, Trash2, ExternalLink, ChevronRight, Store, AlertTriangle, Menu } from 'lucide-vue-next';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';

const store = useKobichaStore();
const { stores, stockFragranceOil, stockCampuran, allJenisBarangList } = storeToRefs(store);

const searchQuery = ref('');
const filterJenis = ref('');
const sortBy = ref('name_asc');
const expandedStoreId = ref<string | null>(null);

function toggleRow(id: string) {
  expandedStoreId.value = expandedStoreId.value === id ? null : id;
}

const filteredStores = computed(() => {
  let list = [...stores.value];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      s => s.namaToko.toLowerCase().includes(q) || s.jenisBarang.toLowerCase().includes(q)
    );
  }

  if (filterJenis.value) {
    list = list.filter(s => s.jenisBarang === filterJenis.value);
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
const originalJenisBarang = ref<string>('');
const showCascadeRenameModal = ref(false);

const form = ref({
  namaToko: '',
  jenisBarang: '',
  linkToko: '',
  gambar: '',
  deskripsi: ''
});

function openAddModal() {
  isEditing.value = false;
  editingId.value = null;
  originalJenisBarang.value = '';
  form.value = {
    namaToko: '',
    jenisBarang: '',
    linkToko: '',
    gambar: '',
    deskripsi: ''
  };
  isModalOpen.value = true;
}

function openEditModal(s: StoreSupplier) {
  isEditing.value = true;
  editingId.value = s.id;
  originalJenisBarang.value = s.jenisBarang;
  form.value = {
    namaToko: s.namaToko,
    jenisBarang: s.jenisBarang,
    linkToko: s.linkToko,
    gambar: s.gambar || '',
    deskripsi: s.deskripsi || ''
  };
  isModalOpen.value = true;
}

function handleSubmitStore() {
  if (!form.value.namaToko.trim() || !form.value.jenisBarang.trim()) return;

  if (isEditing.value && originalJenisBarang.value && form.value.jenisBarang.trim() !== originalJenisBarang.value.trim()) {
    showCascadeRenameModal.value = true;
    return;
  }

  executeSaveStore();
}

function confirmCascadeRename() {
  store.renameJenisBarangCascade(originalJenisBarang.value, form.value.jenisBarang.trim());
  showCascadeRenameModal.value = false;
  executeSaveStore();
}

function cancelCascadeRename() {
  showCascadeRenameModal.value = false;
  executeSaveStore();
}

function executeSaveStore() {
  if (isEditing.value && editingId.value) {
    store.updateStore(editingId.value, {
      namaToko: form.value.namaToko.trim(),
      jenisBarang: form.value.jenisBarang.trim(),
      linkToko: form.value.linkToko.trim(),
      gambar: form.value.gambar?.trim() || undefined,
      deskripsi: form.value.deskripsi?.trim() || undefined
    });
  } else {
    store.addStore({
      namaToko: form.value.namaToko.trim(),
      jenisBarang: form.value.jenisBarang.trim(),
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
</script>
