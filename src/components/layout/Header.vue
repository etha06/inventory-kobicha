<template>
  <header class="sticky top-0 z-30 h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-sage-100/80 px-4 sm:px-8 flex items-center justify-between transition-all">
    <!-- Left: Mobile Menu Trigger -->
    <div class="flex items-center gap-3">
      <button
        @click="$emit('open-mobile')"
        class="lg:hidden w-9 h-9 rounded-xl bg-sage-50 hover:bg-sage-100 text-sage-800 flex items-center justify-center transition-colors border border-sage-200"
        title="Buka Menu"
      >
        <Menu class="w-4 h-4" />
      </button>
    </div>

    <!-- Right: Live Date Indicator -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5 text-xs font-medium text-sage-700 bg-sage-50/80 px-3.5 py-1.5 rounded-full border border-sage-200/60">
        <Calendar class="w-3.5 h-3.5 text-sage-600" />
        <span>{{ todayFormatted }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Menu, Calendar } from 'lucide-vue-next';

defineEmits(['open-mobile']);

const todayFormatted = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'short'
  });
});
</script>
