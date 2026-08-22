import React, { useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { Modal } from '../ui/Modal';
import { useHRData } from '../../contexts/HRDataContext';
import type { Employee, SalaryStructure } from '../../types/hr';
import { currency, netPay } from '../../utils/format';

interface SalaryEditorProps {
  employee: Employee;
}

const fields: {key: keyof SalaryStructure;label: string;}[] = [
{ key: 'basic', label: 'Basic' },
{ key: 'hra', label: 'House rent allowance' },
{ key: 'allowances', label: 'Other allowances' },
{ key: 'tax', label: 'Income tax' },
{ key: 'pf', label: 'Provident fund' }];


export function SalaryEditor({ employee }: SalaryEditorProps) {
  const { updateSalary } = useHRData();
  const [draft, setDraft] = useState<SalaryStructure>(employee.salary);
  const [confirming, setConfirming] = useState(false);

  const dirty = fields.some((field) => draft[field.key] !== employee.salary[field.key]);
  const before = netPay(employee.salary);
  const after = netPay(draft);
  const delta = after - before;

  return (
    <>
      <Panel
        title="Salary structure"
        description="Changes take effect on the next unpublished payslip."
        action={
        <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled={!dirty} onClick={() => setDraft(employee.salary)}>
              Reset
            </Button>
            <Button size="sm" disabled={!dirty} onClick={() => setConfirming(true)}>
              Review change
            </Button>
          </div>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {fields.map((field) =>
          <Field key={field.key} label={field.label} htmlFor={`salary-${field.key}`}>
              <input
              id={`salary-${field.key}`}
              type="number"
              min={0}
              step={500}
              className={inputClass}
              value={draft[field.key]}
              onChange={(event) =>
              setDraft((current) => ({ ...current, [field.key]: Number(event.target.value) }))
              } />
            
            </Field>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-lg bg-slate-50 px-4 py-3">
          <div>
            <p className="text-xs text-ink-muted">Current net</p>
            <p className="text-lg font-semibold text-ink">{currency(before)}</p>
          </div>
          <ArrowRightIcon className="h-4 w-4 text-ink-soft" />
          <div>
            <p className="text-xs text-ink-muted">After change</p>
            <p className="text-lg font-semibold text-ink">{currency(after)}</p>
          </div>
          {dirty &&
          <span
            className={`ml-auto text-sm font-medium ${delta >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            
              {delta >= 0 ? '+' : '−'}
              {currency(Math.abs(delta))} per month
            </span>
          }
        </div>
      </Panel>

      <Modal
        open={confirming}
        title="Confirm salary revision"
        description={`${employee.name} · ${employee.id}`}
        onClose={() => setConfirming(false)}
        footer={
        <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              updateSalary(employee.id, draft);
              setConfirming(false);
              toast.success('Salary structure updated', {
                description: `${employee.name} has been notified.`
              });
            }}>
            
              Apply revision
            </Button>
          </>
        }>
        
        <ul className="flex flex-col gap-2 text-sm">
          {fields.
          filter((field) => draft[field.key] !== employee.salary[field.key]).
          map((field) =>
          <li key={field.key} className="flex items-center justify-between">
                <span className="text-ink-muted">{field.label}</span>
                <span className="text-ink">
                  {currency(employee.salary[field.key])} → <strong>{currency(draft[field.key])}</strong>
                </span>
              </li>
          )}
          <li className="mt-2 flex items-center justify-between border-t border-hairline pt-2">
            <span className="font-medium text-ink">Net pay</span>
            <span className="font-semibold text-ink">
              {currency(before)} → {currency(after)}
            </span>
          </li>
        </ul>
      </Modal>
    </>);

}