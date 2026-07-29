/**
 * Early-access signup → Kit (formerly ConvertKit).
 *
 * The browser posts here rather than to Kit directly. Kit's v3 form endpoint
 * accepts a public API key, but shipping it in the bundle means anyone can
 * stuff the list; keeping the call server-side also lets us drop honeypot hits
 * and malformed addresses before they ever reach the account.
 *
 * Configure in Netlify → Site settings → Environment variables:
 *   KIT_API_KEY   your Kit v3 API key
 *   KIT_FORM_ID   the numeric id of the form subscribers are added to
 *   KIT_API_BASE  optional, defaults to Kit's v3 host
 *
 * Netlify v2 function: routed by the `config.path` below, so no redirect rule.
 */
export const config = { path: '/api/early-access' }

// The Netlify runtime provides `process.env`. Declared here rather than pulling
// in @types/node, so this file stays inside the app's `vue-tsc` run instead of
// being excluded from CI.
declare const process: { env: Record<string, string | undefined> }

interface Payload {
  email?: unknown
  platform?: unknown
  botField?: unknown
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405)
  }

  let payload: Payload
  try {
    payload = await request.json() as Payload
  }
  catch {
    return json({ ok: false, error: 'Malformed request' }, 400)
  }

  // Honeypot: answer as though it worked. Telling a bot it failed just invites
  // a retry with the field left blank.
  if (typeof payload.botField === 'string' && payload.botField.trim() !== '') {
    return json({ ok: true })
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  if (!EMAIL.test(email) || email.length > 254) {
    return json({ ok: false, error: 'That address does not look right — check and try again.' }, 400)
  }

  const platform = typeof payload.platform === 'string' ? payload.platform.slice(0, 60) : 'unknown'

  const apiKey = process.env.KIT_API_KEY
  const formId = process.env.KIT_FORM_ID
  const base = process.env.KIT_API_BASE ?? 'https://api.convertkit.com/v3'

  if (!apiKey || !formId) {
    // Misconfiguration is ours, not the visitor's — say so plainly and leave a
    // trace in the function log rather than blaming their address.
    console.error('early-access: KIT_API_KEY or KIT_FORM_ID is not set')
    return json({ ok: false, error: 'Signup is not configured yet. Try again shortly.' }, 503)
  }

  try {
    const res = await fetch(`${base}/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
        // Kit stores this against the subscriber, so "how many people are
        // waiting on Windows" is answerable without a separate table.
        fields: { platform },
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('early-access: Kit responded', res.status, detail.slice(0, 300))
      return json({ ok: false, error: 'Could not add you just now. Try again in a moment.' }, 502)
    }

    return json({ ok: true })
  }
  catch (error) {
    console.error('early-access: request to Kit failed', error)
    return json({ ok: false, error: 'Could not reach the list. Try again in a moment.' }, 502)
  }
}
