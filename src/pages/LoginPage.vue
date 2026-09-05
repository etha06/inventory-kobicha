<template>
  <div class="min-h-screen bg-canvas p-4 sm:p-6 flex flex-col justify-center items-center relative overflow-hidden font-sans text-forest-800 selection:bg-peach-200">
    <!-- Background Decorative Organic Shapes -->
    <div class="fixed top-2 left-4 pointer-events-none opacity-20 hidden md:block">
      <svg width="140" height="140" viewBox="0 0 100 100" fill="none" stroke="#608356" stroke-width="1.5">
        <path d="M10 90 Q 50 10 90 90" />
        <path d="M20 90 Q 50 25 80 90" />
        <path d="M30 90 Q 50 40 70 90" />
        <path d="M40 90 Q 50 55 60 90" />
      </svg>
    </div>
    
    <div class="fixed bottom-2 right-4 pointer-events-none opacity-25 hidden md:block">
      <svg width="160" height="160" viewBox="0 0 100 100" fill="none" stroke="#608356" stroke-width="1.5">
        <circle cx="90" cy="90" r="70" />
        <circle cx="90" cy="90" r="50" />
        <circle cx="90" cy="90" r="30" />
      </svg>
    </div>

    <!-- Login Floating Card Container -->
    <div class="w-full max-w-md bg-white rounded-[28px] sm:rounded-[36px] shadow-floating border border-[#d2e0d0]/80 p-8 sm:p-10 relative z-10 flex flex-col items-center text-center space-y-6">
      <!-- Logo & Brand Header -->
      <div class="flex flex-col items-center space-y-3">
        <div class="w-28 h-28 flex items-center justify-center">
          <img :src="logoImg" alt="Kobicha Studio" class="w-full h-full object-contain drop-shadow-md" />
        </div>
        
        <div>
          <h1 class="text-2xl font-serif font-black tracking-wide text-forest-900">
            KOBICHA STUDIO
          </h1>
          <p class="text-[10px] uppercase font-bold tracking-[0.25em] text-peach-600 mt-0.5">
            Parfumerie Formularium
          </p>
        </div>
        
        <p class="text-xs text-sage-600 max-w-xs leading-relaxed">
          Sistem Terpadu Inventaris Bahan, Resep Racikan, dan Kalkulator HPP
        </p>
      </div>

      <!-- Unauthorized Access Alert -->
      <div
        v-if="authError"
        class="w-full p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left flex items-start gap-3 shadow-2xs animate-shake"
      >
        <AlertCircle class="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div class="space-y-1">
          <div class="font-bold">Akses Ditolak</div>
          <p class="text-[11px] leading-relaxed text-rose-700">
            {{ authError }}
          </p>
        </div>
      </div>

      <!-- Google Sign In Button -->
      <div class="w-full space-y-3 pt-2">
        <button
          type="button"
          @click="handleGoogleLogin"
          :disabled="isLoggingIn"
          class="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-200/90 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-bold text-xs disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <!-- Official Google SVG Icon -->
          <svg v-if="!isLoggingIn" class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>

          <!-- Loading Spinner -->
          <div v-else class="w-5 h-5 border-2 border-stone-300 border-t-peach-500 rounded-full animate-spin"></div>

          <span>{{ isLoggingIn ? 'Menghubungkan Akun Google...' : 'Masuk dengan Akun Google' }}</span>
        </button>

        <p class="text-[11px] text-stone-400">
          Gunakan akun Gmail resmi yang telah terdaftar di sistem.
        </p>
      </div>

      <!-- Security Trust Badges -->
      <div class="w-full pt-4 border-t border-stone-100 flex flex-col items-center space-y-1.5 text-stone-400 text-[10px]">
        <div class="flex items-center gap-1.5 font-medium text-sage-600">
          <ShieldCheck class="w-3.5 h-3.5 text-forest-700" />
          <span>Terproteksi Firebase & reCAPTCHA Enterprise</span>
        </div>
        <p class="text-stone-400/80">
          Akses terbatas hanya untuk tim resmi Kobicha Parfumerie
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKobichaStore } from '../stores/kobichaStore';
import { storeToRefs } from 'pinia';
import { Sparkles, AlertCircle, ShieldCheck } from 'lucide-vue-next';
import logoImg from '../assets/logo.png';

const store = useKobichaStore();
const { isLoggingIn, authError } = storeToRefs(store);

async function handleGoogleLogin() {
  await store.loginWithGoogle();
}
</script>
