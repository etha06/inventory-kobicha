<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <div class="bg-white rounded-[28px] shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-center transition-all">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border"
            :class="type === 'warning' ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-rose-100 text-rose-600 border-rose-200'"
          >
            <AlertTriangle v-if="type === 'warning'" class="w-7 h-7" />
            <Trash2 v-else class="w-7 h-7" />
          </div>

          <h3 class="text-base sm:text-lg font-bold text-stone-900 font-serif mb-2">
            {{ title }}
          </h3>
          
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
            {{ message }}
          </p>

          <div class="flex items-center justify-center gap-3">
            <button
              type="button"
              @click="handleCancel"
              class="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors"
            >
              {{ cancelText || 'Batal' }}
            </button>
            <button
              type="button"
              @click="handleConfirm"
              class="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-95"
              :class="type === 'warning' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'"
            >
              {{ confirmText || 'Ya, Yakin Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Trash2, AlertTriangle } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'close'): void;
}>();

function handleCancel() {
  emit('cancel');
  emit('close');
}

function handleConfirm() {
  emit('confirm');
}
</script>
