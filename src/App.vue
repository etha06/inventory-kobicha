<template>
  <div class="min-h-screen bg-canvas p-2 sm:p-5 lg:p-6 flex flex-col justify-center items-center relative overflow-x-hidden font-sans text-forest-800">
    <!-- Background Decorative Organic Shapes (Image 1 Accents) -->
    <div class="fixed top-2 left-4 pointer-events-none opacity-20 hidden md:block">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#608356" stroke-width="1.5">
        <path d="M10 90 Q 50 10 90 90" />
        <path d="M20 90 Q 50 25 80 90" />
        <path d="M30 90 Q 50 40 70 90" />
        <path d="M40 90 Q 50 55 60 90" />
      </svg>
    </div>
    
    <div class="fixed bottom-2 right-4 pointer-events-none opacity-25 hidden md:block">
      <svg width="130" height="130" viewBox="0 0 100 100" fill="none" stroke="#608356" stroke-width="1.5">
        <circle cx="90" cy="90" r="70" />
        <circle cx="90" cy="90" r="50" />
        <circle cx="90" cy="90" r="30" />
      </svg>
    </div>

    <!-- Main Floating App Card Container -->
    <div class="w-full max-w-[1560px] bg-white rounded-[24px] sm:rounded-[36px] shadow-floating border border-[#d2e0d0]/80 flex overflow-hidden min-h-[93vh] relative z-10">
      <!-- Sidebar Navigation (Image 2 style with organic curve & peach active pill) -->
      <Sidebar
        :isCollapsed="isSidebarCollapsed"
        :isMobileOpen="isMobileNavOpen"
        @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
        @close-mobile="isMobileNavOpen = false"
      />

      <!-- Main Content Wrapper inside the Card -->
      <div
        class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out bg-white overflow-y-auto"
        :class="[isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72']"
      >
        <!-- Page View Container -->
        <main class="flex-1 p-4 sm:p-6 w-full">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <!-- 1. Home / Dashboard -->
            <HomePage v-if="activeTab === 'home'" />

            <!-- 2. Where to Buy -->
            <WhereToBuyPage v-else-if="activeTab === 'wheretobuy'" />

            <!-- 3. Stock Barang Submenus -->
            <StockCampuranPage v-else-if="activeTab === 'stock-campuran'" />
            <StockFragranceOilPage v-else-if="activeTab === 'stock-fo'" />
            <ListHargaPage v-else-if="activeTab === 'list-harga-fo'" />

            <!-- 4. Formula Submenus -->
            <FormulaBasePage v-else-if="activeTab === 'formula-base'" />
            <KatalogRacikanPage v-else-if="activeTab === 'katalog-racikan'" />
            <KalkulatorRacikanPage v-else-if="activeTab === 'kalkulator-racikan'" />

            <!-- 5. Harga Modal / HPP Submenus -->
            <KatalogHppPage v-else-if="activeTab === 'katalog-hpp'" />
            <KalkulatorHppPage v-else-if="activeTab === 'kalkulator-hpp'" />

            <!-- 6. Ready to Sell Page -->
            <ReadyToSellPage v-else-if="activeTab === 'ready-to-sell'" />
          </Transition>
        </main>
      </div>
    </div>

    <!-- Global Floating Toast Notifications -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useKobichaStore } from './stores/kobichaStore';
import { storeToRefs } from 'pinia';

import Sidebar from './components/layout/Sidebar.vue';
import Toast from './components/common/Toast.vue';

import HomePage from './pages/HomePage.vue';
import WhereToBuyPage from './pages/WhereToBuyPage.vue';
import StockCampuranPage from './pages/StockCampuranPage.vue';
import StockFragranceOilPage from './pages/StockFragranceOilPage.vue';
import ListHargaPage from './pages/ListHargaPage.vue';
import FormulaBasePage from './pages/FormulaBasePage.vue';
import KatalogRacikanPage from './pages/KatalogRacikanPage.vue';
import KalkulatorRacikanPage from './pages/KalkulatorRacikanPage.vue';
import KatalogHppPage from './pages/KatalogHppPage.vue';
import KalkulatorHppPage from './pages/KalkulatorHppPage.vue';
import ReadyToSellPage from './pages/ReadyToSellPage.vue';

const store = useKobichaStore();
const { activeTab, isMobileNavOpen } = storeToRefs(store);

const isSidebarCollapsed = ref(false);
</script>
