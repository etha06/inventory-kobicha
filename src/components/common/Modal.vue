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
        class="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 md:p-6"
        @click.self="closeOnBackdrop && $emit('close')"
      >
        <div
          class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 w-full overflow-hidden flex flex-col max-h-[92vh] transition-all transform duration-150"
          :class="maxWidthClass"
        >
          <!-- Modal Header -->
          <div class="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
            <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div v-if="$slots.icon" class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold flex-shrink-0">
                <slot name="icon" />
              </div>
              <div class="min-w-0">
                <h3 class="text-sm sm:text-base md:text-lg font-bold text-stone-900 font-serif truncate">{{ title }}</h3>
                <p v-if="subtitle" class="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">{{ subtitle }}</p>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 text-stone-800 text-xs sm:text-sm">
            <slot />
          </div>

          <!-- Modal Footer -->
          <div v-if="$slots.footer" class="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-end gap-2.5">
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
    closeOnBackdrop: false
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
