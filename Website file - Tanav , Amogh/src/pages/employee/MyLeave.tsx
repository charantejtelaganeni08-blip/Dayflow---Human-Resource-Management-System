import React, { useState } from 'react';
import { CalendarPlusIcon, MessageSquareIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ApplyLeaveModal } from '../../components/leave/ApplyLeaveModal';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { fmtDate, relativeTime } from '../../utils/date';
import { leaveStatusMeta, leaveTypeMeta, leaveTypes } from '../../utils/labels';

export function MyLeave() {
  const { currentUser } = useAuth();
  const { leavesFor, withdrawLeave } = useHRData();
  const [applyOpen, setApplyOpen] = useState(false);
  if (!currentUser) return null;

  const requests = leavesFor(currentUser.id);

  return (
    <>
      <PageHeader
        title="Leave"
        description="Apply, track status and read HR's decision comments."
        action={
        <Button onClick={() => setApplyOpen(true)}>
            <CalendarPlusIcon className="h-4 w-4" />
            Apply for leave
          </Button>
        } />
      

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {leaveTypes.map((type) => {
          const balance = currentUser.balances[type];
          return (
            <div key={type} className="rounded-lg border border-hairline bg-surface px-4 py-3">
              <p className="text-xs text-ink-muted">{leaveTypeMeta[type].label}</p>
              <p className="mt-0.5 text-lg font-semibold text-ink">
                {type === 'unpaid' ? balance.used : balance.total - balance.used}
                <span className="text-xs font-normal text-ink-soft">
                  {type === 'unpaid' ? ' taken' : ` / ${balance.total} left`}
                </span>
              </p>
            </div>);

        })}
      </div>

      <Panel title="Your requests" bodyClassName="p-0">
        {requests.length === 0 ?
        <EmptyState
          icon={<CalendarPlusIcon className="h-4 w-4" />}
          title="No leave requests yet"
          description="Apply for leave and it will appear here with its status."
          action={<Button onClick={() => setApplyOpen(true)}>Apply for leave</Button>} /> :


        <ul className="divide-y divide-hairline">
            {requests.map((request) =>
          <li key={request.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-ink">
                        {leaveTypeMeta[request.type].label} leave · {request.days} day
                        {request.days === 1 ? '' : 's'}
                      </span>
                      <Badge className={leaveStatusMeta[request.status].chip}>
                        {leaveStatusMeta[request.status].label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">
                      {fmtDate(request.from)} → {fmtDate(request.to)}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Applied {relativeTime(request.appliedAt)}
                    </p>
                    {request.decisionComment &&
                <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-ink-muted">
                        <MessageSquareIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {request.decisionComment}
                      </p>
                }
                  </div>
                  {request.status === 'pending' &&
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  withdrawLeave(request.id);
                  toast('Request withdrawn');
                }}>
                
                      Withdraw
                    </Button>
              }
                </div>
              </li>
          )}
          </ul>
        }
      </Panel>

      <ApplyLeaveModal open={applyOpen} employee={currentUser} onClose={() => setApplyOpen(false)} />
    </>);

}