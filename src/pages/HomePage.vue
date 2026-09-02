<template>
  <div class="space-y-7">
    <!-- Top Greeting Section (Image 1 Header Style) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sage-100">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold font-serif text-forest-900 tracking-tight flex items-center gap-2">
          <span>Selamat {{ greetingTime }}, Tim Kobicha</span>
        </h1>
        <p class="text-xs sm:text-sm text-sage-600 mt-1 font-sans">
          Welcome to your perfume formulation & inventory management system
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2.5">
        <button
          @click="store.isQuickAddFoOpen = true"
          class="px-4 py-2 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all transform active:scale-95 flex items-center gap-1.5"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>+ Tambah FO</span>
        </button>
        <button
          @click="store.navigateTo('kalkulator-racikan')"
          class="px-4 py-2 rounded-2xl bg-sage-50 hover:bg-sage-100 text-forest-800 text-xs font-bold border border-sage-200 transition-all flex items-center gap-1.5"
        >
          <FlaskConical class="w-3.5 h-3.5 text-sage-600" />
          <span>Kalkulator Racik</span>
        </button>
      </div>
    </div>

    <!-- Main Dashboard Grid (Left: Stats + Products Table, Right: Analytics Donut + Most Used FO) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT COLUMN: Stats Cards & Products Stock Table (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- 4 Pastel Wave Stat Cards (Image 1 Style) -->
        <StatsOverview />

        <!-- Products Stock List Table (Image 1 Style) -->
        <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-forest-900 text-base font-serif">Products Stock List</h3>
              <p class="text-xs text-sage-600">Daftar konsentrat fragrance oil terbaru dan status ketersediaan</p>
            </div>
            <button
              @click="store.navigateTo('stock-fo')"
              class="text-xs font-bold text-peach-600 hover:text-peach-700 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Table with Image 1 Pill Badges -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-sage-100 text-[10px] font-bold uppercase tracking-wider text-sage-600">
                  <th class="py-3 px-3">Nama Fragrance Oil</th>
                  <th class="py-3 px-3">Brand / Supplier</th>
                  <th class="py-3 px-3 text-center">Status Stok</th>
                  <th class="py-3 px-3 text-right">Harga</th>
                  <th class="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-sage-50 text-forest-800">
                <tr
                  v-for="fo in recentFoList"
                  :key="fo.id"
                  class="table-row-hover transition-colors"
                >
                  <!-- Nama FO & Notes -->
                  <td class="py-3.5 px-3">
                    <div class="font-bold text-forest-900 text-xs">{{ fo.nama }}</div>
                    <div class="text-[10px] text-sage-500 truncate max-w-[180px]">
                      {{ (fo.notes && fo.notes.length) ? fo.notes.join(', ') : (fo.pyramid || 'Aroma blend') }}
                    </div>
                  </td>

                  <!-- Brand / Supplier -->
                  <td class="py-3.5 px-3 text-sage-600 text-[11px]">
                    {{ fo.storeName || '-' }}
                  </td>

                  <!-- Pill Status (In Stock / Low Stock / Out of Stock) -->
                  <td class="py-3.5 px-3 text-center">
                    <span
                      v-if="fo.currentStock === 'Banyak'"
                      class="px-3 py-1 rounded-full text-[10px] font-bold bg-[#e2ece0] text-[#32522c] border border-[#c1d8be] inline-block"
                    >
                      In Stock
                    </span>
                    <span
                      v-else-if="fo.currentStock === 'Dikit'"
                      class="px-3 py-1 rounded-full text-[10px] font-bold bg-[#fef3e2] text-[#8e520e] border border-[#fae0be] inline-block"
                    >
                      Low Stock
                    </span>
                    <span
                      v-else
                      class="px-3 py-1 rounded-full text-[10px] font-bold bg-[#fdeeed] text-[#9b2c2c] border border-[#f8c8c8] inline-block"
                    >
                      Out of Stock
                    </span>
                  </td>

                  <!-- Harga Rata-rata -->
                  <td class="py-3.5 px-3 text-right font-mono font-semibold text-forest-900">
                    {{ formatRupiah(store.getFoAveragePricePerMl(fo.id)) }}
                  </td>

                  <!-- Aksi -->
                  <td class="py-3.5 px-3 text-right">
                    <button
                      @click="store.navigateTo('stock-fo')"
                      class="p-1 rounded-lg hover:bg-sage-100 text-sage-600 transition-colors"
                      title="Lihat di Katalog FO"
                    >
                      <Eye class="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2 Column Layout: Quick Notes & Interactive Calendar -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <QuickNotes />
          <InteractiveCalendar />
        </div>
      </div>

      <!-- RIGHT COLUMN: Analytics Donut Chart & Most Used Oils (4 cols) (Image 1 Style) -->
      <div class="lg:col-span-4 space-y-6">
        <!-- 1. Olfactory Notes Donut Chart Widget (Image 1 Style) -->
        <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-forest-900 text-sm font-serif">Karakter Aroma</h3>
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
                <span class="text-xl font-bold font-serif text-forest-900 leading-none">100%</span>
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
            <h3 class="font-bold text-forest-900 text-sm font-serif">Most Used Fragrance Oils</h3>
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

        <!-- 3. Quick Links / System Info -->
        <div class="p-4 rounded-[20px] bg-sage-50/70 border border-sage-200/70 text-xs text-sage-700 space-y-2">
          <div class="font-bold text-forest-900 flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-peach-500" />
            <span>Kobicha Lab Tip</span>
          </div>
          <p class="text-[11px] leading-relaxed text-sage-600">
            Pastikan seluruh konsentrasi fragrance oil dan pelarut telah terdata dengan akurat untuk mendapatkan estimasi HPP per botol yang presisi.
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Add Modals -->
    <QuickAddModals />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import StatsOverview from '../components/home/StatsOverview.vue';
import QuickNotes from '../components/home/QuickNotes.vue';
import InteractiveCalendar from '../components/home/InteractiveCalendar.vue';
import QuickAddModals from '../components/home/QuickAddModals.vue';
import { Plus, FlaskConical, ChevronRight, Eye, Sparkles } from 'lucide-vue-next';
import { formatRupiah } from '../utils/formatters';

const store = useKobichaStore();
const { stockFragranceOil, racikanCatalog } = storeToRefs(store);

// Dynamic greeting based on current hour
const greetingTime = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Pagi';
  if (hour >= 11 && hour < 15) return 'Siang';
  if (hour >= 15 && hour < 18) return 'Sore';
  return 'Malam';
});

// Recent FO items (up to 5)
const recentFoList = computed(() => {
  return [...stockFragranceOil.value].slice(0, 6);
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
