// Einfacher In-Memory-Rate-Limiter (Spec docs/Contact.md, Abschnitt 8).
//
// Single-Container-Deployment → In-Memory reicht. Bei mehreren Instanzen
// später durch Redis o.ä. ersetzen. Zustand geht bei jedem Server-Neustart
// verloren — das ist für reine Missbrauchsbremse akzeptabel.

interface Bucket {
  count: number;
  resetAt: number; // epoch ms, ab wann das Fenster zurückgesetzt wird
}

const buckets = new Map<string, Bucket>();

// Damit die Map bei vielen verschiedenen IPs nicht unbegrenzt wächst, wird
// gelegentlich aufgeräumt (abgelaufene Buckets entfernen).
let opsSinceSweep = 0;
const SWEEP_EVERY = 500;

function sweep(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // epoch ms
}

/**
 * Zählt einen Treffer für `key` (typischerweise die Besucher-IP) und meldet,
 * ob er innerhalb des Limits liegt. Default: 5 Treffer pro 10 Minuten.
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();

  if (++opsSinceSweep >= SWEEP_EVERY) {
    opsSinceSweep = 0;
    sweep(now);
  }

  const bucket = buckets.get(key);

  // Neues oder abgelaufenes Fenster → frisch starten.
  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}
