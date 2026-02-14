import type { DayStatus } from '@/lib/nofap/stats';

type Props = {
  dayKeys: string[];
  daysMap: Record<string, DayStatus>;
  todayKey: string;
};

export function MonthDots({ dayKeys, daysMap, todayKey }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 shadow-lg">
      <div className="grid grid-cols-10 gap-2">
        {dayKeys.map((key) => {
          const status = daysMap[key];
          const baseColor = status === 'clean' ? 'bg-emerald-500' : status === 'slip' ? 'bg-rose-500' : 'bg-slate-600';
          const ring = key === todayKey ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900' : '';
          return <div key={key} title={key} className={`h-5 w-5 rounded-full ${baseColor} ${ring}`} />;
        })}
      </div>
      <p className="mt-3 text-right text-xs text-slate-300">📆 30 дней</p>
    </div>
  );
}
