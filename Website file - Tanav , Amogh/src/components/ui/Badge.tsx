import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  dotClassName?: string;
}

export function Badge({ children, className, dotClassName }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        className ?? 'bg-slate-100 text-slate-600 ring-slate-500/20'
      )}>
      
      {dotClassName && <span className={cn('h-1.5 w-1.5 rounded-full', dotClassName)} />}
      {children}
    </span>);

}