<template>
  <div class="space-y-8">
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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Katalog Racikan Fragrance (Formula Resep)</h3>
          <p class="text-xs text-sage-600">Database resep racikan aroma parfum, perbandingan tetes, dan komparasi formula</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="store.navigateTo('kalkulator-racikan')"
          class="px-4 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5"
        >
          <FlaskConical class="w-4 h-4" />
          <span>Racik Formula Baru di Kalkulator</span>
        </button>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white p-4 rounded-[20px] border border-sage-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama racikan / bahan FO..."
          class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
        />
        <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
      </div>

      <!-- Filter Commission -->
      <div>
        <CustomSelect
          v-model="filterCommission"
          :options="commissionOptions"
          placeholder="Semua Tipe Resep"
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

    <!-- Table Racikan -->
    <div class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-3 w-10 text-left"></th>
              <th class="py-3.5 px-4 text-left">Nama Racikan</th>
              <th class="py-3.5 px-4 text-left">Fragrance Oil yang Dipakai</th>
              <th class="py-3.5 px-4 text-left">Notes (Labels)</th>
              <th class="py-3.5 px-4 text-left">Tanggal Dibuat</th>
              <th class="py-3.5 px-4 text-left">Tipe</th>
              <th class="py-3.5 px-4 text-left w-28">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="filteredRacikan.length === 0">
              <td colspan="7" class="py-12 text-center text-stone-400">
                <Scroll class="w-8 h-8 mx-auto mb-2 opacity-50" />
                Belum ada data racikan parfum. Gunakan kalkulator racikan untuk membuat dan menyimpan resep.
              </td>
            </tr>

            <tr
              v-for="racikan in filteredRacikan"
              :key="racikan.id"
              class="table-row-hover transition-colors"
              :class="selectedForCompare.includes(racikan.id) ? 'bg-amber-50/60 font-medium' : ''"
            >
              <!-- Checkbox Compare -->
              <td class="py-3.5 px-4 text-left" @click.stop>
                <input
                  type="checkbox"
                  :value="racikan.id"
                  v-model="selectedForCompare"
                  class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  title="Centang untuk bandingkan"
                />
              </td>

              <!-- Nama Racikan -->
              <td class="py-3.5 px-4 text-left">
                <div class="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <span>{{ racikan.nama }}</span>
                </div>
                <div v-if="racikan.formulaBaseName" class="text-[10px] text-stone-500 mt-0.5">
                  Base: {{ racikan.formulaBaseName }}
                </div>
              </td>

              <!-- Fragrance Oils Dipakai -->
              <td class="py-3.5 px-4 text-left">
                <div class="space-y-1 max-w-[260px]">
                  <div
                    v-for="fo in racikan.fragranceOils"
                    :key="fo.id"
                    class="text-[11px] flex items-center justify-between bg-stone-50 px-2 py-0.5 rounded border border-stone-200"
                  >
                    <span class="text-stone-800 truncate mr-2">{{ fo.fragranceOilName }}</span>
                    <span class="font-bold font-mono text-amber-800 flex-shrink-0">{{ fo.tetes }} tetes</span>
                  </div>
                </div>
              </td>

              <!-- Notes Labels -->
              <td class="py-3.5 px-4 text-left">
                <div class="flex flex-wrap gap-1 max-w-[180px]">
                  <span
                    v-for="n in racikan.notes"
                    :key="n"
                    class="px-1.5 py-0.5 rounded text-[10px] font-medium border"
                    :class="[NOTE_COLOR_MAP[n]?.bg, NOTE_COLOR_MAP[n]?.text, NOTE_COLOR_MAP[n]?.border]"
                  >
                    {{ n }}
                  </span>
                </div>
              </td>

              <!-- Tanggal Dibuat (Bulan Tahun) -->
              <td class="py-3.5 px-4 text-left font-medium text-stone-700 whitespace-nowrap">
                {{ racikan.tanggalDibuat }}
              </td>

              <!-- Commission Badge -->
              <td class="py-3.5 px-4 text-left">
                <span
                  v-if="racikan.isCommission"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-block"
                >
                  Commission
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200 inline-block"
                >
                  Regular
                </span>
              </td>

                <!-- Action Buttons (Positioned Right, Aligned Left, Lucide Icons) -->
                <td class="py-3.5 px-4 text-left" @click.stop>
                  <div class="flex items-center justify-start gap-1.5">
                    <button
                      @click="openInCalculator(racikan.id)"
                      class="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200 text-xs transition-colors"
                      title="Buka & Edit Racikan di Kalkulator"
                    >
                      <FlaskConical class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="calculateHpp(racikan)"
                      class="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-200 text-xs transition-colors"
                      title="Hitung HPP Resep Ini"
                    >
                      <DollarSign class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="confirmDelete(racikan)"
                      class="p-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs transition-colors"
                      title="Hapus Resep"
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

    <!-- ========================================================= -->
    <!-- COMPARE SECTION (Side-by-Side Comparison Cards at Bottom) -->
    <!-- ========================================================= -->
    <div class="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-2">
            <Scale class="w-3.5 h-3.5" />
            <span>Fitur Komparasi Formula</span>
          </div>
          <h3 class="text-xl font-bold font-serif text-white">Bandingkan Racikan Fragrance (Side-by-Side)</h3>
          <p class="text-xs text-stone-400 mt-1">Centang 2 atau lebih resep di tabel atas untuk membandingkan piramida tetes dan aroma</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-stone-400 font-mono">
            {{ selectedForCompare.length }} Resep Dipilih
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
        Pilih minimal 2 racikan dari tabel di atas untuk melihat perbandingan side-by-side di sini.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="r in compareList"
          :key="r.id"
          class="bg-stone-800/90 rounded-2xl border border-stone-700/80 p-5 space-y-4 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-2 border-b border-stone-700/60 pb-3">
              <div>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {{ r.tanggalDibuat }}
                </span>
                <h4 class="text-base font-bold text-white font-serif mt-1">{{ r.nama }}</h4>
                <p v-if="r.formulaBaseName" class="text-xs text-stone-400">{{ r.formulaBaseName }}</p>
              </div>
              <button
                @click="removeFromCompare(r.id)"
                class="text-stone-400 hover:text-stone-200 text-xs p-1"
                title="Hapus dari perbandingan"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Notes Tags -->
            <div class="mt-3">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Aroma Notes:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="n in r.notes"
                  :key="n"
                  class="px-1.5 py-0.5 rounded text-[10px] font-medium border"
                  :class="[NOTE_COLOR_MAP[n]?.bg, NOTE_COLOR_MAP[n]?.text, NOTE_COLOR_MAP[n]?.border]"
                >
                  {{ n }}
                </span>
              </div>
            </div>

            <!-- FO Drops List & Percentages -->
            <div class="mt-4 space-y-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Komposisi Tetes (Total: {{ getTotalDrops(r) }} Tetes):
              </span>
              
              <div class="space-y-1.5">
                <div
                  v-for="fo in r.fragranceOils"
                  :key="fo.id"
                  class="bg-stone-900/80 p-2 rounded-xl border border-stone-700/50 space-y-1"
                >
                  <div class="flex justify-between text-xs">
                    <span class="text-stone-200 font-medium truncate mr-2">{{ fo.fragranceOilName }}</span>
                    <span class="font-bold text-amber-400 font-mono">
                      {{ fo.tetes }} tetes ({{ Math.round((fo.tetes / Math.max(getTotalDrops(r), 1)) * 100) }}%)
                    </span>
                  </div>
                  <div class="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-amber-500 rounded-full"
                      :style="{ width: Math.round((fo.tetes / Math.max(getTotalDrops(r), 1)) * 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action inside Compare Card -->
          <div class="pt-3 border-t border-stone-700/60 flex items-center justify-between">
            <span class="text-[11px] text-stone-400">
              {{ r.isCommission ? '✨ Commission Order' : '🌿 Regular Formula' }}
            </span>
            <button
              @click="openInCalculator(r.id)"
              class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Buka di Kalkulator</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Hapus Resep Racikan?"
      :message="`Apakah Anda yakin ingin menghapus resep '${racikanToDelete?.nama}' dari katalog?`"
      @confirm="doDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { RacikanFragrance, NotesEnum } from '../types';
import { NOTES_OPTIONS, NOTE_COLOR_MAP } from '../utils/constants';
import { FlaskConical, Search, DollarSign, Trash2, Scale, Scroll, X, Menu } from 'lucide-vue-next';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import CustomSelect from '../components/common/CustomSelect.vue';

const store = useKobichaStore();
const { racikanCatalog } = storeToRefs(store);

const searchQuery = ref('');
const filterCommission = ref('');
const filterNotes = ref('');
const selectedForCompare = ref<string[]>([]);

const commissionOptions = [
  { value: '', label: 'Semua Tipe Resep' },
  { value: 'regular', label: 'Formula Reguler / House Signature' },
  { value: 'commission', label: 'Pesanan Kustom (Commission)' }
];

const notesOptions = [
  { value: '', label: 'Semua Olfactory Notes' },
  ...NOTES_OPTIONS.map(n => ({ value: n, label: n }))
];

const filteredRacikan = computed(() => {
  let list = [...racikanCatalog.value];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(r => 
      r.nama.toLowerCase().includes(q) ||
      r.fragranceOils.some(f => f.fragranceOilName.toLowerCase().includes(q))
    );
  }

  if (filterCommission.value === 'commission') {
    list = list.filter(r => r.isCommission);
  } else if (filterCommission.value === 'regular') {
    list = list.filter(r => !r.isCommission);
  }

  if (filterNotes.value) {
    list = list.filter(r => r.notes.includes(filterNotes.value as NotesEnum));
  }

  return list;
});

const compareList = computed(() => {
  return racikanCatalog.value.filter(r => selectedForCompare.value.includes(r.id));
});

function removeFromCompare(id: string) {
  selectedForCompare.value = selectedForCompare.value.filter(x => x !== id);
}

function getTotalDrops(r: RacikanFragrance): number {
  return r.fragranceOils.reduce((acc, fo) => acc + (Number(fo.tetes) || 0), 0);
}

function openInCalculator(racikanId: string) {
  store.openCalculatorWithRacikan(racikanId);
}

function calculateHpp(r: RacikanFragrance) {
  store.openHppWithRacikan(r.id, r.formulaBaseId);
}

// Delete State
const isDeleteModalOpen = ref(false);
const racikanToDelete = ref<RacikanFragrance | null>(null);

function confirmDelete(r: RacikanFragrance) {
  racikanToDelete.value = r;
  isDeleteModalOpen.value = true;
}

function doDelete() {
  if (racikanToDelete.value) {
    store.deleteRacikanFragrance(racikanToDelete.value.id);
  }
  isDeleteModalOpen.value = false;
}
</script>
