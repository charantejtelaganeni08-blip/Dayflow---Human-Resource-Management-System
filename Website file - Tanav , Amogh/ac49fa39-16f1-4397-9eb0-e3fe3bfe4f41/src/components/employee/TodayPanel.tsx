import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ClockIcon, LogInIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { fmtDuration, hoursBetween, isLate, todayIso } from '../../utils/date';

export function TodayPanel() {
  const { currentUser } = useAuth();
  const { attendanceOn, checkIn, checkOut } = useHRData();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const record = attendanceOn(currentUser.id, todayIso());
  const started = Boolean(record?.checkIn);
  const finished = Boolean(record?.checkOut);
  const worked = hoursBetween(record?.checkIn, record?.checkOut);
  const late = isLate(record?.checkIn);

  return (
    <section className="rounded-xl border border-hairline bg-surface p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-medium text-ink-muted">{format(now, 'EEEE, d MMMM yyyy')}</p>
          <p className="mt-1 flex items-baseline gap-2 text-4xl font-semibold tracking-tight text-ink">
            {format(now, 'HH:mm')}
            <span className="text-base font-normal text-ink-soft">{format(now, 'ss')}s</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!started &&
            <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">Not checked in</Badge>
            }
            {started && !finished &&
            <Badge className="bg-green-50 text-green-700 ring-green-600/20" dotClassName="bg-status-present">
                Checked in at {record?.checkIn}
              </Badge>
            }
            {finished &&
            <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">
                Day complete · {fmtDuration(worked)}
              </Badge>
            }
            {late &&
            <Badge className="bg-amber-50 text-amber-700 ring-amber-600/20">
                Late · after 09:30
              </Badge>
            }
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2">
          {!started &&
          <Button
            size="lg"
            className="min-w-56 text-base"
            onClick={() => {
              checkIn(currentUser.id);
              toast.success('Checked in', { description: `Recorded at ${format(new Date(), 'HH:mm')}` });
            }}>
            
              <LogInIcon className="h-4 w-4" />
              Check in
            </Button>
          }
          {started && !finished &&
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}>
              <Button
              size="lg"
              variant="secondary"
              className="min-w-56 text-base"
              onClick={() => {
                checkOut(currentUser.id);
                toast.success('Checked out', { description: 'Your hours for today are recorded.' });
              }}>
              
                <LogOutIcon className="h-4 w-4" />
                Check out
              </Button>
            </motion.div>
          }
          {finished &&
          <div className="flex min-w-56 items-center justify-center gap-2 rounded-lg bg-slate-50 px-5 py-3 text-sm text-ink-muted ring-1 ring-inset ring-hairline">
              <ClockIcon className="h-4 w-4" />
              {record?.checkIn} — {record?.checkOut}
            </div>
          }
        </div>
      </div>
    </section>);

}