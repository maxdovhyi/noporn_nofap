type Props = {
  streak: number;
  bestStreak: number;
  pct30: number;
  loggedDays30: number;
};

function Pill({ children }: { children: React.ReactNode }) {
  return <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{children}</div>;
}

export function StatsPills({ streak, bestStreak, pct30, loggedDays30 }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Pill>🔥 Серия: {streak} дней</Pill>
        <Pill>🏆 Лучшее: {bestStreak} дней</Pill>
        <Pill>📈 30 дней: {pct30}% чистых</Pill>
      </div>
      <p className="text-xs text-slate-500">Дней отмечено: {loggedDays30}/30</p>
    </div>
  );
}
