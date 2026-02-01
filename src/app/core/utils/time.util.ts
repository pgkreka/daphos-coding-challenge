export function parseTimeToMinutes(time: string): number | null {
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m) return null;

  const hh = Number(m[1]);
  const mm = Number(m[2]);

  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;

  return hh * 60 + mm;
}

export function minutesBetween(startTime: string, endTime: string): number | null {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null) return null;

  return endMinutes - startMinutes;
}