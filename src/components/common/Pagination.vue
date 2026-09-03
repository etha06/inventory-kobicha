<template>
  <div v-if="totalItems > 0" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-stone-100 text-xs text-stone-500 bg-white rounded-b-2xl select-none">
    <!-- Info Data Range -->
    <div>
      Menampilkan
      <span class="font-bold text-stone-900">{{ startIndex + 1 }}</span>
      -
      <span class="font-bold text-stone-900">{{ endIndex }}</span>
      dari
      <span class="font-bold text-stone-900">{{ totalItems }}</span>
      data
    </div>

    <!-- Navigation Page Buttons -->
    <div v-if="totalPages > 1" class="flex items-center gap-1">
      <!-- First Page Button -->
      <button
        type="button"
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="w-7 h-7 rounded-lg flex items-center justify-center transition-all border text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent border-stone-200"
        title="Halaman Pertama"
      >
        <ChevronsLeft class="w-3.5 h-3.5" />
      </button>

      <!-- Prev Button -->
      <button
        type="button"
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="w-7 h-7 rounded-lg flex items-center justify-center transition-all border text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent border-stone-200"
        title="Halaman Sebelumnya"
      >
        <ChevronLeft class="w-3.5 h-3.5" />
      </button>

      <!-- Page Numbers -->
      <template v-for="p in visiblePages" :key="p">
        <span v-if="p === -1" class="px-1 text-stone-400 font-bold">...</span>
        <button
          v-else
          type="button"
          @click="goToPage(p)"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
          :class="[
            currentPage === p
              ? 'bg-amber-600 text-white shadow-xs font-extrabold'
              : 'text-stone-700 hover:bg-stone-100 border border-stone-200 bg-white'
          ]"
        >
          {{ p }}
        </button>
      </template>

      <!-- Next Button -->
      <button
        type="button"
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="w-7 h-7 rounded-lg flex items-center justify-center transition-all border text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent border-stone-200"
        title="Halaman Selanjutnya"
      >
        <ChevronRight class="w-3.5 h-3.5" />
      </button>

      <!-- Last Page Button -->
      <button
        type="button"
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="w-7 h-7 rounded-lg flex items-center justify-center transition-all border text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent border-stone-200"
        title="Halaman Terakhir"
      >
        <ChevronsRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    currentPage: number;
    totalItems: number;
    itemsPerPage?: number;
  }>(),
  {
    itemsPerPage: 10
  }
);

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'page-change', page: number): void;
}>();

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage));
});

const startIndex = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(props.totalItems, props.currentPage * props.itemsPerPage);
});

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return;
  emit('update:currentPage', page);
  emit('page-change', page);
}

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = props.currentPage;
  const pages: number[] = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  // Always show first
  pages.push(1);

  if (current > 3) {
    pages.push(-1); // ellipsis
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push(-1); // ellipsis
  }

  // Always show last
  pages.push(total);

  return pages;
});
</script>
