import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ClockAlertIcon, InboxIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { LeaveDecisionModal } from '../../components/leave/LeaveDecisionModal';
import { useHRData } from '../../contexts/HRDataContext';
import type { LeaveRequest } from '../../types/hr';
import { fmtDate, relativeTime, todayIso } from '../../utils/date';
import { attendanceMeta, leaveTypeMeta } from '../../utils/labels';

export function AdminDashboard() {
  const { employees, leaves, attendance, getEmployee } = useHRData();
  const [target, setTarget] = useState<{request: LeaveRequest;decision: 'approved' | 'rejected';} | null>(
    null
  );

  const pending = leaves.filter((request) => request.status === 'pending');
  const today = todayIso();
  const todayRecords = attendance.filter((record) => record.date === today);
  const presentToday = todayRecords.filter((record) => record.status === 'present').length;
  const onLeaveToday = todayRecords.filter((record) => record.status === 'leave').length;
  const notCheckedIn = employees.filter(
    (employee) => !todayRecords.some((record) => record.employeeId === employee.id && record.checkIn)
  );

  const stats = [
  { label: 'Headcount', value: employees.length },
  { label: 'Present today', value: presentToday },
  { label: 'On leave today', value: onLeaveToday },
  { label: 'Pending approvals', value: pending.length }];


  return (
    <>
      <PageHeader
        title="Needs your attention"
        description="Clear the queue first — everything else can wait."
        action={
        <Link to="/admin/reports">
            <Button variant="secondary">View reports</Button>
          </Link>
        } />
      

      <Panel
        title={`Leave requests awaiting a decision (${pending.length})`}
        bodyClassName="p-0"
        action={
        <Link to="/admin/leave" className="text-xs font-medium text-brand-600 hover:text-brand-700">
            Open approvals
          </Link>
        }>
        
        {pending.length === 0 ?
        <EmptyState
          icon={<InboxIcon className="h-4 w-4" />}
          title="Queue is clear"
          description="No leave requests are waiting on you right now." /> :


        <ul className="divide-y divide-hairline">
            <AnimatePresence initial={false}>
              {pending.map((request) => {
              const employee = getEmployee(request.employeeId);
              return (
                <motion.li
                  key={request.id}
                  layout
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-wrap items-center gap-4 px-5 py-4">
                  
                    <Avatar name={employee?.name ?? '—'} src={employee?.avatarUrl} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-ink">{employee?.name}</span>
                        <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">
                          {leaveTypeMeta[request.type].label} · {request.days}d
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-ink-muted">
                        {fmtDate(request.from)} → {fmtDate(request.to)}
                      </p>
                      <p className="mt-1 truncate text-xs text-ink-soft">
                        “{request.remarks}” · applied {relativeTime(request.appliedAt)}
                      </p>
                    </div>
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
                  </motion.li>);

            })}
            </AnimatePresence>
          </ul>
        }
      </Panel>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Today's attendance exceptions"
          description="People without a check-in yet"
          bodyClassName="p-0">
          
          {notCheckedIn.length === 0 ?
          <EmptyState
            icon={<ClockAlertIcon className="h-4 w-4" />}
            title="Everyone is accounted for"
            description="Every active employee has checked in today." /> :


          <ul className="divide-y divide-hairline">
              {notCheckedIn.map((employee) => {
              const record = todayRecords.find((item) => item.employeeId === employee.id);
              const meta = record ? attendanceMeta[record.status] : null;
              return (
                <li key={employee.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar name={employee.name} src={employee.avatarUrl} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{employee.name}</p>
                      <p className="text-xs text-ink-muted">{employee.department}</p>
                    </div>
                    {meta ?
                  <Badge className={meta.chip} dotClassName={meta.dot}>
                        {meta.label}
                      </Badge> :

                  <Badge className="bg-amber-50 text-amber-700 ring-amber-600/20">No check-in</Badge>
                  }
                    <Link
                    to={`/admin/employees/${employee.id}`}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700">
                    
                      Open
                    </Link>
                  </li>);

            })}
            </ul>
          }
        </Panel>

        <Panel title="Org at a glance">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
            {stats.map((stat) =>
            <div key={stat.label}>
                <dt className="text-xs text-ink-muted">{stat.label}</dt>
                <dd className="mt-0.5 text-2xl font-semibold text-ink">{stat.value}</dd>
              </div>
            )}
          </dl>
        </Panel>
      </div>

      <LeaveDecisionModal
        request={target?.request ?? null}
        decision={target?.decision ?? 'approved'}
        onClose={() => setTarget(null)} />
      
    </>);

}