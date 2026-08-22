import { NavLink } from 'react-router-dom';
import { adminNav, employeeNav } from './navItems';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

export function MobileNav() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  const items = currentUser.role === 'admin' ? adminNav : employeeNav;

  return (
    <nav
      aria-label="Sections"
      className="flex gap-1 overflow-x-auto border-b border-hairline bg-surface px-4 py-2 lg:hidden">
      
      {items.map((item) =>
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
        cn(
          'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors duration-150 ease-soft',
          isActive ? 'bg-brand-50 font-medium text-brand-700' : 'text-ink-muted hover:bg-slate-50'
        )
        }>
        
          {item.icon}
          {item.label}
        </NavLink>
      )}
    </nav>);

}