import {
  addDays,
  differenceInMinutes,
  eachDayOfInterval,
  format,
  isWeekend,
  parseISO,
  startOfWeek } from
'date-fns';

export const ISO = 'yyyy-MM-dd';

export function todayIso(): string {
  return format(new Date(), ISO);
}

export function fmtDate(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy');
}

export function fmtShortDate(iso: string): string {
  return format(parseISO(iso), 'd MMM');
}

export function fmtMonth(month: string): string {
  return format(parseISO(`${month}-01`), 'MMMM yyyy');
}

export function fmtTime(time?: string): string {
  return time ? time : '—';
}

export function weekDays(reference: Date): string[] {
  const start = startOfWeek(reference, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), ISO));
}

export function workingDaysBetween(from: string, to: string): number {
  if (!from || !to) return 0;
  const start = parseISO(from);
  const end = parseISO(to);
  if (end < start) return 0;
  return eachDayOfInterval({ start, end }).filter((day) => !isWeekend(day)).length;
}

export function rangesOverlap(aFrom: string, aTo: string, bFrom: string, bTo: string): boolean {
  return aFrom <= bTo && bFrom <= aTo;
}

export function hoursBetween(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 0;
  const base = '2020-01-01T';
  const minutes = differenceInMinutes(new Date(`${base}${checkOut}:00`), new Date(`${base}${checkIn}:00`));
  return Math.max(minutes, 0) / 60;
}

export function fmtDuration(hours: number): string {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return `${whole}h ${String(minutes).padStart(2, '0')}m`;
}

export function isLate(checkIn?: string, threshold = '09:30'): boolean {
  return Boolean(checkIn && checkIn > threshold);
}

export function relativeTime(isoDateTime: string): string {
  const then = new Date(isoDateTime).getTime();
  const diff = Date.now() - then;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return format(new Date(isoDateTime), 'd MMM');
}

export function isToday(isoDateTime: string): boolean {
  return format(new Date(isoDateTime), ISO) === todayIso();
}