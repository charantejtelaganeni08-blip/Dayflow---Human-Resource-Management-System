import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarSearchIcon, PencilIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { inputClass } from '../../components/ui/Field';
import { CorrectionModal } from '../../components/attendance/CorrectionModal';
import { useHRData } from '../../contexts/HRDataContext';
import type { AttendanceStatus, Employee } from '../../types/hr';
import { fmtDuration, hoursBetween, isLate, todayIso } from '../../utils/date';
import { attendanceMeta } from '../../utils/labels';

export function AdminAttendance() {
  const { employees, attendance } = useHRData();
  const [date, setDate] = useState(todayIso());
  const [department, setDepartment] = useState('All departments');
  const [status, setStatus] = useState<AttendanceStatus | 'all'>('all');
  const [correcting, setCorrecting] = useState<Employee | null>(null);

  const departments = useMemo(
    () => ['All departments', ...Array.from(new Set(employees.map((employee) => employee.department)))],
    [employees]
  );

  const rows = useMemo(
    () =>
    employees.
    map((employee) => ({
      employee,
      record: attendance.find(
        (item) => item.employeeId === employee.id && item.date === date
      )
    })).
    filter(({ employee, record }) => {
      const matchesDepartment =
      department === 'All departments' || employee.department === department;
      const matchesStatus = status === 'all' || record?.status === status;
      return matchesDepartment && matchesStatus;
    }),
    [employees, attendance, date, department, status]
  );

  const summary = (Object.keys(attendanceMeta) as AttendanceStatus[]).map((key) => ({
    key,
    count: rows.filter((row) => row.record?.status === key).length
  }));

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Everyone's record for a single day. Corrections are logged with a reason." />
      

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="date"
          aria-label="Choose date"
          className={`${inputClass} w-44`}
          value={date}
          max={todayIso()}
          onChange={(event) => setDate(event.target.value)} />
        
        <select
          className={`${inputClass} w-52`}
          aria-label="Filter by department"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}>
          
          {departments.map((option) =>
          <option key={option}>{option}</option>
          )}
        </select>
        <select
          className={`${inputClass} w-40`}
          aria-label="Filter by status"
          value={status}
          onChange={(event) => setStatus(event.target.value as AttendanceStatus | 'all')}>
          
          <option value="all">All statuses</option>
          {(Object.keys(attendanceMeta) as AttendanceStatus[]).map((key) =>
          <option key={key} value={key}>
              {attendanceMeta[key].label}
            </option>
          )}
        </select>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {summary.map((item) =>
          <span key={item.key} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${attendanceMeta[item.key].dot}`} />
              {attendanceMeta[item.key].label} {item.count}
            </span>
          )}
        </div>
      </div>

      <Panel bodyClassName="p-0">
        {rows.length === 0 ?
        <EmptyState
          icon={<CalendarSearchIcon className="h-4 w-4" />}
          title="No records match"
          description="Adjust the date or filters to see attendance." /> :


        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-soft">
                  <th scope="col" className="px-5 py-3 font-medium">Employee</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">In</th>
                  <th scope="col" className="px-5 py-3 font-medium">Out</th>
                  <th scope="col" className="px-5 py-3 font-medium">Hours</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {rows.map(({ employee, record }) => {
                const meta = record ? attendanceMeta[record.status] : null;
                return (
                  <tr key={employee.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={employee.name} src={employee.avatarUrl} size="sm" />
                          <div>
                            <Link
                            to={`/admin/employees/${employee.id}`}
                            className="font-medium text-ink hover:text-brand-700">
                            
                              {employee.name}
                            </Link>
                            <p className="text-xs text-ink-muted">{employee.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {meta ?
                      <Badge className={meta.chip} dotClassName={meta.dot}>
                            {meta.label}
                          </Badge> :

                      <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">
                            No record
                          </Badge>
                      }
                      </td>
                      <td className={`px-5 py-3 ${isLate(record?.checkIn) ? 'text-amber-700' : 'text-ink-muted'}`}>
                        {record?.checkIn ?? '—'}
                        {isLate(record?.checkIn) && <span className="ml-1 text-xs">late</span>}
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{record?.checkOut ?? '—'}</td>
                      <td className="px-5 py-3 text-ink-muted">
                        {record?.checkIn && record?.checkOut ?
                      fmtDuration(hoursBetween(record.checkIn, record.checkOut)) :
                      '—'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="secondary" size="sm" onClick={() => setCorrecting(employee)}>
                          <PencilIcon className="h-3.5 w-3.5" />
                          Correct
                        </Button>
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }
      </Panel>

      <CorrectionModal
        key={`${correcting?.id ?? 'none'}-${date}`}
        employee={correcting}
        date={date}
        onClose={() => setCorrecting(null)} />
      
    </>);

}