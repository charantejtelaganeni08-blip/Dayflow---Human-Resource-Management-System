import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { inputClass } from '../../components/ui/Field';
import { useHRData } from '../../contexts/HRDataContext';
import { todayIso } from '../../utils/date';
import { attendanceMeta } from '../../utils/labels';

export function Employees() {
  const { employees, attendance } = useHRData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All departments');

  const departments = useMemo(
    () => ['All departments', ...Array.from(new Set(employees.map((employee) => employee.department)))],
    [employees]
  );

  const today = todayIso();
  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesTerm =
      !term ||
      employee.name.toLowerCase().includes(term) ||
      employee.id.toLowerCase().includes(term) ||
      employee.designation.toLowerCase().includes(term);
      const matchesDepartment =
      department === 'All departments' || employee.department === department;
      return matchesTerm && matchesDepartment;
    });
  }, [employees, query, department]);

  return (
    <>
      <PageHeader
        title="Employees"
        description={`${employees.length} people. Open a record to view or edit everything.`} />
      

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            className={`${inputClass} pl-9`}
            placeholder="Search by name, ID or role"
            aria-label="Search employees"
            value={query}
            onChange={(event) => setQuery(event.target.value)} />
          
        </div>
        <select
          className={`${inputClass} w-52`}
          aria-label="Filter by department"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}>
          
          {departments.map((option) =>
          <option key={option}>{option}</option>
          )}
        </select>
      </div>

      <Panel bodyClassName="p-0">
        {rows.length === 0 ?
        <EmptyState
          icon={<UsersIcon className="h-4 w-4" />}
          title="No people match"
          description="Try a different search term or department." /> :


        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-soft">
                  <th scope="col" className="px-5 py-3 font-medium">Employee</th>
                  <th scope="col" className="px-5 py-3 font-medium">Department</th>
                  <th scope="col" className="px-5 py-3 font-medium">Manager</th>
                  <th scope="col" className="px-5 py-3 font-medium">Today</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {rows.map((employee) => {
                const record = attendance.find(
                  (item) => item.employeeId === employee.id && item.date === today
                );
                const meta = record ? attendanceMeta[record.status] : null;
                return (
                  <tr
                    key={employee.id}
                    tabIndex={0}
                    role="link"
                    onClick={() => navigate(`/admin/employees/${employee.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') navigate(`/admin/employees/${employee.id}`);
                    }}
                    className="cursor-pointer transition-colors duration-150 ease-soft hover:bg-slate-50">
                    
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={employee.name} src={employee.avatarUrl} size="sm" />
                          <div>
                            <p className="font-medium text-ink">{employee.name}</p>
                            <p className="text-xs text-ink-muted">
                              {employee.id} · {employee.designation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{employee.department}</td>
                      <td className="px-5 py-3 text-ink-muted">{employee.manager}</td>
                      <td className="px-5 py-3">
                        {meta ?
                      <Badge className={meta.chip} dotClassName={meta.dot}>
                            {meta.label}
                          </Badge> :

                      <span className="text-xs text-ink-soft">No record</span>
                      }
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{employee.employmentStatus}</td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }
      </Panel>
    </>);

}