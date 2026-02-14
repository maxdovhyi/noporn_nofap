'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { CheckInButtons } from '../../components/nofap/CheckInButtons';
import { Last7Days } from '../../components/nofap/Last7Days';
import { StatsPills } from '../../components/nofap/StatsPills';
import { formatHumanDate, getLocalISODate, shiftDate } from '../../lib/date';
import { compute30d, computeBestStreak, computeStreak, type NofapRecord, type NofapStatus } from '../../lib/nofap/stats';

type ProfileState = 'loading' | 'guest' | 'authed';

type DBRecord = NofapRecord & { id?: string };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

export default function NoFapPage() {
  const [authState, setAuthState] = useState<ProfileState>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [records, setRecords] = useState<DBRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Kiev';
  const todayDate = getLocalISODate(timeZone);

  const loadRecords = useCallback(async (uid: string) => {
    if (!supabase) return;
    const fromDate = shiftDate(todayDate, -90);
    const { data, error } = await supabase
      .from('nofap_daily')
      .select('id, day, status')
      .eq('user_id', uid)
      .gte('day', fromDate)
      .order('day', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setRecords((data ?? []) as DBRecord[]);
  }, [todayDate]);

  useEffect(() => {
    let alive = true;

    async function init() {
      if (!supabase) {
        setAuthState('guest');
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (!alive) return;

      const user = data.user;
      if (!user) {
        setAuthState('guest');
        return;
      }

      setUserId(user.id);
      setAuthState('authed');
      await loadRecords(user.id);
    }

    init();

    return () => {
      alive = false;
    };
  }, [loadRecords]);

  const todayStatus = useMemo<NofapStatus | null>(() => {
    return records.find((item) => item.day === todayDate)?.status ?? null;
  }, [records, todayDate]);

  const stats = useMemo(() => {
    const streak = computeStreak(records, todayDate);
    const bestStreak = computeBestStreak(records);
    const { pct30, loggedDays30 } = compute30d(records, todayDate);
    return { streak, bestStreak, pct30, loggedDays30 };
  }, [records, todayDate]);

  const last7Items = useMemo(() => {
    const map = new Map(records.map((record) => [record.day, record.status]));

    return Array.from({ length: 7 }, (_, index) => {
      const day = shiftDate(todayDate, -(6 - index));
      const weekdayShort = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', timeZone }).format(new Date(`${day}T00:00:00`));
      return {
        day,
        weekdayShort: weekdayShort.replace('.', ''),
        status: map.get(day) ?? null,
      };
    });
  }, [records, timeZone, todayDate]);

  const onSetStatus = useCallback(async (status: NofapStatus | null) => {
    if (!supabase || !userId) return;
    setSaving(true);

    if (status === null) {
      await supabase.from('nofap_daily').delete().eq('user_id', userId).eq('day', todayDate);
      await loadRecords(userId);
      setSaving(false);
      setToast('Сохранено ✅');
      setTimeout(() => setToast(null), 1500);
      return;
    }

    const { data: existing } = await supabase
      .from('nofap_daily')
      .select('id')
      .eq('user_id', userId)
      .eq('day', todayDate)
      .maybeSingle();

    if (existing?.id) {
      await supabase.from('nofap_daily').update({ status }).eq('id', existing.id);
    } else {
      await supabase.from('nofap_daily').insert({ user_id: userId, day: todayDate, status });
    }

    await loadRecords(userId);
    setSaving(false);
    setToast('Сохранено ✅');
    setTimeout(() => setToast(null), 1500);
  }, [loadRecords, todayDate, userId]);

  if (authState === 'loading') {
    return <main className="p-6 text-center text-slate-500">Загрузка…</main>;
  }

  if (authState === 'guest') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-lg">
          <h1 className="text-2xl font-bold">NoPorn / NoFap 🛡️</h1>
          <p className="mt-2 text-slate-600">Чтобы отмечать статус, пожалуйста войдите в аккаунт.</p>
          <Link href="/login" className="mt-5 inline-block rounded-2xl bg-slate-900 px-5 py-3 text-white">
            Войти
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NoPorn / NoFap 🛡️</h1>
          <p className="mt-1 text-sm text-slate-600">Сегодня: {formatHumanDate(todayDate, timeZone)}</p>
        </div>

        <StatsPills {...stats} />
        <CheckInButtons todayStatus={todayStatus} onSetStatus={onSetStatus} pending={saving} />
        <Last7Days items={last7Items} />
        <p className="text-center text-xs text-slate-500">📲 Установите приложение из меню браузера: "На экран домой".</p>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
