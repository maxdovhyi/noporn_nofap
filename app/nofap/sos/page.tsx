'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const TOTAL_SECONDS = 7 * 60;

export default function SosPage() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const onStart = () => {
    setSecondsLeft(TOTAL_SECONDS);
    setRunning(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-5 text-slate-100 md:px-6">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-3xl border border-slate-700 bg-slate-800/60 p-4 shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold">🆘 SOS — не сорваться</h1>
          <p className="mt-1 text-sm text-slate-300">Сейчас цель: пережить 7 минут. Потом станет легче ⏱️</p>
        </div>

        <Link href="/nofap" className="inline-flex w-fit items-center rounded-xl border border-slate-600 px-3 py-2 text-sm hover:bg-slate-700/40">
          ← Back
        </Link>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
          <h2 className="text-lg font-semibold">⏱️ Таймер 7:00</h2>
          <p className="mt-2 text-4xl font-bold tracking-wider">{mm}:{ss}</p>
          <button
            type="button"
            onClick={onStart}
            className="mt-3 rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-900 transition active:scale-[0.98]"
          >
            ▶️ Старт
          </button>
          {!running && secondsLeft === 0 && <p className="mt-2 text-emerald-300">✅ Волна спала. Выбери действие ниже</p>}
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
          <h3 className="text-lg font-semibold">🧊 Быстрый reset</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
            <li>30 сек холодная вода на лицо/шею</li>
            <li>10 медленных глубоких вдохов</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
          <h3 className="text-lg font-semibold">💪 Движение (2 минуты)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
            <li>20 приседаний</li>
            <li>10–20 отжиманий</li>
            <li>2 минуты ходьбы</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
          <h3 className="text-lg font-semibold">🫁 Вим Хоф (упрощённо)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
            <li>30–40 глубоких вдохов</li>
            <li>выдох → задержка (комфортно)</li>
            <li>вдох → держать 15 сек</li>
            <li>1–2 раунда</li>
          </ul>
          <p className="mt-2 text-sm text-amber-300">⚠️ Не в воде / не за рулём / только сидя</p>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
          <h3 className="text-lg font-semibold">🧠 План</h3>
          <p className="mt-2 text-slate-200">Если тянет → открываю SOS → таймер → действие.</p>
          <p className="mt-1 text-slate-200">Если не отпускает → пишу другу / выхожу из комнаты / меняю место.</p>
        </section>
      </div>
    </main>
  );
}
