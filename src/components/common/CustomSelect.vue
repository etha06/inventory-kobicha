<template>
  <div class="relative w-full text-left" ref="selectContainer">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      class="w-full bg-white text-left px-3.5 py-2 text-xs flex items-center justify-between transition-all duration-150 select-none"
      :class="[
        isOpen
          ? 'border-2 border-stone-900 shadow-sm rounded-xl'
          : 'border border-sage-200 hover:border-sage-300 rounded-xl',
        disabled ? 'bg-stone-100/80 text-stone-500 cursor-not-allowed border-stone-200/80 opacity-60 pointer-events-none' : 'cursor-pointer text-stone-800',
        buttonClass
      ]"
    >
      <span class="truncate" :class="!selectedLabel ? 'text-stone-400 font-normal' : (disabled ? 'text-stone-600 font-medium' : 'text-stone-900 font-medium')">
        {{ selectedLabel || placeholder }}
      </span>

      <span class="ml-2 flex-shrink-0" :class="disabled ? 'text-stone-400' : 'text-stone-600'">
        <ChevronUp v-if="isOpen" class="w-3.5 h-3.5 text-stone-700 transition-transform duration-150" />
        <ChevronDown v-else class="w-3.5 h-3.5 text-stone-400 transition-transform duration-150" />
      </span>
    </button>

    <!-- Teleported Dropdown Panel (Floats on top of all tables, modals, and overflow containers) -->
    <Teleport to="body">
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
          ref="dropdownRef"
          :style="dropdownStyle"
          class="bg-white border border-stone-200/90 rounded-2xl shadow-2xl py-1.5 max-h-60 overflow-y-auto text-xs overflow-hidden"
          :class="dropdownClass"
        >
          <!-- Search Input if searchable -->
          <div v-if="searchable" class="p-2 border-b border-stone-100 sticky top-0 bg-white">
            <input
              ref="searchInput"
              v-model="searchTerm"
              type="text"
              placeholder="Cari..."
              class="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-stone-50/50"
              @click.stop
            />
          </div>

          <!-- Options List -->
          <div>
            <div
              v-for="(opt, idx) in normalizedFilteredOptions"
              :key="idx"
              @click="selectOption(opt)"
              class="px-4 py-2.5 cursor-pointer transition-colors text-xs flex items-center justify-between"
              :class="[
                isSelected(opt.value)
                  ? 'bg-stone-100/90 text-stone-900 font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-normal'
              ]"
            >
              <div class="flex items-center gap-2 truncate">
                <span v-if="opt.icon">{{ opt.icon }}</span>
                <span class="truncate">{{ opt.label }}</span>
              </div>

              <span
                v-if="opt.badge"
                class="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded border inline-flex items-center justify-center min-w-[20px]"
                :class="opt.badgeClass || 'bg-stone-100 text-stone-600 border-stone-200'"
              >
                {{ opt.badge }}
              </span>
            </div>

            <div
              v-if="normalizedFilteredOptions.length === 0"
              class="px-4 py-3 text-center text-stone-400 text-xs italic"
            >
              Tidak ada pilihan ditemukan
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
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
  badgeClass?: string;
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
const dropdownRef = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

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

function updateDropdownPosition() {
  if (!selectContainer.value) return;
  const rect = selectContainer.value.getBoundingClientRect();
  const dropdownHeight = 240;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    // Open upwards if not enough space below
    dropdownStyle.value = {
      position: 'fixed',
      bottom: `${window.innerHeight - rect.top + 6}px`,
      left: `${rect.left}px`,
      width: `${Math.max(rect.width, 220)}px`,
      zIndex: '99999'
    };
  } else {
    // Open downwards
    dropdownStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 6}px`,
      left: `${rect.left}px`,
      width: `${Math.max(rect.width, 220)}px`,
      zIndex: '99999'
    };
  }
}

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    updateDropdownPosition();
    if (props.searchable) {
      nextTick(() => {
        searchInput.value?.focus();
      });
    }
  }
}

function selectOption(opt: SelectOption) {
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  isOpen.value = false;
  searchTerm.value = '';
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (
    selectContainer.value &&
    !selectContainer.value.contains(target) &&
    dropdownRef.value &&
    !dropdownRef.value.contains(target)
  ) {
    isOpen.value = false;
    searchTerm.value = '';
  }
}

function handleScrollOrResize() {
  if (isOpen.value) {
    updateDropdownPosition();
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScrollOrResize, true);
  window.addEventListener('resize', handleScrollOrResize);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScrollOrResize, true);
  window.removeEventListener('resize', handleScrollOrResize);
});
</script>