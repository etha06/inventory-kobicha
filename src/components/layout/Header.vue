<template>
  <header class="sticky top-0 z-30 h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-sage-100/80 px-4 sm:px-6 flex items-center justify-between transition-all">
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
  </header>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next';

defineEmits(['open-mobile']);
</script>
