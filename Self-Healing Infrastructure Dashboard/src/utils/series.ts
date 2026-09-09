import type { SeriesPoint } from '../types';

/** Deterministic pseudo-random generator so mock charts stay stable between renders. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function label(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60_000);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function buildSeries(
keys: {key: string;base: number;variance: number;min?: number;max?: number;}[],
points = 32,
seed = 7,
stepMinutes = 5)
: SeriesPoint[] {
  const rand = seeded(seed);
  const current = keys.map((k) => k.base);
  const out: SeriesPoint[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const row: SeriesPoint = { t: label(i * stepMinutes) };
    keys.forEach((k, idx) => {
      const drift = (rand() - 0.5) * k.variance;
      const pull = (k.base - current[idx]) * 0.25;
      current[idx] = current[idx] + drift + pull;
      const min = k.min ?? 0;
      const max = k.max ?? 100;
      current[idx] = Math.min(max, Math.max(min, current[idx]));
      row[k.key] = Math.round(current[idx] * 10) / 10;
    });
    out.push(row);
  }
  return out;
}

export function sparkline(base: number, seed: number, points = 24): SeriesPoint[] {
  return buildSeries([{ key: 'v', base, variance: base * 0.35 }], points, seed);
}