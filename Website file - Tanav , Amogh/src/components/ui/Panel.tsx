import React from 'react';
import { cn } from '../../utils/cn';

interface PanelProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

export function Panel({ title, description, action, className, bodyClassName, children }: PanelProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-hairline bg-surface shadow-panel',
        className
      )}>
      
      {(title || action) &&
      <header className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      }
      <div className={cn('px-5 py-4', bodyClassName)}>{children}</div>
    </section>);

}