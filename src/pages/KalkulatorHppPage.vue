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
          <label class="block text-xs font-semibold text-forest-800 mb-1">Nama Produk</label>
          <!-- Detail & Update Mode: Dropdown from Katalog HPP -->
          <div v-if="mode === 'detail_update'">
            <CustomSelect
              v-model="selectedHppId"
              :options="hppCatalogOptions"
              placeholder="-- Pilih Produk dari Katalog HPP --"
              :searchable="true"
              @change="onSelectHppFromCatalog"
            />
          </div>
          <!-- Tambah Baru Mode: Plain Text Input -->
          <div v-else>
            <input
              v-model="hppTitle"
              type="text"
              required
              placeholder="Misal: Kobicha Velvet Wood"
              class="w-full px-3.5 py-2 rounded-xl border border-sage-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 text-sm font-semibold bg-white"
            />
          </div>
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

    <!-- SECTION 1: HPP RESEP RACIKAN -->
    <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sage-100 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-2xl bg-peach-50 text-peach-700 border border-peach-200/80 flex items-center justify-center font-bold text-sm">
            <FlaskConical class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-base font-extrabold text-forest-900 font-rounded">1. HPP Resep Racikan</h4>
            <p class="text-xs text-sage-600">Biaya konsentrat fragrance oil dan bahan pelarut campuran</p>
          </div>
        </div>

        <!-- Mode Toggle (Tambah Baru on Left, Detail & Update on Right) -->
        <div class="flex items-center gap-1.5 bg-sage-50 p-1 rounded-2xl text-xs font-semibold border border-sage-200/60">
          <button
            type="button"
            @click="setMode('tambah_baru')"
            class="px-4 py-2 rounded-xl transition-all"
            :class="mode === 'tambah_baru' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900 font-semibold'"
          >
            Tambah Baru
          </button>
          <button
            type="button"
            @click="setMode('detail_update')"
            class="px-4 py-2 rounded-xl transition-all"
            :class="mode === 'detail_update' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900 font-semibold'"
          >
            Detail & Update
          </button>
        </div>
      </div>

      <!-- Formula Base & Racikan Selectors + Table Breakdown (Exact as in media_1788451316301.png) -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-sage-50/50 p-4 rounded-2xl border border-sage-200/80">
          <div>
            <label class="block text-xs font-bold text-forest-900 mb-1">1. Pilih Formula Base (Pelarut %)</label>
            <CustomSelect
              v-model="selectedBaseId"
              :options="baseOptions"
              placeholder="-- Pilih Template Formula Base --"
              :disabled="mode === 'detail_update'"
              @change="recalculateLiquidFromRecipe"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-forest-900 mb-1">2. Pilih Racikan Fragrance (Bibit FO)</label>
            <div v-if="mode === 'tambah_baru'">
              <button
                type="button"
                @click="openRacikanPickerModal"
                class="w-full bg-white text-left px-3.5 py-2 text-xs flex items-center justify-between border border-sage-200 hover:border-sage-300 rounded-xl cursor-pointer transition-all shadow-xs"
              >
                <span class="truncate" :class="!selectedRacikanId ? 'text-stone-400 font-normal' : 'text-stone-900 font-semibold'">
                  {{ selectedRacikanName || '-- Pilih Racikan dari Katalog --' }}
                </span>
                <ChevronDown class="w-3.5 h-3.5 text-stone-400 flex-shrink-0 ml-2" />
              </button>
            </div>
            <div v-else>
              <input
                type="text"
                :value="selectedRacikanName || '-'"
                disabled
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-100/80 border border-stone-200 text-stone-700 font-semibold cursor-not-allowed opacity-60"
              />
            </div>
          </div>
        </div>

        <!-- Liquid Ingredients Table Breakdown Container (Fixed Height with Fixed Header, Scrollable Body, and Fixed Footer at Bottom) -->
        <div class="border border-sage-200/90 rounded-2xl bg-white flex flex-col h-[420px] overflow-hidden shadow-sm">
          <!-- 1. FIXED HEADER -->
          <div class="bg-sage-50/80 border-b border-sage-200 flex-shrink-0">
            <table class="w-full text-xs text-left table-fixed">
              <thead class="text-[10px] text-forest-700 uppercase font-bold">
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
            </table>
          </div>

          <!-- 2. SCROLLABLE MIDDLE TBODY AREA -->
          <div class="overflow-y-auto overflow-x-hidden flex-1">
            <table class="w-full text-xs text-left table-fixed">
              <tbody class="divide-y divide-sage-100 text-stone-800">
                <tr v-if="liquidIngredients.length === 0">
                  <td colspan="8" class="py-12 text-center text-sage-400 italic">
                    Pilih Formula Base dan Racikan di atas untuk menghitung otomatis komposisi cairan.
                  </td>
                </tr>

                <tr v-for="(ing, idx) in liquidIngredients" :key="idx" class="hover:bg-sage-50/40 transition-colors">
                  <td class="py-2.5 px-3 text-left text-stone-400 font-mono text-[11px] w-10">
                    {{ idx + 1 }}
                  </td>

                  <!-- Nama & Dropdown Selector (Plain text for FO and Base items, Dropdown only for custom added rows) -->
                  <td class="py-2.5 px-3 text-left">
                    <div v-if="ing.jenis === 'FO'" class="space-y-0.5">
                      <span class="font-bold text-stone-900 block truncate">{{ ing.nama }}</span>
                      <span class="text-[10px] text-stone-500">Konsentrat Bibit Fragrance Oil</span>
                    </div>
                    
                    <div v-else-if="!ing.isCustomRow" class="space-y-0.5">
                      <span class="font-bold text-stone-900 block truncate">{{ ing.nama }}</span>
                      <span class="text-[10px] text-stone-500">Pelarut Formula Base</span>
                    </div>

                    <div v-else class="space-y-1.5">
                      <CustomSelect
                        v-model="ing.stockCampuranId"
                        :options="bahanBakuOptions"
                        placeholder="-- Pilih Cairan dari Stok Bahan Baku --"
                        :searchable="true"
                        @change="onSelectCampuranItem(ing)"
                      />
                      <span v-if="!ing.stockCampuranId" class="text-[10px] text-peach-800 font-medium block">
                        Pilih item dari stok bahan baku di atas untuk mengaitkan harga secara otomatis.
                      </span>
                    </div>
                  </td>

                  <!-- Tipe Badge -->
                  <td class="py-2.5 px-3 text-left w-24">
                    <span
                      class="px-1.5 py-0.5 rounded text-[10px] font-bold inline-block"
                      :class="ing.jenis === 'FO' ? 'bg-peach-100 text-peach-800 border border-peach-200' : 'bg-sage-100 text-forest-800 border border-sage-200'"
                    >
                      {{ ing.jenis }}
                    </span>
                  </td>

                  <!-- Persentase (%) -->
                  <td class="py-2.5 px-3 text-left font-mono w-24">
                    <input
                      v-if="ing.isCustomRow"
                      v-model.number="ing.percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      @input="onIngredientPercentChange(ing)"
                      class="w-16 px-1.5 py-1 text-xs border border-sage-200 rounded-lg text-left font-mono font-bold"
                    />
                    <span v-else class="text-xs font-semibold text-stone-700">
                      {{ formatNumber(ing.percentage, 2) }}%
                    </span>
                  </td>

                  <!-- Volume (ml) -->
                  <td class="py-2.5 px-3 text-left font-mono w-28">
                    <span class="text-xs font-semibold text-stone-700">
                      {{ formatNumber(ing.volumeMl, 2) }} ml
                    </span>
                  </td>

                  <!-- Harga per ml -->
                  <td class="py-2.5 px-3 text-left font-mono text-stone-600 w-32">
                    <input
                      v-if="ing.isCustomRow && !ing.stockCampuranId"
                      v-model.number="ing.pricePerMl"
                      type="number"
                      min="0"
                      placeholder="Rp/ml"
                      @input="recalculateLiquidFromRecipe"
                      class="w-24 px-1.5 py-1 text-xs border border-sage-200 rounded-lg text-left font-mono font-bold"
                    />
                    <span v-else class="text-xs">
                      {{ formatRupiah(ing.pricePerMl) }}
                    </span>
                  </td>

                  <!-- Subtotal Biaya -->
                  <td class="py-2.5 px-3 text-left font-mono font-bold text-stone-900 w-36">
                    {{ formatRupiah(ing.cost) }}
                  </td>

                  <!-- Delete Custom Row -->
                  <td class="py-2.5 px-3 text-left w-16">
                    <button
                      v-if="ing.isCustomRow"
                      type="button"
                      @click="removeLiquidIngredient(idx)"
                      class="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Hapus Bahan"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                    <span v-else class="text-stone-300 text-xs">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 3. FIXED FOOTER AT BOTTOM -->
          <div class="bg-sage-50/90 border-t border-sage-200 flex-shrink-0">
            <table class="w-full text-xs text-left table-fixed">
              <tfoot>
                <tr class="font-bold text-forest-900">
                  <th class="py-2.5 px-3 w-10 text-left"></th>
                  <th class="py-2.5 px-3 text-left">
                    <button
                      type="button"
                      @click="addCustomLiquidRow"
                      class="px-3 py-1.5 text-xs rounded-xl bg-sage-100 hover:bg-sage-200 text-forest-900 font-bold border border-sage-200 transition-colors inline-flex items-center gap-1"
                    >
                      <Plus class="w-3.5 h-3.5" />
                      <span>Tambah Cairan / Pelarut Lainnya</span>
                    </button>
                  </th>
                  <th class="py-2.5 px-3 text-left w-24"></th>
                  <th class="py-2.5 px-3 text-left w-24"></th>
                  <th class="py-2.5 px-3 text-left font-mono font-bold text-forest-900 w-28">{{ targetBottleMl }} ml</th>
                  <th class="py-2.5 px-3 text-left w-32"></th>
                  <th class="py-2.5 px-3 text-left font-mono text-forest-900 text-sm font-bold w-36">{{ formatRupiah(subtotalLiquid) }}</th>
                  <th class="py-2.5 px-3 text-left w-16"></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 2: MODAL LAINNYA (PACKAGING, BOTOL, STIKER & OPERASIONAL) -->
    <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sage-100 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-2xl bg-forest-50 text-forest-700 border border-sage-200 flex items-center justify-center font-bold text-sm">
            <Package class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-base font-extrabold text-forest-900 font-rounded">2. Modal Lainnya (Packaging, Botol, Stiker & Operasional)</h4>
            <p class="text-xs text-sage-600">
              Bebas input kemasan & operasional (botol kaca, sprayer, hardbox, stiker label, packaging bubble wrap, dsb)
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Button Ambil dari Stok Campuran -->
          <button
            type="button"
            @click="openStockCampuranPicker"
            class="px-4 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <Layers class="w-3.5 h-3.5" />
            <span>Ambil dari Stok Campuran</span>
          </button>

          <button
            type="button"
            @click="addManualPackagingRow"
            class="px-4 py-2.5 rounded-2xl bg-sage-50 hover:bg-sage-100 text-forest-800 border border-sage-200 text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah Item Manual</span>
          </button>
        </div>
      </div>

      <!-- Packaging Items Table (Action on Right, Header text-left, Lucide Trash2) -->
      <div class="overflow-x-auto border border-sage-200/90 rounded-2xl">
        <table class="w-full text-xs text-left">
          <thead class="bg-sage-50/80 border-b border-sage-200 text-[10px] text-forest-700 uppercase font-bold">
            <tr>
              <th class="py-2.5 px-3 w-10 text-left">#</th>
              <th class="py-2.5 px-3 text-left">Nama Barang / Kemasan / Operasional</th>
              <th class="py-2.5 px-3 text-left w-28">Jumlah (Pcs)</th>
              <th class="py-2.5 px-3 text-left w-36">Harga Satuan (Rp)</th>
              <th class="py-2.5 px-3 text-left w-36">Total Biaya (Rp)</th>
              <th class="py-2.5 px-4 text-left w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-sage-100 text-stone-800">
            <tr v-if="packagingRows.length === 0">
              <td colspan="6" class="py-6 text-center text-sage-400 italic">
                Belum ada komponen modal lainnya. Klik "+ Tambah Item Manual" untuk memasukkan botol, box, atau stiker.
              </td>
            </tr>

            <tr v-for="(row, idx) in packagingRows" :key="row.id" class="hover:bg-sage-50/40 transition-colors">
              <td class="py-2 px-3 text-left text-stone-400 font-mono text-[11px]">
                {{ idx + 1 }}
              </td>

              <td class="py-2 px-3 text-left">
                <input
                  v-model="row.namaItem"
                  type="text"
                  placeholder="Misal: Botol Kaca Kotak 50ml / Stiker Gold Foil"
                  class="w-full px-2.5 py-1.5 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-1 focus:ring-sage-500 font-medium"
                />
              </td>
              <td class="py-2 px-3 text-left">
                <input
                  v-model.number="row.jumlah"
                  type="number"
                  min="1"
                  class="w-20 px-2 py-1 text-xs border border-sage-200 rounded-lg text-left font-mono font-bold"
                />
              </td>
              <td class="py-2 px-3 text-left">
                <input
                  v-model.number="row.hargaSatuan"
                  type="number"
                  min="0"
                  class="w-28 px-2 py-1 text-xs border border-sage-200 rounded-lg text-left font-mono font-bold"
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
                  class="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  title="Hapus Item"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-sage-50/90 border-t border-sage-200 font-bold text-forest-900">
            <tr>
              <td colspan="4" class="py-2.5 px-3 text-right">Subtotal Modal Lainnya:</td>
              <td class="py-2.5 px-3 font-mono text-sm text-forest-900">{{ formatRupiah(subtotalPackaging) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- SUMMARY SECTION: GRAND TOTAL HPP & PROFIT SIMULATION -->
    <div class="bg-forest-900 rounded-[24px] p-6 text-white border border-forest-800 shadow-md space-y-5">
      <!-- Grand Total Top Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-800 pb-5">
        <div>
          <span class="text-xs uppercase font-bold text-sage-300 tracking-wider block mb-1">
            Grand Total Biaya Pokok Produksi (HPP)
          </span>
          <h3 class="text-2xl sm:text-3xl font-extrabold font-mono text-peach-300">
            {{ formatRupiah(grandTotalHpp) }}
            <span class="text-xs font-normal text-sage-400">/ botol {{ targetBottleMl }}ml</span>
          </h3>
          <p class="text-xs text-sage-400 mt-1">
            HPP per ml: <strong>{{ formatRupiah(grandTotalHpp / Math.max(targetBottleMl, 1)) }}</strong> / ml
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-forest-950/80 border border-forest-700/80 px-4 py-3 rounded-2xl text-center">
            <span class="text-[10px] uppercase font-bold text-sage-400 block">Modal Cairan</span>
            <span class="text-lg font-bold font-mono text-peach-400">{{ formatRupiah(subtotalLiquid) }}</span>
          </div>

          <div class="bg-forest-950/80 border border-forest-700/80 px-4 py-3 rounded-2xl text-center">
            <span class="text-[10px] uppercase font-bold text-sage-400 block">Modal Lainnya</span>
            <span class="text-lg font-bold font-mono text-sage-200">{{ formatRupiah(subtotalPackaging) }}</span>
          </div>
        </div>
      </div>

      <!-- Cost Proportion Progress Bar -->
      <div class="space-y-1.5">
        <div class="flex justify-between text-xs text-sage-300 font-semibold">
          <span>Komposisi: Cairan {{ Math.round((subtotalLiquid / Math.max(grandTotalHpp, 1)) * 100) }}%</span>
          <span>Modal Lainnya {{ Math.round((subtotalPackaging / Math.max(grandTotalHpp, 1)) * 100) }}%</span>
        </div>
        <div class="w-full bg-forest-950 h-2.5 rounded-full overflow-hidden flex border border-forest-800">
          <div
            class="bg-peach-500 h-full transition-all duration-300"
            :style="{ width: Math.round((subtotalLiquid / Math.max(grandTotalHpp, 1)) * 100) + '%' }"
          ></div>
          <div
            class="bg-sage-400 h-full transition-all duration-300"
            :style="{ width: Math.round((subtotalPackaging / Math.max(grandTotalHpp, 1)) * 100) + '%' }"
          ></div>
        </div>
      </div>

      <!-- Profit Margin Simulator -->
      <div class="bg-forest-950/70 rounded-2xl p-5 border border-forest-800/80 space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <TrendingUp class="w-4 h-4" />
            <span>Simulasi Margin Keuntungan & Harga Jual Rekomendasi</span>
          </h4>
          <span class="text-xs text-sage-400">Sesuaikan target profit margin</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Margin Input -->
          <div>
            <label class="block text-xs text-sage-300 mb-1 font-medium">Target Profit Margin (%)</label>
            <div class="relative">
              <input
                v-model.number="targetMarginPercentage"
                type="number"
                min="0"
                step="5"
                class="w-full px-3.5 py-2 rounded-xl bg-forest-950 border border-forest-700 font-mono font-bold text-white text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
              />
              <span class="absolute right-3.5 top-2.5 text-emerald-400 text-xs font-bold font-mono pointer-events-none">%</span>
            </div>
          </div>

          <!-- Recommended Selling Price -->
          <div>
            <label class="block text-xs text-sage-300 mb-1">Rekomendasi Harga Jual (Rp)</label>
            <div class="px-4 py-2 rounded-xl bg-forest-950/90 border border-emerald-500/40 font-mono font-bold text-base text-emerald-300">
              {{ formatRupiah(recommendedSellingPrice) }}
            </div>
          </div>

          <!-- Net Profit per Bottle -->
          <div>
            <label class="block text-xs text-sage-300 mb-1">Estimasi Laba Bersih / Botol</label>
            <div class="px-4 py-2 rounded-xl bg-forest-950/90 border border-forest-700 font-mono font-bold text-base text-emerald-400">
              +{{ formatRupiah(recommendedSellingPrice - grandTotalHpp) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="pt-2 flex justify-end gap-3">
        <button
          @click="saveHpp"
          class="px-6 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-sm font-bold shadow-pill transition-all transform active:scale-95 flex items-center gap-2"
        >
          <Save class="w-4 h-4" />
          <span>Simpan Hasil ke Katalog HPP</span>
        </button>
      </div>
    </div>

    <!-- Modal Picker: Ambil dari Stok Campuran & Kemasan -->
    <Modal
      :isOpen="isCampuranPickerModalOpen"
      title="Ambil Item dari Stok Campuran & Kemasan"
      subtitle="Pilih botol, sprayer, box, stiker, atau pelarut untuk dimasukkan ke rincian modal"
      maxWidth="2xl"
      @close="isCampuranPickerModalOpen = false"
    >
      <div class="space-y-4">
        <!-- Search & Filter Bar inside modal -->
        <div class="flex flex-col sm:flex-row gap-2.5">
          <div class="relative flex-1">
            <input
              v-model="campuranPickerSearch"
              type="text"
              placeholder="Cari nama barang / jenis / toko..."
              class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
            />
            <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
          </div>

          <div class="flex items-center gap-1 bg-sage-50 p-1 rounded-2xl text-xs font-semibold border border-sage-200/60">
            <button
              type="button"
              @click="campuranPickerFilterTipe = 'all'"
              class="px-3 py-1 rounded-xl transition-all"
              :class="campuranPickerFilterTipe === 'all' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900 font-semibold'"
            >
              Semua
            </button>
            <button
              type="button"
              @click="campuranPickerFilterTipe = 'packaging'"
              class="px-3 py-1 rounded-xl transition-all"
              :class="campuranPickerFilterTipe === 'packaging' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900 font-semibold'"
            >
              Kemasan
            </button>
            <button
              type="button"
              @click="campuranPickerFilterTipe = 'bahan_baku'"
              class="px-3 py-1 rounded-xl transition-all"
              :class="campuranPickerFilterTipe === 'bahan_baku' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900 font-semibold'"
            >
              Bahan Baku
            </button>
          </div>
        </div>

        <!-- List of items -->
        <div class="border border-sage-200/90 rounded-2xl max-h-80 overflow-y-auto divide-y divide-sage-100">
          <div
            v-if="filteredCampuranPickerList.length === 0"
            class="py-12 text-center text-sage-400 text-xs italic"
          >
            Tidak ada item stok campuran yang sesuai pencarian.
          </div>

          <div
            v-for="item in filteredCampuranPickerList"
            :key="item.id"
            class="p-3 hover:bg-sage-50/40 flex items-center justify-between gap-3 transition-colors"
          >
            <div class="space-y-0.5 flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-bold text-stone-900 text-xs truncate">{{ item.namaBarang }}</span>
                <span
                  class="px-1.5 py-0.2 rounded text-[9px] font-bold"
                  :class="item.isBahanBaku ? 'bg-peach-100 text-peach-800 border border-peach-200' : 'bg-sage-100 text-forest-800 border border-sage-200'"
                >
                  {{ item.isBahanBaku ? 'Bahan Baku' : 'Kemasan' }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-[11px] text-stone-500">
                <span>{{ item.jenis }}</span>
                <span>•</span>
                <span>{{ item.storeName }}</span>
                <span>•</span>
                <span class="font-mono font-semibold text-stone-800">{{ formatRupiah(item.hargaPerPcs) }} / pcs</span>
              </div>
            </div>

            <button
              type="button"
              @click="addCampuranItemToPackaging(item)"
              class="px-3.5 py-1.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-white shadow-pill text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Modal Picker: Pilih Racikan dari Katalog -->
    <Modal
      :isOpen="isRacikanPickerModalOpen"
      title="Pilih Resep Racikan dari Katalog"
      subtitle="Pilih racikan fragrance yang sudah tersimpan untuk dimuat ke kalkulasi HPP"
      maxWidth="2xl"
      @close="isRacikanPickerModalOpen = false"
    >
      <div class="space-y-4">
        <!-- Search & Filter Bar inside modal -->
        <div class="flex flex-col sm:flex-row gap-2.5">
          <div class="relative flex-1">
            <input
              v-model="racikanPickerSearch"
              type="text"
              placeholder="Cari nama racikan / notes / tanggal..."
              class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 bg-white"
            />
            <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-sage-400" />
          </div>

          <div class="flex items-center gap-1 bg-sage-50 p-1 rounded-2xl text-xs font-semibold border border-sage-200/60">
            <button
              type="button"
              @click="racikanPickerFilter = 'all'"
              class="px-3 py-1 rounded-xl transition-all"
              :class="racikanPickerFilter === 'all' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900 font-semibold'"
            >
              Semua ({{ racikanCatalog.length }})
            </button>
            <button
              type="button"
              @click="racikanPickerFilter = 'commission'"
              class="px-3 py-1 rounded-xl transition-all"
              :class="racikanPickerFilter === 'commission' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900 font-semibold'"
            >
              Commission
            </button>
            <button
              type="button"
              @click="racikanPickerFilter = 'standard'"
              class="px-3 py-1 rounded-xl transition-all"
              :class="racikanPickerFilter === 'standard' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900 font-semibold'"
            >
              Standar
            </button>
          </div>
        </div>

        <!-- List of racikan items -->
        <div class="border border-sage-200/90 rounded-2xl max-h-80 overflow-y-auto divide-y divide-sage-100">
          <div
            v-if="filteredRacikanPickerList.length === 0"
            class="py-12 text-center text-sage-400 text-xs italic"
          >
            Tidak ada data resep racikan yang sesuai pencarian.
          </div>

          <div
            v-for="item in filteredRacikanPickerList"
            :key="item.id"
            class="p-3.5 hover:bg-sage-50/40 flex items-center justify-between gap-3 transition-colors"
            :class="selectedRacikanId === item.id ? 'bg-peach-50/70 border-l-4 border-peach-500' : ''"
          >
            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-stone-900 text-xs truncate">{{ item.nama }}</span>
                <span
                  v-if="item.isCommission"
                  class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-peach-100 text-peach-900 border border-peach-300"
                >
                  Commission Order
                </span>
                <span v-if="selectedRacikanId === item.id" class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Sedang Dipilih
                </span>
              </div>
              <div class="flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
                <span>{{ item.fragranceOils.length }} Komposisi Bibit FO</span>
                <span>•</span>
                <span>{{ item.fragranceOils.reduce((s, fo) => s + (fo.tetes || 0), 0) }} Tetes</span>
                <span>•</span>
                <span>Dibuat: {{ item.tanggalDibuat }}</span>
              </div>
            </div>

            <button
              type="button"
              @click="selectRacikanFromPicker(item.id)"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
              :class="selectedRacikanId === item.id ? 'bg-emerald-600 text-white shadow-xs' : 'bg-peach-500 hover:bg-peach-600 text-white shadow-pill'"
            >
              <Check v-if="selectedRacikanId === item.id" class="w-3.5 h-3.5" />
              <span>{{ selectedRacikanId === item.id ? 'Terpilih' : 'Pilih Racikan' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { PackagingHppItem, HppLiquidIngredientDetail, StockCampuran } from '../types';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { RotateCcw, Save, Plus, Trash2, FlaskConical, Package, TrendingUp, Menu, Layers, Search, Check, ChevronDown } from 'lucide-vue-next';
import CustomSelect from '../components/common/CustomSelect.vue';
import Modal from '../components/common/Modal.vue';

const store = useKobichaStore();
const { formulaBases, racikanCatalog, stockCampuran, bahanBakuCampuranList, hppCatalog, prefilledHppRacikanId, prefilledHppBaseId } = storeToRefs(store);

const mode = ref<'tambah_baru' | 'detail_update'>('tambah_baru');
const editingHppId = ref<string | null>(null);

const hppTitle = ref('');
const selectedHppId = ref('');
const targetBottleMl = ref(50);

const selectedBaseId = ref('');
const selectedRacikanId = ref('');

const isCampuranPickerModalOpen = ref(false);
const campuranPickerSearch = ref('');
const campuranPickerFilterTipe = ref<'all' | 'packaging' | 'bahan_baku'>('all');

const filteredCampuranPickerList = computed(() => {
  let list = [...stockCampuran.value];
  if (campuranPickerFilterTipe.value === 'packaging') {
    list = list.filter(c => !c.isBahanBaku);
  } else if (campuranPickerFilterTipe.value === 'bahan_baku') {
    list = list.filter(c => c.isBahanBaku);
  }
  if (campuranPickerSearch.value.trim()) {
    const q = campuranPickerSearch.value.toLowerCase();
    list = list.filter(c =>
      c.namaBarang.toLowerCase().includes(q) ||
      c.jenis.toLowerCase().includes(q) ||
      c.storeName.toLowerCase().includes(q)
    );
  }
  return list;
});

function openStockCampuranPicker() {
  campuranPickerSearch.value = '';
  campuranPickerFilterTipe.value = 'all';
  isCampuranPickerModalOpen.value = true;
}

function addCampuranItemToPackaging(item: StockCampuran) {
  packagingRows.value.push({
    id: 'pkg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
    namaItem: item.namaBarang,
    jumlah: 1,
    hargaSatuan: item.hargaPerPcs,
    total: item.hargaPerPcs
  });
  store.showToast(`"${item.namaBarang}" ditambahkan ke rincian modal!`, 'success');
}

// Racikan Modal Picker State & Methods
const isRacikanPickerModalOpen = ref(false);
const racikanPickerSearch = ref('');
const racikanPickerFilter = ref<'all' | 'commission' | 'standard'>('all');

const filteredRacikanPickerList = computed(() => {
  let list = [...racikanCatalog.value];
  if (racikanPickerFilter.value === 'commission') {
    list = list.filter(r => r.isCommission);
  } else if (racikanPickerFilter.value === 'standard') {
    list = list.filter(r => !r.isCommission);
  }
  if (racikanPickerSearch.value.trim()) {
    const q = racikanPickerSearch.value.toLowerCase();
    list = list.filter(r =>
      r.nama.toLowerCase().includes(q) ||
      (r.deskripsi && r.deskripsi.toLowerCase().includes(q)) ||
      r.tanggalDibuat.toLowerCase().includes(q)
    );
  }
  return list;
});

function openRacikanPickerModal() {
  racikanPickerSearch.value = '';
  racikanPickerFilter.value = 'all';
  isRacikanPickerModalOpen.value = true;
}

function selectRacikanFromPicker(id: string) {
  selectedRacikanId.value = id;
  recalculateLiquidFromRecipe();
  isRacikanPickerModalOpen.value = false;
  const racikan = racikanCatalog.value.find(r => r.id === id);
  if (racikan) {
    store.showToast(`Resep "${racikan.nama}" berhasil dipilih!`, 'success');
  }
}

const selectedRacikanName = computed(() => {
  const r = racikanCatalog.value.find(x => x.id === selectedRacikanId.value);
  return r ? `${r.nama} (${r.fragranceOils.length} FO)` : '';
});

const targetMarginPercentage = ref(150);

const hppCatalogOptions = computed(() => [
  { value: '', label: '-- Pilih Produk dari Katalog HPP --' },
  ...hppCatalog.value.map(h => ({
    value: h.id,
    label: `${h.nama} (${h.targetBottleMl}ml)`
  }))
]);

const baseOptions = computed(() => [
  { value: '', label: '-- Pilih Template Formula Base --' },
  ...formulaBases.value.map(b => ({ value: b.id, label: b.nama }))
]);

const racikanOptions = computed(() => [
  { value: '', label: '-- Pilih Racikan dari Katalog --' },
  ...racikanCatalog.value.map(r => ({ value: r.id, label: `${r.nama} (${r.tanggalDibuat})` }))
]);

const bahanBakuOptions = computed(() => [
  { value: '', label: '-- Pilih Cairan dari Stok Bahan Baku --' },
  ...bahanBakuCampuranList.value.map(c => ({
    value: c.id,
    label: `${c.namaBarang} — (${formatRupiah(store.getCampuranAveragePricePerMl(c.id))}/ml)`
  }))
]);

function setMode(m: 'tambah_baru' | 'detail_update') {
  mode.value = m;
  if (m === 'tambah_baru') {
    resetForm();
    mode.value = 'tambah_baru';
  } else {
    selectedHppId.value = '';
    hppTitle.value = '';
    selectedBaseId.value = '';
    selectedRacikanId.value = '';
    liquidIngredients.value = [];
    packagingRows.value = [];
    editingHppId.value = null;
  }
}

function onSelectHppFromCatalog() {
  if (!selectedHppId.value) {
    hppTitle.value = '';
    selectedBaseId.value = '';
    selectedRacikanId.value = '';
    liquidIngredients.value = [];
    packagingRows.value = [];
    editingHppId.value = null;
    return;
  }
  const h = hppCatalog.value.find(x => x.id === selectedHppId.value);
  if (h) {
    editingHppId.value = h.id;
    hppTitle.value = h.nama;
    targetBottleMl.value = h.targetBottleMl || 50;
    targetMarginPercentage.value = h.targetMarginPercentage || 150;
    selectedBaseId.value = h.formulaBaseId || '';
    selectedRacikanId.value = h.racikanId || '';

    if (h.formulaBaseId || h.racikanId) {
      recalculateLiquidFromRecipe();
    } else if (h.liquidDetails && h.liquidDetails.length > 0) {
      liquidIngredients.value = h.liquidDetails.map(d => ({
        nama: d.nama,
        jenis: d.jenis,
        volumeMl: d.volumeMl,
        pricePerMl: Math.round(d.biaya / Math.max(d.volumeMl, 1)),
        percentage: (d.volumeMl / Math.max(h.targetBottleMl, 1)) * 100,
        cost: d.biaya,
        isCustomRow: false
      }));
    }

    packagingRows.value = (h.packagingItems || []).map(p => ({
      id: p.id || 'pkg-' + Math.random(),
      namaItem: p.namaItem,
      jumlah: p.jumlah,
      hargaSatuan: p.hargaSatuan,
      total: p.total
    }));
  }
}

// Section 2: Packaging Items
const packagingRows = ref<PackagingHppItem[]>([]);

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

function onBottleSizeChange() {
  if (selectedRacikanId.value || selectedBaseId.value) {
    recalculateLiquidFromRecipe();
  }
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
  isCustomRow?: boolean;
}

const liquidIngredients = ref<LiquidIngredientRow[]>([]);

function recalculateLiquidFromRecipe() {
  const base = formulaBases.value.find(b => b.id === selectedBaseId.value);
  const racikan = racikanCatalog.value.find(r => r.id === selectedRacikanId.value);

  if (!base && !racikan) {
    liquidIngredients.value = [];
    return;
  }

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
        cost,
        isCustomRow: false
      });
    });
  } else if (foPercent > 0) {
    // Fallback single generic FO
    result.push({
      nama: 'Fragrance Oil Concentrate (Generic)',
      jenis: 'FO',
      percentage: foPercent,
      volumeMl: totalFoMl,
      pricePerMl: 2000,
      cost: Math.round(totalFoMl * 2000),
      isCustomRow: false
    });
  }

  // Solvent & Additives Breakdown from Base
  if (base) {
    base.ingredients
      .filter(i => !i.isFragranceOilConcentrate)
      .forEach(i => {
        const vol = (bottleMl * i.percentage) / 100;
        
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
          cost,
          isCustomRow: false
        });
      });
  } else if (bottleMl > totalFoMl) {
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
      cost: Math.round(solventMl * pricePerMl),
      isCustomRow: false
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
    cost: Math.round(vol * pricePerMl),
    isCustomRow: true
  });
}

function removeLiquidIngredient(idx: number) {
  liquidIngredients.value.splice(idx, 1);
}

const subtotalLiquid = computed(() => {
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
  editingHppId.value = null;
  selectedHppId.value = '';
  selectedBaseId.value = '';
  selectedRacikanId.value = '';
  targetBottleMl.value = 50;
  targetMarginPercentage.value = 150;
  mode.value = 'tambah_baru';
  hppTitle.value = '';
  liquidIngredients.value = [];
  packagingRows.value = [];
}

function saveHpp() {
  if (!hppTitle.value.trim()) {
    store.showToast('Masukkan nama produk terlebih dahulu', 'warning');
    return;
  }

  const base = formulaBases.value.find(b => b.id === selectedBaseId.value);
  const racikan = racikanCatalog.value.find(r => r.id === selectedRacikanId.value);

  const liquidDetails: HppLiquidIngredientDetail[] = liquidIngredients.value.map(i => ({
    nama: i.nama,
    jenis: i.jenis,
    volumeMl: i.volumeMl,
    biaya: i.cost
  }));

  const packagingItems: PackagingHppItem[] = packagingRows.value.map(p => ({
    id: p.id,
    namaItem: p.namaItem,
    jumlah: p.jumlah,
    hargaSatuan: p.hargaSatuan,
    total: p.jumlah * p.hargaSatuan
  }));

  const payload = {
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
  };

  if (mode.value === 'detail_update' && editingHppId.value) {
    store.updateHppCalculation(editingHppId.value, payload);
  } else {
    store.addHppCalculation(payload);
  }

  store.navigateTo('katalog-hpp');
}

onMounted(() => {
  if (prefilledHppRacikanId.value) {
    mode.value = 'tambah_baru';
    selectedRacikanId.value = prefilledHppRacikanId.value;
    if (prefilledHppBaseId.value) selectedBaseId.value = prefilledHppBaseId.value;
    const r = racikanCatalog.value.find(x => x.id === prefilledHppRacikanId.value);
    if (r) {
      hppTitle.value = r.nama;
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
