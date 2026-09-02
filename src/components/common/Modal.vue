<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        @click.self="closeOnBackdrop && $emit('close')"
      >
        <div
          class="bg-white rounded-[28px] shadow-floating border border-sage-200/80 w-full overflow-hidden flex flex-col max-h-[90vh] transition-all transform animate-in fade-in zoom-in-95 duration-200"
          :class="maxWidthClass"
        >
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-sage-100 flex items-center justify-between bg-sage-50/60">
            <div class="flex items-center gap-3">
              <div v-if="$slots.icon" class="w-10 h-10 rounded-2xl bg-peach-100 text-peach-800 flex items-center justify-center font-bold">
                <slot name="icon" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold text-forest-900 font-serif">{{ title }}</h3>
                <p v-if="subtitle" class="text-xs text-sage-600 mt-0.5">{{ subtitle }}</p>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="w-8 h-8 rounded-xl text-sage-400 hover:text-forest-900 hover:bg-sage-100 flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="px-6 py-5 overflow-y-auto flex-1 text-forest-800 text-sm">
            <slot />
          </div>

          <!-- Modal Footer -->
          <div v-if="$slots.footer" class="px-6 py-3.5 border-t border-sage-100 bg-sage-50/40 flex items-center justify-end gap-2.5">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    closeOnBackdrop?: boolean;
  }>(),
  {
    maxWidth: 'lg',
    closeOnBackdrop: true
  }
);

defineEmits(['close']);

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-sm';
    case 'md': return 'max-w-md';
    case 'lg': return 'max-w-lg';
    case 'xl': return 'max-w-xl';
    case '2xl': return 'max-w-2xl';
    case '3xl': return 'max-w-3xl';
    case '4xl': return 'max-w-4xl';
    case '5xl': return 'max-w-5xl';
    default: return 'max-w-lg';
  }
});
</script>
