import { NotesEnum, PyramidEnum, JenisLiquidEnum, CurrentStockEnum } from '../types';

export const NOTES_OPTIONS: NotesEnum[] = [
  'Woody',
  'Floral',
  'Gourmand',
  'Oriental',
  'Fruity',
  'Aquatic',
  'Aromatic',
  'Citrus',
  'Green',
  'Leathery',
  'Powdery'
];

export const PYRAMID_OPTIONS: PyramidEnum[] = ['Top', 'Middle', 'Bottom'];

export const JENIS_LIQUID_OPTIONS: JenisLiquidEnum[] = [
  'Essential oil',
  'Fragrance Oil',
  'Kimia Sintetis',
  'Steering Base'
];

export const CURRENT_STOCK_OPTIONS: CurrentStockEnum[] = ['Banyak', 'Dikit', 'Habis'];

export const CATEGORY_CAMPURAN_OPTIONS = [
  'Pelarut / Solvent (Alkohol/Etanol)',
  'Fixative / Pengikat Aroma',
  'Solubilizer / Emulsifier',
  'Botol & Packaging',
  'Sprayer & Cap',
  'Peralatan Lab & Pipet',
  'Bahan Aditif Lainnya'
];

export const NOTE_COLOR_MAP: Record<NotesEnum, { bg: string; text: string; border: string }> = {
  Woody: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  Floral: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  Gourmand: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  Oriental: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  Fruity: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  Aquatic: { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300' },
  Aromatic: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  Citrus: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  Green: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  Leathery: { bg: 'bg-stone-200', text: 'text-stone-800', border: 'border-stone-400' },
  Powdery: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
};

export const PYRAMID_BADGE_MAP: Record<PyramidEnum, { bg: string; text: string }> = {
  Top: { bg: 'bg-amber-500/15 text-amber-700 border-amber-300', text: 'Top Note ☁️' },
  Middle: { bg: 'bg-indigo-500/15 text-indigo-700 border-indigo-300', text: 'Heart / Middle 🌸' },
  Bottom: { bg: 'bg-stone-600/15 text-stone-800 border-stone-400', text: 'Base / Bottom 🪵' },
};

export const STOCK_STATUS_MAP: Record<CurrentStockEnum, { bg: string; text: string; dot: string }> = {
  Banyak: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Banyak', dot: 'bg-emerald-500' },
  Dikit: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Menipis', dot: 'bg-amber-500' },
  Habis: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Habis', dot: 'bg-rose-500' },
};
