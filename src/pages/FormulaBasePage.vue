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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Katalog Formula Base (Template Pelarut)</h3>
          <p class="text-xs text-sage-600">Standar rasio konsentrat bibit parfum & bahan pelarut (total komposisi 100%)</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
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
        class="col-span-full py-12 text-center text-stone-400 bg-white rounded-xl border border-stone-200/80 text-xs shadow-xs"
      >
        <FlaskConical class="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p class="text-xs text-stone-400">Belum ada Formula Base. Buat formula base seperti EDT 10%, EDP 20%, atau Extrait 30%.</p>
      </div>

      <div
        v-for="base in formulaBases"
        :key="base.id"
        class="bg-white rounded-xl border border-sage-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div>
              <h4 class="font-rounded font-extrabold text-base text-forest-900 leading-snug">
                {{ base.nama }}
              </h4>
            </div>
            
            <div class="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
              <button
                @click="openEditModal(base)"
                class="p-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 text-xs transition-colors"
                title="Edit Formula Base"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                @click="confirmDelete(base)"
                class="p-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs transition-colors"
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
                <span :class="ing.isFragranceOilConcentrate ? 'font-bold text-amber-900' : 'text-stone-700'">
                  {{ ing.namaBahan }}
                </span>
                <span class="font-mono font-bold" :class="ing.isFragranceOilConcentrate ? 'text-amber-800' : 'text-stone-900'">
                  {{ ing.percentage }}%
                </span>
              </div>
              <div class="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="ing.isFragranceOilConcentrate ? 'bg-amber-600' : 'bg-stone-600'"
                  :style="{ width: ing.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="pt-4 border-t border-stone-100 flex items-center justify-end">
          <button
            @click="useInCalculator(base.id)"
            class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs transition-colors border border-amber-200/80 flex items-center gap-1.5"
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
      subtitle="Tentukan komposisi bahan campuran dan porsi konsentrat FO (Wajib tepat 100%)"
      maxWidth="2xl"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="saveBase" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Nama Formula Base</label>
          <input
            v-model="form.nama"
            type="text"
            required
            placeholder="Misal: Eau de Parfum (EDP) 20% Standard"
            class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Deskripsi Formula (Opsional)</label>
          <textarea
            v-model="form.deskripsi"
            rows="2"
            placeholder="Karakteristik ketahanan, panduan maturasi, rekomendasi penggunaan..."
            class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          ></textarea>
        </div>

        <!-- 100% Progress Indicator -->
        <div class="p-4 rounded-lg border transition-all" :class="totalCalcPercentage === 100 ? 'bg-emerald-50/80 border-emerald-300' : 'bg-amber-50 border-amber-300'">
          <div class="flex items-center justify-between mb-1.5 text-xs font-bold">
            <span :class="totalCalcPercentage === 100 ? 'text-emerald-800' : 'text-amber-900'">
              Total Persentase: {{ totalCalcPercentage }}%
            </span>
            <span v-if="totalCalcPercentage === 100" class="text-emerald-700 font-bold flex items-center gap-1">
              ✓ Pas 100% Siap Simpan
            </span>
            <span v-else class="text-amber-700">
              {{ totalCalcPercentage < 100 ? `Kurang ${100 - totalCalcPercentage}%` : `Kelebihan ${totalCalcPercentage - 100}%` }}
            </span>
          </div>
          <div class="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-200"
              :class="totalCalcPercentage === 100 ? 'bg-emerald-600' : totalCalcPercentage > 100 ? 'bg-rose-600' : 'bg-amber-600'"
              :style="{ width: Math.min(totalCalcPercentage, 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Ingredients Input List -->
        <div class="space-y-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label class="block text-xs font-bold text-stone-900 uppercase tracking-wider">
              Komposisi Bahan & Persentase (%):
            </label>
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                v-if="!form.ingredients.some(i => i.isFragranceOilConcentrate)"
                type="button"
                @click="addFoSlot"
                class="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1 transition-colors border border-amber-300"
              >
                <Plus class="w-3 h-3" />
                <span>+ Slot Konsentrat FO</span>
              </button>

              <button
                type="button"
                @click="addIngredientRow"
                class="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors border border-stone-200"
              >
                <Plus class="w-3 h-3" />
                <span>Tambah Bahan Lainnya</span>
              </button>
            </div>
          </div>

          <div v-if="form.ingredients.length === 0" class="py-8 text-center text-stone-400 text-xs italic bg-stone-50/70 rounded-lg border border-dashed border-stone-200">
            Belum ada komposisi bahan. Klik "+ Slot Konsentrat FO" atau "+ Tambah Bahan Lainnya" di atas untuk menyusun formula.
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(ing, idx) in form.ingredients"
              :key="ing.id"
              class="flex items-center gap-2 p-2.5 rounded-lg border bg-stone-50/50"
              :class="ing.isFragranceOilConcentrate ? 'border-amber-300 bg-amber-50/40' : 'border-stone-200'"
            >
              <div class="flex-1">
                <span class="text-[10px] text-stone-500 block mb-0.5">
                  {{ ing.isFragranceOilConcentrate ? 'Slot Konsentrat Minyak Wangi' : 'Pilih Bahan dari Stock Lainnya' }}
                </span>
                
                <div v-if="ing.isFragranceOilConcentrate" class="px-3 py-1.5 rounded-md bg-amber-100/70 border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <span>Fragrance Oil Concentrate</span>
                </div>
                <CustomSelect
                  v-else
                  v-model="ing.stockCampuranId"
                  :options="campuranOptions"
                  placeholder="-- Pilih Bahan Lainnya --"
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
                    class="w-full px-2.5 py-1.5 text-xs rounded-md border border-stone-300 font-bold font-mono text-stone-900 pr-6"
                  />
                  <span class="absolute right-2 top-1.5 text-stone-400 text-xs font-bold">%</span>
                </div>
              </div>

              <button
                type="button"
                @click="removeIngredientRow(idx)"
                class="text-stone-400 hover:text-rose-600 p-1 text-xs mt-3.5"
                title="Hapus Baris"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
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
            :disabled="totalCalcPercentage !== 100"
            class="px-5 py-2 rounded-lg text-white text-xs font-semibold shadow-xs transition-all"
            :class="totalCalcPercentage === 100 ? 'bg-amber-600 hover:bg-amber-700 cursor-pointer' : 'bg-stone-400 cursor-not-allowed opacity-60'"
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
    ingredients: []
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

function addFoSlot() {
  if (form.value.ingredients.some(i => i.isFragranceOilConcentrate)) {
    store.showToast('Slot Konsentrat FO sudah ada di formula', 'info');
    return;
  }
  form.value.ingredients.unshift({
    id: 'ing-fo-' + Date.now(),
    namaBahan: 'Fragrance Oil Concentrate',
    percentage: 20,
    isFragranceOilConcentrate: true
  });
}

function addIngredientRow() {
  form.value.ingredients.push({
    id: 'ing-' + Date.now(),
    namaBahan: '',
    stockCampuranId: undefined,
    percentage: 0,
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
