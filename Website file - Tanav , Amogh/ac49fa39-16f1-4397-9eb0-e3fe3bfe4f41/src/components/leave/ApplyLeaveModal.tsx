import { useMemo, useState } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { useHRData } from '../../contexts/HRDataContext';
import type { Employee, LeaveType } from '../../types/hr';
import { rangesOverlap, todayIso, workingDaysBetween } from '../../utils/date';
import { leaveTypeMeta, leaveTypes } from '../../utils/labels';

interface ApplyLeaveModalProps {
  open: boolean;
  employee: Employee;
  onClose: () => void;
}

export function ApplyLeaveModal({ open, employee, onClose }: ApplyLeaveModalProps) {
  const { applyLeave, leavesFor } = useHRData();
  const [type, setType] = useState<LeaveType>('casual');
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(todayIso());
  const [remarks, setRemarks] = useState('');

  const days = workingDaysBetween(from, to);
  const balance = employee.balances[type];
  const remaining = balance.total - balance.used;

  const conflict = useMemo(
    () =>
    leavesFor(employee.id).some(
      (request) =>
      (request.status === 'pending' || request.status === 'approved') &&
      rangesOverlap(from, to, request.from, request.to)
    ),
    [employee.id, from, to, leavesFor]
  );

  const overBalance = type !== 'unpaid' && days > remaining;
  const invalidRange = days === 0;
  const canSubmit = !conflict && !overBalance && !invalidRange && remarks.trim().length > 3;

  return (
    <Modal
      open={open}
      title="Apply for leave"
      description="HR reviews the request and you get notified with their comment."
      onClose={onClose}
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
          disabled={!canSubmit}
          onClick={() => {
            applyLeave({ employeeId: employee.id, type, from, to, days, remarks: remarks.trim() });
            toast.success('Request submitted', { description: 'HR has been notified.' });
            setRemarks('');
            onClose();
          }}>
          
            Submit request
          </Button>
        </>
      }>
      
      <div className="flex flex-col gap-4">
        <Field label="Leave type">
          <div className="grid grid-cols-4 gap-2">
            {leaveTypes.map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              aria-pressed={type === option}
              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors duration-150 ease-soft ${
              type === option ?
              'border-brand-500 bg-brand-50 text-brand-700' :
              'border-hairline bg-white text-ink-muted hover:border-slate-300'}`
              }>
              
                {leaveTypeMeta[option].label}
              </button>
            )}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="From" htmlFor="leave-from">
            <input
              id="leave-from"
              type="date"
              className={inputClass}
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                if (event.target.value > to) setTo(event.target.value);
              }} />
            
          </Field>
          <Field label="To" htmlFor="leave-to">
            <input
              id="leave-to"
              type="date"
              min={from}
              className={inputClass}
              value={to}
              onChange={(event) => setTo(event.target.value)} />
            
          </Field>
        </div>

        <Field label="Remarks" htmlFor="leave-remarks" hint="Tell HR why — this is shown with the request.">
          <textarea
            id="leave-remarks"
            rows={3}
            className={`${inputClass} h-auto py-2`}
            placeholder="Family wedding out of town."
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)} />
          
        </Field>

        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Working days requested</span>
            <span className="font-medium text-ink">{days}</span>
          </div>
          {type !== 'unpaid' &&
          <div className="mt-1.5 flex items-center justify-between">
              <span className="text-ink-muted">{leaveTypeMeta[type].label} balance after approval</span>
              <span className="font-medium text-ink">
                {remaining - days} of {balance.total}
              </span>
            </div>
          }
        </div>

        {(conflict || overBalance || invalidRange) &&
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 ring-1 ring-inset ring-red-200">
          
            <AlertCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              {invalidRange ?
            'Pick a range that contains at least one working day.' :
            conflict ?
            'This overlaps an existing pending or approved request.' :
            `You only have ${remaining} ${leaveTypeMeta[type].label.toLowerCase()} day${remaining === 1 ? '' : 's'} left. Apply as unpaid instead.`}
            </span>
          </div>
        }
      </div>
    </Modal>);

}