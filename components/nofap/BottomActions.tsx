import Link from 'next/link';
import type { DayStatus } from '@/lib/nofap/stats';

type Props = {
  disabled?: boolean;
  onSetStatus: (status: DayStatus) => void;
};

export function BottomActions({ disabled = false, onSetStatus }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSetStatus('slip')}
        className="rounded-2xl bg-rose-500 px-3 py-4 text-base font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
      >
        🔴 Срыв
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSetStatus('clean')}
        className="rounded-2xl bg-emerald-500 px-3 py-4 text-base font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
      >
        🟢 Держусь
      </button>
      <Link
        href="/nofap/sos"
        className="flex items-center justify-center rounded-2xl bg-amber-500 px-3 py-4 text-base font-semibold text-slate-900 shadow-md transition hover:brightness-105 active:scale-[0.98]"
      >
        🆘 SOS
      </Link>
    </div>
  );
}
