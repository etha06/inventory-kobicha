<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
    <!-- Stat 1: Fragrance Oils -->
    <div
      @click="store.navigateTo('stock-fo')"
      class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
    >
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Fragrance Oils</span>
        <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
          💧
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">{{ totalFoCount }}</span>
        <span class="text-xs text-stone-500">Varian Aroma</span>
      </div>
      <div class="mt-3 flex items-center gap-1.5 text-xs">
        <span v-if="lowStockFoCount > 0" class="text-rose-600 font-semibold flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          {{ lowStockFoCount }} stok menipis/habis
        </span>
        <span v-else class="text-emerald-600 font-medium flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Semua stok aman
        </span>
      </div>
    </div>

    <!-- Stat 2: Bahan Campuran -->
    <div
      @click="store.navigateTo('stock-campuran')"
      class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
    >
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Bahan Campuran</span>
        <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
          📦
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">{{ totalCampuranCount }}</span>
        <span class="text-xs text-stone-500">Item Bahan</span>
      </div>
      <div class="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
        <span>Pelarut, DPG & Botol</span>
      </div>
    </div>

    <!-- Stat 3: Katalog Racikan -->
    <div
      @click="store.navigateTo('katalog-racikan')"
      class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
    >
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Katalog Racikan</span>
        <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
          📜
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">{{ totalRacikanCount }}</span>
        <span class="text-xs text-stone-500">Formula Tersimpan</span>
      </div>
      <div class="mt-3 flex items-center gap-1.5 text-xs text-purple-700 font-medium">
        <span>+{{ totalHppCount }} Analisis HPP</span>
      </div>
    </div>

    <!-- Stat 4: Deadlines / Pengingat -->
    <div
      class="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all group"
    >
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Target & Reminder</span>
        <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
          📅
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">{{ pendingDeadlinesCount }}</span>
        <span class="text-xs text-stone-500">Agenda Aktif</span>
      </div>
      <div class="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
        <span>Maturasi & Restock</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKobichaStore } from '../../stores/kobichaStore';
import { storeToRefs } from 'pinia';

const store = useKobichaStore();
const {
  totalFoCount,
  lowStockFoCount,
  totalCampuranCount,
  totalRacikanCount,
  totalHppCount,
  pendingDeadlinesCount
} = storeToRefs(store);
</script>
