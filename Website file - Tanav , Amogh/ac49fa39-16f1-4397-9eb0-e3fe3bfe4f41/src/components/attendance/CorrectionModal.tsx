import { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { useHRData } from '../../contexts/HRDataContext';
import type { AttendanceStatus, Employee } from '../../types/hr';
import { fmtDate } from '../../utils/date';
import { attendanceMeta } from '../../utils/labels';
import { cn } from '../../utils/cn';

interface CorrectionModalProps {
  employee: Employee | null;
  date: string;
  onClose: () => void;
}

const statuses: AttendanceStatus[] = ['present', 'half-day', 'absent', 'leave'];

export function CorrectionModal({ employee, date, onClose }: CorrectionModalProps) {
  const { attendanceOn, correctAttendance } = useHRData();
  const existing = employee ? attendanceOn(employee.id, date) : undefined;
  const [status, setStatus] = useState<AttendanceStatus>(existing?.status ?? 'present');
  const [checkIn, setCheckIn] = useState(existing?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(existing?.checkOut ?? '');
  const [note, setNote] = useState('');

  const close = () => {
    setNote('');
    onClose();
  };

  return (
    <Modal
      open={Boolean(employee)}
      title="Correct attendance record"
      description={employee ? `${employee.name} · ${fmtDate(date)}` : undefined}
      onClose={close}
      footer={
      <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
          disabled={note.trim().length < 4}
          onClick={() => {
            if (!employee) return;
            correctAttendance(employee.id, date, {
              status,
              checkIn: status === 'absent' || status === 'leave' ? undefined : checkIn || undefined,
              checkOut: status === 'absent' || status === 'leave' ? undefined : checkOut || undefined,
              note: note.trim()
            });
            toast.success('Attendance corrected', { description: `${employee.name} has been notified.` });
            close();
          }}>
          
            Save correction
          </Button>
        </>
      }>
      
      <div className="flex flex-col gap-4">
        <Field label="Status">
          <div className="grid grid-cols-4 gap-2">
            {statuses.map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              aria-pressed={status === option}
              className={cn(
                'rounded-lg border px-2 py-2 text-xs font-medium transition-colors duration-150 ease-soft',
                status === option ?
                'border-brand-500 bg-brand-50 text-brand-700' :
                'border-hairline bg-white text-ink-muted hover:border-slate-300'
              )}>
              
                {attendanceMeta[option].label}
              </button>
            )}
          </div>
        </Field>

        {(status === 'present' || status === 'half-day') &&
        <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in" htmlFor="correct-in">
              <input
              id="correct-in"
              type="time"
              className={inputClass}
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)} />
            
            </Field>
            <Field label="Check-out" htmlFor="correct-out">
              <input
              id="correct-out"
              type="time"
              className={inputClass}
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)} />
            
            </Field>
          </div>
        }

        <Field
          label="Reason"
          htmlFor="correct-note"
          hint="Required — kept on the record and sent to the employee.">
          
          <textarea
            id="correct-note"
            rows={3}
            className={`${inputClass} h-auto py-2`}
            placeholder="Biometric device was offline; times confirmed with the manager."
            value={note}
            onChange={(event) => setNote(event.target.value)} />
          
        </Field>
      </div>
    </Modal>);

}