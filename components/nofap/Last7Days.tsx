import type { NofapStatus } from '@/lib/nofap/stats';

type Item = {
  day: string;
  weekdayShort: string;
  status: NofapStatus | null;
};

type Props = {
  items: Item[];
};

export function Last7Days({ items }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">История 7 дней</h3>
      <div className="flex flex-wrap gap-2 text-sm">
        {items.map((item) => (
          <span key={item.day} className="rounded-full bg-slate-100 px-3 py-1">
            {item.weekdayShort} {item.status === 'clean' ? '✅' : item.status === 'slip' ? '⚠️' : '—'}
          </span>
        ))}
      </div>
    </div>
  );
}
