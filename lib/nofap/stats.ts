import { shiftISODate } from './date';

export type DayStatus = 'clean' | 'slip';

export type NopnofStore = {
  version: 1;
  days: Record<string, DayStatus>;
};

export function buildLast30DayKeys(todayKey: string): string[] {
  return Array.from({ length: 30 }, (_, i) => shiftISODate(todayKey, -(29 - i)));
}

export function computeStreak(days: Record<string, DayStatus>, todayKey: string): number {
  let streak = 0;
  let cursor = todayKey;

  while (days[cursor] === 'clean') {
    streak += 1;
    cursor = shiftISODate(cursor, -1);
  }

  return streak;
}

export function computeBestStreak(days: Record<string, DayStatus>): number {
  const keys = Object.keys(days).sort();
  let best = 0;
  let current = 0;
  let prev: string | null = null;

  for (const key of keys) {
    if (days[key] === 'slip') {
      current = 0;
      prev = key;
      continue;
    }

    if (!prev) {
      current = 1;
    } else {
      current = shiftISODate(prev, 1) === key ? current + 1 : 1;
    }

    best = Math.max(best, current);
    prev = key;
  }

  return best;
}

export function compute30d(days: Record<string, DayStatus>, todayKey: string): {
  pct30: number;
  loggedDays30: number;
  cleanCount: number;
} {
  const keys = buildLast30DayKeys(todayKey);
  const cleanCount = keys.filter((key) => days[key] === 'clean').length;
  const loggedDays30 = keys.filter((key) => days[key]).length;

  return {
    pct30: Math.round((cleanCount / 30) * 100),
    loggedDays30,
    cleanCount,
  };
}
