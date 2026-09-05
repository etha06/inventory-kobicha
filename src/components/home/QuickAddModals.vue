<template>
  <div>
    <!-- 1. Quick Add Fragrance Oil Modal -->
    <Modal
      :isOpen="isQuickAddFoOpen"
      title="Tambah Fragrance Oil Cepat"
      subtitle="Input cepat konsentrat aroma ke stock gudang"
      maxWidth="2xl"
      @close="isQuickAddFoOpen = false"
    >
      <form @submit.prevent="saveFo" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Nama Fragrance Oil</label>
          <input
            v-model="foForm.nama"
            type="text"
            required
            placeholder="Misal: Santal 33 Type Oil"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Toko Supplier</label>
            <CustomSelect
              v-model="foForm.storeId"
              :options="storeOptions"
              placeholder="-- Pilih Toko Supplier --"
              :searchable="true"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Ukuran Botol (ml)</label>
            <input
              v-model.number="foForm.botolMl"
              type="number"
              min="1"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Harga Beli (Rp)</label>
            <input
              v-model.number="foForm.hargaBeli"
              type="number"
              min="0"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-semibold font-mono"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Pyramid</label>
            <CustomSelect
              v-model="foForm.pyramid"
              :options="PYRAMID_OPTIONS"
              placeholder="Pilih Piramida"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Current Stock</label>
            <CustomSelect
              v-model="foForm.currentStock"
              :options="currentStockOptions"
              placeholder="Pilih Status Stock"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">
            Olfactory Notes <span class="text-rose-500 font-bold">*</span>
            <span class="text-[10px] font-normal text-stone-500">(Wajib minimal 1)</span>
          </label>
          <div
            class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 border rounded-xl transition-colors"
            :class="foForm.notes.length === 0 ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' : 'border-stone-200 bg-stone-50/50'"
          >
            <button
              v-for="note in NOTES_OPTIONS"
              :key="note"
              type="button"
              @click="toggleFoQuickNote(note)"
              class="px-2 py-0.5 rounded-lg text-xs font-medium transition-all"
              :class="foForm.notes.includes(note) ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'"
            >
              {{ note }}
            </button>
          </div>
          <p v-if="foForm.notes.length === 0" class="text-[10px] text-rose-600 mt-1 font-medium">
            * Pilih minimal 1 karakter aroma wangi
          </p>
        </div>

        <div class="pt-3 border-t flex justify-end gap-2">
          <button
            type="button"
            @click="isQuickAddFoOpen = false"
            class="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-semibold shadow-sm"
          >
            Simpan FO
          </button>
        </div>
      </form>
    </Modal>

    <!-- 2. Quick Add Campuran Modal -->
    <Modal
      :isOpen="isQuickAddCampuranOpen"
      title="Tambah Barang Lainnya Cepat"
      subtitle="Input cepat pelarut alkohol, DPG, atau packaging"
      maxWidth="lg"
      @close="isQuickAddCampuranOpen = false"
    >
      <form @submit.prevent="saveCampuran" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Nama Barang</label>
          <input
            v-model="campuranForm.namaBarang"
            type="text"
            required
            placeholder="Misal: Fixative DPG 500ml"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-semibold text-stone-700">Jenis Barang</label>
            <span class="text-[10px] text-stone-400">Pilih kategori Where to Buy</span>
          </div>

          <CustomSelect
            v-model="campuranForm.jenis"
            :options="jenisQuickOptions"
            placeholder="-- Pilih Jenis Barang --"
            :searchable="true"
          />

          <!-- Quick Suggestion Badges -->
          <div v-if="allJenisBarangList.length > 0" class="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto p-1.5 bg-stone-50 rounded-xl border border-stone-100">
            <button
              v-for="j in allJenisBarangList"
              :key="j"
              type="button"
              @click="campuranForm.jenis = j"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border"
              :class="campuranForm.jenis === j ? 'bg-peach-500 text-white border-peach-500 shadow-sm' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'"
            >
              {{ j }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Toko Supplier</label>
          <CustomSelect
            v-model="campuranForm.storeId"
            :options="storeOptions"
            placeholder="-- Pilih Toko Supplier --"
            :searchable="true"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Jumlah Stock (pcs)</label>
            <input
              v-model.number="campuranForm.jumlahStok"
              type="number"
              min="0"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Harga / pcs (Rp)</label>
            <input
              v-model.number="campuranForm.hargaPerPcs"
              type="number"
              min="0"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-semibold font-mono"
            />
          </div>
        </div>

        <div class="pt-3 border-t flex justify-end gap-2">
          <button
            type="button"
            @click="isQuickAddCampuranOpen = false"
            class="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-semibold shadow-sm"
          >
            Simpan Barang
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { PyramidEnum, CurrentStockEnum, NotesEnum } from '../../types';
import { PYRAMID_OPTIONS, NOTES_OPTIONS } from '../../utils/constants';
import Modal from '../common/Modal.vue';
import CustomSelect from '../common/CustomSelect.vue';

const store = useKobichaStore();
const { isQuickAddFoOpen, isQuickAddCampuranOpen, stores, allJenisBarangList } = storeToRefs(store);

const storeOptions = computed(() => [
  { value: '', label: '-- Pilih Toko Supplier --' },
  ...stores.value.map(s => ({ value: s.id, label: s.namaToko }))
]);

const jenisQuickOptions = computed(() => [
  ...allJenisBarangList.value.map(j => ({ value: j, label: j }))
]);

const currentStockOptions = [
  { value: 'Banyak', label: 'Banyak' },
  { value: 'Dikit', label: 'Dikit' },
  { value: 'Habis', label: 'Habis' }
];

const foForm = ref({
  nama: '',
  storeId: '',
  botolMl: 10,
  hargaBeli: 30000,
  pyramid: 'Middle' as PyramidEnum,
  notes: [] as NotesEnum[],
  currentStock: 'Banyak' as CurrentStockEnum
});

function toggleFoQuickNote(note: NotesEnum) {
  if (foForm.value.notes.includes(note)) {
    foForm.value.notes = foForm.value.notes.filter(n => n !== note);
  } else {
    foForm.value.notes.push(note);
  }
}

const campuranForm = ref({
  namaBarang: '',
  jenis: 'Pelarut / Solvent',
  storeId: '',
  jumlahStok: 10,
  hargaPerPcs: 45000
});

function saveFo() {
  if (!foForm.value.nama.trim()) {
    store.showToast('Nama Fragrance Oil wajib diisi', 'error');
    return;
  }
  if (foForm.value.notes.length === 0) {
    store.showToast('Olfactory Notes wajib dipilih minimal 1!', 'error');
    return;
  }

  const selectedStore = stores.value.find(s => s.id === foForm.value.storeId);
  const storeName = selectedStore?.namaToko || 'Toko Lainnya';

  store.addStockFragranceOil({
    nama: foForm.value.nama,
    jenisLiquid: 'Fragrance Oil',
    storeId: foForm.value.storeId || undefined,
    storeName,
    botolMl: foForm.value.botolMl,
    currentStock: foForm.value.currentStock,
    pyramid: foForm.value.pyramid,
    notes: foForm.value.notes,
    priceTiers: [
      {
        id: 'tier-' + Date.now(),
        ml: foForm.value.botolMl,
        harga: foForm.value.hargaBeli,
        hargaPerMl: Math.round(foForm.value.hargaBeli / Math.max(foForm.value.botolMl, 1))
      }
    ]
  });

  foForm.value = {
    nama: '',
    storeId: '',
    botolMl: 10,
    hargaBeli: 30000,
    pyramid: 'Middle',
    notes: [],
    currentStock: 'Banyak'
  };
  isQuickAddFoOpen.value = false;
}

function saveCampuran() {
  if (!campuranForm.value.namaBarang.trim()) return;
  const selectedStore = stores.value.find(s => s.id === campuranForm.value.storeId);
  const storeName = selectedStore?.namaToko || 'Toko Lainnya';

  store.addStockCampuran({
    namaBarang: campuranForm.value.namaBarang,
    jenis: campuranForm.value.jenis,
    storeId: campuranForm.value.storeId || undefined,
    storeName,
    jumlahStok: campuranForm.value.jumlahStok,
    hargaPerPcs: campuranForm.value.hargaPerPcs
  });

  campuranForm.value = {
    namaBarang: '',
    jenis: allJenisBarangList.value[0] || 'Pelarut / Solvent',
    storeId: '',
    jumlahStok: 10,
    hargaPerPcs: 45000
  };
  isQuickAddCampuranOpen.value = false;
}
</script>
