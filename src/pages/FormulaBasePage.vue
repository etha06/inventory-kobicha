<template>
  <div class="space-y-6">
    <!-- Top Action Card -->
    <div class="bg-white p-5 rounded-[24px] border border-sage-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-extrabold text-forest-900 font-rounded">Katalog Formula Base (Template Pelarut)</h3>
        <p class="text-xs text-sage-600">Standar rasio konsentrat bibit parfum & bahan pelarut (total komposisi 100%)</p>
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
            
            <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100">
              <button
                @click="openEditModal(base)"
                class="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-xs transition-colors"
                title="Edit Formula Base"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                @click="confirmDelete(base)"
                class="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:bg-rose-50 text-xs transition-colors"
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
                <span :class="ing.isFragranceOilConcentrate ? 'font-bold text-amber-900 flex items-center gap-1' : 'text-stone-700'">
                  <span v-if="ing.isFragranceOilConcentrate">💧</span>
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
            class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs transition-colors border border-amber-200/80 flex items-center gap-1.5"
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
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Deskripsi Formula (Opsional)</label>
          <textarea
            v-model="form.deskripsi"
            rows="2"
            placeholder="Karakteristik ketahanan, panduan maturasi, rekomendasi penggunaan..."
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          ></textarea>
        </div>

        <!-- 100% Progress Indicator -->
        <div class="p-4 rounded-xl border transition-all" :class="totalCalcPercentage === 100 ? 'bg-emerald-50/80 border-emerald-300' : 'bg-amber-50 border-amber-300'">
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
          <div class="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-200"
              :class="totalCalcPercentage === 100 ? 'bg-emerald-600' : totalCalcPercentage > 100 ? 'bg-rose-600' : 'bg-amber-600'"
              :style="{ width: Math.min(totalCalcPercentage, 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Ingredients Input List -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-stone-900 uppercase tracking-wider">
              Komposisi Bahan & Persentase (%):
            </label>
            <button
              type="button"
              @click="addIngredientRow"
              class="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
            >
              <Plus class="w-3 h-3" />
              <span>Tambah Bahan Campuran</span>
            </button>
          </div>

          <div class="space-y-2">
            <div
              v-for="(ing, idx) in form.ingredients"
              :key="ing.id"
              class="flex items-center gap-2 p-2.5 rounded-xl border bg-stone-50/50"
              :class="ing.isFragranceOilConcentrate ? 'border-amber-300 bg-amber-50/40' : 'border-stone-200'"
            >
              <div class="flex-1">
                <span class="text-[10px] text-stone-500 block mb-0.5">
                  {{ ing.isFragranceOilConcentrate ? 'Slot Konsentrat Minyak Wangi' : 'Pilih Bahan dari Stok Campuran' }}
                </span>
                
                <div v-if="ing.isFragranceOilConcentrate" class="px-3 py-1.5 rounded-lg bg-amber-100/70 border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <span>💧 Fragrance Oil Concentrate</span>
                </div>
                <select
                  v-else
                  v-model="ing.stockCampuranId"
                  @change="onSelectCampuran(ing)"
                  required
                  class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                >
                  <option value="">-- Pilih Bahan Campuran --</option>
                  <option v-for="c in stockCampuran" :key="c.id" :value="c.id">
                    {{ c.namaBarang }} ({{ c.jenis }})
                  </option>
                </select>
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
                    class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 font-bold font-mono text-stone-900 pr-6"
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
          </div>
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
            :disabled="totalCalcPercentage !== 100"
            class="px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-sm transition-all"
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
import { Plus, Pencil, Trash2, FlaskConical, X } from 'lucide-vue-next';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';

const store = useKobichaStore();
const { formulaBases, stockCampuran } = storeToRefs(store);

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
