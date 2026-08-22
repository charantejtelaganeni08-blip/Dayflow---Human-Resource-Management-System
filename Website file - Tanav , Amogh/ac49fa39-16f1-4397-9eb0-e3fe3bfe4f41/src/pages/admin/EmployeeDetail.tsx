import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Panel } from '../../components/ui/Panel';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { AttendanceHistory } from '../../components/attendance/AttendanceHistory';
import { SalaryEditor } from '../../components/payroll/SalaryEditor';
import { useHRData } from '../../contexts/HRDataContext';
import { useScreenInit } from '../../useScreenInit.js';
import { fmtDate } from '../../utils/date';
import { leaveStatusMeta, leaveTypeMeta } from '../../utils/labels';
import { cn } from '../../utils/cn';

type Tab = 'profile' | 'attendance' | 'leave' | 'payroll';

const tabs: {id: Tab;label: string;}[] = [
{ id: 'profile', label: 'Profile' },
{ id: 'attendance', label: 'Attendance' },
{ id: 'leave', label: 'Leave' },
{ id: 'payroll', label: 'Payroll' }];


export function EmployeeDetail() {
  const { employeeId = '' } = useParams();
  const { getEmployee, leavesFor } = useHRData();
  const screenInit = useScreenInit() as {employeeTab?: Tab;};
  const [tab, setTab] = useState<Tab>(screenInit.employeeTab ?? 'profile');

  const employee = getEmployee(employeeId);

  if (!employee) {
    return (
      <Panel>
        <EmptyState
          icon={<ArrowLeftIcon className="h-4 w-4" />}
          title="Employee not found"
          description="That record does not exist. Head back to the directory." />
        
      </Panel>);

  }

  const requests = leavesFor(employee.id);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-4 rounded-xl border border-hairline bg-surface px-5 py-3.5 shadow-panel">
        <Avatar name={employee.name} src={employee.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-ink">{employee.name}</p>
          <p className="text-sm text-ink-muted">
            {employee.designation} · {employee.department} · {employee.id}
          </p>
        </div>
        <Link
          to="/admin/employees"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
          
          <ArrowLeftIcon className="h-4 w-4" />
          Back to directory
        </Link>
      </div>

      <div className="mb-5 flex gap-1 border-b border-hairline">
        {tabs.map((option) =>
        <button
          key={option.id}
          type="button"
          onClick={() => setTab(option.id)}
          aria-current={tab === option.id}
          className={cn(
            '-mb-px border-b-2 px-3.5 py-2 text-sm transition-colors duration-150 ease-soft',
            tab === option.id ?
            'border-brand-600 font-medium text-brand-700' :
            'border-transparent text-ink-muted hover:text-ink'
          )}>
          
            {option.label}
          </button>
        )}
      </div>

      {tab === 'profile' && <ProfileForm employee={employee} canEditAll />}
      {tab === 'attendance' && <AttendanceHistory employeeId={employee.id} />}
      {tab === 'leave' &&
      <Panel title="Leave history" bodyClassName="p-0">
          {requests.length === 0 ?
        <EmptyState
          icon={<ArrowLeftIcon className="h-4 w-4" />}
          title="No leave on record"
          description="This person has not applied for leave yet." /> :


        <ul className="divide-y divide-hairline">
              {requests.map((request) =>
          <li key={request.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-ink">
                        {leaveTypeMeta[request.type].label} · {request.days}d
                      </span>
                      <Badge className={leaveStatusMeta[request.status].chip}>
                        {leaveStatusMeta[request.status].label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {fmtDate(request.from)} → {fmtDate(request.to)}
                    </p>
                    {request.decisionComment &&
              <p className="mt-1 text-xs text-ink-soft">HR: {request.decisionComment}</p>
              }
                  </div>
                </li>
          )}
            </ul>
        }
        </Panel>
      }
      {tab === 'payroll' && <SalaryEditor employee={employee} />}
    </>);

}