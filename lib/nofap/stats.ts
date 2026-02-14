export type NofapStatus = 'clean' | 'slip';

export type NofapRecord = {
  day: string;
  status: NofapStatus;
};

function sortByDayAsc(records: NofapRecord[]): NofapRecord[] {
  return [...records].sort((a, b) => a.day.localeCompare(b.day));
}

export function computeStreak(records: NofapRecord[], todayDate: string): number {
  const byDay = new Map(records.map((record) => [record.day, record.status]));

  if (byDay.get(todayDate) === 'slip') {
    return 0;
  }

  let streak = 0;
  let cursor = new Date(`${todayDate}T00:00:00`);

  while (true) {
    const day = cursor.toISOString().slice(0, 10);
    if (byDay.get(day) !== 'clean') {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function computeBestStreak(records: NofapRecord[]): number {
  const sorted = sortByDayAsc(records);
  let current = 0;
  let best = 0;
  let prevDate: Date | null = null;

  for (const record of sorted) {
    const date = new Date(`${record.day}T00:00:00`);

    if (record.status === 'slip') {
      current = 0;
      prevDate = date;
      continue;
    }

    if (!prevDate) {
      current = 1;
    } else {
      const diff = Math.round((date.getTime() - prevDate.getTime()) / 86400000);
      current = diff === 1 ? current + 1 : 1;
    }

    best = Math.max(best, current);
    prevDate = date;
  }

  return best;
}

export function compute30d(records: NofapRecord[], todayDate: string): { pct30: number; loggedDays30: number } {
  const today = new Date(`${todayDate}T00:00:00`);
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() - 29);

  const within30 = records.filter((record) => {
    const date = new Date(`${record.day}T00:00:00`);
    return date >= minDate && date <= today;
  });

  const loggedDays30 = within30.length;
  const cleanDays = within30.filter((record) => record.status === 'clean').length;

  return {
    pct30: loggedDays30 ? Math.round((cleanDays / loggedDays30) * 100) : 0,
    loggedDays30,
  };
}
