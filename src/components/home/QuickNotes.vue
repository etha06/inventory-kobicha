<template>
  <div class="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold">
          📝
        </div>
        <div>
          <h3 class="font-bold text-stone-900 text-base">Quick Notes & Scratchpad</h3>
          <p class="text-xs text-stone-500">Catat ide formula, reminder belanja, atau evaluasi aroma</p>
        </div>
      </div>

      <button
        @click="openNewNoteModal"
        class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
      >
        <span>+</span> Tambah Catatan
      </button>
    </div>

    <!-- Notes List / Grid -->
    <div class="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[420px]">
      <div v-if="quickNotes.length === 0" class="h-48 flex flex-col items-center justify-center text-stone-400 text-center">
        <span class="text-3xl mb-2">📋</span>
        <p class="text-sm">Belum ada catatan. Klik "Tambah Catatan" untuk mulai mencatat ide.</p>
      </div>

      <div
        v-for="note in sortedNotes"
        :key="note.id"
        class="p-4 rounded-xl border transition-all relative group"
        :class="[
          note.isPinned ? 'border-amber-300 bg-amber-50/50 shadow-sm' : 'border-stone-200/90 bg-stone-50/40 hover:bg-stone-50'
        ]"
      >
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <button
              @click="togglePin(note)"
              class="text-sm transition-transform hover:scale-125"
              :title="note.isPinned ? 'Lepas Pin' : 'Sematkan ke Atas'"
            >
              <span v-if="note.isPinned">📌</span>
              <span v-else class="opacity-30 group-hover:opacity-80">📍</span>
            </button>
            <h4 class="font-bold text-stone-900 text-sm leading-snug">{{ note.title }}</h4>
          </div>

          <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100">
            <button
              @click="editNote(note)"
              class="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 text-xs"
              title="Edit"
            >
              ✏️
            </button>
            <button
              @click="store.deleteQuickNote(note.id)"
              class="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 text-xs"
              title="Hapus"
            >
              🗑️
            </button>
          </div>
        </div>

        <p class="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
          {{ note.content }}
        </p>

        <div class="mt-3 pt-2 border-t border-stone-200/50 flex items-center justify-between text-[10px] text-stone-400">
          <span>{{ formatDateIndo(note.updatedAt || note.createdAt) }}</span>
          <span v-if="note.isPinned" class="font-semibold text-amber-700 uppercase tracking-wider">Pinned</span>
        </div>
      </div>
    </div>

    <!-- Note Create/Edit Modal -->
    <Modal
      :isOpen="isModalOpen"
      :title="isEditing ? 'Edit Catatan' : 'Tambah Catatan Baru'"
      subtitle="Simpan ide racikan dan catatan penting"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="saveNote" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Judul Catatan</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Misal: Evaluasi Batch Vanilla Citrus..."
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Isi Catatan</label>
          <textarea
            v-model="form.content"
            rows="5"
            required
            placeholder="Tulis detail catatan, perbandingan aroma, atau ide eksperimen..."
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          ></textarea>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="pinnedCheckbox"
            v-model="form.isPinned"
            type="checkbox"
            class="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <label for="pinnedCheckbox" class="text-xs font-medium text-stone-700 cursor-pointer">
            📌 Sematkan catatan ini di bagian atas
          </label>
        </div>

        <div class="pt-2 flex justify-end gap-2">
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
            Simpan Catatan
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
import { QuickNote } from '../../types';
import { formatDateIndo } from '../../utils/formatters';
import Modal from '../common/Modal.vue';

const store = useKobichaStore();
const { quickNotes } = storeToRefs(store);

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  title: '',
  content: '',
  isPinned: false
});

const sortedNotes = computed(() => {
  return [...quickNotes.value].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

function openNewNoteModal() {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    title: '',
    content: '',
    isPinned: false
  };
  isModalOpen.value = true;
}

function editNote(note: QuickNote) {
  isEditing.value = true;
  editingId.value = note.id;
  form.value = {
    title: note.title,
    content: note.content,
    isPinned: note.isPinned
  };
  isModalOpen.value = true;
}

function togglePin(note: QuickNote) {
  store.updateQuickNote(note.id, { isPinned: !note.isPinned });
}

function saveNote() {
  if (!form.value.title.trim()) return;
  if (isEditing.value && editingId.value) {
    store.updateQuickNote(editingId.value, {
      title: form.value.title,
      content: form.value.content,
      isPinned: form.value.isPinned
    });
  } else {
    store.addQuickNote({
      title: form.value.title,
      content: form.value.content,
      isPinned: form.value.isPinned
    });
  }
  isModalOpen.value = false;
}
</script>
