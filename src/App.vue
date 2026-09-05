<template>
  <!-- 1. Loading Splash Screen while Checking Auth Status -->
  <div
    v-if="authLoading"
    class="min-h-screen bg-canvas flex flex-col items-center justify-center p-4 font-sans text-forest-800 space-y-4"
  >
    <div class="w-20 h-20 flex items-center justify-center animate-pulse">
      <img :src="logoImg" alt="Kobicha Studio" class="w-full h-full object-contain drop-shadow-md" />
    </div>
    <div class="text-center space-y-1">
      <h2 class="text-lg font-serif font-black tracking-wide text-forest-900">KOBICHA STUDIO</h2>
      <p class="text-xs text-sage-600 font-medium flex items-center justify-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-peach-500 animate-ping"></span>
        <span>Memverifikasi akun & keamanan...</span>
      </p>
    </div>
  </div>

  <!-- 2. Login Page if not Authenticated or not in Whitelist -->
  <LoginPage v-else-if="!isAuthenticated" />

  <!-- 3. Main Authenticated Application Dashboard -->
  <div v-else class="min-h-screen bg-canvas p-2 sm:p-5 lg:p-6 flex flex-col justify-center items-center relative overflow-x-hidden font-sans text-forest-800">
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
    <div class="w-full max-w-[1560px] bg-white rounded-2xl sm:rounded-[36px] shadow-floating border border-[#d2e0d0]/80 flex overflow-hidden min-h-[100dvh] sm:min-h-[93vh] relative z-10">
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
        <main class="flex-1 p-3.5 sm:p-5 lg:p-6 w-full min-w-0">
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

    <!-- Global Image Lightbox Modal -->
    <ImageModal />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useKobichaStore } from './stores/kobichaStore';
import { storeToRefs } from 'pinia';
import logoImg from './assets/logo.png';

import Sidebar from './components/layout/Sidebar.vue';
import Toast from './components/common/Toast.vue';
import ImageModal from './components/common/ImageModal.vue';

import LoginPage from './pages/LoginPage.vue';
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
const { activeTab, isMobileNavOpen, authLoading, isAuthenticated } = storeToRefs(store);

const isSidebarCollapsed = ref(false);
</script>
