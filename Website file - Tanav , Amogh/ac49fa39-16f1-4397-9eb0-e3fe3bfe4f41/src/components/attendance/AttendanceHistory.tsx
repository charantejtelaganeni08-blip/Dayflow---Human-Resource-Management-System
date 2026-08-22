import { useMemo, useState } from 'react';
import {
  addMonths,
  addWeeks,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  parseISO,
  startOfMonth } from
'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { Badge } from '../ui/Badge';
import { useHRData } from '../../contexts/HRDataContext';
import { ISO, fmtDuration, hoursBetween, isLate, todayIso, weekDays } from '../../utils/date';
import { attendanceMeta } from '../../utils/labels';
import { cn } from '../../utils/cn';

type View = 'week' | 'month';

interface AttendanceHistoryProps {
  employeeId: string;
}

export function AttendanceHistory({ employeeId }: AttendanceHistoryProps) {
  const { attendanceFor } = useHRData();
  const [view, setView] = useState<View>('week');
  const [cursor, setCursor] = useState(new Date());

  const records = attendanceFor(employeeId);
  const byDate = useMemo(
    () => new Map(records.map((record) => [record.date, record])),
    [records]
  );

  const monthRecords = records.filter((record) => isSameMonth(parseISO(record.date), cursor));
  const presentDays = monthRecords.filter((record) => record.status === 'present').length;
  const totalHours = monthRecords.reduce(
    (sum, record) => sum + hoursBetween(record.checkIn, record.checkOut),
    0
  );
  const inTimes = monthRecords.filter((record) => record.checkIn).map((record) => record.checkIn as string);
  const averageIn = inTimes.length ?
  format(
    new Date(
      2020,
      0,
      1,
      0,
      Math.round(
        inTimes.reduce((sum, time) => {
          const [h, m] = time.split(':').map(Number);
          return sum + h * 60 + m;
        }, 0) / inTimes.length
      )
    ),
    'HH:mm'
  ) :
  '—';

  const days = weekDays(cursor);
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const leadingBlanks = (getDay(monthStart) + 6) % 7;
  const monthDays = Array.from({ length: monthEnd.getDate() }, (_, index) =>
  format(new Date(cursor.getFullYear(), cursor.getMonth(), index + 1), ISO)
  );

  const step = (direction: number) => {
    setCursor((current) => view === 'week' ? addWeeks(current, direction) : addMonths(current, direction));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
        { label: 'Days present', value: String(presentDays) },
        { label: 'Hours worked', value: fmtDuration(totalHours) },
        { label: 'Average check-in', value: averageIn },
        {
          label: 'Exceptions',
          value: String(
            monthRecords.filter((record) => record.status === 'absent' || record.status === 'half-day').
            length
          )
        }].
        map((stat) =>
        <div key={stat.label} className="rounded-lg border border-hairline bg-surface px-4 py-3">
            <p className="text-xs text-ink-muted">{stat.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-ink">{stat.value}</p>
          </div>
        )}
      </div>

      <Panel
        title={view === 'week' ? `Week of ${format(parseISO(days[0]), 'd MMM yyyy')}` : format(cursor, 'MMMM yyyy')}
        action={
        <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-100 p-0.5">
              {(['week', 'month'] as View[]).map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              aria-pressed={view === option}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors duration-150 ease-soft',
                view === option ? 'bg-white text-ink shadow-panel' : 'text-ink-muted hover:text-ink'
              )}>
              
                  {option}
                </button>
            )}
            </div>
            <div className="flex items-center gap-1">
              <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous period"
              className="rounded-md p-1.5 text-ink-muted transition-colors duration-150 ease-soft hover:bg-slate-100 hover:text-ink">
              
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next period"
              className="rounded-md p-1.5 text-ink-muted transition-colors duration-150 ease-soft hover:bg-slate-100 hover:text-ink">
              
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        }>
        
        {view === 'week' ?
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {days.map((date) => {
            const record = byDate.get(date);
            const meta = record ? attendanceMeta[record.status] : null;
            const today = date === todayIso();
            return (
              <div
                key={date}
                className={cn(
                  'flex min-h-32 flex-col rounded-lg border p-3',
                  today ? 'border-brand-300 bg-brand-50/50' : 'border-hairline bg-white'
                )}>
                
                  <p className="text-xs font-medium text-ink-muted">
                    {format(parseISO(date), 'EEE d')}
                  </p>
                  {meta ?
                <>
                      <Badge className={`${meta.chip} mt-2 self-start`} dotClassName={meta.dot}>
                        {meta.label}
                      </Badge>
                      <div className="mt-auto pt-3 text-xs text-ink-muted">
                        <p className={cn(isLate(record?.checkIn) && 'text-amber-700')}>
                          In {record?.checkIn ?? '—'}
                        </p>
                        <p>Out {record?.checkOut ?? '—'}</p>
                        <p className="mt-1 font-medium text-ink">
                          {fmtDuration(hoursBetween(record?.checkIn, record?.checkOut))}
                        </p>
                      </div>
                    </> :

                <p className="mt-auto text-xs text-ink-soft">No record</p>
                }
                </div>);

          })}
          </div> :

        <div>
            <div className="grid grid-cols-7 gap-1.5 pb-2 text-center text-[11px] font-medium uppercase tracking-wide text-ink-soft">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) =>
            <span key={label}>{label}</span>
            )}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: leadingBlanks }, (_, index) =>
            <span key={`blank-${index}`} />
            )}
              {monthDays.map((date) => {
              const record = byDate.get(date);
              const meta = record ? attendanceMeta[record.status] : null;
              return (
                <div
                  key={date}
                  title={meta ? `${date} · ${meta.label}` : `${date} · no record`}
                  className={cn(
                    'flex h-16 flex-col justify-between rounded-lg border p-2',
                    date === todayIso() ? 'border-brand-300 bg-brand-50/50' : 'border-hairline bg-white'
                  )}>
                  
                    <span className="text-xs text-ink-muted">{format(parseISO(date), 'd')}</span>
                    {meta ?
                  <span className="flex items-center gap-1.5">
                        <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
                        <span className="truncate text-[11px] text-ink-muted">
                          {record?.checkIn ?? meta.label}
                        </span>
                      </span> :

                  <span className="text-[11px] text-ink-soft">—</span>
                  }
                  </div>);

            })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 border-t border-hairline pt-3">
              {Object.values(attendanceMeta).map((meta) =>
            <span key={meta.label} className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
                  {meta.label}
                </span>
            )}
            </div>
          </div>
        }
      </Panel>
    </div>);

}