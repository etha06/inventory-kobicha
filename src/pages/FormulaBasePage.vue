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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Katalog Formula Base (Template Pelarut)</h3>
          <p class="text-xs text-sage-600">Standar rasio konsentrat bibit parfum & bahan pelarut (total komposisi 100%)</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="px-4 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5"
        >
          <Plus class="w-4 h-4" />
          <span>Buat Formula Base Baru</span>
        </button>
      </div>
    </div>

    <!-- Formula Base Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-if="formulaBases.length === 0"
        class="col-span-full py-16 text-center text-sage-400 bg-white rounded-[24px] border border-sage-200"
      >
        <FlaskConical class="w-10 h-10 mx-auto mb-2 opacity-40 text-sage-700" />
        Belum ada Formula Base. Buat formula base seperti EDT 10%, EDP 20%, atau Extrait 30%.
      </div>

      <div
        v-for="base in formulaBases"
        :key="base.id"
        class="bg-white rounded-[24px] border border-sage-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div>
              <h4 class="font-rounded font-extrabold text-base text-forest-900 leading-snug">
                {{ base.nama }}
              </h4>
            </div>
            
            <div class="flex items-center gap-1 opacity-90 group-hover:opacity-100">
              <button
                @click="openEditModal(base)"
                class="p-1.5 rounded-lg text-sage-600 hover:text-forest-900 hover:bg-sage-100 text-xs transition-colors"
                title="Edit Formula Base"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                @click="confirmDelete(base)"
                class="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 text-xs transition-colors"
                title="Hapus Formula Base"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p v-if="base.deskripsi" class="text-xs text-stone-600 mb-4 line-clamp-2">
            {{ base.deskripsi }}
          </p>

          <!-- Ingredients List with Progress bars -->
          <div class="space-y-2.5 mb-4">
            <div
              v-for="ing in base.ingredients"
              :key="ing.id"
              class="space-y-1"
            >
              <div class="flex justify-between text-xs font-medium">
                <span :class="ing.isFragranceOilConcentrate ? 'font-bold text-peach-900' : 'text-stone-700'">
                  {{ ing.namaBahan }}
                </span>
                <span class="font-mono font-bold" :class="ing.isFragranceOilConcentrate ? 'text-peach-800' : 'text-stone-900'">
                  {{ ing.percentage }}%
                </span>
              </div>
              <div class="w-full bg-sage-100 h-1.5 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="ing.isFragranceOilConcentrate ? 'bg-peach-500' : 'bg-sage-600'"
                  :style="{ width: ing.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="pt-4 border-t border-sage-100 flex items-center justify-end">
          <button
            @click="useInCalculator(base.id)"
            class="px-3.5 py-1.5 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-900 font-semibold text-xs transition-colors border border-peach-200/80 flex items-center gap-1.5"
          >
            <FlaskConical class="w-3.5 h-3.5" />
            <span>Racik dengan Base Ini</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form (Add / Edit) -->
    <Modal
      :isOpen="isModalOpen"
      :title="isEditing ? 'Edit Formula Base' : 'Buat Formula Base Baru'"
      :subtitle="isEditing ? 'Perbarui persentase rasio bibit FO & pelarut' : 'Tentukan rasio baku konsentrat bibit FO dan pelarut campuran (Total harus 100%)'"
      maxWidth="xl"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="saveBase" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Nama Formula Base (Template)</label>
          <input
            v-model="form.nama"
            type="text"
            required
            placeholder="Misal: Extrait de Parfum 30% (Standard Kobicha)"
            class="w-full px-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Deskripsi / Catatan (Opsional)</label>
          <textarea
            v-model="form.deskripsi"
            rows="2"
            placeholder="Catatan panduan rasio atau karakteristik formula base..."
            class="w-full px-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
          ></textarea>
        </div>

        <!-- Dynamic Ingredients List inside Modal -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-stone-900">Komposisi Bahan Base & FO</label>
            <span
              class="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
              :class="totalCalcPercentage === 100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'"
            >
              Total: {{ totalCalcPercentage }}% / 100%
            </span>
          </div>

          <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
            <div
              v-for="(ing, idx) in form.ingredients"
              :key="ing.id"
              class="flex items-center gap-2 bg-sage-50/50 p-2.5 rounded-xl border border-sage-200/80"
            >
              <div class="flex-1">
                <span class="text-[10px] text-stone-500 block mb-0.5">Nama Bahan / Komponen</span>
                <input
                  v-if="ing.isFragranceOilConcentrate"
                  type="text"
                  :value="ing.namaBahan"
                  disabled
                  class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-stone-100 border border-stone-200 font-bold text-stone-800"
                />
                <CustomSelect
                  v-else
                  v-model="ing.stockCampuranId"
                  :options="campuranOptions"
                  placeholder="-- Pilih Bahan Campuran --"
                  :searchable="true"
                  @change="onSelectCampuran(ing)"
                />
              </div>

              <div class="w-28">
                <span class="text-[10px] text-stone-500 block mb-0.5">Persentase (%)</span>
                <div class="relative">
                  <input
                    v-model.number="ing.percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    required
                    class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-sage-200 font-bold font-mono text-stone-900 pr-6"
                  />
                  <span class="absolute right-2 top-1.5 text-stone-400 text-xs font-bold">%</span>
                </div>
              </div>

              <button
                v-if="!ing.isFragranceOilConcentrate"
                type="button"
                @click="removeIngredientRow(idx)"
                class="text-stone-400 hover:text-rose-600 p-1 text-xs mt-3.5"
                title="Hapus Baris"
              >
                <X class="w-4 h-4" />
              </button>
              <div v-else class="w-5"></div>
            </div>
            
            <button
              type="button"
              @click="addIngredientRow"
              class="w-full py-2 border-2 border-dashed border-sage-300 rounded-xl text-sage-600 hover:border-sage-400 hover:text-sage-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus class="w-4 h-4" />
              <span>Tambah Bahan Baru</span>
            </button>
          </div>
        </div>

        <div class="pt-3 border-t border-sage-100 flex justify-end gap-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 rounded-xl border border-sage-200 text-forest-800 text-xs font-semibold hover:bg-sage-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="totalCalcPercentage !== 100"
            class="px-5 py-2.5 rounded-2xl text-white text-xs font-bold shadow-pill transition-all"
            :class="totalCalcPercentage === 100 ? 'bg-peach-500 hover:bg-peach-600 cursor-pointer' : 'bg-stone-300 cursor-not-allowed opacity-60 shadow-none'"
          >
            Simpan Formula Base
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Hapus Formula Base?"
      :message="`Apakah Anda yakin ingin menghapus formula base '${baseToDelete?.nama}'?`"
      @confirm="doDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { FormulaBase, FormulaBaseIngredient } from '../types';
import { Plus, Pencil, Trash2, FlaskConical, X, Menu } from 'lucide-vue-next';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import CustomSelect from '../components/common/CustomSelect.vue';

const store = useKobichaStore();
const { formulaBases, stockCampuran } = storeToRefs(store);

const campuranOptions = computed(() => [
  { value: '', label: '-- Pilih Bahan Campuran --' },
  ...stockCampuran.value.map(c => ({
    value: c.id,
    label: `${c.namaBarang} (${c.jenis})`
  }))
]);

function useInCalculator(baseId: string) {
  store.prefilledFormulaBaseId = baseId;
  store.navigateTo('kalkulator-racikan');
}

// Modal State
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = ref<{
  nama: string;
  deskripsi: string;
  ingredients: FormulaBaseIngredient[];
}>({
  nama: '',
  deskripsi: '',
  ingredients: []
});

const totalCalcPercentage = computed(() => {
  return form.value.ingredients.reduce((acc, i) => acc + (Number(i.percentage) || 0), 0);
});

function openAddModal() {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    nama: '',
    deskripsi: '',
    ingredients: [
      { id: 'ing-fo', namaBahan: 'Fragrance Oil Concentrate', percentage: 20, isFragranceOilConcentrate: true },
      { id: 'ing-1', namaBahan: stockCampuran.value[0]?.namaBarang || 'Ethanol Absolute 96%', stockCampuranId: stockCampuran.value[0]?.id, percentage: 75, isFragranceOilConcentrate: false },
      { id: 'ing-2', namaBahan: stockCampuran.value[1]?.namaBarang || 'DPG / Fixative', stockCampuranId: stockCampuran.value[1]?.id, percentage: 5, isFragranceOilConcentrate: false }
    ]
  };
  isModalOpen.value = true;
}

function openEditModal(base: FormulaBase) {
  isEditing.value = true;
  editingId.value = base.id;
  form.value = {
    nama: base.nama,
    deskripsi: base.deskripsi || '',
    ingredients: JSON.parse(JSON.stringify(base.ingredients))
  };
  isModalOpen.value = true;
}

function addIngredientRow() {
  const item = stockCampuran.value[0];
  form.value.ingredients.push({
    id: 'ing-' + Date.now(),
    namaBahan: item ? item.namaBarang : 'Bahan Campuran',
    stockCampuranId: item ? item.id : undefined,
    percentage: 5,
    isFragranceOilConcentrate: false
  });
}

function removeIngredientRow(idx: number) {
  form.value.ingredients.splice(idx, 1);
}

function onSelectCampuran(ing: FormulaBaseIngredient) {
  const item = stockCampuran.value.find(c => c.id === ing.stockCampuranId);
  if (item) {
    ing.namaBahan = item.namaBarang;
  }
}

function saveBase() {
  if (totalCalcPercentage.value !== 100) {
    store.showToast('Total persentase komposisi wajib pas 100%', 'warning');
    return;
  }

  if (isEditing.value && editingId.value) {
    store.updateFormulaBase(editingId.value, {
      nama: form.value.nama.trim(),
      deskripsi: form.value.deskripsi.trim() || undefined,
      ingredients: form.value.ingredients,
      totalPercentage: 100
    });
  } else {
    store.addFormulaBase({
      nama: form.value.nama.trim(),
      deskripsi: form.value.deskripsi.trim() || undefined,
      ingredients: form.value.ingredients,
      totalPercentage: 100
    });
  }
  isModalOpen.value = false;
}

// Delete State
const isDeleteModalOpen = ref(false);
const baseToDelete = ref<FormulaBase | null>(null);

function confirmDelete(base: FormulaBase) {
  baseToDelete.value = base;
  isDeleteModalOpen.value = true;
}

function doDelete() {
  if (baseToDelete.value) {
    store.deleteFormulaBase(baseToDelete.value.id);
  }
  isDeleteModalOpen.value = false;
}
</script>
