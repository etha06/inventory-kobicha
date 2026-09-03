<template>
  <div class="space-y-6">
    <!-- Page Header (Kobicha Green / Forest styling) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 shadow-xs">
          <ShoppingBag class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-base font-extrabold text-forest-900 font-rounded">Ready to Sell (Produk Siap Jual)</h3>
          <p class="text-xs text-stone-500">
            Manajemen stock produk parfum retail dan paket bundling siap kirim
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="openAddModal"
          class="px-4 py-2.5 rounded-lg bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Produk</span>
        </button>
      </div>
    </div>

    <!-- Summary / Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
        <div class="flex items-center justify-between text-stone-400 mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Varian</span>
          <Boxes class="w-4 h-4 text-amber-600" />
        </div>
        <div class="text-xl font-extrabold font-mono text-stone-900">
          {{ readyToSellProducts.length }}
          <span class="text-xs font-sans font-normal text-stone-500">Produk</span>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
        <div class="flex items-center justify-between text-stone-400 mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Stock Fisik</span>
          <PackageCheck class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="text-xl font-extrabold font-mono text-emerald-700">
          {{ totalReadyToSellStock }}
          <span class="text-xs font-sans font-normal text-stone-500">Pcs / Botol</span>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
        <div class="flex items-center justify-between text-stone-400 mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-stone-500">Estimasi Omset Stock</span>
          <DollarSign class="w-4 h-4 text-amber-600" />
        </div>
        <div class="text-xl font-extrabold font-mono text-amber-900">
          {{ formatRupiah(totalReadyToSellValue) }}
        </div>
      </div>

      <div class="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
        <div class="flex items-center justify-between text-stone-400 mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-stone-500">Paket Bundle</span>
          <Gift class="w-4 h-4 text-indigo-600" />
        </div>
        <div class="text-xl font-extrabold font-mono text-indigo-900">
          {{ totalBundleCount }}
          <span class="text-xs font-sans font-normal text-stone-500">Bundle</span>
        </div>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
      <div class="relative flex-1">
        <Search class="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama produk, series, atau isi bundle..."
          class="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs font-medium"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Filter Type Tabs -->
        <div class="bg-stone-100 p-1 rounded-lg flex items-center text-xs font-semibold text-stone-600">
          <button
            @click="filterType = 'all'"
            class="px-3 py-1.5 rounded-md transition-all"
            :class="filterType === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'"
          >
            Semua ({{ readyToSellProducts.length }})
          </button>
          <button
            @click="filterType = 'single'"
            class="px-3 py-1.5 rounded-md transition-all"
            :class="filterType === 'single' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'"
          >
            Single ({{ totalSingleCount }})
          </button>
          <button
            @click="filterType = 'bundle'"
            class="px-3 py-1.5 rounded-md transition-all"
            :class="filterType === 'bundle' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'"
          >
            Bundle ({{ totalBundleCount }})
          </button>
        </div>

        <!-- Filter Series Dropdown using CustomSelect -->
        <div class="min-w-[170px]">
          <CustomSelect
            v-model="filterSeries"
            :options="seriesOptions"
            placeholder="Semua Series"
          />
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-bold">
              <th class="py-3.5 px-4 text-left">Nama Produk</th>
              <th class="py-3.5 px-4 text-left">Tipe</th>
              <th class="py-3.5 px-4 text-left">Isi / Komponen</th>
              <th class="py-3.5 px-4 text-left">Series</th>
              <th class="py-3.5 px-4 text-left">Stock Unit</th>
              <th class="py-3.5 px-4 text-left">Harga Jual</th>
              <th class="py-3.5 px-4 text-left">Pertama Dijual</th>
              <th class="py-3.5 px-4 text-left w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-800">
            <tr v-if="filteredProducts.length === 0">
              <td colspan="8" class="py-12 text-center text-stone-400">
                <ShoppingBag class="w-8 h-8 mx-auto mb-2 opacity-50" />
                Belum ada data produk siap jual. Klik tombol "+ Tambah Produk" di atas untuk menambahkan produk retail atau paket bundle.
              </td>
            </tr>

            <tr
              v-for="item in paginatedProducts"
              :key="item.id"
              class="table-row-hover transition-colors"
            >
              <!-- Nama Produk -->
              <td class="py-3.5 px-4 text-left">
                <span class="font-bold text-stone-900 text-xs">{{ item.nama }}</span>
              </td>

              <!-- Tipe Badge -->
              <td class="py-3.5 px-4 text-left">
                <span
                  v-if="item.isBundle"
                  class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold"
                >
                  Bundle
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-semibold"
                >
                  Single
                </span>
              </td>

              <!-- Isi / Komponen Produk -->
              <td class="py-3.5 px-4 text-left">
                <div v-if="item.isBundle && item.bundleItems && item.bundleItems.length > 0" class="space-y-1">
                  <div
                    v-for="(bi, idx) in item.bundleItems"
                    :key="idx"
                    class="text-[11px] text-stone-700 flex items-center gap-1.5"
                  >
                    <span class="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">
                      {{ bi.qty }}x
                    </span>
                    <span class="truncate max-w-[200px]">{{ bi.namaProduk }}</span>
                  </div>
                </div>
                <div v-else-if="!item.isBundle && item.hppCalculationId" class="text-[11px] text-stone-600">
                  <span class="font-medium text-stone-800">{{ getHppName(item.hppCalculationId) }}</span>
                </div>
                <span v-else class="text-stone-400 text-xs italic">-</span>
              </td>

              <!-- Series -->
              <td class="py-3.5 px-4 text-left">
                <span
                  v-if="item.series"
                  class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium whitespace-nowrap"
                >
                  {{ item.series }}
                </span>
                <span v-else class="text-stone-400 text-xs">-</span>
              </td>

              <!-- Stok Unit -->
              <td class="py-3.5 px-4 text-left font-mono font-bold">
                <span
                  v-if="item.jumlahStok === 0"
                  class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px]"
                >
                  Habis (0)
                </span>
                <span
                  v-else-if="item.jumlahStok <= 5"
                  class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]"
                >
                  {{ item.jumlahStok }} pcs (Kritis)
                </span>
                <span
                  v-else
                  class="text-stone-900 text-xs"
                >
                  {{ item.jumlahStok }} pcs
                </span>
              </td>

              <!-- Harga Jual -->
              <td class="py-3.5 px-4 text-left">
                <span class="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block text-xs">
                  {{ formatRupiah(item.hargaJual) }}
                </span>
              </td>

              <!-- Pertama Kali Dijual -->
              <td class="py-3.5 px-4 text-left font-mono text-[11px] text-stone-600">
                {{ formatDate(item.pertamaKaliDijual) }}
              </td>

              <!-- Aksi -->
              <td class="py-3.5 px-4 text-left" @click.stop>
                <div class="flex items-center justify-start gap-1.5">
                  <button
                    @click="viewDetail(item)"
                    class="p-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                    title="Lihat Detail Produk"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="openEditModal(item)"
                    class="p-1.5 rounded-md border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition-colors"
                    title="Edit Produk"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="confirmDelete(item)"
                    class="p-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                    title="Hapus Produk"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination for Table -->
      <Pagination
        v-model:currentPage="currentPage"
        :totalItems="filteredProducts.length"
        :itemsPerPage="itemsPerPage"
      />
    </div>

    <!-- ========================================================= -->
    <!-- GRAND TOTAL ANALISIS BIAYA & PROFIT SIMULATOR (Ready to Sell) -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-4">
        <div>
          <span class="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            ✨ Grand Total Analisis Biaya & Profit
          </span>
          <h3 class="text-xl font-bold font-serif text-white flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-emerald-400" />
            <span>Kalkulator & Simulasi Margin Keuntungan Produk</span>
          </h3>
        </div>
        <span class="text-xs text-stone-400">Pilih produk untuk simulasi harga jual & margin</span>
      </div>

      <!-- Alert Rumus Perhitungan (Di Bawah Header) -->
      <div class="p-3.5 bg-stone-950/80 rounded-xl border border-stone-800 flex items-start gap-3 text-stone-300">
        <Info class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div class="space-y-1 text-xs leading-relaxed">
          <p>
            <strong class="text-amber-300 font-semibold">Rumus Profit Margin (%):</strong>
            <span class="font-mono text-stone-200 ml-1">((Harga Jual - Modal HPP) / Modal HPP) &times; 100%</span>
          </p>
          <p>
            <strong class="text-emerald-300 font-semibold">Rumus Laba Bersih / Unit:</strong>
            <span class="font-mono text-stone-200 ml-1">Harga Jual - Modal HPP</span>
            <span class="text-stone-400 ml-1.5">(Anda dapat mengedit Harga Jual maupun Profit Margin untuk simulasi 2 arah).</span>
          </p>
        </div>
      </div>

      <!-- Profit Margin Simulator / Calculator -->
      <div class="bg-stone-950/60 rounded-xl p-5 border border-stone-800 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          <!-- 1. Pilih Produk untuk Disimulasikan (Dark Themed Dropdown) -->
          <div class="sm:col-span-1">
            <label class="block text-xs text-stone-300 mb-1">Pilih Produk</label>
            <CustomSelect
              v-model="simulatedProductId"
              :options="simulationProductOptions"
              placeholder="-- Pilih Produk --"
              :dark="true"
              :searchable="true"
              @change="onSimulatedProductChange"
            />
          </div>

          <!-- 2. Modal HPP / Unit -->
          <div>
            <label class="block text-xs text-stone-300 mb-1">Modal HPP / Unit</label>
            <div class="px-3.5 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs font-bold text-amber-300 truncate flex items-center h-[38px]">
              <span v-if="simulatedProductId">
                {{ formatRupiah(simulatedProductHpp) }}
              </span>
              <span v-else class="text-stone-500">-</span>
            </div>
          </div>

          <!-- 3. Simulasi Harga Jual (Input yang Bisa Diedit, Default Sesuai Harga Jual Produk) -->
          <div>
            <label class="block text-xs text-stone-300 mb-1">Simulasi Harga Jual (Rp)</label>
            <div class="relative">
              <input
                v-model.number="simulatedSellingPrice"
                type="number"
                min="0"
                step="500"
                :disabled="!simulatedProductId"
                placeholder="0"
                @input="onSellingPriceInput"
                class="w-full px-3.5 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs font-semibold text-white pl-8 focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <span class="absolute left-3 top-2 text-stone-400 text-xs font-bold pointer-events-none">Rp</span>
            </div>
          </div>

          <!-- 4. Profit Margin (%) (Bisa Diedit) -->
          <div>
            <label class="block text-xs text-stone-300 mb-1">Profit Margin (%)</label>
            <div class="relative">
              <input
                v-model.number="simulatedMargin"
                type="number"
                step="5"
                :disabled="!simulatedProductId || simulatedProductHpp <= 0"
                placeholder="0"
                @input="onMarginInput"
                class="w-full px-3.5 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs font-semibold text-white pr-8 focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <span class="absolute right-3 top-2 text-stone-400 text-xs font-bold pointer-events-none">%</span>
            </div>
          </div>

          <!-- 5. Estimasi Laba Bersih / Unit -->
          <div>
            <label class="block text-xs text-stone-300 mb-1">Estimasi Laba / Unit</label>
            <div class="px-3.5 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-400 truncate flex items-center h-[38px]">
              <span v-if="simulatedProductId">
                +{{ formatRupiah(simulatedProfitPerUnit) }}
              </span>
              <span v-else class="text-stone-500">-</span>
            </div>
          </div>
        </div>

        <!-- Rincian Modal Produk (HPP Breakdown) -->
        <div v-if="simulatedProduct" class="mt-4 pt-4 border-t border-stone-800 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>📋 Rincian Modal HPP Produk:</span>
              <span class="text-white normal-case font-semibold">{{ simulatedProduct.nama }}</span>
            </span>
            <span class="text-xs font-bold font-mono text-amber-300 bg-stone-900 px-3 py-1 rounded-md border border-stone-700">
              Total Modal HPP: {{ formatRupiah(simulatedProductHpp) }}
            </span>
          </div>

          <!-- Single Product Breakdown -->
          <div v-if="!simulatedProduct.isBundle && simulatedLinkedHpp" class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div class="bg-stone-900/90 p-3 rounded-lg border border-stone-800">
              <span class="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Katalog HPP Terkait</span>
              <span class="font-semibold text-stone-200 truncate block">{{ simulatedLinkedHpp.nama }} ({{ simulatedLinkedHpp.targetBottleMl }}ml)</span>
            </div>
            <div class="bg-stone-900/90 p-3 rounded-lg border border-stone-800">
              <span class="text-[10px] uppercase font-bold text-amber-400/90 block mb-0.5">Modal Resep Racikan</span>
              <span class="font-bold font-mono text-amber-300 text-sm">{{ formatRupiah(simulatedLinkedHpp.subtotalLiquid || 0) }}</span>
            </div>
            <div class="bg-stone-900/90 p-3 rounded-lg border border-stone-800">
              <span class="text-[10px] uppercase font-bold text-indigo-400/90 block mb-0.5">Modal Kemasan & Lainnya</span>
              <span class="font-bold font-mono text-indigo-300 text-sm">{{ formatRupiah(simulatedLinkedHpp.subtotalPackaging || 0) }}</span>
            </div>
          </div>

          <!-- Bundle Items Breakdown -->
          <div v-else-if="simulatedProduct.isBundle && simulatedProduct.bundleItems && simulatedProduct.bundleItems.length > 0" class="border border-stone-800 rounded-lg overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-stone-900 text-[10px] font-bold text-stone-400 uppercase">
                <tr>
                  <th class="py-2.5 px-3">Item Produk dalam Paket Bundle</th>
                  <th class="py-2.5 px-3 text-center">Kuantitas</th>
                  <th class="py-2.5 px-3 text-right">Modal HPP / Unit</th>
                  <th class="py-2.5 px-3 text-right">Subtotal Modal HPP</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-800 text-stone-300 bg-stone-950/40">
                <tr v-for="(bi, idx) in simulatedProduct.bundleItems" :key="idx">
                  <td class="py-2.5 px-3 font-medium text-stone-200">{{ bi.namaProduk }} ({{ bi.ukuranBotolMl || '-' }} ml)</td>
                  <td class="py-2.5 px-3 text-center font-mono font-bold text-indigo-400">{{ bi.qty }}x</td>
                  <td class="py-2.5 px-3 text-right font-mono text-stone-400">{{ formatRupiah(bi.hppPerItem || 0) }}</td>
                  <td class="py-2.5 px-3 text-right font-mono font-bold text-amber-300">{{ formatRupiah((bi.hppPerItem || 0) * (bi.qty || 1)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL FORM (TAMBAH / EDIT PRODUK) -->
    <Modal
      :isOpen="isModalOpen"
      :title="isEditing ? 'Edit Produk Ready to Sell' : 'Tambah Produk Ready to Sell'"
      subtitle="Input detail produk parfum retail atau bundle pack siap kirim"
      maxWidth="3xl"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- 1. Pilihan Tipe: Single vs Bundle -->
        <div>
          <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Pilih Jenis Produk:
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.isBundle = false"
              class="p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all"
              :class="!form.isBundle ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20 shadow-xs' : 'bg-white border-stone-200 hover:bg-stone-50'"
            >
              <div
                class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="!form.isBundle ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500'"
              >
                <ShoppingBag class="w-4 h-4" />
              </div>
              <div>
                <span class="font-bold text-xs text-stone-900 block">Produk Tunggal (Single)</span>
                <span class="text-[11px] text-stone-500">Satu botol parfum retail siap jual</span>
              </div>
            </button>

            <button
              type="button"
              @click="form.isBundle = true"
              class="p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all"
              :class="form.isBundle ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs' : 'bg-white border-stone-200 hover:bg-stone-50'"
            >
              <div
                class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="form.isBundle ? 'bg-indigo-600 text-white' : 'bg-stone-100 text-stone-500'"
              >
                <Gift class="w-4 h-4" />
              </div>
              <div>
                <span class="font-bold text-xs text-stone-900 block">Paket Bundle (Set)</span>
                <span class="text-[11px] text-stone-500">Kombinasi multiple produk dalam 1 paket</span>
              </div>
            </button>
          </div>
        </div>

        <!-- 2. Form Fields for Single Product -->
        <div v-if="!form.isBundle" class="space-y-4 pt-2 border-t border-stone-100">
          <!-- Nama Produk -->
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Nama Produk <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.nama"
              type="text"
              required
              placeholder="Misal: Kobicha Velvet Rose Extrait 50ml"
              class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs font-semibold text-stone-900"
            />
          </div>

          <!-- Pilih Produk dari Katalog HPP -->
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Pilih Produk dari Katalog HPP <span class="text-rose-500">*</span>
            </label>
            <CustomSelect
              v-model="form.hppCalculationId"
              :options="hppSelectOptions"
              placeholder="-- Pilih Produk HPP --"
              @change="onSelectHppForSingle"
            />
          </div>
        </div>

        <!-- 3. Form Fields for Bundle Product -->
        <div v-else class="space-y-4 pt-2 border-t border-stone-100">
          <!-- Nama Paket Bundle -->
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Nama Paket Bundle <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.nama"
              type="text"
              required
              placeholder="Misal: Duo Discovery Extrait Set (2x 50ml)"
              class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-semibold text-stone-900"
            />
          </div>

          <!-- Multiple Product Picker in Bundle -->
          <div class="space-y-3 bg-stone-50/80 p-4 rounded-xl border border-stone-200/80">
            <div class="flex items-center justify-between">
              <div>
                <h5 class="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Gift class="w-3.5 h-3.5 text-indigo-600" />
                  <span>Daftar Produk di dalam Paket Bundle:</span>
                </h5>
                <p class="text-[11px] text-stone-500">Pilih produk dari Katalog HPP dan tentukan kuantitasnya</p>
              </div>

              <button
                type="button"
                @click="addBundleItemRow"
                class="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold transition-all flex items-center gap-1"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>Tambah Item</span>
              </button>
            </div>

            <div v-if="form.bundleItems.length === 0" class="py-6 text-center text-stone-400 text-xs bg-white rounded-lg border border-dashed">
              Belum ada produk dimasukkan. Klik "+ Tambah Item" untuk memilih produk dari katalog HPP.
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(bItem, idx) in form.bundleItems"
                :key="bItem.id"
                class="p-3 bg-white rounded-lg border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shadow-xs"
              >
                <div class="flex-1">
                  <CustomSelect
                    v-model="bItem.hppCalculationId"
                    :options="bundleHppOptions"
                    placeholder="-- Pilih Produk HPP --"
                    @change="onSelectBundleItemHpp(bItem)"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <div class="w-20">
                    <input
                      v-model.number="bItem.qty"
                      type="number"
                      min="1"
                      required
                      placeholder="Qty"
                      class="w-full px-2.5 py-1.5 rounded-md border border-stone-200 text-xs font-semibold text-center text-stone-900"
                    />
                  </div>

                  <button
                    type="button"
                    @click="removeBundleItemRow(idx)"
                    class="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                    title="Hapus baris item"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Shared Common Inputs: Stock, Price, Series, Image, Date -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
          <!-- Jumlah Stock -->
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Jumlah Stock Siap Jual <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.jumlahStok"
                type="number"
                min="0"
                required
                class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs font-semibold pr-12 text-stone-900"
              />
              <span class="absolute right-3 top-2.5 text-stone-400 text-xs font-bold pointer-events-none">pcs</span>
            </div>
          </div>

          <!-- Harga Jual -->
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Harga Jual (Rp) <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.hargaJual"
                type="number"
                min="0"
                step="500"
                required
                class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold text-emerald-800 pl-8"
              />
              <span class="absolute left-3 top-2.5 text-stone-400 text-xs font-bold pointer-events-none">Rp</span>
            </div>
          </div>

          <!-- Series (Combobox with Datalist & Quick Suggestion Chips) -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Series / Kategori Koleksi
            </label>
            <div class="relative">
              <input
                v-model="form.series"
                type="text"
                list="seriesDatalist"
                placeholder="Ketik atau pilih series (misal: Signature Wood Collection, Discovery Series)..."
                class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs font-medium text-stone-900"
              />
              <datalist id="seriesDatalist">
                <option v-for="s in allReadyToSellSeries" :key="s" :value="s">{{ s }}</option>
              </datalist>
            </div>

            <!-- Quick Suggestion Badges -->
            <div v-if="allReadyToSellSeries.length > 0" class="flex flex-wrap gap-1.5 mt-2 max-h-20 overflow-y-auto p-1.5 bg-stone-50 rounded-lg border border-stone-100">
              <button
                v-for="s in allReadyToSellSeries"
                :key="s"
                type="button"
                @click="form.series = s"
                class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all border"
                :class="form.series === s ? 'bg-peach-500 text-white border-peach-500 shadow-xs' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Pertama Kali Dijual (Input Date) -->
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Pertama Kali Dijual (Tanggal Rilis) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.pertamaKaliDijual"
              type="date"
              required
              class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs font-medium text-stone-900"
            />
          </div>

          <!-- Gambar (URL / File Upload) -->
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Foto Produk (Opsional URL / File)
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.gambar"
                type="text"
                placeholder="https://... atau pilih file"
                class="flex-1 px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs font-medium"
              />
              <label class="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer border border-stone-200 flex items-center gap-1">
                <Upload class="w-3.5 h-3.5" />
                <span class="hidden sm:inline">Upload</span>
                <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
              </label>
            </div>
          </div>

          <!-- Image Preview Thumbnail if available -->
          <div v-if="form.gambar" class="sm:col-span-2 flex items-center gap-3 p-2 bg-stone-50 rounded-lg border">
            <div class="w-12 h-12 rounded-md overflow-hidden border bg-white flex-shrink-0">
              <img :src="form.gambar" alt="Preview" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-xs font-semibold text-stone-800 block">Preview Foto Produk</span>
              <span class="text-[10px] text-stone-400 truncate block">{{ form.gambar }}</span>
            </div>
            <button
              type="button"
              @click="form.gambar = ''"
              class="p-1 text-stone-400 hover:text-rose-500"
              title="Hapus Foto"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Deskripsi / Catatan Tambahan -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-stone-700 mb-1">
              Deskripsi / Catatan Produk (Opsional)
            </label>
            <textarea
              v-model="form.deskripsi"
              rows="2"
              placeholder="Catatan kemasan, packaging sleeve, notes aroma, target pasar..."
              class="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-xs"
            ></textarea>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-lg bg-peach-500 hover:bg-peach-600 text-white text-xs font-bold shadow-xs"
          >
            {{ isEditing ? 'Simpan Perubahan' : 'Tambah Produk' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- DETAIL MODAL -->
    <Modal
      :isOpen="isDetailModalOpen"
      :title="detailItem?.nama || 'Detail Produk'"
      subtitle="Rincian spesifikasi produk siap jual, stock, dan harga"
      maxWidth="2xl"
      @close="isDetailModalOpen = false"
    >
      <div v-if="detailItem" class="space-y-5">
        <!-- Image & Main Overview -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div class="w-24 h-24 rounded-lg overflow-hidden border border-stone-200 bg-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <img
              v-if="detailItem.gambar"
              :src="detailItem.gambar"
              :alt="detailItem.nama"
              class="w-full h-full object-cover"
            />
            <Gift v-else-if="detailItem.isBundle" class="w-8 h-8 text-indigo-400" />
            <ShoppingBag v-else class="w-8 h-8 text-stone-400" />
          </div>

          <div class="flex-1 text-center sm:text-left space-y-1">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                v-if="detailItem.isBundle"
                class="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[10px]"
              >
                Paket Bundle
              </span>
              <span
                v-else
                class="px-2.5 py-0.5 rounded-md bg-stone-200 text-stone-800 font-semibold text-[10px]"
              >
                Single Product
              </span>
              <span
                v-if="detailItem.series"
                class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold text-[10px]"
              >
                {{ detailItem.series }}
              </span>
            </div>

            <h4 class="text-base font-bold text-stone-900 font-serif mt-1">{{ detailItem.nama }}</h4>
            <p v-if="detailItem.deskripsi" class="text-xs text-stone-600 leading-relaxed">
              {{ detailItem.deskripsi }}
            </p>
          </div>
        </div>

        <!-- Metric Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="p-3.5 rounded-lg bg-white border border-stone-200 text-center">
            <span class="text-[10px] uppercase font-bold text-stone-400 block">Current Stock</span>
            <span class="text-base font-extrabold font-mono text-stone-900">{{ detailItem.jumlahStok }} pcs</span>
          </div>

          <div class="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <span class="text-[10px] uppercase font-bold text-emerald-700 block">Harga Jual</span>
            <span class="text-base font-extrabold font-mono text-emerald-900">{{ formatRupiah(detailItem.hargaJual) }}</span>
          </div>

          <div class="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-center col-span-2 sm:col-span-1">
            <span class="text-[10px] uppercase font-bold text-amber-700 block">First Time Sell</span>
            <span class="text-base font-extrabold font-mono text-amber-950">{{ formatDate(detailItem.pertamaKaliDijual) }}</span>
          </div>
        </div>

        <!-- Bundle Contents Table if Bundle -->
        <div v-if="detailItem.isBundle && detailItem.bundleItems && detailItem.bundleItems.length > 0" class="space-y-2">
          <h5 class="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Rincian Produk dalam Paket Bundle:
          </h5>
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-stone-100 text-[10px] font-bold text-stone-600 uppercase">
                <tr>
                  <th class="py-2.5 px-3">Nama Produk</th>
                  <th class="py-2.5 px-3 text-center">Kuantitas</th>
                  <th class="py-2.5 px-3 text-right">Ukuran</th>
                </tr>
              </thead>
              <tbody class="divide-y text-stone-800">
                <tr v-for="(bi, idx) in detailItem.bundleItems" :key="idx">
                  <td class="py-2.5 px-3 font-semibold">{{ bi.namaProduk }}</td>
                  <td class="py-2.5 px-3 text-center font-mono font-bold text-indigo-700">{{ bi.qty }}x</td>
                  <td class="py-2.5 px-3 text-right font-mono text-stone-600">{{ bi.ukuranBotolMl ? bi.ukuranBotolMl + ' ml' : '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="pt-3 border-t border-stone-100 flex justify-end gap-2">
          <button
            @click="isDetailModalOpen = false"
            class="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
          >
            Tutup
          </button>
          <button
            @click="isDetailModalOpen = false; openEditModal(detailItem)"
            class="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Pencil class="w-3.5 h-3.5" />
            <span>Edit Produk</span>
          </button>
        </div>
      </div>
    </Modal>

    <!-- CONFIRM DELETE MODAL -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Hapus Produk Ready to Sell"
      :message="`Apakah Anda yakin ingin menghapus produk '${productToDelete?.nama || ''}' dari daftar siap jual? Tindakan ini tidak dapat dibatalkan.`"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { ReadyToSellProduct, BundleProductItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import Modal from '../components/common/Modal.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import CustomSelect from '../components/common/CustomSelect.vue';
import Pagination from '../components/common/Pagination.vue';
import {
  ShoppingBag,
  Plus,
  Boxes,
  PackageCheck,
  DollarSign,
  Gift,
  Search,
  X,
  Eye,
  Pencil,
  Trash2,
  Upload,
  TrendingUp,
  Info
} from 'lucide-vue-next';

const store = useKobichaStore();
const { readyToSellProducts, hppCatalog, allReadyToSellSeries, totalReadyToSellStock, totalReadyToSellValue } = storeToRefs(store);

// Helper to get HPP cost for a ready to sell product (Single or Bundle)
function getItemHpp(product: ReadyToSellProduct | null | undefined): number {
  if (!product) return 0;
  if (!product.isBundle) {
    if (product.hppCalculationId) {
      const h = hppCatalog.value.find(item => item.id === product.hppCalculationId);
      if (h) return h.grandTotalHpp;
    }
    return 0;
  }
  // Bundle items aggregation
  if (product.bundleItems && product.bundleItems.length > 0) {
    return product.bundleItems.reduce((acc, bi) => acc + ((bi.hppPerItem || 0) * (bi.qty || 1)), 0);
  }
  return 0;
}

const totalInventoryHppCost = computed(() => {
  return readyToSellProducts.value.reduce((acc, p) => {
    return acc + (getItemHpp(p) * (p.jumlahStok || 0));
  }, 0);
});

const totalPotentialProfit = computed(() => {
  return Math.max(0, totalReadyToSellValue.value - totalInventoryHppCost.value);
});

// Profit Margin Simulation State (2-Way Interactive)
const simulatedProductId = ref<string>('');
const simulatedSellingPrice = ref<number>(0);
const simulatedMargin = ref<number>(0);

const simulationProductOptions = computed(() => {
  return readyToSellProducts.value.map(p => ({
    value: p.id,
    label: `${p.nama} (${formatRupiah(p.hargaJual)})`
  }));
});

const simulatedProduct = computed(() => {
  return readyToSellProducts.value.find(p => p.id === simulatedProductId.value) || null;
});

const simulatedProductHpp = computed(() => {
  return simulatedProduct.value ? getItemHpp(simulatedProduct.value) : 0;
});

const simulatedLinkedHpp = computed(() => {
  if (!simulatedProduct.value || simulatedProduct.value.isBundle || !simulatedProduct.value.hppCalculationId) {
    return null;
  }
  return hppCatalog.value.find(h => h.id === simulatedProduct.value?.hppCalculationId) || null;
});

function onSimulatedProductChange() {
  if (!simulatedProductId.value) {
    simulatedSellingPrice.value = 0;
    simulatedMargin.value = 0;
    return;
  }
  const p = readyToSellProducts.value.find(item => item.id === simulatedProductId.value);
  if (p) {
    simulatedSellingPrice.value = p.hargaJual || 0;
    const hpp = getItemHpp(p);
    if (hpp > 0) {
      simulatedMargin.value = Math.round(((p.hargaJual - hpp) / hpp) * 100);
    } else {
      simulatedMargin.value = 0;
    }
  }
}

function onSellingPriceInput() {
  const hpp = simulatedProductHpp.value;
  if (hpp > 0) {
    simulatedMargin.value = Math.round(((simulatedSellingPrice.value - hpp) / hpp) * 100);
  } else {
    simulatedMargin.value = 0;
  }
}

function onMarginInput() {
  const hpp = simulatedProductHpp.value;
  if (hpp > 0) {
    const rawPrice = hpp * (1 + (simulatedMargin.value || 0) / 100);
    simulatedSellingPrice.value = Math.round(rawPrice / 500) * 500;
  }
}

const calculatedMarginPercentage = computed(() => {
  if (!simulatedProduct.value || simulatedProductHpp.value <= 0) return 0;
  const margin = ((simulatedSellingPrice.value - simulatedProductHpp.value) / simulatedProductHpp.value) * 100;
  return Math.round(margin);
});

const simulatedProfitPerUnit = computed(() => {
  if (!simulatedProduct.value) return 0;
  return Math.max(0, simulatedSellingPrice.value - simulatedProductHpp.value);
});

// Filter & Search
const searchQuery = ref('');
const filterType = ref<'all' | 'single' | 'bundle'>('all');
const filterSeries = ref('');

const seriesOptions = computed(() => {
  const opts: { value: string; label: string }[] = [
    { value: '', label: 'Semua Series' }
  ];
  allReadyToSellSeries.value.forEach(s => {
    opts.push({ value: s, label: s });
  });
  return opts;
});

const hppSelectOptions = computed(() => {
  return hppCatalog.value.map(h => ({
    value: h.id,
    label: `${h.nama} (${h.targetBottleMl}ml • HPP: ${formatRupiah(h.grandTotalHpp)})`
  }));
});

const bundleHppOptions = computed(() => {
  return hppCatalog.value.map(h => ({
    value: h.id,
    label: `${h.nama} (${h.targetBottleMl}ml)`
  }));
});

const totalBundleCount = computed(() => readyToSellProducts.value.filter(p => p.isBundle).length);
const totalSingleCount = computed(() => readyToSellProducts.value.filter(p => !p.isBundle).length);

const filteredProducts = computed(() => {
  return readyToSellProducts.value.filter(p => {
    // Type Filter
    if (filterType.value === 'single' && p.isBundle) return false;
    if (filterType.value === 'bundle' && !p.isBundle) return false;

    // Series Filter
    if (filterSeries.value && p.series !== filterSeries.value) return false;

    // Search Query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = p.nama.toLowerCase().includes(q);
      const matchSeries = (p.series || '').toLowerCase().includes(q);
      const matchDesc = (p.deskripsi || '').toLowerCase().includes(q);
      const matchBundleItems = p.bundleItems?.some(bi => bi.namaProduk.toLowerCase().includes(q));
      if (!matchName && !matchSeries && !matchDesc && !matchBundleItems) return false;
    }

    return true;
  });
});

// Pagination State (Max 10 rows per page)
const currentPage = ref(1);
const itemsPerPage = 10;

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

watch([searchQuery, filterType, filterSeries], () => {
  currentPage.value = 1;
});

// Modal Form State
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = ref<{
  isBundle: boolean;
  nama: string;
  hppCalculationId: string;
  bundleItems: BundleProductItem[];
  jumlahStok: number;
  hargaJual: number;
  series: string;
  gambar: string;
  pertamaKaliDijual: string;
  deskripsi: string;
}>({
  isBundle: false,
  nama: '',
  hppCalculationId: '',
  bundleItems: [],
  jumlahStok: 10,
  hargaJual: 0,
  series: '',
  gambar: '',
  pertamaKaliDijual: new Date().toISOString().split('T')[0],
  deskripsi: ''
});

function openAddModal() {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    isBundle: false,
    nama: '',
    hppCalculationId: '',
    bundleItems: [],
    jumlahStok: 10,
    hargaJual: 0,
    series: '',
    gambar: '',
    pertamaKaliDijual: new Date().toISOString().split('T')[0],
    deskripsi: ''
  };
  isModalOpen.value = true;
}

function openEditModal(product: ReadyToSellProduct) {
  isEditing.value = true;
  editingId.value = product.id;
  form.value = {
    isBundle: product.isBundle,
    nama: product.nama,
    hppCalculationId: product.hppCalculationId || '',
    bundleItems: product.bundleItems ? JSON.parse(JSON.stringify(product.bundleItems)) : [],
    jumlahStok: product.jumlahStok,
    hargaJual: product.hargaJual,
    series: product.series || '',
    gambar: product.gambar || '',
    pertamaKaliDijual: product.pertamaKaliDijual || new Date().toISOString().split('T')[0],
    deskripsi: product.deskripsi || ''
  };
  isModalOpen.value = true;
}

function onSelectHppForSingle() {
  if (!form.value.hppCalculationId) return;
  const hpp = hppCatalog.value.find(h => h.id === form.value.hppCalculationId);
  if (hpp) {
    if (form.value.hargaJual === 0 && hpp.recommendedSellingPrice > 0) {
      form.value.hargaJual = hpp.recommendedSellingPrice;
    }
  }
}

function addBundleItemRow() {
  const defaultHpp = hppCatalog.value[0];
  form.value.bundleItems.push({
    id: 'b-item-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    hppCalculationId: defaultHpp ? defaultHpp.id : '',
    namaProduk: defaultHpp ? defaultHpp.nama : '',
    qty: 1,
    ukuranBotolMl: defaultHpp ? defaultHpp.targetBottleMl : 50,
    hppPerItem: defaultHpp ? defaultHpp.grandTotalHpp : 0
  });
}

function removeBundleItemRow(idx: number) {
  form.value.bundleItems.splice(idx, 1);
}

function onSelectBundleItemHpp(item: BundleProductItem) {
  const hpp = hppCatalog.value.find(h => h.id === item.hppCalculationId);
  if (hpp) {
    item.namaProduk = hpp.nama;
    item.ukuranBotolMl = hpp.targetBottleMl;
    item.hppPerItem = hpp.grandTotalHpp;
  }
}

function handleImageUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    form.value.gambar = evt.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function handleSubmit() {
  if (!form.value.nama.trim()) {
    store.showToast('Nama produk wajib diisi', 'warning');
    return;
  }

  if (!form.value.isBundle && !form.value.hppCalculationId) {
    store.showToast('Silakan pilih produk dari Katalog HPP', 'warning');
    return;
  }

  if (form.value.isBundle && form.value.bundleItems.length === 0) {
    store.showToast('Paket bundle harus memiliki minimal 1 produk', 'warning');
    return;
  }

  const payload: Omit<ReadyToSellProduct, 'id' | 'createdAt' | 'updatedAt'> = {
    isBundle: form.value.isBundle,
    nama: form.value.nama.trim(),
    hppCalculationId: !form.value.isBundle ? form.value.hppCalculationId || undefined : undefined,
    bundleItems: form.value.isBundle ? form.value.bundleItems : undefined,
    jumlahStok: Number(form.value.jumlahStok) || 0,
    hargaJual: Number(form.value.hargaJual) || 0,
    series: form.value.series.trim(),
    gambar: form.value.gambar,
    pertamaKaliDijual: form.value.pertamaKaliDijual || new Date().toISOString().split('T')[0],
    deskripsi: form.value.deskripsi.trim()
  };

  if (isEditing.value && editingId.value) {
    store.updateReadyToSellProduct(editingId.value, payload);
  } else {
    store.addReadyToSellProduct(payload);
  }

  isModalOpen.value = false;
}

// Detail Modal
const isDetailModalOpen = ref(false);
const detailItem = ref<ReadyToSellProduct | null>(null);

function viewDetail(product: ReadyToSellProduct) {
  detailItem.value = product;
  isDetailModalOpen.value = true;
}

// Delete Confirmation
const isDeleteModalOpen = ref(false);
const productToDelete = ref<ReadyToSellProduct | null>(null);

function confirmDelete(product: ReadyToSellProduct) {
  productToDelete.value = product;
  isDeleteModalOpen.value = true;
}

function handleDelete() {
  if (productToDelete.value) {
    store.deleteReadyToSellProduct(productToDelete.value.id);
    isDeleteModalOpen.value = false;
    productToDelete.value = null;
  }
}

// Helper Getters
function getHppName(id: string): string {
  const h = hppCatalog.value.find(item => item.id === id);
  return h ? `${h.nama} (${h.targetBottleMl}ml)` : 'Katalog HPP';
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
</script>
