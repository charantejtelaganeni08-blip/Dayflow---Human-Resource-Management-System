import { Link } from 'react-router-dom';
import { ActivityIcon, ArrowRightIcon, CalendarPlusIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { TodayPanel } from '../../components/employee/TodayPanel';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { fmtDate, relativeTime } from '../../utils/date';
import { leaveStatusMeta, leaveTypeMeta, leaveTypes } from '../../utils/labels';

export function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const { leavesFor, attendanceFor, payslipsFor } = useHRData();
  if (!currentUser) return null;

  const leaves = leavesFor(currentUser.id);
  const pending = leaves.filter((request) => request.status === 'pending');
  const attendance = attendanceFor(currentUser.id).slice(0, 4);
  const latestSlip = payslipsFor(currentUser.id).find((slip) => slip.published);

  const activity = [
  ...leaves.slice(0, 3).map((request) => ({
    id: `lv-${request.id}`,
    at: request.decidedAt ?? request.appliedAt,
    title:
    request.status === 'pending' ?
    `Applied for ${leaveTypeMeta[request.type].label.toLowerCase()} leave` :
    `Leave ${request.status}`,
    detail: `${fmtDate(request.from)} → ${fmtDate(request.to)}`
  })),
  ...attendance.map((record) => ({
    id: `att-${record.id}`,
    at: `${record.date}T${record.checkIn ?? '09:00'}:00`,
    title: record.checkIn ? `Checked in at ${record.checkIn}` : `Marked ${record.status}`,
    detail: fmtDate(record.date)
  })),
  ...(latestSlip ?
  [
  {
    id: `slip-${latestSlip.id}`,
    at: `${latestSlip.month}-28T10:00:00`,
    title: 'Payslip published',
    detail: latestSlip.month
  }] :

  [])].

  sort((a, b) => a.at < b.at ? 1 : -1).
  slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Good to see you, ${currentUser.name.split(' ')[0]}`}
        description="Your day, your leave and your pay — all in one place."
        action={
        <Link to="/leave">
            <Button variant="secondary">
              <CalendarPlusIcon className="h-4 w-4" />
              Apply for leave
            </Button>
          </Link>
        } />
      

      <TodayPanel />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Leave balance" description="Remaining days this year">
          <ul className="flex flex-col gap-3.5">
            {leaveTypes.
            filter((type) => type !== 'unpaid').
            map((type) => {
              const balance = currentUser.balances[type];
              const remaining = balance.total - balance.used;
              const pct = Math.min(100, Math.round(balance.used / balance.total * 100));
              return (
                <li key={type}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-ink">{leaveTypeMeta[type].label}</span>
                      <span className="text-sm font-medium text-ink">
                        {remaining}
                        <span className="text-xs font-normal text-ink-soft"> / {balance.total}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: leaveTypeMeta[type].hex }} />
                    
                    </div>
                  </li>);

            })}
          </ul>
        </Panel>

        <Panel
          title="Requests in flight"
          action={
          <Link to="/leave" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          }>
          
          {pending.length === 0 ?
          <EmptyState
            icon={<CalendarPlusIcon className="h-4 w-4" />}
            title="No pending requests"
            description="Anything you apply for will sit here until HR decides." /> :


          <ul className="flex flex-col gap-3">
              {pending.map((request) =>
            <li key={request.id} className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-ink">
                      {leaveTypeMeta[request.type].label} · {request.days}d
                    </span>
                    <Badge className={leaveStatusMeta[request.status].chip}>
                      {leaveStatusMeta[request.status].label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    {fmtDate(request.from)} → {fmtDate(request.to)}
                  </p>
                </li>
            )}
            </ul>
          }
        </Panel>

        <Panel title="Recent activity">
          {activity.length === 0 ?
          <EmptyState
            icon={<ActivityIcon className="h-4 w-4" />}
            title="Nothing yet"
            description="Check in to start building your record." /> :


          <ol className="flex flex-col gap-3">
              {activity.map((item) =>
            <li key={item.id} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{item.title}</p>
                    <p className="text-xs text-ink-soft">
                      {item.detail} · {relativeTime(item.at)}
                    </p>
                  </div>
                </li>
            )}
            </ol>
          }
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Latest payslip">
          {latestSlip ?
          <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink-muted">{latestSlip.month}</p>
                <p className="text-lg font-semibold text-ink">
                  Net pay is ready to view in your payslips
                </p>
              </div>
              <Link to="/payslips">
                <Button variant="secondary">
                  Open payslips
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div> :

          <EmptyState
            icon={<ActivityIcon className="h-4 w-4" />}
            title="No payslips yet"
            description="Your first payslip appears once HR publishes payroll." />

          }
        </Panel>
      </div>
    </>);

}