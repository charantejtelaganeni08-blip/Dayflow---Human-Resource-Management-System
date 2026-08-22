import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-ink-soft">
        {icon}
      </span>
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="max-w-sm text-xs text-ink-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>);

}