import React from 'react';
import { cn } from '../../utils/cn';

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  locked?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, error, locked, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
        
        {label}
        {locked && <span className="text-[10px] font-normal text-ink-soft">· Managed by HR</span>}
      </label>
      {children}
      {error ?
      <p className="text-xs text-red-600">{error}</p> :

      hint && <p className="text-xs text-ink-soft">{hint}</p>
      }
    </div>);

}

export const inputClass =
'h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink placeholder:text-ink-soft transition-colors duration-150 ease-soft focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-ink-muted';