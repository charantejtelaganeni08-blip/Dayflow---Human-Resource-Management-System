import { useEffect, useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { Modal } from '../ui/Modal';
import { SalaryBreakdown } from './SalaryBreakdown';
import { useHRData } from '../../contexts/HRDataContext';
import { useAuth } from '../../contexts/AuthContext';
import type { Employee, Payslip, SalaryStructure } from '../../types/hr';
import { currency, netPay } from '../../utils/format';
import { fmtMonth } from '../../utils/date';

interface SalaryEditorProps { employee: Employee; }

const fields: { key: keyof SalaryStructure; label: string }[] = [
  { key: 'basic', label: 'Basic' }, { key: 'hra', label: 'House rent allowance' },
  { key: 'allowances', label: 'Other allowances' }, { key: 'tax', label: 'Income tax' },
  { key: 'pf', label: 'Provident fund' },
];

export function SalaryEditor({ employee }: SalaryEditorProps) {
  const { payslipsFor, updatePayslip, updateSalary } = useHRData();
  const { currentUser } = useAuth();
  const [draft, setDraft] = useState<SalaryStructure>(employee.salary);
  const [revisionTarget, setRevisionTarget] = useState<Payslip | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!revisionTarget) setDraft(employee.salary); }, [employee.salary, revisionTarget]);

  const baseline = revisionTarget?.structure ?? employee.salary;
  const dirty = fields.some((field) => draft[field.key] !== baseline[field.key]);
  const before = netPay(baseline);
  const after = netPay(draft);
  const delta = after - before;
  const payrollRecords = payslipsFor(employee.id);
  const canEditPayroll = currentUser?.role === 'admin' && currentUser.id !== employee.id;

  if (!canEditPayroll) {
    return <>
      <Panel title="Salary structure" description="Read-only for your own payroll.">
        <SalaryBreakdown structure={employee.salary} />
      </Panel>
      <Panel title="Payroll records" bodyClassName="p-0">
        <p className="px-5 pt-4 text-sm text-ink-muted">HR users can view, but cannot edit, their own payroll records.</p>
        <ul className="mt-3 divide-y divide-hairline">
          {payrollRecords.map((slip) => <li key={slip.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
            <span className="text-ink">{fmtMonth(slip.month)}</span>
            <span className="text-ink-muted">{slip.published ? 'Published' : 'Draft'} · {currency(netPay(slip.structure))}</span>
          </li>)}
        </ul>
      </Panel>
    </>;
  }

  const handleApplyRevision = () => {
    if (!dirty || saving) return;
    try {
      setSaving(true);
      if (revisionTarget) updatePayslip(revisionTarget.id, draft);
      else updateSalary(employee.id, draft);
      setConfirming(false);
      setRevisionTarget(null);
      toast.success(revisionTarget ? revisionTarget.published ? 'Payslip revised' : 'Draft payroll updated' : 'Salary structure updated', {
        description: revisionTarget ? `${employee.name}'s ${fmtMonth(revisionTarget.month)} ${revisionTarget.published ? 'payslip was revised.' : 'draft payroll was updated.'}` : `${employee.name}'s salary has been updated successfully.`,
      });
    } catch (error) {
      console.error('Salary update failed:', error);
      toast.error('Salary update failed', { description: error instanceof Error ? error.message : 'Unable to update the salary. Please try again.' });
    } finally { setSaving(false); }
  };

  const handleSalaryChange = (key: keyof SalaryStructure, value: string) => {
    const parsedValue = Number(value);
    setDraft((current) => ({
      ...current,
      [key]: Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0,
    }));
  };

  return <>
    <Panel
      title="Salary structure"
      description={revisionTarget ? `Editing the ${revisionTarget.published ? 'published payslip' : 'draft payroll'} for ${fmtMonth(revisionTarget.month)}.` : 'Changes take effect on the next unpublished payslip.'}
      action={<div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={!dirty || saving} onClick={() => setDraft(baseline)}>Reset</Button>
        <Button size="sm" disabled={!dirty || saving} onClick={() => setConfirming(true)}>Review change</Button>
      </div>}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {fields.map((field) => <Field key={field.key} label={field.label} htmlFor={`salary-${field.key}`}>
          <input id={`salary-${field.key}`} type="number" min={0} step={500} className={inputClass} value={draft[field.key]} disabled={saving} onChange={(event) => handleSalaryChange(field.key, event.target.value)} />
        </Field>)}
      </div>

      {revisionTarget && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm">
        <span className="text-brand-900">Editing the {revisionTarget.published ? 'published payslip' : 'draft payroll'} for <strong>{fmtMonth(revisionTarget.month)}</strong>.</span>
        <Button variant="secondary" size="sm" disabled={saving} onClick={() => { setRevisionTarget(null); setDraft(employee.salary); }}>Edit current salary instead</Button>
      </div>}

      <div className="mt-5 flex flex-wrap items-center gap-4 rounded-lg bg-slate-50 px-4 py-3">
        <div><p className="text-xs text-ink-muted">Current net</p><p className="text-lg font-semibold text-ink">{currency(before)}</p></div>
        <ArrowRightIcon className="h-4 w-4 text-ink-soft" />
        <div><p className="text-xs text-ink-muted">After change</p><p className="text-lg font-semibold text-ink">{currency(after)}</p></div>
        {dirty && <span className={`ml-auto text-sm font-medium ${delta >= 0 ? 'text-green-700' : 'text-red-700'}`}>{delta >= 0 ? '+' : '−'}{currency(Math.abs(delta))} per month</span>}
      </div>

      {payrollRecords.length > 0 && <div className="mt-5 border-t border-hairline pt-5">
        <p className="text-sm font-medium text-ink">Employee payroll records</p>
        <p className="mt-1 text-xs text-ink-muted">Edit a draft before publishing, or revise one issued payslip without changing the others.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {payrollRecords.map((slip) => <li key={slip.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="text-sm text-ink">{fmtMonth(slip.month)} <span className={slip.published ? 'text-green-700' : 'text-amber-700'}>· {slip.published ? 'Published' : 'Draft'}</span></span>
            <Button variant="secondary" size="sm" disabled={saving} onClick={() => { setRevisionTarget(slip); setDraft(slip.structure); }}>{slip.published ? 'Revise payslip' : 'Edit draft'}</Button>
          </li>)}
        </ul>
      </div>}
    </Panel>

    <Modal
      open={confirming}
      title={revisionTarget ? revisionTarget.published ? 'Confirm payslip revision' : 'Confirm draft payroll update' : 'Confirm salary revision'}
      description={revisionTarget ? `${employee.name} · ${fmtMonth(revisionTarget.month)}` : `${employee.name} · ${employee.id}`}
      onClose={() => { if (!saving) setConfirming(false); }}
      footer={<><Button variant="secondary" disabled={saving} onClick={() => setConfirming(false)}>Cancel</Button><Button disabled={saving || !dirty} onClick={handleApplyRevision}>{saving ? 'Saving...' : 'Apply revision'}</Button></>}
    >
      <ul className="flex flex-col gap-2 text-sm">
        {fields.filter((field) => draft[field.key] !== baseline[field.key]).map((field) => <li key={field.key} className="flex items-center justify-between">
          <span className="text-ink-muted">{field.label}</span><span className="text-ink">{currency(baseline[field.key])} → <strong>{currency(draft[field.key])}</strong></span>
        </li>)}
        <li className="mt-2 flex items-center justify-between border-t border-hairline pt-2"><span className="font-medium text-ink">Net pay</span><span className="font-semibold text-ink">{currency(before)} → {currency(after)}</span></li>
      </ul>
    </Modal>
  </>;
}
