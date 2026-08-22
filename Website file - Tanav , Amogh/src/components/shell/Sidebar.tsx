import React from 'react';
import { NavLink } from 'react-router-dom';
import { BuildingIcon, LogOutIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { adminNav, employeeNav } from './navItems';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

export function Sidebar() {
  const { currentUser, signOut } = useAuth();
  if (!currentUser) return null;
  const items = currentUser.role === 'admin' ? adminNav : employeeNav;

  return (
    <nav
      aria-label="Main"
      className="flex h-full w-60 shrink-0 flex-col border-r border-hairline bg-surface">
      
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <BuildingIcon className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight text-ink">PeopleDesk</span>
      </div>

      <ul className="flex flex-1 flex-col gap-0.5 px-3">
        {items.map((item) =>
        <li key={item.to}>
            <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ease-soft',
              isActive ?
              'bg-brand-50 font-medium text-brand-700' :
              'text-ink-muted hover:bg-slate-50 hover:text-ink'
            )
            }>
            
              {item.icon}
              {item.label}
            </NavLink>
          </li>
        )}
      </ul>

      <div className="border-t border-hairline p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar name={currentUser.name} src={currentUser.avatarUrl} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{currentUser.name}</p>
            <p className="truncate text-xs text-ink-muted">
              {currentUser.role === 'admin' ? 'Admin / HR' : currentUser.designation}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="rounded-md p-1.5 text-ink-soft transition-colors duration-150 ease-soft hover:bg-slate-100 hover:text-ink">
            
            <LogOutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>);

}