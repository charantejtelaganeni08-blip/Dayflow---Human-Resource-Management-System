import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, subMonths } from 'date-fns';
import { CheckCircle2Icon, SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { inputClass } from '../../components/ui/Field';
import { useHRData } from '../../contexts/HRDataContext';
import { currency, deductions, grossPay, netPay } from '../../utils/format';
import { fmtMonth } from '../../utils/date';

export function Payroll() {
  const { employees, payslips, publishPayroll } = useHRData();
  const months = useMemo(
    () => Array.from({ length: 5 }, (_, index) => format(subMonths(new Date(), index), 'yyyy-MM')),
    []
  );
  const [month, setMonth] = useState(months[0]);

  const rows = employees.map((employee) => ({
    employee,
    slip: payslips.find((item) => item.employeeId === employee.id && item.month === month)
  }));

  const totalCost = rows.reduce(
    (sum, row) => sum + grossPay(row.slip?.structure ?? row.employee.salary),
    0
  );
  const draftCount = rows.filter((row) => row.slip && !row.slip.published).length;

  return (
    <>
      <PageHeader
        title="Payroll"
        description="Monthly cost across the org. Open a person to revise their structure."
        action={
        <div className="flex items-center gap-2">
            <select
            className={`${inputClass} w-44`}
            aria-label="Payroll month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}>
            
              {months.map((option) =>
            <option key={option} value={option}>
                  {fmtMonth(option)}
                </option>
            )}
            </select>
            <Button
            disabled={draftCount === 0}
            onClick={() => {
              const count = publishPayroll(month);
              toast.success(`Payroll published for ${fmtMonth(month)}`, {
                description: `${count} payslip${count === 1 ? '' : 's'} released to employees.`
              });
            }}>
            
              <SendIcon className="h-4 w-4" />
              {draftCount === 0 ? 'Published' : `Publish ${draftCount} slips`}
            </Button>
          </div>
        } />
      

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-hairline bg-surface px-4 py-3">
          <p className="text-xs text-ink-muted">Total monthly cost</p>
          <p className="mt-0.5 text-2xl font-semibold text-ink">{currency(totalCost)}</p>
        </div>
        <div className="rounded-lg border border-hairline bg-surface px-4 py-3">
          <p className="text-xs text-ink-muted">People on payroll</p>
          <p className="mt-0.5 text-2xl font-semibold text-ink">{employees.length}</p>
        </div>
        <div className="rounded-lg border border-hairline bg-surface px-4 py-3">
          <p className="text-xs text-ink-muted">Status</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink">
            {draftCount === 0 ?
            <>
                <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                Published
              </> :

            `${draftCount} slips in draft`
            }
          </p>
        </div>
      </div>

      <Panel bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-soft">
                <th scope="col" className="px-5 py-3 font-medium">Employee</th>
                <th scope="col" className="px-5 py-3 font-medium">Gross</th>
                <th scope="col" className="px-5 py-3 font-medium">Deductions</th>
                <th scope="col" className="px-5 py-3 font-medium">Net pay</th>
                <th scope="col" className="px-5 py-3 font-medium">Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map(({ employee, slip }) => {
                const structure = slip?.structure ?? employee.salary;
                return (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={employee.name} src={employee.avatarUrl} size="sm" />
                        <div>
                          <Link
                            to={`/admin/employees/${employee.id}`}
                            className="font-medium text-ink hover:text-brand-700">
                            
                            {employee.name}
                          </Link>
                          <p className="text-xs text-ink-muted">{employee.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{currency(grossPay(structure))}</td>
                    <td className="px-5 py-3 text-ink-muted">{currency(deductions(structure))}</td>
                    <td className="px-5 py-3 font-medium text-ink">{currency(netPay(structure))}</td>
                    <td className="px-5 py-3">
                      {slip?.published ?
                      <Badge className="bg-green-50 text-green-700 ring-green-600/20">Published</Badge> :

                      <Badge className="bg-amber-50 text-amber-700 ring-amber-600/20">Draft</Badge>
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>);

}