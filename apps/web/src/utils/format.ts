// utils/format.ts
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const isPlainTimestamp = (v: any): v is { seconds: number; nanoseconds: number } =>
  v && typeof v === 'object' && typeof v.seconds === 'number' && typeof v.nanoseconds === 'number';

export function toDateSafe(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (v instanceof Timestamp) return v.toDate();
  if (isPlainTimestamp(v)) return new Date(v.seconds * 1000 + Math.floor(v.nanoseconds / 1e6));
  if (typeof v === 'string') {
    const d = v.length <= 10 ? new Date(v + 'T00:00:00') : new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function fmtDate(v: unknown, pattern = 'd/M/yyyy HH:mm') {
  const d = toDateSafe(v);
  return d ? format(d, pattern, { locale: es }) : '';
}

export function safeText(v: unknown): string {
  if (v == null) return '';
  const date = toDateSafe(v);
  if (date) return format(date, 'd/M/yyyy HH:mm', { locale: es });
  if (Array.isArray(v)) return v.map(safeText).join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
