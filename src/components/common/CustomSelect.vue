<template>
  <div class="relative w-full text-left" ref="selectContainer">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      class="w-full bg-white border text-left px-3.5 py-2 text-xs flex items-center justify-between transition-all duration-150 select-none"
      :class="[
        isOpen
          ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm rounded-lg'
          : 'border-stone-300 hover:border-stone-400 rounded-lg',
        disabled ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-stone-200' : 'cursor-pointer text-stone-800',
        buttonClass
      ]"
    >
      <span class="truncate font-semibold" :class="!selectedLabel ? 'text-stone-400 font-normal' : 'text-stone-800'">
        {{ selectedLabel || placeholder }}
      </span>

      <span class="ml-2 flex-shrink-0 text-stone-500">
        <ChevronUp v-if="isOpen" class="w-3.5 h-3.5 text-stone-600 transition-transform duration-150" />
        <ChevronDown v-else class="w-3.5 h-3.5 text-stone-400 transition-transform duration-150" />
      </span>
    </button>

    <!-- Dropdown Panel -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1.5 w-full bg-white border border-stone-200 rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto text-xs"
        :class="dropdownClass"
      >
        <!-- Search Input if searchable -->
        <div v-if="searchable" class="p-2 border-b border-stone-100 sticky top-0 bg-white">
          <input
            ref="searchInput"
            v-model="searchTerm"
            type="text"
            placeholder="Cari..."
            class="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
            @click.stop
          />
        </div>

        <!-- Options List -->
        <div class="divide-y divide-stone-50">
          <div
            v-for="(opt, idx) in normalizedFilteredOptions"
            :key="idx"
            @click="selectOption(opt)"
            class="px-3.5 py-2 cursor-pointer transition-colors text-xs flex items-center justify-between"
            :class="[
              isSelected(opt.value)
                ? 'bg-stone-100 text-stone-900 font-bold'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-medium'
            ]"
          >
            <div class="flex items-center gap-2 truncate">
              <span v-if="opt.icon">{{ opt.icon }}</span>
              <span class="truncate">{{ opt.label }}</span>
            </div>

            <span v-if="opt.badge" class="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-normal">
              {{ opt.badge }}
            </span>
          </div>

          <div
            v-if="normalizedFilteredOptions.length === 0"
            class="px-3.5 py-3 text-center text-stone-400 text-xs italic"
          >
            Tidak ada pilihan ditemukan
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';

export interface SelectOption {
  value: any;
  label: string;
  icon?: string;
  badge?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: any;
    options: (SelectOption | string | number)[];
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    buttonClass?: string;
    dropdownClass?: string;
  }>(),
  {
    placeholder: 'Pilih...',
    disabled: false,
    searchable: false,
    buttonClass: '',
    dropdownClass: ''
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'change', value: any): void;
}>();

const isOpen = ref(false);
const searchTerm = ref('');
const selectContainer = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);

const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt as SelectOption;
    }
    return {
      value: opt,
      label: String(opt)
    };
  });
});

const normalizedFilteredOptions = computed(() => {
  if (!props.searchable || !searchTerm.value.trim()) {
    return normalizedOptions.value;
  }
  const q = searchTerm.value.toLowerCase().trim();
  return normalizedOptions.value.filter((opt) =>
    opt.label.toLowerCase().includes(q)
  );
});

const selectedOption = computed(() => {
  return normalizedOptions.value.find((opt) => opt.value === props.modelValue);
});

const selectedLabel = computed(() => {
  if (selectedOption.value) {
    return selectedOption.value.label;
  }
  if (props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== '') {
    return String(props.modelValue);
  }
  return '';
});

function isSelected(val: any) {
  return props.modelValue === val;
}

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.searchable) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
}

function selectOption(opt: SelectOption) {
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  isOpen.value = false;
  searchTerm.value = '';
}

function handleClickOutside(e: MouseEvent) {
  if (selectContainer.value && !selectContainer.value.contains(e.target as Node)) {
    isOpen.value = false;
    searchTerm.value = '';
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>