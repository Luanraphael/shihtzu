/** Keeps Meta/UTM attribution parameters from the landing URL and hands them to the checkout. */

const KEY = "stz-tracking-params";
const TRACKED = /^(utm_[a-z_]+|fbclid|gclid|ttclid|src|sck|xcod)$/i;

export function captureTrackingParams(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const saved: Record<string, string> = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    let changed = false;
    params.forEach((v, k) => {
      if (TRACKED.test(k) && v) {
        saved[k] = v;
        changed = true;
      }
    });
    if (changed) sessionStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    /* storage unavailable */
  }
}

export function trackingParams(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

/** Appends tracking params (and optional extras) to a URL without duplicating existing keys. */
export function withTracking(url: string, extra: Record<string, string> = {}): string {
  if (!url) return url;
  const u = new URL(url, window.location.origin);
  const all = { ...trackingParams(), ...extra };
  for (const [k, v] of Object.entries(all)) if (v && !u.searchParams.has(k)) u.searchParams.set(k, v);
  return u.origin === window.location.origin ? u.pathname + u.search + u.hash : u.toString();
}
