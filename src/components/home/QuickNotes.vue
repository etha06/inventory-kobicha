<template>
  <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-peach-50 text-peach-600 flex items-center justify-center font-bold border border-peach-200/60">
          <FileText class="w-4 h-4" />
        </div>
        <h3 class="font-extrabold text-forest-900 text-base font-rounded">Notes</h3>
      </div>

      <button
        @click="openNewNoteModal"
        class="w-8 h-8 rounded-full bg-peach-500 hover:bg-peach-600 text-white shadow-pill transition-all transform active:scale-95 flex items-center justify-center flex-shrink-0"
        title="Tambah Catatan"
      >
        <Plus class="w-4 h-4" />
      </button>
    </div>

    <!-- Notes List / Grid -->
    <div class="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[420px]">
      <div v-if="quickNotes.length === 0" class="h-48 flex flex-col items-center justify-center text-sage-400 text-center">
        <FileText class="w-8 h-8 text-sage-300 mb-2" />
        <p class="text-xs">Belum ada catatan. Klik tombol + untuk mulai mencatat ide.</p>
      </div>

      <div
        v-for="note in sortedNotes"
        :key="note.id"
        class="p-4 rounded-2xl border transition-all relative group"
        :class="[
          note.isPinned ? 'border-peach-300 bg-peach-50/40 shadow-sm' : 'border-sage-100 bg-sage-50/30 hover:bg-sage-50/60'
        ]"
      >
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <button
              @click="togglePin(note)"
              class="text-xs transition-transform hover:scale-125"
              :title="note.isPinned ? 'Lepas Pin' : 'Sematkan ke Atas'"
            >
              <Pin class="w-3.5 h-3.5" :class="note.isPinned ? 'text-peach-600 fill-peach-600' : 'text-sage-400'" />
            </button>
            <h4 class="font-bold text-forest-900 text-sm leading-snug">{{ note.title }}</h4>
          </div>

          <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100">
            <button
              @click="editNote(note)"
              class="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs transition-colors"
              title="Edit"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>
            <button
              @click="store.deleteQuickNote(note.id)"
              class="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs transition-colors"
              title="Hapus"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p class="text-xs text-forest-800 whitespace-pre-wrap leading-relaxed">
          {{ note.content }}
        </p>

        <div class="mt-3 pt-2 border-t border-sage-100/70 flex items-center justify-between text-[10px] text-sage-400">
          <span>{{ formatDateIndo(note.updatedAt || note.createdAt) }}</span>
          <span v-if="note.isPinned" class="font-bold text-peach-600 uppercase tracking-wider text-[9px]">Pinned</span>
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
          <label class="block text-xs font-semibold text-forest-800 mb-1">Judul Catatan</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Misal: Evaluasi Batch Vanilla Citrus..."
            class="w-full px-3.5 py-2 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-forest-800 mb-1">Isi Catatan</label>
          <textarea
            v-model="form.content"
            rows="5"
            required
            placeholder="Tulis detail catatan, perbandingan aroma, atau ide eksperimen..."
            class="w-full px-3.5 py-2 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 text-sm"
          ></textarea>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="pinnedCheckbox"
            v-model="form.isPinned"
            type="checkbox"
            class="rounded border-sage-300 text-peach-500 focus:ring-peach-500"
          />
          <label for="pinnedCheckbox" class="text-xs font-medium text-forest-800 cursor-pointer">
            Sematkan catatan ini di bagian atas
          </label>
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 rounded-xl border border-sage-200 text-forest-800 text-xs font-semibold hover:bg-sage-50"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-semibold shadow-sm"
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
import { Plus, FileText, Pin, Pencil, Trash2 } from 'lucide-vue-next';

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
