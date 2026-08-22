import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { isToday, relativeTime } from '../../utils/date';
import { cn } from '../../utils/cn';

export function NotificationBell() {
  const { currentUser } = useAuth();
  const { notificationsFor, markNotificationRead, markAllNotificationsRead } = useHRData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!currentUser) return null;

  const items = notificationsFor(currentUser.id);
  const unread = items.filter((item) => !item.read).length;
  const today = items.filter((item) => isToday(item.at));
  const earlier = items.filter((item) => !isToday(item.at));

  const groups = [
  { label: 'Today', items: today },
  { label: 'Earlier', items: earlier }].
  filter((group) => group.items.length > 0);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-soft hover:bg-slate-100 hover:text-ink">
        
        <BellIcon className="h-4 w-4" />
        {unread > 0 &&
        <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        }
      </button>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-xl border border-hairline bg-surface shadow-pop">
          
            <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
              <p className="text-sm font-semibold text-ink">Notifications</p>
              {unread > 0 &&
            <button
              type="button"
              onClick={() => markAllNotificationsRead(currentUser.id)}
              className="text-xs font-medium text-brand-600 hover:text-brand-700">
              
                  Mark all read
                </button>
            }
            </div>

            <div className="max-h-96 overflow-y-auto">
              {groups.length === 0 &&
            <p className="px-4 py-8 text-center text-xs text-ink-muted">
                  Nothing yet. Approvals and payslips will show up here.
                </p>
            }
              {groups.map((group) =>
            <div key={group.label}>
                  <p className="bg-slate-50 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-soft">
                    {group.label}
                  </p>
                  <ul>
                    {group.items.map((item) =>
                <li key={item.id}>
                        <button
                    type="button"
                    onClick={() => {
                      markNotificationRead(item.id);
                      setOpen(false);
                      navigate(item.href);
                    }}
                    className="flex w-full gap-2.5 border-b border-hairline px-4 py-3 text-left transition-colors duration-150 ease-soft hover:bg-slate-50">
                    
                          <span
                      className={cn(
                        'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                        item.read ? 'bg-transparent' : 'bg-brand-600'
                      )} />
                    
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-medium text-ink">{item.title}</span>
                            <span className="mt-0.5 block text-xs text-ink-muted">{item.body}</span>
                            <span className="mt-1 block text-[11px] text-ink-soft">
                              {relativeTime(item.at)}
                            </span>
                          </span>
                        </button>
                      </li>
                )}
                  </ul>
                </div>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}