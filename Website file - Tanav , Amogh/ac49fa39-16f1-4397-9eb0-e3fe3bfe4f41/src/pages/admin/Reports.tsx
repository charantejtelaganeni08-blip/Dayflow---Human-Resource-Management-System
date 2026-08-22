import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { inputClass } from '../../components/ui/Field';
import { useHRData } from '../../contexts/HRDataContext';
import { currency, downloadTextFile, grossPay, netPay, toCsv } from '../../utils/format';
import { ISO, todayIso } from '../../utils/date';
import { attendanceMeta, leaveTypeMeta, leaveTypes } from '../../utils/labels';

const ranges = [
{ id: '30', label: 'Last 30 days' },
{ id: '60', label: 'Last 60 days' },
{ id: '90', label: 'Last 90 days' }];


export function Reports() {
  const { employees, attendance, leaves, payslips } = useHRData();
  const [range, setRange] = useState('30');

  const from = format(subDays(new Date(), Number(range)), ISO);
  const scoped = useMemo(
    () => attendance.filter((record) => record.date >= from && record.date <= todayIso()),
    [attendance, from]
  );

  const trend = useMemo(() => {
    const buckets = new Map<string, {week: string;present: number;absent: number;halfDay: number;leave: number;}>();
    scoped.forEach((record) => {
      const week = format(parseISO(record.date), "'W'w");
      const bucket = buckets.get(week) ?? { week, present: 0, absent: 0, halfDay: 0, leave: 0 };
      if (record.status === 'present') bucket.present += 1;
      if (record.status === 'absent') bucket.absent += 1;
      if (record.status === 'half-day') bucket.halfDay += 1;
      if (record.status === 'leave') bucket.leave += 1;
      buckets.set(week, bucket);
    });
    return Array.from(buckets.values());
  }, [scoped]);

  const leaveUtilization = leaveTypes.map((type) => ({
    type: leaveTypeMeta[type].label,
    used: employees.reduce((sum, employee) => sum + employee.balances[type].used, 0),
    fill: leaveTypeMeta[type].hex
  }));

  const costByDepartment = useMemo(() => {
    const map = new Map<string, number>();
    employees.forEach((employee) => {
      map.set(employee.department, (map.get(employee.department) ?? 0) + grossPay(employee.salary));
    });
    return Array.from(map.entries()).map(([department, cost]) => ({ department, cost }));
  }, [employees]);

  const totalCost = costByDepartment.reduce((sum, item) => sum + item.cost, 0);
  const pendingCount = leaves.filter((request) => request.status === 'pending').length;

  const exportAttendance = () => {
    const rows: (string | number)[][] = [['Employee ID', 'Name', 'Date', 'Status', 'Check in', 'Check out']];
    scoped.forEach((record) => {
      const employee = employees.find((item) => item.id === record.employeeId);
      rows.push([
      record.employeeId,
      employee?.name ?? '',
      record.date,
      attendanceMeta[record.status].label,
      record.checkIn ?? '',
      record.checkOut ?? '']
      );
    });
    downloadTextFile(`attendance-last-${range}-days.csv`, toCsv(rows));
    toast.success('Attendance report downloaded');
  };

  const exportSlips = () => {
    const rows: (string | number)[][] = [['Employee ID', 'Name', 'Month', 'Gross', 'Net', 'Published']];
    payslips.forEach((slip) => {
      const employee = employees.find((item) => item.id === slip.employeeId);
      rows.push([
      slip.employeeId,
      employee?.name ?? '',
      slip.month,
      grossPay(slip.structure),
      netPay(slip.structure),
      slip.published ? 'Yes' : 'No']
      );
    });
    downloadTextFile('salary-slips.csv', toCsv(rows));
    toast.success('Salary slip export downloaded');
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Attendance, leave and payroll patterns across the company."
        action={
        <select
          className={`${inputClass} w-44`}
          aria-label="Reporting range"
          value={range}
          onChange={(event) => setRange(event.target.value)}>
          
            {ranges.map((option) =>
          <option key={option.id} value={option.id}>
                {option.label}
              </option>
          )}
          </select>
        } />
      

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
        { label: 'Records in range', value: String(scoped.length) },
        {
          label: 'Attendance rate',
          value: `${Math.round(
            scoped.filter((record) => record.status === 'present').length / Math.max(scoped.length, 1) * 100
          )}%`
        },
        { label: 'Pending approvals', value: String(pendingCount) },
        { label: 'Monthly payroll', value: currency(totalCost) }].
        map((stat) =>
        <div key={stat.label} className="rounded-lg border border-hairline bg-surface px-4 py-3">
            <p className="text-xs text-ink-muted">{stat.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-ink">{stat.value}</p>
          </div>
        )}
      </div>

      <Panel title="Attendance trend" description="Records per week by status">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" stackId="a" name="Present" fill={attendanceMeta.present.hex} />
              <Bar dataKey="halfDay" stackId="a" name="Half-day" fill={attendanceMeta['half-day'].hex} />
              <Bar dataKey="leave" stackId="a" name="Leave" fill={attendanceMeta.leave.hex} />
              <Bar dataKey="absent" stackId="a" name="Absent" fill={attendanceMeta.absent.hex} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Leave utilization" description="Days consumed by type, company-wide">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leaveUtilization} dataKey="used" nameKey="type" innerRadius={55} outerRadius={90}>
                  {leaveUtilization.map((entry) =>
                  <Cell key={entry.type} fill={entry.fill} />
                  )}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Payroll cost by department" description="Gross monthly cost">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByDepartment} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
                
                <YAxis
                  type="category"
                  dataKey="department"
                  width={90}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false} />
                
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(value: number) => currency(value)} />
                
                <Bar dataKey="cost" name="Gross cost" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Exports" description="Generated from the current data">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={exportAttendance}>
              <DownloadIcon className="h-4 w-4" />
              Attendance report (CSV)
            </Button>
            <Button variant="secondary" onClick={exportSlips}>
              <DownloadIcon className="h-4 w-4" />
              Salary slips (CSV)
            </Button>
          </div>
        </Panel>
      </div>
    </>);

}