import type { DayStatus } from '@/lib/nofap/stats';

type Props = {
  todayText: string;
  todayStatus: DayStatus | null;
};

export function Header({ todayText, todayStatus }: Props) {
  const statusText = todayStatus === 'clean'
    ? '🟢 Сегодня держусь'
    : todayStatus === 'slip'
      ? '🔴 Сегодня срыв'
      : '⚪ Сегодня не отмечено';

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">🛡️ NoPorn</h1>
      <p className="text-sm text-slate-300">🚫 NoFap tracker</p>
      <p className="text-sm text-slate-300">📅 Сегодня: {todayText}</p>
      <p className="text-sm font-semibold">{statusText}</p>
    </div>
  );
}
