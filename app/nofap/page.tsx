'use client';

import { useEffect, useMemo, useState } from 'react';
import { BottomActions } from '@/components/nofap/BottomActions';
import { Header } from '@/components/nofap/Header';
import { MonthDots } from '@/components/nofap/MonthDots';
import { StreakBar } from '@/components/nofap/StreakBar';
import { Toast } from '@/components/nofap/Toast';
import { formatRuHumanDate, getLocalISODate } from '@/lib/nofap/date';
import { loadStore, saveStore } from '@/lib/nofap/store';
import { buildLast30DayKeys, compute30d, computeBestStreak, computeStreak, type DayStatus, type NopnofStore } from '@/lib/nofap/stats';

export default function NoFapPage() {
  const [store, setStore] = useState<NopnofStore>({ version: 1, days: {} });
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const todayKey = getLocalISODate();

  useEffect(() => {
    async function boot() {
      const loaded = await loadStore();
      setStore(loaded);
      setReady(true);
    }

    boot();
  }, []);

  const todayStatus = store.days[todayKey] ?? null;

  const last30 = useMemo(() => buildLast30DayKeys(todayKey), [todayKey]);

  const streak = useMemo(() => computeStreak(store.days, todayKey), [store.days, todayKey]);
  const best = useMemo(() => computeBestStreak(store.days), [store.days]);
  const d30 = useMemo(() => compute30d(store.days, todayKey), [store.days, todayKey]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1600);
  };

  const setTodayStatus = async (nextStatus: DayStatus) => {
    const prev = store.days[todayKey];
    const next: NopnofStore = {
      ...store,
      days: {
        ...store.days,
        [todayKey]: nextStatus,
      },
    };

    setStore(next);
    await saveStore(next);

    if (!prev) {
      showToast(nextStatus === 'clean' ? '✅ Записал. Красавчик 💪' : '📝 Записал. Без паники — завтра снова в бой 👌');
      return;
    }

    if (prev !== nextStatus) {
      showToast('🔄 Обновил отметку');
      return;
    }

    showToast(nextStatus === 'clean' ? '✅ Уже держишься' : '📝 Уже отмечен срыв');
  };

  if (!ready) {
    return <main className="min-h-screen bg-slate-950 p-6 text-center text-slate-300">Загрузка…</main>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-5 text-slate-100 md:px-6">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-3xl border border-slate-700 bg-slate-800/60 p-4 shadow-2xl backdrop-blur">
        <Header todayText={formatRuHumanDate(todayKey)} todayStatus={todayStatus} />

        <MonthDots dayKeys={last30} daysMap={store.days} todayKey={todayKey} />

        <StreakBar streak={streak} best={best} pct30={d30.pct30} logged30={d30.loggedDays30} />

        <BottomActions onSetStatus={setTodayStatus} />

        <p className="text-center text-xs text-slate-400">📲 Установи как приложение: меню браузера → «На экран домой».</p>
      </div>
      {toast && <Toast message={toast} />}
    </main>
  );
}
