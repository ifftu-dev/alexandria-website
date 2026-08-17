/**
 * A per-IP request budget for the public form endpoints.
 *
 * Both functions accept anonymous POSTs from any origin and each one triggers
 * outbound Plunk calls — a contact upsert and, on the early-access path, an
 * email to an address the caller chose. Nothing bounded how often. That is
 * enough to burn the Plunk quota, mail-bomb an address, or fill the contact
 * list with noise.
 *
 * Deliberately small and in-memory. Netlify functions run in short-lived
 * isolates, so this is not a strong distributed limiter and does not pretend
 * to be: it flattens the trivial case of one client looping on the endpoint,
 * which is the case that actually shows up. A determined attacker rotating IPs
 * is a job for the platform's edge rules, and the honeypot plus the strict
 * field validation already blunt the rest.
 */

/** Requests allowed per IP per window. */
const LIMIT = 5

/** Window length. Generous — a person fills these forms once. */
const WINDOW_MS = 60_000

/** Cap on tracked IPs, so the map cannot itself become the memory leak. */
const MAX_TRACKED = 5_000

const hits = new Map<string, { count: number, resetAt: number }>()

/**
 * The client address, from the header Netlify sets at its edge.
 *
 * `x-nf-client-connection-ip` is written by the platform and is not
 * caller-controlled; `x-forwarded-for` is, so its first entry is only a
 * fallback and the limiter degrades to per-request rather than trusting it
 * blindly.
 */
export function clientIp(request: Request): string {
  return (
    request.headers.get('x-nf-client-connection-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown'
  )
}

/** True when this request is over budget and should be refused. */
export function isRateLimited(request: Request): boolean {
  const ip = clientIp(request)
  const now = Date.now()

  if (hits.size > MAX_TRACKED) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key)
    }
    // Still oversized after pruning: drop everything rather than grow.
    if (hits.size > MAX_TRACKED) hits.clear()
  }

  const entry = hits.get(ip)
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > LIMIT
}

/** The response for a caller over budget. */
export function tooManyRequests(): Response {
  return new Response(
    JSON.stringify({ ok: false, error: 'Too many attempts — wait a minute and try again.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Retry-After': String(Math.ceil(WINDOW_MS / 1000)),
      },
    },
  )
}
