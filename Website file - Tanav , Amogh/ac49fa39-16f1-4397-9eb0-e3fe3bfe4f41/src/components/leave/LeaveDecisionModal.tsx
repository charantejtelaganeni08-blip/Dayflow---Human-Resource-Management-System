import { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import type { LeaveRequest } from '../../types/hr';
import { fmtDate } from '../../utils/date';
import { leaveTypeMeta } from '../../utils/labels';

interface LeaveDecisionModalProps {
  request: LeaveRequest | null;
  decision: 'approved' | 'rejected';
  onClose: () => void;
}

export function LeaveDecisionModal({ request, decision, onClose }: LeaveDecisionModalProps) {
  const { currentUser } = useAuth();
  const { decideLeave, getEmployee } = useHRData();
  const [comment, setComment] = useState('');

  const employee = request ? getEmployee(request.employeeId) : undefined;
  const rejecting = decision === 'rejected';
  const canSubmit = !rejecting || comment.trim().length > 3;

  return (
    <Modal
      open={Boolean(request)}
      title={rejecting ? 'Reject leave request' : 'Approve leave request'}
      description={
      request && employee ?
      `${employee.name} · ${leaveTypeMeta[request.type].label} · ${fmtDate(request.from)} → ${fmtDate(request.to)}` :
      undefined
      }
      onClose={() => {
        setComment('');
        onClose();
      }}
      footer={
      <>
          <Button
          variant="secondary"
          onClick={() => {
            setComment('');
            onClose();
          }}>
          
            Cancel
          </Button>
          <Button
          variant={rejecting ? 'danger' : 'success'}
          disabled={!canSubmit}
          onClick={() => {
            if (!request || !currentUser) return;
            decideLeave(request.id, decision, comment.trim(), currentUser.id);
            toast.success(rejecting ? 'Request rejected' : 'Request approved', {
              description: `${employee?.name} has been notified.`
            });
            setComment('');
            onClose();
          }}>
          
            {rejecting ? 'Reject request' : 'Approve request'}
          </Button>
        </>
      }>
      
      {request &&
      <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <p className="text-ink-muted">Employee remarks</p>
            <p className="mt-1 text-ink">{request.remarks}</p>
            <p className="mt-2 text-xs text-ink-soft">
              {request.days} working day{request.days === 1 ? '' : 's'} requested
            </p>
          </div>

          <Field
          label={rejecting ? 'Reason for rejection' : 'Comment (optional)'}
          htmlFor="decision-comment"
          hint={rejecting ? 'Required — the employee sees this.' : 'Shown to the employee with the approval.'}>
          
            <textarea
            id="decision-comment"
            rows={3}
            className={`${inputClass} h-auto py-2`}
            placeholder={
            rejecting ?
            'Overlaps with the release window — please re-plan.' :
            'Approved. Please hand over ongoing work.'
            }
            value={comment}
            onChange={(event) => setComment(event.target.value)} />
          
          </Field>

          {decision === 'approved' &&
        <p className="text-xs text-ink-muted">
              Approving marks these days as Leave on the attendance record and deducts them from the
              balance.
            </p>
        }
        </div>
      }
    </Modal>);

}