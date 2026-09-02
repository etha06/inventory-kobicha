<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold text-sage-800 uppercase tracking-widest">
        Analytics & Inventory Overview
      </h3>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <!-- 1. Sage Green Card: Fragrance Oils -->
      <div
        @click="store.navigateTo('stock-fo')"
        class="relative overflow-hidden rounded-[24px] p-5 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg group"
        style="background: linear-gradient(135deg, #a3c49c 0%, #89af81 100%);"
      >
        <!-- Wave Motif at bottom (Image 1) -->
        <svg class="absolute bottom-0 left-0 right-0 w-full h-12 opacity-30 pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0 25 C 30 10, 70 35, 100 20 L 100 40 L 0 40 Z" fill="#4d7245" />
        </svg>

        <div class="relative z-10 text-center space-y-1">
          <span class="text-[11px] font-semibold text-forest-900/80 block uppercase tracking-wider">
            Fragrance Oils
          </span>
          <div class="text-3xl sm:text-4xl font-bold font-serif text-forest-900 leading-none py-1">
            {{ totalFoCount }}
          </div>
          <span class="text-[11px] text-forest-900/70 font-medium block">
            Varian Aroma
          </span>
        </div>
      </div>

      <!-- 2. Warm Peach Card: Racikan & Formulas -->
      <div
        @click="store.navigateTo('katalog-racikan')"
        class="relative overflow-hidden rounded-[24px] p-5 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg group"
        style="background: linear-gradient(135deg, #f7c387 0%, #ebaa65 100%);"
      >
        <!-- Wave Motif at bottom (Image 1) -->
        <svg class="absolute bottom-0 left-0 right-0 w-full h-12 opacity-30 pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0 20 C 40 35, 60 10, 100 25 L 100 40 L 0 40 Z" fill="#9e5e1a" />
        </svg>

        <div class="relative z-10 text-center space-y-1">
          <span class="text-[11px] font-semibold text-[#5a330a]/80 block uppercase tracking-wider">
            Katalog Racikan
          </span>
          <div class="text-3xl sm:text-4xl font-bold font-serif text-[#442505] leading-none py-1">
            {{ totalRacikanCount }}
          </div>
          <span class="text-[11px] text-[#5a330a]/70 font-medium block">
            Formula Tersimpan
          </span>
        </div>
      </div>

      <!-- 3. Soft Lilac Card: Analisis HPP -->
      <div
        @click="store.navigateTo('katalog-hpp')"
        class="relative overflow-hidden rounded-[24px] p-5 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg group"
        style="background: linear-gradient(135deg, #cbb6d8 0%, #b29ac2 100%);"
      >
        <!-- Wave Motif at bottom (Image 1) -->
        <svg class="absolute bottom-0 left-0 right-0 w-full h-12 opacity-30 pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0 30 C 35 15, 65 30, 100 15 L 100 40 L 0 40 Z" fill="#583669" />
        </svg>

        <div class="relative z-10 text-center space-y-1">
          <span class="text-[11px] font-semibold text-[#442854]/80 block uppercase tracking-wider">
            Analisis HPP
          </span>
          <div class="text-3xl sm:text-4xl font-bold font-serif text-[#321c3f] leading-none py-1">
            {{ totalHppCount }}
          </div>
          <span class="text-[11px] text-[#442854]/70 font-medium block">
            Kalkulasi Biaya
          </span>
        </div>
      </div>

      <!-- 4. Dusty Rose Card: Running Out Items / Low Stock Alert -->
      <div
        @click="store.navigateTo('stock-fo')"
        class="relative overflow-hidden rounded-[24px] p-5 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg group"
        style="background: linear-gradient(135deg, #e3a9a9 0%, #d48f8f 100%);"
      >
        <!-- Wave Motif at bottom (Image 1) -->
        <svg class="absolute bottom-0 left-0 right-0 w-full h-12 opacity-30 pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0 20 C 30 35, 70 10, 100 25 L 100 40 L 0 40 Z" fill="#6d2e2e" />
        </svg>

        <div class="relative z-10 text-center space-y-1">
          <span class="text-[11px] font-semibold text-[#5e2323]/80 block uppercase tracking-wider">
            Stok Alert
          </span>
          <div class="text-3xl sm:text-4xl font-bold font-serif text-[#481717] leading-none py-1">
            {{ String(lowStockFoCount).padStart(2, '0') }}
          </div>
          <span class="text-[11px] text-[#5e2323]/70 font-medium block">
            {{ lowStockFoCount > 0 ? 'Perlu Restock' : 'Semua Stok Aman' }}
          </span>
        </div>
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
  totalHppCount
} = storeToRefs(store);
</script>
