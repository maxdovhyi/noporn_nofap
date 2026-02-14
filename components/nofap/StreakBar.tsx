type Props = {
  streak: number;
  best: number;
  pct30: number;
  logged30: number;
};

export function StreakBar({ streak, best, pct30, logged30 }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 shadow-lg">
      <p className="text-2xl font-bold">🔥 Серия: {streak} дней</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
        <span>🏆 Рекорд: {best}</span>
        <span>📈 30 дней: {pct30}% держусь</span>
        <span>📝 Отмечено: {logged30}/30</span>
      </div>
    </div>
  );
}
