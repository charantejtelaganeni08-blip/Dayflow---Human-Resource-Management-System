import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';

const titles: {match: RegExp;title: string;}[] = [
{ match: /^\/$/, title: 'Dashboard' },
{ match: /^\/attendance/, title: 'My Attendance' },
{ match: /^\/leave/, title: 'Leave' },
{ match: /^\/payslips/, title: 'Payslips' },
{ match: /^\/profile/, title: 'Profile' },
{ match: /^\/admin\/employees\/.+/, title: 'Employee record' },
{ match: /^\/admin\/employees/, title: 'Employees' },
{ match: /^\/admin\/attendance/, title: 'Attendance' },
{ match: /^\/admin\/leave/, title: 'Leave approvals' },
{ match: /^\/admin\/payroll/, title: 'Payroll' },
{ match: /^\/admin\/reports/, title: 'Reports' }];


export function TopBar() {
  const { currentUser } = useAuth();
  const { employees } = useHRData();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const title = titles.find((entry) => entry.match.test(location.pathname))?.title ?? 'PeopleDesk';

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    return employees.
    filter(
      (employee) =>
      employee.name.toLowerCase().includes(term) ||
      employee.id.toLowerCase().includes(term) ||
      employee.department.toLowerCase().includes(term)
    ).
    slice(0, 6);
  }, [employees, query]);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-hairline bg-surface/90 px-6 backdrop-blur">
      <h2 className="text-sm font-medium text-ink-muted">{title}</h2>

      <div className="flex items-center gap-2">
        {currentUser.role === 'admin' &&
        <div className="relative hidden md:block">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft" />
            <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people…"
            aria-label="Search employees"
            className="h-9 w-64 rounded-lg border border-hairline bg-canvas pl-8 pr-3 text-sm text-ink placeholder:text-ink-soft focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
            {results.length > 0 &&
          <ul className="absolute left-0 top-11 z-40 w-72 overflow-hidden rounded-xl border border-hairline bg-surface py-1 shadow-pop">
                {results.map((employee) =>
            <li key={employee.id}>
                    <button
                type="button"
                onClick={() => {
                  setQuery('');
                  navigate(`/admin/employees/${employee.id}`);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors duration-150 ease-soft hover:bg-slate-50">
                
                      <Avatar name={employee.name} src={employee.avatarUrl} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">{employee.name}</span>
                        <span className="block truncate text-xs text-ink-muted">
                          {employee.id} · {employee.department}
                        </span>
                      </span>
                    </button>
                  </li>
            )}
              </ul>
          }
          </div>
        }

        <NotificationBell />

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors duration-150 ease-soft hover:bg-slate-100">
          
          <Avatar name={currentUser.name} src={currentUser.avatarUrl} size="sm" />
          <span className="hidden text-sm text-ink sm:block">{currentUser.name.split(' ')[0]}</span>
        </button>
      </div>
    </header>);

}