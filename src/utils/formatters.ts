import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatRupiah(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number | undefined | null, decimals = 2): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatDateIndo(dateStr: string): string {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return format(d, 'd MMM yyyy, HH:mm', { locale: id });
  } catch {
    return dateStr || '-';
  }
}

export function formatMonthYear(date: Date = new Date()): string {
  return format(date, 'MMMM yyyy', { locale: id });
}

export function normalizeJenisBarang(val: string | string[] | undefined | null): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map(s => String(s).trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    if (val.includes(',')) {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    const trimmed = val.trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
}

export function formatJenisBarang(val: string | string[] | undefined | null): string {
  const items = normalizeJenisBarang(val);
  return items.length > 0 ? items.join(', ') : '-';
}
