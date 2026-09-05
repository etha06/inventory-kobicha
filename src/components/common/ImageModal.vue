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
        v-if="previewImage"
        class="fixed inset-0 z-[9999] bg-stone-950/85 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 select-none"
        @click.self="store.closeImagePreview()"
      >
        <!-- Top Control Bar -->
        <div class="w-full max-w-4xl flex items-center justify-between gap-3 text-white pb-2 flex-shrink-0">
          <div class="flex items-center gap-2 min-w-0">
            <span class="px-2 py-0.5 rounded-md bg-peach-500/20 text-peach-300 border border-peach-400/30 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
              Preview Foto
            </span>
            <h3 class="text-sm sm:text-base font-bold text-white truncate font-rounded">
              {{ previewImage.title || 'Foto Produk / Barang' }}
            </h3>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <a
              :href="previewImage.url"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5"
              title="Buka foto ukuran asli di tab baru"
            >
              <ExternalLink class="w-3.5 h-3.5 text-peach-300" />
              <span class="hidden sm:inline">Ukuran Asli</span>
            </a>

            <button
              type="button"
              @click="store.closeImagePreview()"
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-500/30 hover:text-rose-200 text-white flex items-center justify-center border border-white/20 transition-all active:scale-95"
              title="Tutup Preview (Esc)"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Middle High-Resolution Image Container -->
        <div
          class="flex-1 w-full max-w-4xl flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-0"
          @click.self="store.closeImagePreview()"
        >
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
          >
            <img
              :src="previewImage.url"
              :alt="previewImage.title || 'Foto Preview'"
              class="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20 ring-1 ring-black/40 bg-stone-900/40"
            />
          </Transition>
        </div>

        <!-- Bottom Caption / Close Hint Bar -->
        <div class="w-full max-w-4xl pt-2 flex items-center justify-between text-xs text-stone-300 flex-shrink-0 border-t border-white/10">
          <span class="text-[11px] text-stone-400 hidden sm:inline">
            Klik di luar gambar atau tekan tombol <kbd class="px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">Esc</kbd> untuk menutup
          </span>
          <button
            type="button"
            @click="store.closeImagePreview()"
            class="px-4 py-1.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs shadow-md transition-all ml-auto active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { X, ExternalLink } from 'lucide-vue-next';

const store = useKobichaStore();
const { previewImage } = storeToRefs(store);

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && previewImage.value) {
    store.closeImagePreview();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
