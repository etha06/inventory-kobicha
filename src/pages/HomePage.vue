<template>
  <div class="space-y-7">
    <!-- Top Greeting Section (Image 1 Header Style) -->
    <div class="pb-2 border-b border-sage-100 flex items-center justify-between">
      <div class="flex items-center gap-3.5">
        <!-- Mobile Burger Button -->
        <button
          @click="store.openMobileNav()"
          class="lg:hidden w-10 h-10 rounded-2xl bg-white hover:bg-sage-50 text-forest-900 flex items-center justify-center transition-all border border-sage-200/80 shadow-sm flex-shrink-0 active:scale-95"
          title="Buka Menu"
        >
          <Menu class="w-5 h-5 text-forest-900" />
        </button>

        <div>
          <h1 class="text-xl sm:text-3xl font-extrabold font-rounded text-forest-900 tracking-tight flex items-center gap-2">
            <span>Selamat {{ greetingTime }}, Tim Kobicha Studio</span>
          </h1>
          <p class="text-xs sm:text-sm text-sage-600 mt-0.5 font-sans">
            Welcome to your perfume formulation & inventory management system
          </p>
        </div>
      </div>

      <!-- Action Button: Riwayat Penambahan Stock -->
      <div class="flex items-center gap-2">
        <button
          @click="isStockHistoryModalOpen = true"
          class="px-4 py-2 rounded-xl bg-white hover:bg-sage-50 text-forest-900 border border-sage-200 text-xs font-bold shadow-xs transition-all flex items-center gap-2 active:scale-95"
        >
          <History class="w-4 h-4 text-amber-700" />
          <span class="hidden sm:inline">Riwayat Penambahan Stock</span>
          <span class="sm:hidden">Riwayat Stock</span>
        </button>
      </div>
    </div>

    <!-- 4 Pastel Wave Stat Cards (Image 1 Style) -->
    <StatsOverview />

    <!-- Main Dashboard Grid (Left: Quick Notes & Calendar, Right: Analytics Donut + Most Used FO) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT COLUMN: Quick Notes & Interactive Calendar (8 cols) -->
      <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <QuickNotes />
        <InteractiveCalendar />
      </div>

      <!-- RIGHT COLUMN: Analytics Donut Chart & Most Used Oils (4 cols) (Image 1 Style) -->
      <div class="lg:col-span-4 space-y-6">
        <!-- 1. Olfactory Notes Donut Chart Widget (Image 1 Style) -->
        <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-extrabold text-forest-900 text-sm font-rounded">Karakter Aroma</h3>
            <span class="text-[10px] font-mono text-sage-500 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
              {{ stockFragranceOil.length }} Varian
            </span>
          </div>

          <!-- Donut SVG (Image 1 Pie Chart) -->
          <div class="flex flex-col items-center justify-center py-2">
            <div class="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                <!-- Segments -->
                <circle
                  cx="18" cy="18" r="14" fill="transparent"
                  stroke="#a3c49c" stroke-width="7"
                  :stroke-dasharray="`${chartPercentages.woody} 100`"
                  stroke-dashoffset="0"
                />
                <circle
                  cx="18" cy="18" r="14" fill="transparent"
                  stroke="#f7c387" stroke-width="7"
                  :stroke-dasharray="`${chartPercentages.floral} 100`"
                  :stroke-dashoffset="`-${chartPercentages.woody}`"
                />
                <circle
                  cx="18" cy="18" r="14" fill="transparent"
                  stroke="#cbb6d8" stroke-width="7"
                  :stroke-dasharray="`${chartPercentages.citrus} 100`"
                  :stroke-dashoffset="`-${chartPercentages.woody + chartPercentages.floral}`"
                />
                <circle
                  cx="18" cy="18" r="14" fill="transparent"
                  stroke="#e3a9a9" stroke-width="7"
                  :stroke-dasharray="`${chartPercentages.others} 100`"
                  :stroke-dashoffset="`-${chartPercentages.woody + chartPercentages.floral + chartPercentages.citrus}`"
                />
              </svg>
              <!-- Center Badge -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-xl font-extrabold font-rounded text-forest-900 leading-none">100%</span>
                <span class="text-[9px] text-sage-500 uppercase tracking-widest mt-0.5">Notes</span>
              </div>
            </div>

            <!-- Legend (Image 1 Style) -->
            <div class="grid grid-cols-2 gap-2.5 w-full mt-4 text-[11px] text-forest-800">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#a3c49c]"></span>
                <span class="text-sage-700">Woody / Amber</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#f7c387]"></span>
                <span class="text-sage-700">Floral / Sweet</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#cbb6d8]"></span>
                <span class="text-sage-700">Citrus / Fresh</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#e3a9a9]"></span>
                <span class="text-sage-700">Gourmand / Lainnya</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Most Used Fragrance Oils Widget (Image 1 Right Panel) -->
        <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-extrabold text-forest-900 text-sm font-rounded">Most Used Fragrance Oils</h3>
            <span class="text-[10px] text-sage-500 font-medium">Dalam Resep</span>
          </div>

          <!-- Progress Bars List (Image 1 Style) -->
          <div class="space-y-3.5">
            <div
              v-for="(item, idx) in topUsedFoList"
              :key="item.name"
              class="space-y-1.5"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-forest-900 truncate max-w-[140px]">{{ item.name }}</span>
                <span class="font-mono text-sage-600 text-[11px]">{{ item.formulaCount }} resep</span>
              </div>

              <!-- Pastel Progress Bar -->
              <div class="w-full bg-sage-50 h-2 rounded-full overflow-hidden border border-sage-100">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="idx === 0 ? 'bg-[#a3c49c]' : idx === 1 ? 'bg-[#f7c387]' : idx === 2 ? 'bg-[#cbb6d8]' : 'bg-[#e3a9a9]'"
                  :style="{ width: item.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Add Modals -->
    <QuickAddModals />

    <!-- Stock Addition History Modal -->
    <StockHistoryModal
      :isOpen="isStockHistoryModalOpen"
      @close="isStockHistoryModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import StatsOverview from '../components/home/StatsOverview.vue';
import QuickNotes from '../components/home/QuickNotes.vue';
import InteractiveCalendar from '../components/home/InteractiveCalendar.vue';
import QuickAddModals from '../components/home/QuickAddModals.vue';
import StockHistoryModal from '../components/home/StockHistoryModal.vue';
import { Menu, History } from 'lucide-vue-next';

const store = useKobichaStore();
const { stockFragranceOil, racikanCatalog } = storeToRefs(store);

const isStockHistoryModalOpen = ref(false);

// Dynamic greeting based on current hour
const greetingTime = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Pagi';
  if (hour >= 11 && hour < 15) return 'Siang';
  if (hour >= 15 && hour < 18) return 'Sore';
  return 'Malam';
});

// Chart percentages for Donut
const chartPercentages = computed(() => {
  const total = Math.max(stockFragranceOil.value.length, 1);
  const woody = stockFragranceOil.value.filter(f => (f.notes || []).some(n => /Woody|Oriental|Leathery/i.test(n))).length;
  const floral = stockFragranceOil.value.filter(f => (f.notes || []).some(n => /Floral|Gourmand|Powdery/i.test(n))).length;
  const citrus = stockFragranceOil.value.filter(f => (f.notes || []).some(n => /Citrus|Aquatic|Fruity|Green/i.test(n))).length;
  const others = Math.max(total - (woody + floral + citrus), 0);

  const pWoody = Math.round((woody / total) * 100) || 35;
  const pFloral = Math.round((floral / total) * 100) || 30;
  const pCitrus = Math.round((citrus / total) * 100) || 20;
  const pOthers = Math.max(100 - (pWoody + pFloral + pCitrus), 15);

  return { woody: pWoody, floral: pFloral, citrus: pCitrus, others: pOthers };
});

// Top used Fragrance Oils across formulations
const topUsedFoList = computed(() => {
  const usageMap: Record<string, number> = {};
  
  racikanCatalog.value.forEach(recipe => {
    (recipe.fragranceOils || []).forEach(it => {
      usageMap[it.fragranceOilName] = (usageMap[it.fragranceOilName] || 0) + 1;
    });
  });

  const list = Object.entries(usageMap)
    .map(([name, count]) => ({ name, formulaCount: count }))
    .sort((a, b) => b.formulaCount - a.formulaCount)
    .slice(0, 5);

  if (list.length === 0) {
    // Default fallback from FO stock list
    return stockFragranceOil.value.slice(0, 4).map((f, i) => ({
      name: f.nama,
      formulaCount: (4 - i) * 2,
      percentage: Math.round(((4 - i) / 4) * 85)
    }));
  }

  const maxCount = Math.max(...list.map(l => l.formulaCount), 1);
  return list.map(l => ({
    ...l,
    percentage: Math.round((l.formulaCount / maxCount) * 90) + 10
  }));
});
</script>
