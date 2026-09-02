<template>
  <div class="space-y-6">
    <!-- Header Card -->
    <div class="bg-white p-5 rounded-[24px] border border-sage-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <!-- Mobile Burger Button -->
        <button
          @click="store.openMobileNav()"
          class="lg:hidden w-9 h-9 rounded-2xl bg-sage-50 hover:bg-sage-100 text-forest-900 flex items-center justify-center transition-all border border-sage-200/80 shadow-sm flex-shrink-0 active:scale-95"
          title="Buka Menu"
        >
          <Menu class="w-4 h-4" />
        </button>

        <div>
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Kalkulator Harga Modal & HPP Parfum</h3>
          <p class="text-xs text-sage-600">
            Perhitungan terpisah modal cairan formula liquid dan kemasan packaging dengan input manual bebas
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="resetForm"
          class="px-3.5 py-2 rounded-2xl bg-sage-50 hover:bg-sage-100 text-forest-800 text-xs font-semibold border border-sage-200 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>
        <button
          @click="saveHpp"
          class="px-5 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5"
        >
          <Save class="w-4 h-4" />
          <span>Simpan ke Katalog HPP</span>
        </button>
      </div>
    </div>

    <!-- General Title & Bottle Size Configuration -->
    <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-forest-800 mb-1">Nama Analisis / Produk HPP</label>
          <input
            v-model="hppTitle"
            type="text"
            required
            placeholder="Misal: HPP Kobicha Signature No. 1 (Botol 50ml Amber)"
            class="w-full px-3.5 py-2 rounded-xl border border-sage-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 text-sm font-medium bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Ukuran Botol yang Dihitung (ml)</label>
          <div class="relative">
            <input
              v-model.number="targetBottleMl"
              type="number"
              min="1"
              required
              @input="onBottleSizeChange"
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-bold font-mono pr-8 text-stone-900"
            />
            <span class="absolute right-3 top-2.5 text-stone-400 text-xs font-bold">ml</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 1: HPP RESEP / LIQUID FORMULA (TERPISAH) -->
    <div class="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-sm space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
            <FlaskConical class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-stone-900">1. HPP Resep / Cairan Liquid Parfum</h4>
            <p class="text-xs text-stone-500">Biaya konsentrat fragrance oil dan bahan pelarut campuran</p>
          </div>
        </div>

        <!-- Mode Toggle -->
        <div class="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            @click="liquidMode = 'by_recipe'"
            class="px-3 py-1.5 rounded-lg transition-all"
            :class="liquidMode === 'by_recipe' ? 'bg-amber-600 text-white shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'"
          >
            By Base & Racikan Resep
          </button>
          <button
            type="button"
            @click="liquidMode = 'manual'"
            class="px-3 py-1.5 rounded-lg transition-all"
            :class="liquidMode === 'manual' ? 'bg-amber-600 text-white shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'"
          >
            Input Manual Rp/ml
          </button>
        </div>
      </div>

      <!-- Option A: By Formula Base & Racikan -->
      <div v-if="liquidMode === 'by_recipe'" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200/80">
          <div>
            <label class="block text-xs font-bold text-amber-950 mb-1">1. Pilih Formula Base (Pelarut %)</label>
            <select
              v-model="selectedBaseId"
              @change="recalculateLiquidFromRecipe"
              class="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white font-medium focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="">-- Pilih Template Formula Base --</option>
              <option v-for="b in formulaBases" :key="b.id" :value="b.id">
                {{ b.nama }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-amber-950 mb-1">2. Pilih Racikan Fragrance (Bibit FO)</label>
            <select
              v-model="selectedRacikanId"
              @change="recalculateLiquidFromRecipe"
              class="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white font-medium focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="">-- Pilih Racikan dari Katalog --</option>
              <option v-for="r in racikanCatalog" :key="r.id" :value="r.id">
                {{ r.nama }} ({{ r.tanggalDibuat }})
              </option>
            </select>
          </div>
        </div>

        <!-- Liquid Ingredients Table Breakdown with Interactive Pelarut Dropdown from Bahan Baku -->
        <div class="overflow-x-auto border rounded-xl">
          <table class="w-full text-xs text-left">
            <thead class="bg-stone-100/70 border-b text-[10px] text-stone-500 uppercase font-bold">
              <tr>
                <th class="py-2.5 px-3 w-10 text-left">#</th>
                <th class="py-2.5 px-3 text-left">Bahan Formula Liquid</th>
                <th class="py-2.5 px-3 text-left w-24">Tipe</th>
                <th class="py-2.5 px-3 text-left w-24">Porsi (%)</th>
                <th class="py-2.5 px-3 text-left w-28">Volume (ml)</th>
                <th class="py-2.5 px-3 text-left w-32">Rata-rata Harga</th>
                <th class="py-2.5 px-3 text-left w-36">Subtotal Biaya</th>
                <th class="py-2.5 px-3 text-left w-16">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y text-stone-800">
              <tr v-if="liquidIngredients.length === 0">
                <td colspan="8" class="py-6 text-center text-stone-400 italic">
                  Pilih Formula Base dan Racikan di atas untuk menghitung otomatis komposisi cairan.
                </td>
              </tr>

              <tr v-for="(ing, idx) in liquidIngredients" :key="idx" class="hover:bg-stone-50">
                <td class="py-2.5 px-3 text-left text-stone-400 font-mono text-[11px]">
                  {{ idx + 1 }}
                </td>

                <!-- Nama & Dropdown Selector for Campuran / Solvent -->
                <td class="py-2.5 px-3 text-left">
                  <div v-if="ing.jenis === 'FO'" class="space-y-0.5">
                    <span class="font-bold text-stone-900 block">{{ ing.nama }}</span>
                    <span class="text-[10px] text-stone-500">Konsentrat Bibit Fragrance Oil</span>
                  </div>
                  
                  <div v-else class="space-y-1.5">
                    <select
                      v-model="ing.stockCampuranId"
                      @change="onSelectCampuranItem(ing)"
                      class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-semibold text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">-- Pilih Cairan dari Stok Bahan Baku --</option>
                      <option
                        v-for="c in bahanBakuCampuranList"
                        :key="c.id"
                        :value="c.id"
                      >
                        {{ c.namaBarang }} — ({{ formatRupiah(store.getCampuranAveragePricePerMl(c.id)) }}/ml)
                      </option>
                    </select>
                    <span v-if="!ing.stockCampuranId" class="text-[10px] text-amber-800 font-medium block">
                      Pilih item dari stok bahan baku di atas untuk mengaitkan harga secara otomatis.
                    </span>
                  </div>
                </td>

                <!-- Tipe Badge -->
                <td class="py-2.5 px-3 text-left">
                  <span
                    class="px-1.5 py-0.5 rounded text-[10px] font-bold inline-block"
                    :class="ing.jenis === 'FO' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'"
                  >
                    {{ ing.jenis }}
                  </span>
                </td>

                <!-- Persentase (%) -->
                <td class="py-2.5 px-3 text-left font-mono">
                  <input
                    v-if="ing.jenis === 'Campuran'"
                    v-model.number="ing.percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    @input="onIngredientPercentChange(ing)"
                    class="w-16 px-1.5 py-1 text-xs border rounded text-left font-mono font-bold"
                  />
                  <span v-else>{{ formatNumber(ing.percentage, 1) }}%</span>
                </td>

                <!-- Volume (ml) -->
                <td class="py-2.5 px-3 text-left font-mono font-bold">
                  {{ formatNumber(ing.volumeMl, 2) }} ml
                </td>

                <!-- Rata-rata Harga per ml -->
                <td class="py-2.5 px-3 text-left font-mono text-stone-600">
                  <input
                    v-if="ing.jenis === 'Campuran'"
                    v-model.number="ing.pricePerMl"
                    type="number"
                    min="0"
                    @input="onIngredientPriceChange(ing)"
                    class="w-24 px-1.5 py-1 text-xs border rounded text-left font-mono font-bold"
                    title="Harga modal per 1 ml"
                  />
                  <span v-else>{{ formatRupiah(ing.pricePerMl) }}</span>
                </td>

                <!-- Subtotal Biaya -->
                <td class="py-2.5 px-3 text-left font-mono font-bold text-stone-900">
                  {{ formatRupiah(ing.cost) }}
                </td>

                <!-- Aksi Hapus (hanya untuk baris cairan / solvent) -->
                <td class="py-2.5 px-3 text-left">
                  <button
                    v-if="ing.jenis === 'Campuran'"
                    type="button"
                    @click="removeLiquidIngredient(idx)"
                    class="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors"
                    title="Hapus baris cairan ini"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-stone-50 border-t font-bold text-stone-900">
              <tr>
                <td colspan="4" class="py-2.5 px-3 text-left">
                  <button
                    type="button"
                    @click="addCustomLiquidRow"
                    class="px-2.5 py-1 text-xs rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    <span>Tambah Cairan / Pelarut Lainnya</span>
                  </button>
                </td>
                <td class="py-2.5 px-3 text-left font-mono font-bold text-amber-950">{{ targetBottleMl }} ml</td>
                <td></td>
                <td class="py-2.5 px-3 text-left font-mono text-amber-950 text-sm font-bold">{{ formatRupiah(subtotalLiquid) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Option B: Manual Input Liquid Price -->
      <div v-else class="space-y-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Harga Modal Liquid (Rp)</label>
            <input
              v-model.number="manualLiquidPricePerMl"
              type="number"
              min="0"
              placeholder="Misal: 500"
              class="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-mono font-bold"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Subtotal Modal Liquid (Auto)</label>
            <div class="px-3.5 py-2 rounded-xl bg-white border border-stone-300 font-mono font-bold text-sm text-stone-900">
              {{ formatRupiah(manualLiquidPricePerMl * targetBottleMl) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 2: MODAL LAINNYA (PACKAGING, BOTOL, STIKER & OPERASIONAL) -->
    <div class="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-sm space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm">
            <Package class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-stone-900">2. Modal Lainnya (Packaging, Botol, Stiker & Operasional)</h4>
            <p class="text-xs text-stone-500">
              Bebas input kemasan & operasional (botol kaca, sprayer, hardbox, stiker label, packaging bubble wrap, dsb)
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Shortcut add from stock campuran -->
          <select
            @change="addFromCampuranStock"
            class="px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50 font-medium"
          >
            <option value="">+ Ambil dari Stok Campuran</option>
            <option v-for="c in stockCampuran" :key="c.id" :value="c.id">
              {{ c.namaBarang }} ({{ formatRupiah(c.hargaPerPcs) }})
            </option>
          </select>

          <button
            type="button"
            @click="addManualPackagingRow"
            class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah Item Manual</span>
          </button>
        </div>
      </div>

      <!-- Packaging Items Table (Action on Right, Header text-left, Lucide Trash2) -->
      <div class="overflow-x-auto border rounded-xl">
        <table class="w-full text-xs text-left">
          <thead class="bg-stone-100/70 border-b text-[10px] text-stone-500 uppercase font-bold">
            <tr>
              <th class="py-2.5 px-3 w-10 text-left">#</th>
              <th class="py-2.5 px-3 text-left">Nama Barang / Kemasan / Operasional</th>
              <th class="py-2.5 px-3 text-left w-28">Jumlah (Pcs)</th>
              <th class="py-2.5 px-3 text-left w-36">Harga Satuan (Rp)</th>
              <th class="py-2.5 px-3 text-left w-36">Total Biaya (Rp)</th>
              <th class="py-2.5 px-4 text-left w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y text-stone-800">
            <tr v-if="packagingRows.length === 0">
              <td colspan="6" class="py-6 text-center text-stone-400 italic">
                Belum ada komponen modal lainnya. Klik "+ Tambah Item Manual" untuk memasukkan botol, box, atau stiker.
              </td>
            </tr>

            <tr v-for="(row, idx) in packagingRows" :key="row.id" class="hover:bg-stone-50">
              <td class="py-2 px-3 text-left text-stone-400 font-mono text-[11px]">
                {{ idx + 1 }}
              </td>

              <td class="py-2 px-3 text-left">
                <input
                  v-model="row.namaItem"
                  type="text"
                  placeholder="Misal: Botol Kaca Kotak 50ml / Stiker Gold Foil"
                  class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 font-medium"
                />
              </td>
              <td class="py-2 px-3 text-left">
                <input
                  v-model.number="row.jumlah"
                  type="number"
                  min="1"
                  class="w-20 px-2 py-1 text-xs border rounded-lg text-left font-mono font-bold"
                />
              </td>
              <td class="py-2 px-3 text-left">
                <input
                  v-model.number="row.hargaSatuan"
                  type="number"
                  min="0"
                  class="w-28 px-2 py-1 text-xs border rounded-lg text-left font-mono font-bold"
                />
              </td>
              <td class="py-2 px-3 text-left font-mono font-bold text-stone-900">
                {{ formatRupiah(row.jumlah * row.hargaSatuan) }}
              </td>
              <!-- Delete Row (Positioned Right, Aligned Left, Lucide Trash2) -->
              <td class="py-2 px-4 text-left">
                <button
                  type="button"
                  @click="removePackagingRow(idx)"
                  class="p-1 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs transition-colors"
                  title="Hapus Item"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-stone-50 border-t font-bold text-stone-900">
            <tr>
              <td colspan="4" class="py-2.5 px-3 text-left">Subtotal Modal Lainnya:</td>
              <td class="py-2.5 px-3 text-left font-mono text-indigo-950 text-sm font-bold">{{ formatRupiah(subtotalPackaging) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- GRAND TOTAL HPP & PROFIT SIMULATOR -->
    <div class="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-800 pb-6">
        <div>
          <span class="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            ✨ Grand Total Analisis Biaya
          </span>
          <h3 class="text-2xl font-bold font-serif text-white">
            {{ hppTitle || 'Perhitungan HPP Produk' }}
          </h3>
          <p class="text-xs text-stone-300 mt-1">
            Botol {{ targetBottleMl }} ml • Liquid: {{ formatRupiah(subtotalLiquid) }} • Modal Lainnya: {{ formatRupiah(subtotalPackaging) }}
          </p>
        </div>

        <!-- Big HPP Badges -->
        <div class="flex items-center gap-3">
          <div class="bg-stone-950/80 border border-stone-700/80 px-5 py-3 rounded-2xl text-center">
            <span class="text-[10px] uppercase font-bold text-stone-400 block">Grand Total HPP / Botol</span>
            <span class="text-2xl font-bold font-mono text-amber-400">{{ formatRupiah(grandTotalHpp) }}</span>
          </div>

          <div class="bg-stone-950/80 border border-stone-700/80 px-4 py-3 rounded-2xl text-center">
            <span class="text-[10px] uppercase font-bold text-stone-400 block">Biaya Modal</span>
            <span class="text-lg font-bold font-mono text-white">{{ formatRupiah(hppPerMl) }}</span>
          </div>
        </div>
      </div>

      <!-- Cost Split Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-xs text-stone-300">
          <span>🧪 Porsi Modal Liquid: <strong>{{ Math.round((subtotalLiquid / Math.max(grandTotalHpp, 1)) * 100) }}%</strong> ({{ formatRupiah(subtotalLiquid) }})</span>
          <span>📦 Porsi Modal Lainnya: <strong>{{ Math.round((subtotalPackaging / Math.max(grandTotalHpp, 1)) * 100) }}%</strong> ({{ formatRupiah(subtotalPackaging) }})</span>
        </div>
        <div class="w-full bg-stone-950 h-3 rounded-full overflow-hidden flex border border-stone-800">
          <div
            class="bg-amber-500 h-full transition-all duration-300"
            :style="{ width: Math.round((subtotalLiquid / Math.max(grandTotalHpp, 1)) * 100) + '%' }"
          ></div>
          <div
            class="bg-indigo-500 h-full transition-all duration-300"
            :style="{ width: Math.round((subtotalPackaging / Math.max(grandTotalHpp, 1)) * 100) + '%' }"
          ></div>
        </div>
      </div>

      <!-- Profit Margin Simulator -->
      <div class="bg-stone-950/60 rounded-2xl p-5 border border-stone-800 space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <TrendingUp class="w-4 h-4" />
            <span>Simulasi Margin Keuntungan & Harga Jual Rekomendasi</span>
          </h4>
          <span class="text-xs text-stone-400">Sesuaikan target profit margin</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Margin Input -->
          <div>
            <label class="block text-xs text-stone-300 mb-1">Target Profit Margin (%)</label>
            <div class="relative">
              <input
                v-model.number="targetMarginPercentage"
                type="number"
                min="0"
                step="5"
                class="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700 font-mono font-bold text-white pr-8 focus:ring-2 focus:ring-emerald-500/30"
              />
              <span class="absolute right-3 top-2.5 text-stone-400 text-xs font-bold">%</span>
            </div>
          </div>

          <!-- Recommended Selling Price -->
          <div>
            <label class="block text-xs text-stone-300 mb-1">Rekomendasi Harga Jual (Rp)</label>
            <div class="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 font-mono font-bold text-base text-emerald-300">
              {{ formatRupiah(recommendedSellingPrice) }}
            </div>
          </div>

          <!-- Net Profit per Bottle -->
          <div>
            <label class="block text-xs text-stone-300 mb-1">Estimasi Laba Bersih / Botol</label>
            <div class="px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 font-mono font-bold text-base text-emerald-400">
              +{{ formatRupiah(recommendedSellingPrice - grandTotalHpp) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="pt-2 flex justify-end gap-3">
        <button
          @click="saveHpp"
          class="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-950/50 transition-all transform active:scale-95 flex items-center gap-2"
        >
          <Save class="w-4 h-4" />
          <span>Simpan Hasil ke Katalog HPP</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { PackagingHppItem, HppLiquidIngredientDetail } from '../types';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { RotateCcw, Save, Plus, Trash2, FlaskConical, Package, TrendingUp, Menu } from 'lucide-vue-next';

const store = useKobichaStore();
const { formulaBases, racikanCatalog, stockCampuran, bahanBakuCampuranList, prefilledHppRacikanId, prefilledHppBaseId } = storeToRefs(store);

const hppTitle = ref('');
const targetBottleMl = ref(50);
const liquidMode = ref<'by_recipe' | 'manual'>('by_recipe');

const selectedBaseId = ref('');
const selectedRacikanId = ref('');
const manualLiquidPricePerMl = ref(450);

const targetMarginPercentage = ref(150);

// Section 2: Packaging Items
const packagingRows = ref<PackagingHppItem[]>([
  { id: 'pkg-1', namaItem: 'Botol Kaca Amber 50ml + Spray Atomizer', jumlah: 1, hargaSatuan: 9500, total: 9500 },
  { id: 'pkg-2', namaItem: 'Hardbox Packaging Custom Kobicha', jumlah: 1, hargaSatuan: 4500, total: 4500 },
  { id: 'pkg-3', namaItem: 'Stiker Label Gold Foil + Pita Segel', jumlah: 1, hargaSatuan: 1500, total: 1500 }
]);

function addManualPackagingRow() {
  packagingRows.value.push({
    id: 'pkg-' + Date.now(),
    namaItem: '',
    jumlah: 1,
    hargaSatuan: 1000,
    total: 1000
  });
}

function removePackagingRow(idx: number) {
  packagingRows.value.splice(idx, 1);
}

function addFromCampuranStock(e: Event) {
  const target = e.target as HTMLSelectElement;
  const campId = target.value;
  if (!campId) return;

  const item = stockCampuran.value.find(c => c.id === campId);
  if (item) {
    packagingRows.value.push({
      id: 'pkg-' + Date.now(),
      namaItem: item.namaBarang,
      jumlah: 1,
      hargaSatuan: item.hargaPerPcs,
      total: item.hargaPerPcs
    });
  }
  target.value = '';
}

function onBottleSizeChange() {
  recalculateLiquidFromRecipe();
}

// Section 1 Liquid Calculation from Recipe
export interface LiquidIngredientRow {
  nama: string;
  jenis: 'FO' | 'Campuran';
  stockCampuranId?: string;
  percentage: number;
  volumeMl: number;
  pricePerMl: number;
  cost: number;
}

const liquidIngredients = ref<LiquidIngredientRow[]>([]);

function recalculateLiquidFromRecipe() {
  const base = formulaBases.value.find(b => b.id === selectedBaseId.value);
  const racikan = racikanCatalog.value.find(r => r.id === selectedRacikanId.value);

  const result: LiquidIngredientRow[] = [];
  const bottleMl = targetBottleMl.value;

  const foPercent = base
    ? (base.ingredients.find(i => i.isFragranceOilConcentrate)?.percentage || 20)
    : (racikan?.foConcentrationPercentage || 20);

  const totalFoMl = (bottleMl * foPercent) / 100;

  // Fragrance Oils Breakdown
  if (racikan && racikan.fragranceOils.length > 0) {
    const totalDrops = racikan.fragranceOils.reduce((acc, f) => acc + (Number(f.tetes) || 0), 0) || 1;

    racikan.fragranceOils.forEach(f => {
      const foMl = (f.tetes / totalDrops) * totalFoMl;
      const foPercentInBottle = (foMl / bottleMl) * 100;
      const pricePerMl = store.getFoAveragePricePerMl(f.fragranceOilId);
      const cost = Math.round(foMl * pricePerMl);

      result.push({
        nama: f.fragranceOilName,
        jenis: 'FO',
        percentage: foPercentInBottle,
        volumeMl: foMl,
        pricePerMl,
        cost
      });
    });
  } else {
    // Fallback single generic FO
    result.push({
      nama: 'Fragrance Oil Concentrate (Generic)',
      jenis: 'FO',
      percentage: foPercent,
      volumeMl: totalFoMl,
      pricePerMl: 2000,
      cost: Math.round(totalFoMl * 2000)
    });
  }

  // Solvent & Additives Breakdown from Base
  if (base) {
    base.ingredients
      .filter(i => !i.isFragranceOilConcentrate)
      .forEach(i => {
        const vol = (bottleMl * i.percentage) / 100;
        
        // Find matching stock campuran in bahan baku list
        let matchedCamp = stockCampuran.value.find(c => c.id === i.stockCampuranId);
        if (!matchedCamp) {
          const lower = i.namaBahan.toLowerCase();
          matchedCamp = bahanBakuCampuranList.value.find(c => 
            c.namaBarang.toLowerCase().includes(lower) || lower.includes(c.namaBarang.toLowerCase()) || lower.includes(c.jenis.toLowerCase())
          );
        }

        const pricePerMl = matchedCamp 
          ? store.getCampuranAveragePricePerMl(matchedCamp.id) 
          : 65;
        const cost = Math.round(vol * pricePerMl);

        result.push({
          nama: matchedCamp?.namaBarang || i.namaBahan,
          stockCampuranId: matchedCamp?.id || '',
          jenis: 'Campuran',
          percentage: i.percentage,
          volumeMl: vol,
          pricePerMl,
          cost
        });
      });
  } else {
    // Default Ethanol 96%
    const defaultCamp = bahanBakuCampuranList.value.find(c => 
      c.jenis.toLowerCase().includes('pelarut') || c.namaBarang.toLowerCase().includes('ethanol') || c.namaBarang.toLowerCase().includes('alkohol')
    ) || bahanBakuCampuranList.value[0];

    const solventMl = bottleMl - totalFoMl;
    const pricePerMl = defaultCamp ? store.getCampuranAveragePricePerMl(defaultCamp.id) : 65;
    result.push({
      nama: defaultCamp?.namaBarang || 'Pelarut Ethanol 96%',
      stockCampuranId: defaultCamp?.id || '',
      jenis: 'Campuran',
      percentage: 100 - foPercent,
      volumeMl: solventMl,
      pricePerMl,
      cost: Math.round(solventMl * pricePerMl)
    });
  }

  liquidIngredients.value = result;
}

function onSelectCampuranItem(ing: LiquidIngredientRow) {
  if (!ing.stockCampuranId) return;
  const camp = stockCampuran.value.find(c => c.id === ing.stockCampuranId);
  if (camp) {
    ing.nama = camp.namaBarang;
    ing.pricePerMl = store.getCampuranAveragePricePerMl(camp.id);
    ing.cost = Math.round(ing.volumeMl * ing.pricePerMl);
  }
}

function onIngredientPercentChange(ing: LiquidIngredientRow) {
  ing.volumeMl = (targetBottleMl.value * ing.percentage) / 100;
  ing.cost = Math.round(ing.volumeMl * ing.pricePerMl);
}

function onIngredientPriceChange(ing: LiquidIngredientRow) {
  ing.cost = Math.round(ing.volumeMl * ing.pricePerMl);
}

function addCustomLiquidRow() {
  const defaultCamp = bahanBakuCampuranList.value[0];
  const pricePerMl = defaultCamp ? store.getCampuranAveragePricePerMl(defaultCamp.id) : 65;
  const percent = 5;
  const vol = (targetBottleMl.value * percent) / 100;

  liquidIngredients.value.push({
    nama: defaultCamp?.namaBarang || 'Bahan Pelarut / Aditif Tambahan',
    stockCampuranId: defaultCamp?.id || '',
    jenis: 'Campuran',
    percentage: percent,
    volumeMl: vol,
    pricePerMl,
    cost: Math.round(vol * pricePerMl)
  });
}

function removeLiquidIngredient(idx: number) {
  liquidIngredients.value.splice(idx, 1);
}

const subtotalLiquid = computed(() => {
  if (liquidMode.value === 'manual') {
    return Math.round(manualLiquidPricePerMl.value * targetBottleMl.value);
  }
  return liquidIngredients.value.reduce((acc, i) => acc + i.cost, 0);
});

const subtotalPackaging = computed(() => {
  return packagingRows.value.reduce((acc, p) => acc + (p.jumlah * p.hargaSatuan), 0);
});

const grandTotalHpp = computed(() => {
  return subtotalLiquid.value + subtotalPackaging.value;
});

const hppPerMl = computed(() => {
  return Math.round(grandTotalHpp.value / Math.max(targetBottleMl.value, 1));
});

const recommendedSellingPrice = computed(() => {
  const marginMultiplier = 1 + (targetMarginPercentage.value / 100);
  const rawPrice = grandTotalHpp.value * marginMultiplier;
  return Math.ceil(rawPrice / 500) * 500;
});

function resetForm() {
  selectedBaseId.value = formulaBases.value[0]?.id || '';
  selectedRacikanId.value = racikanCatalog.value[0]?.id || '';
  targetBottleMl.value = 50;
  targetMarginPercentage.value = 150;
  liquidMode.value = 'by_recipe';
  
  const r = racikanCatalog.value[0];
  hppTitle.value = `HPP ${r ? r.nama : 'Batch Baru'} (Botol 50ml)`;

  recalculateLiquidFromRecipe();
}

function saveHpp() {
  if (!hppTitle.value.trim()) {
    store.showToast('Masukkan nama analisis HPP terlebih dahulu', 'warning');
    return;
  }

  const base = formulaBases.value.find(b => b.id === selectedBaseId.value);
  const racikan = racikanCatalog.value.find(r => r.id === selectedRacikanId.value);

  const liquidDetails: HppLiquidIngredientDetail[] = liquidMode.value === 'by_recipe'
    ? liquidIngredients.value.map(i => ({
        nama: i.nama,
        jenis: i.jenis,
        volumeMl: i.volumeMl,
        biaya: i.cost
      }))
    : [
        {
          nama: 'Cairan Parfum Manual',
          jenis: 'FO',
          volumeMl: targetBottleMl.value,
          biaya: subtotalLiquid.value
        }
      ];

  const packagingItems: PackagingHppItem[] = packagingRows.value.map(p => ({
    id: p.id,
    namaItem: p.namaItem,
    jumlah: p.jumlah,
    hargaSatuan: p.hargaSatuan,
    total: p.jumlah * p.hargaSatuan
  }));

  store.addHppCalculation({
    nama: hppTitle.value,
    formulaBaseId: selectedBaseId.value || undefined,
    formulaBaseName: base?.nama || undefined,
    racikanId: selectedRacikanId.value || undefined,
    racikanName: racikan?.nama || undefined,
    targetBottleMl: targetBottleMl.value,
    subtotalLiquid: subtotalLiquid.value,
    subtotalPackaging: subtotalPackaging.value,
    grandTotalHpp: grandTotalHpp.value,
    hppPerMl: hppPerMl.value,
    targetMarginPercentage: targetMarginPercentage.value,
    recommendedSellingPrice: recommendedSellingPrice.value,
    packagingItems,
    liquidDetails
  });

  store.navigateTo('katalog-hpp');
}

onMounted(() => {
  if (prefilledHppRacikanId.value) {
    selectedRacikanId.value = prefilledHppRacikanId.value;
    if (prefilledHppBaseId.value) selectedBaseId.value = prefilledHppBaseId.value;
    const r = racikanCatalog.value.find(x => x.id === prefilledHppRacikanId.value);
    if (r) {
      hppTitle.value = `HPP ${r.nama} (Botol ${r.targetTotalMl || 50}ml)`;
      targetBottleMl.value = r.targetTotalMl || 50;
      if (r.formulaBaseId) selectedBaseId.value = r.formulaBaseId;
    }
    recalculateLiquidFromRecipe();
    prefilledHppRacikanId.value = null;
    prefilledHppBaseId.value = null;
  } else {
    resetForm();
  }
});
</script>
