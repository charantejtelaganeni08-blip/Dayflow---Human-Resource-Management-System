import React from 'react';
import { BuildingIcon } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-full w-full grid-cols-1 bg-canvas lg:grid-cols-[minmax(0,1fr)_420px]">
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <BuildingIcon className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-ink">PeopleDesk</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-sm text-ink-muted">{footer}</div>}
        </div>
      </main>
      <aside className="hidden flex-col justify-between border-l border-hairline bg-brand-900 px-10 py-12 lg:flex" style={{ backgroundColor: "#131315" }}>
        <div className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <BuildingIcon className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">PeopleDesk</span>
        </div>
        <div>
          <p className="text-lg font-medium leading-snug text-white">
            Onboarding, attendance, leave and payroll for the whole company — in one place.
          </p>
          <p className="mt-3 text-sm text-brand-200">
            Employees handle their own day. HR clears the queue.
          </p>
        </div>
        <p className="text-xs text-brand-300">Prototype · data resets on reload</p>
      </aside>
    </div>);

}