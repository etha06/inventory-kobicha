<template>
  <div class="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex flex-col h-full">
    <!-- Calendar Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-sm font-bold">
          📅
        </div>
        <div>
          <h3 class="font-bold text-stone-900 text-base">Interactive Calendar & Deadlines</h3>
          <p class="text-xs text-stone-500">Kelola jadwal maturasi parfum, restock toko, dan deadline pesanan</p>
        </div>
      </div>

      <button
        @click="openAddDeadlineModal(selectedDateStr)"
        class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
      >
        <span>+</span> Tambah Deadline
      </button>
    </div>

    <!-- Month Navigation -->
    <div class="flex items-center justify-between bg-stone-50/80 px-4 py-2.5 rounded-xl border border-stone-200/60 mb-4">
      <button
        @click="prevMonth"
        class="w-7 h-7 rounded-lg hover:bg-stone-200 flex items-center justify-center text-xs text-stone-600 font-bold transition-colors"
      >
        ◀
      </button>
      <span class="font-serif font-bold text-stone-900 text-sm sm:text-base">
        {{ currentMonthName }} {{ currentYear }}
      </span>
      <button
        @click="nextMonth"
        class="w-7 h-7 rounded-lg hover:bg-stone-200 flex items-center justify-center text-xs text-stone-600 font-bold transition-colors"
      >
        ▶
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 text-center mb-4">
      <div v-for="dayName in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" :key="dayName" class="text-[11px] font-bold text-stone-400 py-1 uppercase">
        {{ dayName }}
      </div>

      <!-- Blank Days before start of month -->
      <div v-for="b in startDayOfWeek" :key="'blank-' + b" class="h-9 sm:h-10"></div>

      <!-- Month Days -->
      <div
        v-for="day in daysInMonth"
        :key="'day-' + day"
        @click="selectDay(day)"
        class="h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center text-xs font-medium relative transition-all cursor-pointer group"
        :class="[
          isSelectedDay(day) ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/20' : 
          isToday(day) ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' :
          'hover:bg-stone-100 text-stone-700'
        ]"
      >
        <span>{{ day }}</span>
        <!-- Event Indicator Dots -->
        <div v-if="getDayDeadlines(day).length > 0" class="flex gap-0.5 mt-0.5">
          <span
            v-for="(ev, idx) in getDayDeadlines(day).slice(0, 3)"
            :key="idx"
            class="w-1.5 h-1.5 rounded-full"
            :class="[
              ev.isCompleted ? 'bg-emerald-400' :
              isSelectedDay(day) ? 'bg-white' : 'bg-rose-500'
            ]"
          ></span>
        </div>
      </div>
    </div>

    <!-- Selected Date Details & Deadlines List -->
    <div class="border-t border-stone-200 pt-4 flex-1">
      <div class="flex items-center justify-between mb-2.5">
        <h4 class="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>Agenda Tanggal:</span>
          <span class="text-amber-700 font-serif normal-case text-sm font-bold">{{ selectedDateFormatted }}</span>
        </h4>
        <span class="text-[11px] text-stone-500">
          {{ selectedDayDeadlines.length }} Agenda
        </span>
      </div>

      <div class="space-y-2 overflow-y-auto max-h-44 pr-1">
        <div v-if="selectedDayDeadlines.length === 0" class="p-4 rounded-xl bg-stone-50 text-center text-stone-400 text-xs">
          Tidak ada deadline atau agenda pada tanggal ini.
          <button @click="openAddDeadlineModal(selectedDateStr)" class="block mx-auto mt-1.5 text-amber-700 font-semibold hover:underline">
            + Tambah Agenda
          </button>
        </div>

        <div
          v-for="dl in selectedDayDeadlines"
          :key="dl.id"
          class="p-3 rounded-xl border transition-all flex items-start justify-between gap-2.5"
          :class="dl.isCompleted ? 'bg-stone-50/70 border-stone-200 text-stone-400' : 'bg-white border-amber-200/80 shadow-sm text-stone-800'"
        >
          <div class="flex items-start gap-2.5">
            <input
              type="checkbox"
              :checked="dl.isCompleted"
              @change="store.toggleDeadline(dl.id)"
              class="mt-1 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs" :class="dl.isCompleted ? 'line-through text-stone-400' : 'text-stone-900'">
                  {{ dl.title }}
                </span>
                <span
                  class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  :class="getCategoryBadgeClass(dl.category)"
                >
                  {{ getCategoryText(dl.category) }}
                </span>
              </div>
              <p v-if="dl.notes" class="text-[11px] text-stone-500 mt-0.5">{{ dl.notes }}</p>
              <div v-if="dl.reminderTime" class="text-[10px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
                <span>⏰ Pengingat jam {{ dl.reminderTime }}</span>
              </div>
            </div>
          </div>

          <button
            @click="store.deleteDeadline(dl.id)"
            class="text-stone-400 hover:text-rose-600 p-1 text-xs"
            title="Hapus Agenda"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah Deadline -->
    <Modal
      :isOpen="isAddModalOpen"
      title="Tambah Target Deadline & Pengingat"
      subtitle="Tetapkan tanggal target maturasi, order, atau belanja bahan"
      @close="isAddModalOpen = false"
    >
      <form @submit.prevent="saveDeadline" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Judul / Kegiatan</label>
          <input
            v-model="deadlineForm.title"
            type="text"
            required
            placeholder="Misal: Maturasi Batch 1 Selesai / Pesan Alkohol 96%"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Tanggal</label>
            <input
              v-model="deadlineForm.date"
              type="date"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Jam Pengingat (Opsional)</label>
            <input
              v-model="deadlineForm.reminderTime"
              type="time"
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Kategori Kegiatan</label>
          <select
            v-model="deadlineForm.category"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm bg-white"
          >
            <option value="maturasi">🧪 Maturasi / Maserasi Parfum</option>
            <option value="beli_stok">🛒 Beli / Restock Bahan Baku</option>
            <option value="deadline_order">📦 Deadline Pesanan / Commission</option>
            <option value="lainnya">📌 Lainnya</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Catatan Tambahan (Opsional)</label>
          <textarea
            v-model="deadlineForm.notes"
            rows="2"
            placeholder="Informasi detail batch, jumlah, atau link..."
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          ></textarea>
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <button
            type="button"
            @click="isAddModalOpen = false"
            class="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm"
          >
            Simpan Deadline
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
import { format, startOfMonth, getDaysInMonth, getDay } from 'date-fns';
import { id } from 'date-fns/locale';
import Modal from '../common/Modal.vue';

const store = useKobichaStore();
const { deadlines } = storeToRefs(store);

const currentDate = ref(new Date());
const selectedDate = ref(new Date());

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());

const currentMonthName = computed(() => {
  return format(currentDate.value, 'MMMM', { locale: id });
});

const startDayOfWeek = computed(() => {
  const start = startOfMonth(currentDate.value);
  return getDay(start); // 0 for Sunday
});

const daysInMonth = computed(() => {
  return getDaysInMonth(currentDate.value);
});

function prevMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
}

function selectDay(day: number) {
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day);
}

function isSelectedDay(day: number) {
  return (
    selectedDate.value.getDate() === day &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getFullYear() === currentYear.value
  );
}

function isToday(day: number) {
  const today = new Date();
  return (
    today.getDate() === day &&
    today.getMonth() === currentMonth.value &&
    today.getFullYear() === currentYear.value
  );
}

const selectedDateStr = computed(() => {
  return format(selectedDate.value, 'yyyy-MM-dd');
});

const selectedDateFormatted = computed(() => {
  return format(selectedDate.value, 'EEEE, d MMMM yyyy', { locale: id });
});

function getDayDeadlines(day: number) {
  const dateStr = format(new Date(currentYear.value, currentMonth.value, day), 'yyyy-MM-dd');
  return deadlines.value.filter(d => d.date === dateStr);
}

const selectedDayDeadlines = computed(() => {
  return deadlines.value.filter(d => d.date === selectedDateStr.value);
});

// Modal State
const isAddModalOpen = ref(false);
const deadlineForm = ref({
  title: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  reminderTime: '09:00',
  category: 'maturasi' as 'beli_stok' | 'maturasi' | 'deadline_order' | 'lainnya',
  notes: ''
});

function openAddDeadlineModal(dateStr?: string) {
  deadlineForm.value = {
    title: '',
    date: dateStr || format(new Date(), 'yyyy-MM-dd'),
    reminderTime: '09:00',
    category: 'maturasi',
    notes: ''
  };
  isAddModalOpen.value = true;
}

function saveDeadline() {
  if (!deadlineForm.value.title.trim()) return;
  store.addDeadline({
    title: deadlineForm.value.title,
    date: deadlineForm.value.date,
    reminderTime: deadlineForm.value.reminderTime || undefined,
    category: deadlineForm.value.category,
    isCompleted: false,
    notes: deadlineForm.value.notes || undefined
  });
  isAddModalOpen.value = false;
}

function getCategoryBadgeClass(category: string) {
  switch (category) {
    case 'maturasi': return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'beli_stok': return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'deadline_order': return 'bg-rose-100 text-rose-800 border border-rose-200';
    default: return 'bg-stone-100 text-stone-800 border border-stone-200';
  }
}

function getCategoryText(category: string) {
  switch (category) {
    case 'maturasi': return 'Maturasi';
    case 'beli_stok': return 'Restock';
    case 'deadline_order': return 'Pesanan';
    default: return 'Agenda';
  }
}
</script>
