import type { SalaryStructure } from '../types/hr';

export function currency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

export function grossPay(s: SalaryStructure): number {
  return s.basic + s.hra + s.allowances;
}

export function deductions(s: SalaryStructure): number {
  return s.tax + s.pf;
}

export function netPay(s: SalaryStructure): number {
  return grossPay(s) - deductions(s);
}

export function initials(name: string): string {
  return name.
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((part) => part[0]?.toUpperCase() ?? '').
  join('');
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${'•'.repeat(Math.max(local.length - 2, 2))}@${domain}`;
}

export function downloadTextFile(fileName: string, contents: string): void {
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function toCsv(rows: (string | number)[][]): string {
  return rows.
  map((row) =>
  row.
  map((cell) => {
    const value = String(cell);
    return value.includes(',') ? `"${value}"` : value;
  }).
  join(',')
  ).
  join('\n');
}