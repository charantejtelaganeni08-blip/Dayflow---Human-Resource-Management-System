export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
{ id: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
{ id: 'upper', label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
{ id: 'number', label: 'One number', test: (value) => /[0-9]/.test(value) },
{ id: 'symbol', label: 'One symbol', test: (value) => /[^A-Za-z0-9]/.test(value) }];


export function passwordScore(value: string): number {
  return passwordRules.filter((rule) => rule.test(value)).length;
}

export function passwordStrength(value: string): {label: string;tone: string;width: string;} {
  const score = passwordScore(value);
  if (score <= 1) return { label: 'Weak', tone: 'bg-red-500', width: 'w-1/4' };
  if (score === 2) return { label: 'Fair', tone: 'bg-amber-500', width: 'w-2/4' };
  if (score === 3) return { label: 'Good', tone: 'bg-sky-500', width: 'w-3/4' };
  return { label: 'Strong', tone: 'bg-green-600', width: 'w-full' };
}

export function isValidWorkEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidEmployeeId(value: string): boolean {
  return /^EMP-\d{4}$/i.test(value.trim());
}