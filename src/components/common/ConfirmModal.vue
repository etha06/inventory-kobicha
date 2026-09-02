<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="$emit('cancel')"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
        <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-4 font-bold">
          🗑️
        </div>
        <h3 class="text-lg font-bold text-center text-stone-900 mb-2">{{ title }}</h3>
        <p class="text-sm text-center text-stone-600 mb-6">{{ message }}</p>
        <div class="flex items-center justify-center gap-3">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium text-sm transition-colors"
          >
            Batal
          </button>
          <button
            @click="$emit('confirm')"
            class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-sm transition-colors"
          >
            {{ confirmText || 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
}>();

defineEmits(['confirm', 'cancel']);
</script>
