export function clock(date: Date = new Date()): string {
  return [date.getHours(), date.getMinutes(), date.getSeconds()].
  map((n) => String(n).padStart(2, '0')).
  join(':');
}

export function relative(secondsAgo: number): string {
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  if (secondsAgo < 3600) return `${Math.round(secondsAgo / 60)} min ago`;
  if (secondsAgo < 86400) return `${Math.round(secondsAgo / 3600)} hours ago`;
  return `${Math.round(secondsAgo / 86400)} days ago`;
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}