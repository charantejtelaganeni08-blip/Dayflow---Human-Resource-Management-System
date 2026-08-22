import React from 'react';
import { DownloadIcon, LockIcon, ReceiptIndianRupeeIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { SalaryBreakdown } from '../../components/payroll/SalaryBreakdown';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { currency, deductions, downloadTextFile, grossPay, netPay } from '../../utils/format';
import { fmtMonth } from '../../utils/date';
import type { Employee, Payslip } from '../../types/hr';

function slipText(employee: Employee, slip: Payslip): string {
  return [
  'PeopleDesk — Salary Slip',
  `Month: ${fmtMonth(slip.month)}`,
  `Employee: ${employee.name} (${employee.id})`,
  `Department: ${employee.department} · ${employee.designation}`,
  '',
  'Earnings',
  `  Basic               ${currency(slip.structure.basic)}`,
  `  HRA                 ${currency(slip.structure.hra)}`,
  `  Other allowances    ${currency(slip.structure.allowances)}`,
  `  Gross               ${currency(grossPay(slip.structure))}`,
  '',
  'Deductions',
  `  Income tax          ${currency(slip.structure.tax)}`,
  `  Provident fund      ${currency(slip.structure.pf)}`,
  `  Total               ${currency(deductions(slip.structure))}`,
  '',
  `Net pay               ${currency(netPay(slip.structure))}`].
  join('\n');
}

export function Payslips() {
  const { currentUser } = useAuth();
  const { payslipsFor } = useHRData();
  if (!currentUser) return null;

  const slips = payslipsFor(currentUser.id);
  const published = slips.filter((slip) => slip.published);

  return (
    <>
      <PageHeader
        title="Payslips"
        description="Your salary structure and monthly slips. Read-only — HR maintains these." />
      

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Current salary structure"
          action={
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <LockIcon className="h-3.5 w-3.5" />
              Managed by HR
            </span>
          }>
          
          <SalaryBreakdown structure={currentUser.salary} />
        </Panel>

        <Panel title="Monthly slips" bodyClassName="p-0">
          {published.length === 0 ?
          <EmptyState
            icon={<ReceiptIndianRupeeIcon className="h-4 w-4" />}
            title="No published payslips"
            description="Slips appear here once HR publishes payroll for the month." /> :


          <ul className="divide-y divide-hairline">
              {published.map((slip) =>
            <li key={slip.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{fmtMonth(slip.month)}</p>
                    <p className="text-xs text-ink-muted">
                      Net {currency(netPay(slip.structure))}
                    </p>
                  </div>
                  <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  downloadTextFile(
                    `payslip-${currentUser.id}-${slip.month}.txt`,
                    slipText(currentUser, slip)
                  );
                  toast.success('Payslip downloaded');
                }}>
                
                    <DownloadIcon className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </li>
            )}
            </ul>
          }
        </Panel>
      </div>
    </>);

}