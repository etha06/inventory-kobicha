<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-4 opacity-0 scale-95"
        enter-to-class="transform translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="transform translate-x-4 opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start gap-3 bg-white text-stone-800 transition-all"
          :class="getTypeClass(toast.type)"
        >
          <div class="mt-0.5 flex-shrink-0">
            <span v-if="toast.type === 'success'" class="text-emerald-600 font-bold">✓</span>
            <span v-else-if="toast.type === 'error'" class="text-rose-600 font-bold">✕</span>
            <span v-else-if="toast.type === 'warning'" class="text-amber-600 font-bold">⚠</span>
            <span v-else class="text-sky-600 font-bold">ℹ</span>
          </div>
          <div class="flex-1 text-sm font-medium leading-snug">
            {{ toast.message }}
          </div>
          <button
            @click="removeToast(toast.id)"
            class="text-stone-400 hover:text-stone-600 p-0.5 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';

const store = useKobichaStore();
const { toasts } = storeToRefs(store);
const { removeToast } = store;

function getTypeClass(type: string) {
  switch (type) {
    case 'success': return 'border-emerald-200 bg-emerald-50/90 text-emerald-950';
    case 'error': return 'border-rose-200 bg-rose-50/90 text-rose-950';
    case 'warning': return 'border-amber-200 bg-amber-50/90 text-amber-950';
    default: return 'border-sky-200 bg-sky-50/90 text-sky-950';
  }
}
</script>
