import { format, formatDistanceToNow } from 'date-fns';
import { DATE_FORMATS } from './constants';

export function formatDate(date: string | Date, formatStr = DATE_FORMATS.SHORT): string {
  return format(new Date(date), formatStr);
}

export function formatDuration(date: string | Date): string {
  const now = new Date();
  const created = new Date(date);
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  
  if (years > 0) return `${years}y, ${months}m`;
  if (months > 0) return `${months}m, ${days}d`;
  return `${days}d`;
}

export function formatDistanceFromNow(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

interface FormatMoneyOptions {
  compact?: boolean;
}

export function formatMoney(amount: number, options: FormatMoneyOptions = {}): string {
  if (options.compact) {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}