import type { NofapStatus } from '@/lib/nofap/stats';

type Props = {
  todayStatus: NofapStatus | null;
  onSetStatus: (status: NofapStatus | null) => Promise<void> | void;
  pending?: boolean;
};

export function CheckInButtons({ todayStatus, onSetStatus, pending = false }: Props) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => onSetStatus('clean')}
        className="w-full rounded-2xl bg-emerald-500 px-4 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.01] active:scale-95 disabled:opacity-60"
      >
        ✅ Чист сегодня
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => onSetStatus('slip')}
        className="w-full rounded-2xl bg-orange-500 px-4 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.01] active:scale-95 disabled:opacity-60"
      >
        ⚠️ Был срыв
      </button>
      {todayStatus && (
        <button
          type="button"
          disabled={pending}
          onClick={() => onSetStatus(null)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:opacity-60"
        >
          ↩️ Отменить/переотметить
        </button>
      )}
    </div>
  );
}
