<template>
  <div class="min-h-screen flex bg-stone-100/60 font-sans text-stone-900 selection:bg-amber-200 selection:text-amber-900">
    <!-- Sidebar Navigation (Desktop Collapsible + Mobile Drawer) -->
    <Sidebar
      :isCollapsed="isSidebarCollapsed"
      :isMobileOpen="isMobileNavOpen"
      @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
      @close-mobile="isMobileNavOpen = false"
    />

    <!-- Main Content Wrapper -->
    <div
      class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
      :class="[isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72']"
    >
      <!-- Top Sticky Header -->
      <Header
        @open-mobile="isMobileNavOpen = true"
      />

      <!-- Page Router View Container -->
      <main class="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
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
        </Transition>
      </main>

      <!-- Minimalist App Footer -->
      <footer class="py-4 px-8 border-t border-stone-200/80 text-center text-xs text-stone-400">
        Stock Barang Kobicha • Internal Perfume Formulation & Inventory System
      </footer>
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
import Header from './components/layout/Header.vue';
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

const store = useKobichaStore();
const { activeTab } = storeToRefs(store);

const isSidebarCollapsed = ref(false);
const isMobileNavOpen = ref(false);
</script>
