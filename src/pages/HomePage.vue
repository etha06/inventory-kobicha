<template>
  <div class="space-y-6">
    <!-- Hero Banner with Quick Actions -->
    <div class="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <!-- Decorative Glow -->
      <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-3">
            <span>✨ Internal Workspace</span> • <span>Kobicha Formulation Lab</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white mb-2">
            Selamat Datang di Stock Barang Kobicha
          </h2>
          <p class="text-sm text-stone-300 max-w-xl leading-relaxed">
            Pusat manajemen stok fragrance oil, bahan pelarut campuran, katalog resep parfum, dan kalkulator harga modal HPP presisi.
          </p>
        </div>

        <!-- Quick Action Buttons on Hero -->
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="store.isQuickAddFoOpen = true"
            class="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-950/50 transition-all transform active:scale-95 flex items-center gap-2"
          >
            <span class="text-base">💧</span>
            <span>+ Tambah Stok FO</span>
          </button>

          <button
            @click="store.isQuickAddCampuranOpen = true"
            class="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs sm:text-sm font-bold border border-stone-700 transition-all flex items-center gap-2"
          >
            <span class="text-base">📦</span>
            <span>+ Tambah Campuran</span>
          </button>

          <button
            @click="store.navigateTo('kalkulator-racikan')"
            class="px-4 py-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-amber-300 text-xs sm:text-sm font-semibold border border-amber-500/40 transition-all flex items-center gap-1.5"
          >
            <span>🧮</span>
            <span>Kalkulator Racik</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <StatsOverview />

    <!-- 2 Column Layout: Quick Notes & Interactive Calendar -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <QuickNotes />
      <InteractiveCalendar />
    </div>

    <!-- Quick Add Modals -->
    <QuickAddModals />
  </div>
</template>

<script setup lang="ts">
import { useKobichaStore } from '../stores/kobichaStore';
import StatsOverview from '../components/home/StatsOverview.vue';
import QuickNotes from '../components/home/QuickNotes.vue';
import InteractiveCalendar from '../components/home/InteractiveCalendar.vue';
import QuickAddModals from '../components/home/QuickAddModals.vue';

const store = useKobichaStore();
</script>
