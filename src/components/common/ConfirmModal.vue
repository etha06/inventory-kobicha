<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-stone-950/50 flex items-center justify-center p-4"
        @click.self="$emit('cancel')"
      >
        <div class="bg-white rounded-[24px] shadow-2xl border border-stone-200 max-w-md w-full p-6 transition-all transform duration-150">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 font-bold border border-rose-200">
            <Trash2 class="w-6 h-6" />
          </div>
          <h3 class="text-base sm:text-lg font-bold text-center text-stone-900 font-serif mb-2">{{ title }}</h3>
          <p class="text-xs sm:text-sm text-center text-stone-600 mb-6">{{ message }}</p>
          <div class="flex items-center justify-center gap-3">
            <button
              @click="$emit('cancel')"
              class="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium text-xs transition-colors"
            >
              Batal
            </button>
            <button
              @click="$emit('confirm')"
              class="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-colors"
            >
              {{ confirmText || 'Ya, Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
}>();

defineEmits(['confirm', 'cancel']);
</script>
