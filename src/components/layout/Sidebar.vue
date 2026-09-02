<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm lg:hidden transition-opacity"
      @click="$emit('close-mobile')"
    />

    <!-- Sidebar Container -->
    <aside
      class="fixed top-0 bottom-0 left-0 z-40 bg-stone-900 text-stone-100 flex flex-col transition-all duration-300 ease-in-out border-r border-stone-800"
      :class="[
        isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0',
        isCollapsed ? 'lg:w-20' : 'lg:w-72'
      ]"
    >
      <!-- Brand Logo & Header -->
      <div class="h-20 px-5 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/40">
        <div class="flex items-center gap-3 overflow-hidden cursor-pointer" @click="store.navigateTo('home')">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40 flex-shrink-0 text-white font-bold">
            <FlaskConical class="w-5 h-5" />
          </div>
          <div v-show="!isCollapsed" class="transition-opacity duration-200">
            <h1 class="font-bold text-base tracking-tight text-white font-serif flex items-center gap-1.5">
              Kobicha
              <span class="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">PARFUM</span>
            </h1>
            <p class="text-xs text-stone-400 font-sans">Stock & Formula System</p>
          </div>
        </div>

        <!-- Desktop Collapse Button -->
        <button
          @click="$emit('toggle-collapse')"
          class="hidden lg:flex w-7 h-7 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 items-center justify-center transition-colors text-xs"
          :title="isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'"
        >
          <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
          <ChevronLeft v-else class="w-4 h-4" />
        </button>

        <!-- Mobile Close Button -->
        <button
          @click="$emit('close-mobile')"
          class="lg:hidden w-8 h-8 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center text-sm"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Menu Items -->
      <div class="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        <!-- 1. Home Group -->
        <div>
          <button
            @click="handleNav('home')"
            class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
            :class="activeTab === 'home' 
              ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
              : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
          >
            <Home class="w-4 h-4 flex-shrink-0" />
            <span v-show="!isCollapsed" class="flex-1 text-left">Home / Dashboard</span>
          </button>
        </div>

        <!-- 2. Where to Buy Group -->
        <div>
          <button
            @click="handleNav('wheretobuy')"
            class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
            :class="activeTab === 'wheretobuy' 
              ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
              : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
          >
            <Store class="w-4 h-4 flex-shrink-0" />
            <span v-show="!isCollapsed" class="flex-1 text-left">Where to Buy</span>
            <span
              v-show="!isCollapsed && totalStoresCount > 0"
              class="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 group-hover:text-stone-200 border border-stone-700/50"
            >
              {{ totalStoresCount }}
            </span>
          </button>
        </div>

        <!-- 3. Stock Barang Section -->
        <div class="space-y-1">
          <div v-show="!isCollapsed" class="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Stock Barang
          </div>
          <div class="space-y-1">
            <button
              @click="handleNav('stock-campuran')"
              class="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              :class="activeTab === 'stock-campuran' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
            >
              <Boxes class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Barang Campuran</span>
              <span
                v-show="!isCollapsed && totalCampuranCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 group-hover:text-stone-200 border border-stone-700/50"
              >
                {{ totalCampuranCount }}
              </span>
            </button>

            <button
              @click="handleNav('stock-fo')"
              class="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              :class="activeTab === 'stock-fo' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
            >
              <Droplet class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Fragrance Oil</span>
              <span
                v-show="!isCollapsed && lowStockFoCount > 0"
                class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30"
                title="Stok menipis / habis"
              >
                {{ lowStockFoCount }} alert
              </span>
              <span
                v-show="!isCollapsed && lowStockFoCount === 0 && totalFoCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 group-hover:text-stone-200 border border-stone-700/50"
              >
                {{ totalFoCount }}
              </span>
            </button>

            <button
              @click="handleNav('list-harga-fo')"
              class="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              :class="activeTab === 'list-harga-fo' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
            >
              <Tag class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">List Harga FO</span>
            </button>
          </div>
        </div>

        <!-- 4. Formula Section -->
        <div class="space-y-1">
          <div v-show="!isCollapsed" class="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Menu Formula
          </div>
          <div class="space-y-1">
            <button
              @click="handleNav('formula-base')"
              class="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              :class="activeTab === 'formula-base' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
            >
              <Layers class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Katalog Formula Base</span>
            </button>

            <button
              @click="handleNav('katalog-racikan')"
              class="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              :class="activeTab === 'katalog-racikan' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
            >
              <BookOpen class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Katalog Racikan</span>
              <span
                v-show="!isCollapsed && totalRacikanCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 group-hover:text-stone-200 border border-stone-700/50"
              >
                {{ totalRacikanCount }}
              </span>
            </button>

            <button
              @click="handleNav('kalkulator-racikan')"
              class="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              :class="activeTab === 'kalkulator-racikan' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
            >
              <FlaskConical class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Kalkulator Racikan</span>
            </button>
          </div>
        </div>

        <!-- 5. Harga Modal / HPP Section -->
        <div class="space-y-1">
          <div v-show="!isCollapsed" class="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Harga Modal / HPP
          </div>
          <div class="space-y-1">
            <button
              @click="handleNav('katalog-hpp')"
              class="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              :class="activeTab === 'katalog-hpp' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
            >
              <Receipt class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Katalog HPP</span>
              <span
                v-show="!isCollapsed && totalHppCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 group-hover:text-stone-200 border border-stone-700/50"
              >
                {{ totalHppCount }}
              </span>
            </button>

            <button
              @click="handleNav('kalkulator-hpp')"
              class="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              :class="activeTab === 'kalkulator-hpp' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold' 
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'"
            >
              <Calculator class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Kalkulator HPP</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Database Tools & Footer -->
      <div class="p-3 border-t border-stone-800/80 bg-stone-950/60 space-y-2">
        <div v-show="!isCollapsed" class="flex items-center gap-1.5">
          <button
            @click="store.exportDatabase()"
            class="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
            title="Export Database JSON"
          >
            <Download class="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <label
            class="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-stone-700 cursor-pointer"
            title="Import Database JSON"
          >
            <Upload class="w-3.5 h-3.5" />
            <span>Import</span>
            <input type="file" accept=".json" class="hidden" @change="handleFileImport" />
          </label>
        </div>

        <div class="flex items-center justify-between px-2 pt-1 text-[11px] text-stone-500">
          <span v-show="!isCollapsed">v1.0 Kobicha</span>
          <span class="font-mono">Offline-ready</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import {
  Home,
  Store,
  Boxes,
  Droplet,
  Tag,
  Layers,
  BookOpen,
  FlaskConical,
  Receipt,
  Calculator,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-vue-next';

defineProps<{
  isCollapsed: boolean;
  isMobileOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-collapse'): void;
  (e: 'close-mobile'): void;
}>();

const store = useKobichaStore();
const { activeTab, stores, stockCampuran, stockFragranceOil, racikanCatalog, hppCatalog } = storeToRefs(store);

const totalStoresCount = computed(() => stores.value.length);
const totalCampuranCount = computed(() => stockCampuran.value.length);
const totalFoCount = computed(() => stockFragranceOil.value.length);
const lowStockFoCount = computed(() => 
  stockFragranceOil.value.filter(f => f.currentStock === 'Dikit' || f.currentStock === 'Habis').length
);
const totalRacikanCount = computed(() => racikanCatalog.value.length);
const totalHppCount = computed(() => hppCatalog.value.length);

function handleNav(tab: any) {
  store.navigateTo(tab);
  emit('close-mobile');
}

function handleFileImport(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const content = evt.target?.result as string;
      const success = store.importDatabase(content);
      if (success) {
        target.value = '';
      }
    } catch {
      store.showToast('Gagal membaca file backup', 'error');
    }
  };
  reader.readAsText(file);
}
</script>
