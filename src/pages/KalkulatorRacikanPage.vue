<template>
  <div class="space-y-6">
    <!-- Top Action Card -->
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
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Kalkulator Racikan Fragrance (Formulator)</h3>
          <p class="text-xs text-sage-600">
            Kalkulasi porsi tetes, konversi ke ml konsentrat bibit FO, dan estimasi otomatis formula parfum
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
          @click="saveRacikan"
          class="px-5 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-pill transition-all flex items-center gap-1.5"
        >
          <Save class="w-4 h-4" />
          <span>Simpan ke Katalog Racikan</span>
        </button>
      </div>
    </div>

    <!-- Yellow Info Alert (Not Bold) -->
    <div class="bg-amber-50 border border-amber-200/90 rounded-2xl p-3.5 px-4 flex items-center gap-2.5 text-amber-900 text-xs shadow-xs">
      <Info class="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span class="font-normal text-amber-800">
        Formula Base sama Target total botol itu ga ke simpen di katalog, dia cuma buat bantu perhitungan aja.
      </span>
    </div>

    <!-- Formula Mode Selector & General Configurations -->
    <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-5">
      <!-- Mode Toggle -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sage-100 pb-4">
        <div>
          <label class="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-0.5">Mode Formulasi:</label>
          <p class="text-xs text-sage-600">Pilih Racik Manual atau By Resep yang sudah tersimpan di Katalog</p>
        </div>

        <div class="flex items-center gap-2 bg-sage-50 p-1 rounded-2xl text-xs font-semibold border border-sage-200/60">
          <button
            type="button"
            @click="setMode('manual')"
            class="px-4 py-2 rounded-xl transition-all"
            :class="mode === 'manual' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900'"
          >
            Mode Manual (Bebas)
          </button>
          <button
            type="button"
            @click="setMode('by_resep')"
            class="px-4 py-2 rounded-xl transition-all"
            :class="mode === 'by_resep' ? 'bg-peach-500 text-white shadow-pill font-bold' : 'text-sage-700 hover:text-forest-900'"
          >
            Mode By Resep Katalog
          </button>
        </div>
      </div>

      <!-- Mode By Resep Selector -->
      <div v-if="mode === 'by_resep'" class="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="space-y-0.5">
          <label class="block text-xs font-bold text-amber-950">Resep Racikan Terpilih:</label>
          <div v-if="selectedRacikanCatalogId" class="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <Check class="w-3.5 h-3.5 text-emerald-600" />
            <span>{{ namaRacikan }}</span>
          </div>
          <span v-else class="text-xs text-stone-500 italic">Belum ada resep racikan yang dipilih dari katalog.</span>
        </div>
        <button
          type="button"
          @click="openRacikanPickerModal"
          class="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <Layers class="w-3.5 h-3.5" />
          <span>{{ selectedRacikanCatalogId ? 'Ganti Resep Racikan' : '+ Pilih Racikan dari Katalog' }}</span>
        </button>
      </div>

      <!-- Formula Base Template & Commission Toggle (Positioned on Top) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">
            Formula Base Pelarut{{ mode === 'manual' ? ' (Opsional)' : '' }}
          </label>
          <CustomSelect
            v-model="selectedBaseId"
            :options="baseOptions"
            placeholder="-- Bebas / Tanpa Formula Base --"
            @change="applyBaseTemplate"
          />
        </div>

        <div class="flex items-center gap-1.5 pt-4 sm:pt-6">
          <input
            v-model="isCommission"
            type="checkbox"
            id="commCheck"
            class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer w-4 h-4"
          />
          <label for="commCheck" class="text-xs font-semibold text-stone-700 cursor-pointer select-none">
            Commission Order
          </label>
        </div>
      </div>

      <!-- Target Formulation Inputs -->
      <div
        class="grid gap-4 pt-2 border-t border-stone-100"
        :class="mode === 'manual' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'"
      >
        <div v-if="mode === 'manual'">
          <label class="block text-xs font-semibold text-stone-700 mb-1">Nama Racikan / Formula</label>
          <input
            v-model="namaRacikan"
            type="text"
            required
            placeholder="Misal: Kobicha Velvet Rose Extrait"
            class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-semibold"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Target Total Botol Parfum (ml)</label>
          <div class="relative">
            <input
              v-model.number="targetTotalMl"
              type="number"
              min="1"
              required
              class="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm font-mono font-bold pr-8"
            />
            <span class="absolute right-3 top-2.5 text-stone-400 text-xs font-bold">ml</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1">Konsentrasi Fragrance Oil (%)</label>
          <div class="relative">
            <input
              v-model.number="foConcentrationPercentage"
              type="number"
              min="1"
              max="100"
              required
              :disabled="Boolean(selectedBaseId)"
              class="w-full px-3.5 py-2 rounded-xl text-sm font-mono font-bold pr-8 transition-colors"
              :class="selectedBaseId ? 'bg-stone-100/90 text-stone-500 cursor-not-allowed border-stone-200 select-none' : 'bg-white border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-stone-900'"
            />
            <span class="absolute right-3 top-2.5 text-xs font-bold" :class="selectedBaseId ? 'text-stone-400' : 'text-stone-500'">%</span>
          </div>
          <span v-if="selectedBaseId" class="text-[10px] text-amber-700 mt-1 block font-medium">
            Terkunci dari Formula Base (Pilih <em>Bebas</em> untuk edit manual)
          </span>
          <span v-else class="text-[10px] text-stone-400 mt-1 block">
            Target FO: <strong>{{ formatNumber(targetTotalFoMl, 2) }} ml</strong> dari {{ targetTotalMl }} ml
          </span>
        </div>
      </div>
    </div>

    <!-- MAIN FORMULATION SECTION (Drops to ml Proportion Calculator) -->
    <div class="bg-white rounded-[24px] border border-sage-100 p-5 sm:p-6 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h4 class="text-sm font-bold text-stone-900 font-serif">Komposisi Fragrance Oil (Tetes & Persentase FO)</h4>
          <p class="text-xs text-stone-500">
            Input jumlah tetes bibit FO. Volume ml dan rasio % akan dihitung proporsional terhadap target {{ targetTotalFoMl }} ml
          </p>
        </div>

        <button
          v-if="mode === 'manual'"
          type="button"
          @click="openFoPickerModal()"
          class="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>+ Tambah FO dari Stok</span>
        </button>
      </div>

      <!-- Drops & Volume Table Container (Fixed Height with Fixed Header, Fixed Footer, and Scrollable Body) -->
      <div class="border border-stone-200/90 rounded-xl bg-white flex flex-col h-[260px] overflow-hidden shadow-sm">
        <!-- 1. FIXED HEADER -->
        <div class="bg-stone-100/90 border-b border-stone-200 flex-shrink-0">
          <table class="w-full text-xs text-left table-fixed">
            <thead class="text-[10px] text-stone-500 uppercase font-bold">
              <tr>
                <th class="py-2.5 px-3 w-10 text-left">#</th>
                <th class="py-2.5 px-3 text-left">Nama Fragrance Oil</th>
                <th class="py-2.5 px-3 text-left w-20">Pyramid</th>
                <th class="py-2.5 px-3 text-left w-28">Jumlah Tetes</th>
                <th class="py-2.5 px-3 text-left w-24">Porsi (% FO)</th>
                <th class="py-2.5 px-3 text-left w-28">Volume (ml)</th>
                <th class="py-2.5 px-3 text-left w-36">Estimasi Biaya FO</th>
                <th class="py-2.5 px-4 text-left w-16">Aksi</th>
              </tr>
            </thead>
          </table>
        </div>

        <!-- 2. SCROLLABLE MIDDLE TBODY AREA -->
        <div class="overflow-y-auto overflow-x-hidden flex-1">
          <table class="w-full text-xs text-left table-fixed">
            <tbody class="divide-y text-stone-800">
              <tr v-if="rows.length === 0">
                <td colspan="8" class="py-12 text-center text-stone-400 italic">
                  <span v-if="mode === 'by_resep' && !selectedRacikanCatalogId">
                    Silakan pilih resep racikan dari katalog di atas terlebih dahulu untuk memuat komposisi Fragrance Oil.
                  </span>
                  <span v-else>
                    Belum ada bahan Fragrance Oil. Klik "+ Ambil dari Stok FO" atau "+ Tambah FO" untuk menambahkan bibit parfum.
                  </span>
                </td>
              </tr>

              <tr v-for="(row, idx) in rows" :key="row.id" class="hover:bg-stone-50 transition-colors">
                <td class="py-2 px-3 text-left text-stone-400 font-mono text-[11px] w-10">
                  {{ idx + 1 }}
                </td>

                <!-- Select Fragrance Oil -->
                <td class="py-2 px-3 text-left">
                  <div class="flex items-center gap-1.5">
                    <div class="flex-1 min-w-0">
                      <CustomSelect
                        v-model="row.fragranceOilId"
                        :options="foOptions"
                        placeholder="-- Pilih Fragrance Oil --"
                        :searchable="true"
                        :disabled="mode === 'by_resep'"
                        @change="onFoSelect(row)"
                      />
                    </div>
                    <button
                      v-if="mode === 'manual'"
                      type="button"
                      @click="openFoPickerModal(row)"
                      class="p-2 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-900 border border-stone-200 transition-colors flex-shrink-0"
                      title="Cari dari Stok Fragrance Oil"
                    >
                      <Search class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

                <!-- Pyramid Badge -->
                <td class="py-2 px-3 text-left w-20">
                  <span
                    v-if="getRowPyramid(row)"
                    class="px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap inline-block"
                    :class="PYRAMID_BADGE_MAP[getRowPyramid(row)!]?.bg"
                  >
                    {{ getRowPyramid(row) }}
                  </span>
                  <span v-else class="text-stone-300 text-xs">-</span>
                </td>

                <!-- Jumlah Tetes -->
                <td class="py-2 px-3 text-left w-28">
                  <input
                    v-model.number="row.tetes"
                    type="number"
                    min="1"
                    required
                    :disabled="mode === 'by_resep'"
                    class="w-20 px-2 py-1 text-xs border rounded-lg text-left font-mono font-bold transition-colors"
                    :class="mode === 'by_resep' ? 'bg-stone-100 text-stone-500 cursor-not-allowed border-stone-200' : 'bg-white border-stone-300'"
                  />
                </td>

                <!-- % FO -->
                <td class="py-2 px-3 text-left font-mono font-semibold text-amber-950 w-24">
                  {{ formatNumber(getRowPercentage(row), 1) }}%
                </td>

                <!-- ml FO -->
                <td class="py-2 px-3 text-left font-mono font-bold text-stone-900 bg-amber-50/50 w-28">
                  {{ formatNumber(getRowMl(row), 2) }} ml
                </td>

                <!-- Estimasi Biaya FO -->
                <td class="py-2 px-3 text-left font-mono text-stone-700 w-36">
                  {{ formatRupiah(getRowCost(row)) }}
                </td>

                <!-- Delete Row Action -->
                <td class="py-2 px-4 text-left w-16">
                  <button
                    v-if="mode === 'manual'"
                    type="button"
                    @click="removeRow(idx)"
                    class="p-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                    title="Hapus Baris FO"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                  <span v-else class="text-stone-300 text-xs">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 3. FIXED FOOTER AT THE BOTTOM -->
        <div class="bg-stone-50 border-t border-stone-200 flex-shrink-0">
          <table class="w-full text-xs text-left table-fixed">
            <tfoot>
              <tr class="font-bold text-stone-900">
                <th class="py-3 px-3 w-10 text-left"></th>
                <th class="py-3 px-3 text-left">Total Komposisi FO:</th>
                <th class="py-3 px-3 text-left w-20"></th>
                <th class="py-3 px-3 text-left font-mono text-amber-950 w-28">{{ totalDrops }} Tetes</th>
                <th class="py-3 px-3 text-left font-mono text-amber-950 w-24">100%</th>
                <th class="py-3 px-3 text-left font-mono text-amber-950 w-28">{{ formatNumber(targetTotalFoMl, 2) }} ml</th>
                <th class="py-3 px-3 text-left font-mono text-amber-950 w-36">{{ formatRupiah(totalFoCost) }}</th>
                <th class="py-3 px-4 text-left w-16"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- SUMMARY CARD -->
    <div class="bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-800 pb-6">
        <div>
          <span class="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            🧪 Ringkasan Formula Botol {{ targetTotalMl }} ml
          </span>
          <h3 class="text-2xl font-bold font-serif text-white">
            {{ namaRacikan || 'Nama Racikan Baru' }}
          </h3>
          <p class="text-xs text-stone-300 mt-1">
            Konsentrasi FO: {{ foConcentrationPercentage }}% ({{ targetTotalFoMl }} ml) • Pelarut Base: {{ targetTotalMl - targetTotalFoMl }} ml
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-stone-950/80 border border-stone-700/80 px-4 py-3 rounded-2xl text-center">
            <span class="text-[10px] uppercase font-bold text-stone-400 block">Total Tetes FO</span>
            <span class="text-xl font-bold font-mono text-amber-400">{{ totalDrops }} Tetes</span>
          </div>

          <div class="bg-stone-950/80 border border-stone-700/80 px-4 py-3 rounded-2xl text-center">
            <span class="text-[10px] uppercase font-bold text-stone-400 block">Estimasi Modal FO</span>
            <span class="text-xl font-bold font-mono text-white">{{ formatRupiah(totalFoCost) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div class="text-xs text-stone-400">
          💡 Data racikan dapat langsung disimpan atau diteruskan ke Kalkulator HPP untuk menghitung biaya botol & packaging.
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="saveAndGoToHpp"
            class="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold border border-stone-700 transition-all flex items-center gap-1.5"
          >
            <DollarSign class="w-3.5 h-3.5" />
            <span>Lanjut Hitung HPP</span>
          </button>

          <button
            @click="saveRacikan"
            class="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-950/50 transition-all flex items-center gap-1.5"
          >
            <Save class="w-4 h-4" />
            <span>Simpan ke Katalog</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Picker: Pilih Fragrance Oil dari Stok -->
    <Modal
      :isOpen="isFoPickerModalOpen"
      title="Pilih Fragrance Oil dari Stok"
      subtitle="Cari dan pilih bibit parfum (FO/EO) untuk ditambahkan ke racikan"
      maxWidth="2xl"
      @close="isFoPickerModalOpen = false"
    >
      <div class="space-y-4">
        <!-- Search & Filter Bar inside modal -->
        <div class="flex flex-col sm:flex-row gap-2.5">
          <div class="relative flex-1">
            <input
              v-model="foPickerSearch"
              type="text"
              placeholder="Cari nama FO / aroma notes / supplier..."
              class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
            />
            <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          </div>

          <div class="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold flex-wrap">
            <button
              type="button"
              @click="foPickerPyramid = 'all'"
              class="px-2.5 py-1 rounded-lg transition-all"
              :class="foPickerPyramid === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
            >
              Semua ({{ stockFragranceOil.length }})
            </button>
            <button
              type="button"
              @click="foPickerPyramid = 'Top'"
              class="px-2.5 py-1 rounded-lg transition-all"
              :class="foPickerPyramid === 'Top' ? 'bg-orange-600 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
            >
              Top
            </button>
            <button
              type="button"
              @click="foPickerPyramid = 'Middle'"
              class="px-2.5 py-1 rounded-lg transition-all"
              :class="foPickerPyramid === 'Middle' ? 'bg-amber-600 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
            >
              Heart
            </button>
            <button
              type="button"
              @click="foPickerPyramid = 'Bottom'"
              class="px-2.5 py-1 rounded-lg transition-all"
              :class="foPickerPyramid === 'Bottom' ? 'bg-fuchsia-700 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
            >
              Base
            </button>
          </div>
        </div>

        <!-- List of Fragrance Oils -->
        <div class="border border-stone-200 rounded-xl max-h-80 overflow-y-auto divide-y divide-stone-100">
          <div
            v-if="filteredFoPickerList.length === 0"
            class="py-12 text-center text-stone-400 text-xs italic"
          >
            Tidak ada Fragrance Oil yang sesuai pencarian.
          </div>

          <div
            v-for="fo in filteredFoPickerList"
            :key="fo.id"
            class="p-3.5 hover:bg-stone-50 flex items-center justify-between gap-3 transition-colors"
          >
            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-stone-900 text-xs truncate">{{ fo.nama }}</span>
                <span
                  class="px-1.5 py-0.2 rounded text-[9px] font-bold border"
                  :class="PYRAMID_BADGE_MAP[fo.pyramid]?.bg"
                >
                  {{ fo.pyramid }} Note
                </span>
                <span
                  class="px-1.5 py-0.2 rounded-full text-[9px] font-bold border inline-flex items-center gap-1"
                  :class="STOCK_STATUS_MAP[fo.currentStock]?.bg"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="STOCK_STATUS_MAP[fo.currentStock]?.dot"></span>
                  {{ fo.currentStock }}
                </span>
                <span
                  v-if="getFoRowCount(fo.id) > 0"
                  class="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1"
                >
                  <Check class="w-2.5 h-2.5" />
                  Masuk Formula ({{ getFoRowCount(fo.id) }})
                </span>
              </div>
              <div class="flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
                <span>{{ fo.jenisLiquid }}</span>
                <span>•</span>
                <span>{{ fo.storeName }}</span>
                <span>•</span>
                <span>{{ fo.botolMl }} ml</span>
                <span v-if="fo.priceTiers && fo.priceTiers.length > 0">
                  • <strong class="font-mono font-semibold text-stone-800">{{ formatRupiah(fo.priceTiers[0].harga) }}</strong>
                </span>
              </div>
              <div v-if="fo.notes && fo.notes.length > 0" class="flex flex-wrap gap-1 pt-0.5">
                <span
                  v-for="n in fo.notes"
                  :key="n"
                  class="px-1.5 py-0.2 rounded text-[9px] font-medium border"
                  :class="[NOTE_COLOR_MAP[n]?.bg, NOTE_COLOR_MAP[n]?.text, NOTE_COLOR_MAP[n]?.border]"
                >
                  {{ n }}
                </span>
              </div>
            </div>

            <button
              type="button"
              @click="selectFoFromPicker(fo)"
              class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 flex-shrink-0"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>{{ targetRowForFoPicker ? 'Pilih FO Ini' : 'Tambah' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Modal Picker: Pilih Racikan dari Katalog -->
    <Modal
      :isOpen="isRacikanPickerModalOpen"
      title="Pilih Resep Racikan dari Katalog"
      subtitle="Pilih racikan fragrance yang sudah tersimpan untuk dimuat komposisi formulanya"
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
              class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
            />
            <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          </div>

          <div class="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              @click="racikanPickerFilter = 'all'"
              class="px-2.5 py-1 rounded-lg transition-all"
              :class="racikanPickerFilter === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
            >
              Semua ({{ racikanCatalog.length }})
            </button>
            <button
              type="button"
              @click="racikanPickerFilter = 'commission'"
              class="px-2.5 py-1 rounded-lg transition-all"
              :class="racikanPickerFilter === 'commission' ? 'bg-amber-600 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
            >
              Commission
            </button>
            <button
              type="button"
              @click="racikanPickerFilter = 'standard'"
              class="px-2.5 py-1 rounded-lg transition-all"
              :class="racikanPickerFilter === 'standard' ? 'bg-stone-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
            >
              Standar
            </button>
          </div>
        </div>

        <!-- List of racikan items -->
        <div class="border border-stone-200 rounded-xl max-h-80 overflow-y-auto divide-y divide-stone-100">
          <div
            v-if="filteredRacikanPickerList.length === 0"
            class="py-12 text-center text-stone-400 text-xs italic"
          >
            Tidak ada data resep racikan yang sesuai pencarian.
          </div>

          <div
            v-for="item in filteredRacikanPickerList"
            :key="item.id"
            class="p-3.5 hover:bg-stone-50 flex items-center justify-between gap-3 transition-colors"
            :class="selectedRacikanCatalogId === item.id ? 'bg-amber-50/70 border-l-4 border-amber-600' : ''"
          >
            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-stone-900 text-xs truncate">{{ item.nama }}</span>
                <span
                  v-if="item.isCommission"
                  class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300"
                >
                  Commission Order
                </span>
                <span v-if="selectedRacikanCatalogId === item.id" class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Sedang Dimuat
                </span>
              </div>
              <div class="flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
                <span>{{ item.fragranceOils.length }} Komposisi Bibit FO</span>
                <span>•</span>
                <span>{{ item.targetTotalMl }} ml</span>
                <span>•</span>
                <span>{{ item.foConcentrationPercentage }}% FO</span>
                <span>•</span>
                <span>Dibuat: {{ item.tanggalDibuat }}</span>
              </div>
            </div>

            <button
              type="button"
              @click="selectRacikanFromPicker(item.id)"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
              :class="selectedRacikanCatalogId === item.id ? 'bg-emerald-600 text-white shadow-xs' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'"
            >
              <Check v-if="selectedRacikanCatalogId === item.id" class="w-3.5 h-3.5" />
              <Plus v-else class="w-3.5 h-3.5" />
              <span>{{ selectedRacikanCatalogId === item.id ? 'Dimuat' : 'Pilih Resep' }}</span>
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
import { RacikanItem, NotesEnum, PyramidEnum, StockFragranceOil } from '../types';
import { PYRAMID_BADGE_MAP, STOCK_STATUS_MAP, NOTE_COLOR_MAP } from '../utils/constants';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { Plus, RotateCcw, Save, Trash2, DollarSign, Menu, Info, Layers, Search, Check } from 'lucide-vue-next';
import CustomSelect from '../components/common/CustomSelect.vue';
import Modal from '../components/common/Modal.vue';

const store = useKobichaStore();
const { stockFragranceOil, formulaBases, racikanCatalog, prefilledRacikanId } = storeToRefs(store);

const mode = ref<'manual' | 'by_resep'>('manual');
const selectedRacikanCatalogId = ref('');
const selectedBaseId = ref('');

const racikanCatalogOptions = computed(() => [
  { value: '', label: '-- Pilih Resep Racikan --' },
  ...racikanCatalog.value.map(r => ({
    value: r.id,
    label: `${r.nama} (${r.tanggalDibuat}) - ${r.fragranceOils.length} FO`
  }))
]);

const baseOptions = computed(() => [
  { value: '', label: '-- Bebas / Tanpa Formula Base --' },
  ...formulaBases.value.map(b => ({
    value: b.id,
    label: b.nama
  }))
]);

function getPyramidBadgeInfo(pyramid?: PyramidEnum) {
  if (pyramid === 'Top') {
    return { badge: 'T', badgeClass: 'bg-orange-100 text-orange-800 border-orange-300' };
  }
  if (pyramid === 'Middle') {
    return { badge: 'M', badgeClass: 'bg-yellow-100 text-amber-900 border-yellow-300' };
  }
  if (pyramid === 'Bottom') {
    return { badge: 'B', badgeClass: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300' };
  }
  return { badge: undefined, badgeClass: undefined };
}

const foOptions = computed(() => [
  { value: '', label: '-- Pilih Fragrance Oil --' },
  ...stockFragranceOil.value.map(fo => {
    const info = getPyramidBadgeInfo(fo.pyramid);
    return {
      value: fo.id,
      label: `${fo.nama} (${fo.storeName})`,
      badge: info.badge,
      badgeClass: info.badgeClass
    };
  })
]);

const namaRacikan = ref('');
const targetTotalMl = ref(50);
const foConcentrationPercentage = ref(20);
const isCommission = ref(false);

interface FormFoRow {
  id: string;
  fragranceOilId: string;
  fragranceOilName: string;
  pyramid?: PyramidEnum;
  tetes: number;
}

const rows = ref<FormFoRow[]>([]);

const targetTotalFoMl = computed(() => {
  return (targetTotalMl.value * foConcentrationPercentage.value) / 100;
});

const totalDrops = computed(() => {
  return rows.value.reduce((acc, r) => acc + (Number(r.tetes) || 0), 0);
});

function getRowPyramid(row: FormFoRow): PyramidEnum | undefined {
  if (row.pyramid) return row.pyramid;
  const fo = stockFragranceOil.value.find(f => f.id === row.fragranceOilId);
  return fo?.pyramid;
}

function getRowPercentage(row: FormFoRow): number {
  if (totalDrops.value <= 0) return 0;
  const drops = Number(row.tetes) || 0;
  return (drops / totalDrops.value) * 100;
}

function getRowMl(row: FormFoRow): number {
  const pct = getRowPercentage(row);
  return (pct / 100) * targetTotalFoMl.value;
}

function getRowCost(row: FormFoRow): number {
  if (!row.fragranceOilId) return 0;
  const ml = getRowMl(row);
  const fo = stockFragranceOil.value.find(f => f.id === row.fragranceOilId);
  const avgPrice = fo ? store.getFoAveragePricePerMl(fo.id) : 0;
  return Math.round(ml * avgPrice);
}

const calculatedRows = computed(() => {
  return rows.value.map(r => {
    const fo = stockFragranceOil.value.find(f => f.id === r.fragranceOilId);
    const percentage = getRowPercentage(r);
    const mlCalculated = getRowMl(r);
    const estimatedCost = getRowCost(r);

    return {
      ...r,
      fragranceOilName: fo?.nama || r.fragranceOilName,
      pyramid: fo?.pyramid || r.pyramid,
      percentage,
      mlCalculated,
      estimatedCost
    };
  });
});

const totalFoCost = computed(() => {
  return rows.value.reduce((acc, r) => acc + getRowCost(r), 0);
});

function addRow() {
  rows.value.push({
    id: 'row-' + Date.now(),
    fragranceOilId: '',
    fragranceOilName: '',
    tetes: 5
  });
}

function removeRow(idx: number) {
  rows.value.splice(idx, 1);
}

function onFoSelect(row: FormFoRow) {
  const fo = stockFragranceOil.value.find(f => f.id === row.fragranceOilId);
  if (fo) {
    row.fragranceOilName = fo.nama;
    row.pyramid = fo.pyramid;
  }
}

// FO Modal Picker State & Methods
const isFoPickerModalOpen = ref(false);
const foPickerSearch = ref('');
const foPickerPyramid = ref<'all' | PyramidEnum>('all');
const targetRowForFoPicker = ref<FormFoRow | null>(null);

const filteredFoPickerList = computed(() => {
  let list = [...stockFragranceOil.value];
  if (foPickerPyramid.value !== 'all') {
    list = list.filter(f => f.pyramid === foPickerPyramid.value);
  }
  if (foPickerSearch.value.trim()) {
    const q = foPickerSearch.value.toLowerCase();
    list = list.filter(f =>
      f.nama.toLowerCase().includes(q) ||
      f.storeName.toLowerCase().includes(q) ||
      f.jenisLiquid.toLowerCase().includes(q) ||
      (f.notes && f.notes.some(n => n.toLowerCase().includes(q)))
    );
  }
  return list;
});

function openFoPickerModal(row?: FormFoRow) {
  targetRowForFoPicker.value = row || null;
  foPickerSearch.value = '';
  foPickerPyramid.value = 'all';
  isFoPickerModalOpen.value = true;
}

function selectFoFromPicker(fo: StockFragranceOil) {
  if (targetRowForFoPicker.value) {
    targetRowForFoPicker.value.fragranceOilId = fo.id;
    targetRowForFoPicker.value.fragranceOilName = fo.nama;
    targetRowForFoPicker.value.pyramid = fo.pyramid;
    store.showToast(`"${fo.nama}" dipilih untuk baris formula!`, 'success');
    isFoPickerModalOpen.value = false;
    targetRowForFoPicker.value = null;
  } else {
    rows.value.push({
      id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      fragranceOilId: fo.id,
      fragranceOilName: fo.nama,
      pyramid: fo.pyramid,
      tetes: 5
    });
    store.showToast(`"${fo.nama}" ditambahkan ke racikan!`, 'success');
    // Modal remains open so user can easily add multiple fragrance oils
  }
}

function getFoRowCount(foId: string): number {
  return rows.value.filter(r => r.fragranceOilId === foId).length;
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
  selectedRacikanCatalogId.value = id;
  loadRecipeFromCatalog();
  isRacikanPickerModalOpen.value = false;
  const racikan = racikanCatalog.value.find(r => r.id === id);
  if (racikan) {
    store.showToast(`Resep "${racikan.nama}" berhasil dimuat!`, 'success');
  }
}

function setMode(m: 'manual' | 'by_resep') {
  mode.value = m;
  selectedRacikanCatalogId.value = '';
  selectedBaseId.value = '';
  namaRacikan.value = '';
  rows.value = [];
}

function loadRecipeFromCatalog() {
  if (!selectedRacikanCatalogId.value) {
    namaRacikan.value = '';
    selectedBaseId.value = '';
    rows.value = [];
    return;
  }

  const r = racikanCatalog.value.find(x => x.id === selectedRacikanCatalogId.value);
  if (!r) return;

  namaRacikan.value = r.nama;
  targetTotalMl.value = r.targetTotalMl || 50;
  foConcentrationPercentage.value = r.foConcentrationPercentage || 20;
  isCommission.value = r.isCommission || false;
  selectedBaseId.value = r.formulaBaseId || '';

  rows.value = r.fragranceOils.map(fo => {
    const matchedFo = stockFragranceOil.value.find(f => f.id === fo.fragranceOilId);
    return {
      id: 'row-' + Math.random(),
      fragranceOilId: fo.fragranceOilId,
      fragranceOilName: fo.fragranceOilName,
      pyramid: matchedFo?.pyramid,
      tetes: fo.tetes
    };
  });
}

function applyBaseTemplate() {
  const base = formulaBases.value.find(b => b.id === selectedBaseId.value);
  if (base) {
    const foIng = base.ingredients.find(i => i.isFragranceOilConcentrate);
    if (foIng) {
      foConcentrationPercentage.value = foIng.percentage;
    }
  }
}

function resetForm() {
  mode.value = 'manual';
  selectedRacikanCatalogId.value = '';
  selectedBaseId.value = '';
  namaRacikan.value = '';
  targetTotalMl.value = 50;
  foConcentrationPercentage.value = 20;
  isCommission.value = false;
  rows.value = [];
}

function saveRacikan() {
  if (!namaRacikan.value.trim()) {
    store.showToast('Silakan masukkan nama racikan terlebih dahulu', 'warning');
    return;
  }

  const validRows = calculatedRows.value.filter(r => r.fragranceOilId);
  if (validRows.length === 0) {
    store.showToast('Pilih minimal 1 Fragrance Oil yang valid', 'warning');
    return;
  }

  const base = formulaBases.value.find(b => b.id === selectedBaseId.value);

  // Aggregate unique notes
  const notesSet = new Set<NotesEnum>();
  validRows.forEach(r => {
    const fo = stockFragranceOil.value.find(f => f.id === r.fragranceOilId);
    if (fo && fo.notes) {
      fo.notes.forEach(n => notesSet.add(n));
    }
  });

  const foPayload: RacikanItem[] = validRows.map(r => ({
    id: r.id,
    fragranceOilId: r.fragranceOilId,
    fragranceOilName: r.fragranceOilName,
    tetes: r.tetes,
    calculatedPercentage: r.percentage,
    calculatedMl: r.mlCalculated
  }));

  const now = new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const bulanTahun = `${months[now.getMonth()]} ${now.getFullYear()}`;

  store.addRacikanFragrance({
    nama: namaRacikan.value,
    formulaBaseId: selectedBaseId.value || undefined,
    formulaBaseName: base?.nama || undefined,
    targetTotalMl: targetTotalMl.value,
    foConcentrationPercentage: foConcentrationPercentage.value,
    fragranceOils: foPayload,
    notes: Array.from(notesSet),
    tanggalDibuat: bulanTahun,
    isCommission: isCommission.value
  });

  store.navigateTo('katalog-racikan');
}

function saveAndGoToHpp() {
  saveRacikan();
  const latest = racikanCatalog.value[racikanCatalog.value.length - 1];
  if (latest) {
    store.openHppWithRacikan(latest.id, latest.formulaBaseId);
  }
}

onMounted(() => {
  if (prefilledRacikanId.value) {
    mode.value = 'by_resep';
    selectedRacikanCatalogId.value = prefilledRacikanId.value;
    loadRecipeFromCatalog();
    prefilledRacikanId.value = null;
  }
});
</script>
