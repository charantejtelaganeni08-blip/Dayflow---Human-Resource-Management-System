import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, InboxIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { LeaveDecisionModal } from '../../components/leave/LeaveDecisionModal';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import type { LeaveRequest, LeaveStatus } from '../../types/hr';
import { fmtDate, relativeTime } from '../../utils/date';
import { leaveStatusMeta, leaveTypeMeta } from '../../utils/labels';
import { cn } from '../../utils/cn';

const filters: {id: LeaveStatus | 'all';label: string;}[] = [
{ id: 'pending', label: 'Pending' },
{ id: 'approved', label: 'Approved' },
{ id: 'rejected', label: 'Rejected' },
{ id: 'all', label: 'All' }];


export function LeaveApprovals() {
  const { currentUser } = useAuth();
  const { leaves, getEmployee, decideLeave } = useHRData();
  const [filter, setFilter] = useState<LeaveStatus | 'all'>('pending');
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState<{request: LeaveRequest;decision: 'approved' | 'rejected';} | null>(
    null
  );

  const visible = useMemo(
    () =>
    leaves.
    filter((request) => filter === 'all' ? true : request.status === filter).
    sort((a, b) => a.appliedAt < b.appliedAt ? 1 : -1),
    [leaves, filter]
  );

  const selectable = visible.filter((request) => request.status === 'pending');

  return (
    <>
      <PageHeader
        title="Leave approvals"
        description="Every request across the company, with the decision trail."
        action={
        selected.length > 0 &&
        <Button
          variant="success"
          onClick={() => {
            if (!currentUser) return;
            selected.forEach((id) => decideLeave(id, 'approved', 'Bulk approved.', currentUser.id));
            toast.success(`${selected.length} request${selected.length === 1 ? '' : 's'} approved`);
            setSelected([]);
          }}>
          
              <CheckIcon className="h-4 w-4" />
              Approve {selected.length} selected
            </Button>

        } />
      

      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 sm:w-fit">
        {filters.map((option) =>
        <button
          key={option.id}
          type="button"
          onClick={() => {
            setFilter(option.id);
            setSelected([]);
          }}
          aria-pressed={filter === option.id}
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ease-soft sm:flex-none',
            filter === option.id ? 'bg-white text-ink shadow-panel' : 'text-ink-muted hover:text-ink'
          )}>
          
            {option.label}
          </button>
        )}
      </div>

      <Panel bodyClassName="p-0">
        {visible.length === 0 ?
        <EmptyState
          icon={<InboxIcon className="h-4 w-4" />}
          title="Nothing here"
          description="No requests match this filter." /> :


        <ul className="divide-y divide-hairline">
            {selectable.length > 0 &&
          <li className="flex items-center gap-3 bg-slate-50 px-5 py-2.5">
                <input
              type="checkbox"
              aria-label="Select all pending requests"
              checked={selected.length === selectable.length}
              onChange={(event) =>
              setSelected(event.target.checked ? selectable.map((request) => request.id) : [])
              }
              className="h-3.5 w-3.5 rounded border-hairline text-brand-600 focus:ring-brand-500" />
            
                <span className="text-xs text-ink-muted">
                  Select all {selectable.length} pending
                </span>
              </li>
          }
            {visible.map((request) => {
            const employee = getEmployee(request.employeeId);
            const pending = request.status === 'pending';
            return (
              <li key={request.id} className="flex flex-wrap items-start gap-4 px-5 py-4">
                  {pending ?
                <input
                  type="checkbox"
                  aria-label={`Select request from ${employee?.name}`}
                  checked={selected.includes(request.id)}
                  onChange={(event) =>
                  setSelected((current) =>
                  event.target.checked ?
                  [...current, request.id] :
                  current.filter((id) => id !== request.id)
                  )
                  }
                  className="mt-3 h-3.5 w-3.5 rounded border-hairline text-brand-600 focus:ring-brand-500" /> :


                <span className="w-3.5" />
                }

                  <Avatar name={employee?.name ?? '—'} src={employee?.avatarUrl} size="md" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                      to={`/admin/employees/${request.employeeId}`}
                      className="text-sm font-medium text-ink hover:text-brand-700">
                      
                        {employee?.name}
                      </Link>
                      <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">
                        {leaveTypeMeta[request.type].label} · {request.days}d
                      </Badge>
                      <Badge className={leaveStatusMeta[request.status].chip}>
                        {leaveStatusMeta[request.status].label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {fmtDate(request.from)} → {fmtDate(request.to)}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      “{request.remarks}” · applied {relativeTime(request.appliedAt)}
                    </p>
                    {request.decisionComment &&
                  <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-ink-muted">
                        HR: {request.decisionComment}
                      </p>
                  }
                  </div>

                  {pending &&
                <div className="flex items-center gap-2">
                      <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setTarget({ request, decision: 'rejected' })}>
                    
                        <XIcon className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                      <Button
                    variant="success"
                    size="sm"
                    onClick={() => setTarget({ request, decision: 'approved' })}>
                    
                        <CheckIcon className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                    </div>
                }
                </li>);

          })}
          </ul>
        }
      </Panel>

      <LeaveDecisionModal
        request={target?.request ?? null}
        decision={target?.decision ?? 'approved'}
        onClose={() => setTarget(null)} />
      
    </>);

}