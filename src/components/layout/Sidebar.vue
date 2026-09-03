<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm lg:hidden transition-opacity"
      @click="$emit('close-mobile')"
    />

    <!-- Sidebar Container (Gambar 2 Inspired Organic Curved Green Sidebar) -->
    <aside
      class="fixed top-0 bottom-0 left-0 z-40 bg-[#608356] text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none lg:rounded-tr-[36px] lg:rounded-br-[36px] overflow-hidden"
      :class="[
        isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0',
        isCollapsed ? 'lg:w-20' : 'lg:w-72'
      ]"
    >
      <!-- Brand Logo & Header (Image 2 style) -->
      <div
        class="h-20 flex items-center border-b border-white/10 bg-black/5 transition-all"
        :class="isCollapsed ? 'justify-center px-2' : 'justify-between px-5'"
      >
        <div
          v-if="!isCollapsed"
          class="flex items-center gap-3 overflow-hidden cursor-pointer"
          @click="store.navigateTo('home')"
        >
          <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner flex-shrink-0 text-white font-bold border border-white/30">
            <Droplet class="w-5 h-5 fill-white text-white" />
          </div>
          <div class="transition-opacity duration-200">
            <h1 class="font-extrabold text-lg tracking-tight text-white font-rounded flex items-center gap-1.5">
              Kobicha
            </h1>
            <p class="text-[11px] text-sage-100 font-sans tracking-wide">Parfumerie & Stock</p>
          </div>
        </div>

        <!-- Desktop Collapse / Menu Button (Image 2 Hamburger toggle) -->
        <button
          @click="$emit('toggle-collapse')"
          class="hidden lg:flex w-10 h-10 rounded-xl text-white/80 hover:text-white hover:bg-white/15 items-center justify-center transition-colors"
          :title="isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'"
        >
          <Menu v-if="isCollapsed" class="w-5 h-5" />
          <ChevronLeft v-else class="w-5 h-5" />
        </button>

        <!-- Mobile Close Button -->
        <button
          @click="$emit('close-mobile')"
          class="lg:hidden w-8 h-8 rounded-xl text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center text-sm"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Live Date Indicator in Sidebar -->
      <div class="px-3 pt-3">
        <div
          class="flex items-center gap-2 text-xs font-medium text-white/90 bg-black/15 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm transition-all"
          :class="isCollapsed ? 'justify-center px-1.5' : 'justify-start'"
          :title="todayFormatted"
        >
          <Calendar class="w-3.5 h-3.5 text-sage-200 flex-shrink-0" />
          <span v-show="!isCollapsed" class="truncate font-sans text-[11px] text-sage-100 font-semibold">{{ todayFormatted }}</span>
        </div>
      </div>

      <!-- Navigation Menu Items -->
      <div class="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        <!-- 1. Home Group -->
        <div>
          <button
            @click="handleNav('home')"
            class="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group"
            :class="activeTab === 'home' 
              ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
              : 'text-white/85 hover:bg-white/15 hover:text-white'"
          >
            <Home class="w-4 h-4 flex-shrink-0" />
            <span v-show="!isCollapsed" class="flex-1 text-left">Home / Dashboard</span>
          </button>
        </div>

        <!-- 2. Where to Buy Group -->
        <div>
          <button
            @click="handleNav('wheretobuy')"
            class="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group"
            :class="activeTab === 'wheretobuy' 
              ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
              : 'text-white/85 hover:bg-white/15 hover:text-white'"
          >
            <Store class="w-4 h-4 flex-shrink-0" />
            <span v-show="!isCollapsed" class="flex-1 text-left">Where to Buy</span>
            <span
              v-show="!isCollapsed && totalStoresCount > 0"
              class="text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/90"
            >
              {{ totalStoresCount }}
            </span>
          </button>
        </div>

        <!-- 3. Stock Barang Section -->
        <div class="space-y-1">
          <div v-show="!isCollapsed" class="px-3.5 text-[10px] font-bold uppercase tracking-widest text-sage-200/75">
            Stock Barang
          </div>
          <div class="space-y-1">
            <button
              @click="handleNav('stock-campuran')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'stock-campuran' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <Boxes class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Barang Campuran</span>
              <span
                v-show="!isCollapsed && totalCampuranCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/90"
              >
                {{ totalCampuranCount }}
              </span>
            </button>

            <button
              @click="handleNav('stock-fo')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'stock-fo' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <Droplet class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Fragrance Oil</span>
              <span
                v-show="!isCollapsed && lowStockFoCount > 0"
                class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-400 text-white shadow-sm"
                title="Stok menipis / habis"
              >
                {{ lowStockFoCount }} alert
              </span>
              <span
                v-show="!isCollapsed && lowStockFoCount === 0 && totalFoCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/90"
              >
                {{ totalFoCount }}
              </span>
            </button>

            <button
              @click="handleNav('list-harga-fo')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'list-harga-fo' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <Tag class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">List Harga FO</span>
            </button>
          </div>
        </div>

        <!-- 4. Formula Section -->
        <div class="space-y-1">
          <div v-show="!isCollapsed" class="px-3.5 text-[10px] font-bold uppercase tracking-widest text-sage-200/75">
            Menu Formula
          </div>
          <div class="space-y-1">
            <button
              @click="handleNav('formula-base')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'formula-base' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <Layers class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Katalog Formula Base</span>
            </button>

            <button
              @click="handleNav('katalog-racikan')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'katalog-racikan' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <BookOpen class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Katalog Racikan</span>
              <span
                v-show="!isCollapsed && totalRacikanCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/90"
              >
                {{ totalRacikanCount }}
              </span>
            </button>

            <button
              @click="handleNav('kalkulator-racikan')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'kalkulator-racikan' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <FlaskConical class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Kalkulator Racikan</span>
            </button>
          </div>
        </div>

        <!-- 5. Harga Modal / HPP Section -->
        <div class="space-y-1">
          <div v-show="!isCollapsed" class="px-3.5 text-[10px] font-bold uppercase tracking-widest text-sage-200/75">
            Harga Modal / HPP
          </div>
          <div class="space-y-1">
            <button
              @click="handleNav('katalog-hpp')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'katalog-hpp' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <Receipt class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Katalog HPP</span>
              <span
                v-show="!isCollapsed && totalHppCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/90"
              >
                {{ totalHppCount }}
              </span>
            </button>

            <button
              @click="handleNav('kalkulator-hpp')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'kalkulator-hpp' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <Calculator class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Kalkulator HPP</span>
            </button>
          </div>
        </div>

        <!-- 6. Produk & Penjualan Section -->
        <div class="space-y-1">
          <div v-show="!isCollapsed" class="px-3.5 text-[10px] font-bold uppercase tracking-widest text-sage-200/75">
            Produk & Penjualan
          </div>
          <div class="space-y-1">
            <button
              @click="handleNav('ready-to-sell')"
              class="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 group"
              :class="activeTab === 'ready-to-sell' 
                ? 'bg-peach-500 text-white shadow-pill font-bold transform translate-x-0.5' 
                : 'text-white/85 hover:bg-white/15 hover:text-white'"
            >
              <ShoppingBag class="w-4 h-4 flex-shrink-0" />
              <span v-show="!isCollapsed" class="flex-1 text-left truncate">Ready to Sell</span>
              <span
                v-show="!isCollapsed && totalReadyToSellCount > 0"
                class="text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/90"
              >
                {{ totalReadyToSellCount }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Database Tools & Footer -->
      <div class="p-3 border-t border-white/10 bg-black/10 space-y-2">
        <!-- Cloud Firestore Sync Status Badge -->
        <div class="pt-2 border-t border-white/15">
          <div v-if="!isCollapsed" class="bg-black/20 rounded-xl p-2.5 space-y-1.5 border border-white/10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="relative flex h-2 w-2">
                  <span
                    v-if="cloudSyncStatus === 'connected'"
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2"
                    :class="{
                      'bg-emerald-400': cloudSyncStatus === 'connected',
                      'bg-amber-400': cloudSyncStatus === 'syncing',
                      'bg-rose-400': cloudSyncStatus === 'offline' || cloudSyncStatus === 'error'
                    }"
                  ></span>
                </span>
                <span class="text-xs font-semibold text-white/90">
                  {{ cloudSyncStatus === 'connected' ? 'Firebase Realtime' : cloudSyncStatus === 'syncing' ? 'Menyinkronkan...' : 'Mode Offline' }}
                </span>
              </div>

              <button
                @click="store.forceCloudSync()"
                class="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title="Sinkronkan Cloud Sekarang"
              >
                <RefreshCw class="w-3 h-3" :class="cloudSyncStatus === 'syncing' ? 'animate-spin' : ''" />
              </button>
            </div>
            <p class="text-[10px] text-sage-200/70 leading-tight">
              {{ cloudSyncStatus === 'connected' ? 'Data otomatis sinkron realtime antar perangkat' : 'Tersimpan lokal di browser' }}
            </p>
          </div>

          <div v-else class="flex justify-center py-1" :title="cloudSyncStatus === 'connected' ? 'Firebase Realtime Connected' : 'Offline Mode'">
            <span class="relative flex h-2.5 w-2.5">
              <span
                v-if="cloudSyncStatus === 'connected'"
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2.5 w-2.5"
                :class="{
                  'bg-emerald-400': cloudSyncStatus === 'connected',
                  'bg-amber-400': cloudSyncStatus === 'syncing',
                  'bg-rose-400': cloudSyncStatus === 'offline' || cloudSyncStatus === 'error'
                }"
              ></span>
            </span>
          </div>
        </div>

        <div v-show="!isCollapsed">
          <button
            @click="isConfirmClearOpen = true"
            class="w-full px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-rose-100 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-rose-400/20"
            title="Hapus Semua Data & Mulai dari 0"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Kosongkan Semua Data</span>
          </button>
        </div>

        <div class="flex items-center justify-between px-2 pt-1 text-[11px] text-sage-200">
          <span v-show="!isCollapsed">v1.1 Kobicha</span>
          <span class="font-mono">Cloud-Ready</span>
        </div>
      </div>
    </aside>

    <!-- Modal Konfirmasi Kosongkan Data -->
    <ConfirmModal
      :isOpen="isConfirmClearOpen"
      title="Kosongkan Semua Data?"
      message="Tindakan ini akan menghapus seluruh data Stok, Racikan, HPP, Produk Siap Jual, Notes, dan Kalender sehingga database benar-benar kosong (mulai dari 0). Pastikan Anda sudah mengekspor backup jika ada data penting."
      confirmText="Ya, Kosongkan Semua"
      type="danger"
      @confirm="executeClearData"
      @close="isConfirmClearOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import ConfirmModal from '../common/ConfirmModal.vue';
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
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Calendar,
  Trash2,
  Cloud,
  RefreshCw
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
const { activeTab, stores, stockCampuran, stockFragranceOil, racikanCatalog, hppCatalog, totalReadyToSellCount, cloudSyncStatus } = storeToRefs(store);

const isConfirmClearOpen = ref(false);

function executeClearData() {
  store.clearAllData(true);
  isConfirmClearOpen.value = false;
  store.navigateTo('home');
}

const todayFormatted = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'short'
  });
});

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
</script>
