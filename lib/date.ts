export function getLocalISODate(tz?: string): string {
  const timeZone = tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Europe/Kiev';
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(new Date());
}

export function formatHumanDate(input: string, tz?: string): string {
  const timeZone = tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Europe/Kiev';
  const date = new Date(`${input}T00:00:00`);

  return new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function shiftDate(date: string, offsetDays: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
