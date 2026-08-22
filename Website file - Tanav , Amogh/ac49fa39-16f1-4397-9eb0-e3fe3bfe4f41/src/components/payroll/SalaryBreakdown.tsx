import type { SalaryStructure } from '../../types/hr';
import { currency, deductions, grossPay, netPay } from '../../utils/format';

interface SalaryBreakdownProps {
  structure: SalaryStructure;
}

export function SalaryBreakdown({ structure }: SalaryBreakdownProps) {
  const rows = [
  { group: 'Earnings', items: [
    { label: 'Basic', value: structure.basic },
    { label: 'House rent allowance', value: structure.hra },
    { label: 'Other allowances', value: structure.allowances }]
  },
  { group: 'Deductions', items: [
    { label: 'Income tax', value: -structure.tax },
    { label: 'Provident fund', value: -structure.pf }]
  }];


  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {rows.map((row) =>
        <div key={row.group}>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{row.group}</p>
            <ul className="mt-2 flex flex-col gap-2">
              {row.items.map((item) =>
            <li key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">{item.label}</span>
                  <span className="font-medium text-ink">{currency(Math.abs(item.value))}</span>
                </li>
            )}
              <li className="flex items-center justify-between border-t border-hairline pt-2 text-sm">
                <span className="text-ink-muted">Total</span>
                <span className="font-medium text-ink">
                  {currency(row.group === 'Earnings' ? grossPay(structure) : deductions(structure))}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between rounded-lg bg-brand-50 px-4 py-3">
        <span className="text-sm font-medium text-brand-800">Net pay per month</span>
        <span className="text-xl font-semibold text-brand-900">{currency(netPay(structure))}</span>
      </div>
    </div>);

}