<template>
  <div class="space-y-6">
    <!-- Top Action Card -->
    <div class="bg-white p-5 rounded-[24px] border border-sage-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-extrabold text-forest-900 font-rounded">Kalkulator Racikan Fragrance (Formulator)</h3>
        <p class="text-xs text-sage-600">
          Kalkulasi porsi tetes, konversi ke ml konsentrat bibit FO, dan estimasi otomatis formula parfum
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="resetForm"
          class="px-3.5 py-2 rounded-2xl bg-sage-50 hover:bg-sage-100 text-forest-800 text-xs font-semibold border border-sage-200 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>
        <button
          @click="saveRacikan"
          class="px-5 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5"
        >
          <Save class="w-4 h-4" />
          <span>Simpan ke Katalog Racikan</span>
        </button>
      </div>
    </div>

    <!-- Formula Mode Selector & General Configurations -->
    <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-5">
      <!-- Mode Toggle -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sage-100 pb-4">
        <div>
          <label class="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-0.5">Mode Formulasi:</label>
          <p class="text-xs text-sage-600">Pilih Racik Manual atau By Resep yang sudah tersimpan di Katalog</p>
        </div>

        <div class="flex items-center gap-2 bg-sage-50 p-1 rounded-2xl text-xs font-semibold border border-sage-200/60">
          <button
            type="button"
            @click="setMode('manual')"
            class="px-4 py-2 rounded-xl transition-all"
            :class="mode === 'manual' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900'"
          >
            Mode Manual (Bebas)
          </button>
          <button
            type="button"
            @click="setMode('by_resep')"
            class="px-4 py-2 rounded-xl transition-all"
            :class="mode === 'by_resep' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900'"
          >
            Mode By Resep Katalog
          </button>
        </div>
      </div>

      <!-- Mode By Resep Selector -->
      <div v-if="mode === 'by_resep'" class="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
        <label class="block text-xs font-bold text-amber-950">Pilih Racikan dari Katalog Racikan Fragrance:</label>
        <select
          v-model="selectedRacikanCatalogId"
          @change="loadRecipeFromCatalog"
          class="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-300 bg-white font-medium focus:ring-2 focus:ring-amber-500/30"
        >
          <option value="">-- Pilih Resep Racikan --</option>
          <option v-for="r in racikanCatalog" :key="r.id" :value="r.id">
            {{ r.nama }} ({{ r.tanggalDibuat }}) - {{ r.fragranceOils.length }} FO
          </option>
        </select>
      </div>

      <!-- Target Formulation Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Nama Racikan / Formula</label>
          <input
            v-model="namaRacikan"
            type="text"
            required
            placeholder="Misal: Kobicha Velvet Midnight Batch 1"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Target Volume Botol Parfum (ml)</label>
          <div class="relative">
            <input
              v-model.number="targetTotalMl"
              type="number"
              min="1"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-mono font-bold pr-8"
            />
            <span class="absolute right-3 top-2.5 text-stone-400 text-xs font-bold">ml</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Konsentrasi Fragrance Oil (%)</label>
          <div class="relative">
            <input
              v-model.number="foConcentrationPercentage"
              type="number"
              min="1"
              max="100"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-mono font-bold pr-8"
            />
            <span class="absolute right-3 top-2.5 text-stone-400 text-xs font-bold">%</span>
          </div>
          <span class="text-[10px] text-stone-400 mt-1 block">
            Target FO: <strong>{{ formatNumber(targetTotalFoMl, 2) }} ml</strong> dari {{ targetTotalMl }} ml
          </span>
        </div>
      </div>

      <!-- Optional Formula Base Template & Commission Toggle -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Formula Base Pelarut (Opsional)</label>
          <select
            v-model="selectedBaseId"
            @change="applyBaseTemplate"
            class="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium"
          >
            <option value="">-- Bebas / Tanpa Formula Base --</option>
            <option v-for="b in formulaBases" :key="b.id" :value="b.id">
              {{ b.nama }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-3 pt-4 sm:pt-6">
          <input
            v-model="isCommission"
            type="checkbox"
            id="commCheck"
            class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer w-4 h-4"
          />
          <label for="commCheck" class="text-xs font-semibold text-stone-700 cursor-pointer">
            ✨ Pesanan Kustom Klien (Commission Order)
          </label>
        </div>
      </div>
    </div>

    <!-- INGREDIENTS TABLE (Fragrance Oils Drops Input) -->
    <div class="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <h4 class="text-sm font-bold text-stone-900 font-serif">Komposisi Fragrance Oil (Tetes & Persentase FO)</h4>
          <p class="text-xs text-stone-500">
            Input jumlah tetes bibit FO. Volume ml dan rasio % akan dihitung proporsional terhadap target {{ targetTotalFoMl }} ml
          </p>
        </div>

        <button
          type="button"
          @click="addRow"
          class="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Baris FO</span>
        </button>
      </div>

      <!-- Drops & Volume Table -->
      <div class="overflow-x-auto border rounded-xl">
        <table class="w-full text-xs text-left">
          <thead class="bg-stone-100/70 border-b text-[10px] text-stone-500 uppercase font-bold">
            <tr>
              <th class="py-2.5 px-3">Nama Fragrance Oil</th>
              <th class="py-2.5 px-3 text-center">Pyramid</th>
              <th class="py-2.5 px-3 text-center w-28">Jumlah Tetes</th>
              <th class="py-2.5 px-3 text-center w-28">Porsi (% FO)</th>
              <th class="py-2.5 px-3 text-center w-32">Volume (ml)</th>
              <th class="py-2.5 px-3 text-right w-36">Estimasi Biaya FO</th>
              <th class="py-2.5 px-4 text-left w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y text-stone-800">
            <tr v-if="rows.length === 0">
              <td colspan="7" class="py-8 text-center text-stone-400 italic">
                Belum ada bahan Fragrance Oil. Klik "+ Tambah Baris FO" untuk menambahkan bibit parfum.
              </td>
            </tr>

            <tr v-for="(row, idx) in calculatedRows" :key="row.id" class="hover:bg-stone-50">
              <!-- Select Fragrance Oil -->
              <td class="py-2 px-3">
                <select
                  v-model="row.fragranceOilId"
                  @change="onFoSelect(row)"
                  class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 font-medium"
                >
                  <option value="">-- Pilih Fragrance Oil --</option>
                  <option v-for="fo in stockFragranceOil" :key="fo.id" :value="fo.id">
                    {{ fo.nama }} ({{ fo.storeName }})
                  </option>
                </select>
              </td>

              <!-- Pyramid Badge (Without "Note" word) -->
              <td class="py-2 px-3 text-center">
                <span
                  v-if="row.pyramid"
                  class="px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap"
                  :class="PYRAMID_BADGE_MAP[row.pyramid]?.bg"
                >
                  {{ row.pyramid }}
                </span>
                <span v-else class="text-stone-300 text-xs">-</span>
              </td>

              <!-- Jumlah Tetes -->
              <td class="py-2 px-3 text-center">
                <input
                  v-model.number="row.tetes"
                  type="number"
                  min="1"
                  required
                  class="w-20 px-2 py-1 text-xs border rounded-lg text-center font-mono font-bold"
                />
              </td>

              <!-- % FO -->
              <td class="py-2 px-3 text-center font-mono font-semibold text-amber-950">
                {{ formatNumber(row.percentage, 1) }}%
              </td>

              <!-- ml FO -->
              <td class="py-2 px-3 text-center font-mono font-bold text-stone-900 bg-amber-50/50">
                {{ formatNumber(row.mlCalculated, 2) }} ml
              </td>

              <!-- Estimasi Biaya FO -->
              <td class="py-2 px-3 text-right font-mono text-stone-700">
                {{ formatRupiah(row.estimatedCost) }}
              </td>

              <!-- Delete Row Action (Positioned Right, Aligned Left, Lucide Trash2) -->
              <td class="py-2 px-4 text-left">
                <button
                  type="button"
                  @click="removeRow(idx)"
                  class="p-1 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 text-xs transition-colors"
                  title="Hapus Baris FO"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-stone-50 border-t font-bold text-stone-900">
            <tr>
              <td class="py-2.5 px-3">Total Komposisi FO:</td>
              <td></td>
              <td class="py-2.5 px-3 text-center font-mono text-amber-950">{{ totalDrops }} Tetes</td>
              <td class="py-2.5 px-3 text-center font-mono text-amber-950">100%</td>
              <td class="py-2.5 px-3 text-center font-mono text-amber-950">{{ formatNumber(targetTotalFoMl, 2) }} ml</td>
              <td class="py-2.5 px-3 text-right font-mono text-amber-950">{{ formatRupiah(totalFoCost) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- SUMMARY CARD -->
    <div class="bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-800 pb-6">
        <div>
          <span class="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            🧪 Ringkasan Formula Botol {{ targetTotalMl }} ml
          </span>
          <h3 class="text-2xl font-bold font-serif text-white">
            {{ namaRacikan || 'Nama Racikan Baru' }}
          </h3>
          <p class="text-xs text-stone-300 mt-1">
            Konsentrasi FO: {{ foConcentrationPercentage }}% ({{ targetTotalFoMl }} ml) • Pelarut Base: {{ targetTotalMl - targetTotalFoMl }} ml
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-stone-950/80 border border-stone-700/80 px-4 py-3 rounded-2xl text-center">
            <span class="text-[10px] uppercase font-bold text-stone-400 block">Total Tetes FO</span>
            <span class="text-xl font-bold font-mono text-amber-400">{{ totalDrops }} Tetes</span>
          </div>

          <div class="bg-stone-950/80 border border-stone-700/80 px-4 py-3 rounded-2xl text-center">
            <span class="text-[10px] uppercase font-bold text-stone-400 block">Estimasi Modal FO</span>
            <span class="text-xl font-bold font-mono text-white">{{ formatRupiah(totalFoCost) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div class="text-xs text-stone-400">
          💡 Data racikan dapat langsung disimpan atau diteruskan ke Kalkulator HPP untuk menghitung biaya botol & packaging.
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="saveAndGoToHpp"
            class="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold border border-stone-700 transition-all flex items-center gap-1.5"
          >
            <DollarSign class="w-3.5 h-3.5" />
            <span>Lanjut Hitung HPP</span>
          </button>

          <button
            @click="saveRacikan"
            class="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-950/50 transition-all flex items-center gap-1.5"
          >
            <Save class="w-4 h-4" />
            <span>Simpan ke Katalog</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { RacikanItem, NotesEnum, PyramidEnum } from '../types';
import { PYRAMID_BADGE_MAP } from '../utils/constants';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { Plus, RotateCcw, Save, Trash2, DollarSign } from 'lucide-vue-next';

const store = useKobichaStore();
const { stockFragranceOil, formulaBases, racikanCatalog, prefilledRacikanId } = storeToRefs(store);

const mode = ref<'manual' | 'by_resep'>('manual');
const selectedRacikanCatalogId = ref('');
const selectedBaseId = ref('');

const namaRacikan = ref('');
const targetTotalMl = ref(50);
const foConcentrationPercentage = ref(20);
const isCommission = ref(false);

interface FormFoRow {
  id: string;
  fragranceOilId: string;
  fragranceOilName: string;
  pyramid?: PyramidEnum;
  tetes: number;
}

const rows = ref<FormFoRow[]>([
  { id: 'row-1', fragranceOilId: '', fragranceOilName: '', tetes: 10 },
  { id: 'row-2', fragranceOilId: '', fragranceOilName: '', tetes: 15 }
]);

const targetTotalFoMl = computed(() => {
  return (targetTotalMl.value * foConcentrationPercentage.value) / 100;
});

const totalDrops = computed(() => {
  return rows.value.reduce((acc, r) => acc + (Number(r.tetes) || 0), 0);
});

const calculatedRows = computed(() => {
  const dropsTotal = totalDrops.value || 1;
  const targetFo = targetTotalFoMl.value;

  return rows.value.map(r => {
    const fo = stockFragranceOil.value.find(f => f.id === r.fragranceOilId);
    const percentage = ((Number(r.tetes) || 0) / dropsTotal) * 100;
    const mlCalculated = (percentage / 100) * targetFo;
    const avgPricePerMl = fo ? store.getFoAveragePricePerMl(fo.id) : 2000;
    const estimatedCost = Math.round(mlCalculated * avgPricePerMl);

    return {
      ...r,
      fragranceOilName: fo?.nama || r.fragranceOilName,
      pyramid: fo?.pyramid,
      percentage,
      mlCalculated,
      estimatedCost
    };
  });
});

const totalFoCost = computed(() => {
  return calculatedRows.value.reduce((acc, r) => acc + r.estimatedCost, 0);
});

function addRow() {
  rows.value.push({
    id: 'row-' + Date.now(),
    fragranceOilId: '',
    fragranceOilName: '',
    tetes: 5
  });
}

function removeRow(idx: number) {
  rows.value.splice(idx, 1);
}

function onFoSelect(row: FormFoRow) {
  const fo = stockFragranceOil.value.find(f => f.id === row.fragranceOilId);
  if (fo) {
    row.fragranceOilName = fo.nama;
    row.pyramid = fo.pyramid;
  }
}

function setMode(m: 'manual' | 'by_resep') {
  mode.value = m;
  if (m === 'by_resep' && racikanCatalog.value.length > 0 && !selectedRacikanCatalogId.value) {
    selectedRacikanCatalogId.value = racikanCatalog.value[0].id;
    loadRecipeFromCatalog();
  }
}

function loadRecipeFromCatalog() {
  const r = racikanCatalog.value.find(x => x.id === selectedRacikanCatalogId.value);
  if (!r) return;

  namaRacikan.value = r.nama;
  targetTotalMl.value = r.targetTotalMl || 50;
  foConcentrationPercentage.value = r.foConcentrationPercentage || 20;
  isCommission.value = r.isCommission || false;
  selectedBaseId.value = r.formulaBaseId || '';

  rows.value = r.fragranceOils.map(fo => {
    const matchedFo = stockFragranceOil.value.find(f => f.id === fo.fragranceOilId);
    return {
      id: 'row-' + Math.random(),
      fragranceOilId: fo.fragranceOilId,
      fragranceOilName: fo.fragranceOilName,
      pyramid: matchedFo?.pyramid,
      tetes: fo.tetes
    };
  });
}

function applyBaseTemplate() {
  const base = formulaBases.value.find(b => b.id === selectedBaseId.value);
  if (base) {
    const foIng = base.ingredients.find(i => i.isFragranceOilConcentrate);
    if (foIng) {
      foConcentrationPercentage.value = foIng.percentage;
    }
  }
}

function resetForm() {
  mode.value = 'manual';
  selectedRacikanCatalogId.value = '';
  selectedBaseId.value = '';
  namaRacikan.value = '';
  targetTotalMl.value = 50;
  foConcentrationPercentage.value = 20;
  isCommission.value = false;

  rows.value = [
    { id: 'row-1', fragranceOilId: stockFragranceOil.value[0]?.id || '', fragranceOilName: stockFragranceOil.value[0]?.nama || '', tetes: 12 },
    { id: 'row-2', fragranceOilId: stockFragranceOil.value[1]?.id || '', fragranceOilName: stockFragranceOil.value[1]?.nama || '', tetes: 8 }
  ];
}

function saveRacikan() {
  if (!namaRacikan.value.trim()) {
    store.showToast('Silakan masukkan nama racikan terlebih dahulu', 'warning');
    return;
  }

  const validRows = calculatedRows.value.filter(r => r.fragranceOilId);
  if (validRows.length === 0) {
    store.showToast('Pilih minimal 1 Fragrance Oil yang valid', 'warning');
    return;
  }

  const base = formulaBases.value.find(b => b.id === selectedBaseId.value);

  // Aggregate unique notes
  const notesSet = new Set<NotesEnum>();
  validRows.forEach(r => {
    const fo = stockFragranceOil.value.find(f => f.id === r.fragranceOilId);
    if (fo && fo.notes) {
      fo.notes.forEach(n => notesSet.add(n));
    }
  });

  const foPayload: RacikanItem[] = validRows.map(r => ({
    id: r.id,
    fragranceOilId: r.fragranceOilId,
    fragranceOilName: r.fragranceOilName,
    tetes: r.tetes,
    calculatedPercentage: r.percentage,
    calculatedMl: r.mlCalculated
  }));

  const now = new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const bulanTahun = `${months[now.getMonth()]} ${now.getFullYear()}`;

  store.addRacikanFragrance({
    nama: namaRacikan.value,
    formulaBaseId: selectedBaseId.value || undefined,
    formulaBaseName: base?.nama || undefined,
    targetTotalMl: targetTotalMl.value,
    foConcentrationPercentage: foConcentrationPercentage.value,
    fragranceOils: foPayload,
    notes: Array.from(notesSet),
    tanggalDibuat: bulanTahun,
    isCommission: isCommission.value
  });

  store.navigateTo('katalog-racikan');
}

function saveAndGoToHpp() {
  saveRacikan();
  const latest = racikanCatalog.value[racikanCatalog.value.length - 1];
  if (latest) {
    store.openHppWithRacikan(latest.id, latest.formulaBaseId);
  }
}

onMounted(() => {
  if (prefilledRacikanId.value) {
    mode.value = 'by_resep';
    selectedRacikanCatalogId.value = prefilledRacikanId.value;
    loadRecipeFromCatalog();
    prefilledRacikanId.value = null;
  } else if (stockFragranceOil.value.length > 0 && rows.value[0].fragranceOilId === '') {
    rows.value[0].fragranceOilId = stockFragranceOil.value[0].id;
    rows.value[0].fragranceOilName = stockFragranceOil.value[0].nama;
    if (stockFragranceOil.value.length > 1) {
      rows.value[1].fragranceOilId = stockFragranceOil.value[1].id;
      rows.value[1].fragranceOilName = stockFragranceOil.value[1].nama;
    }
  }
});
</script>
