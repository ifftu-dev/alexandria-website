/**
 * Pilot and partnership enquiries → Plunk, kept apart from the learner waitlist.
 *
 * One module, two routes (`/api/pilot`, `/api/partner`), because the handling is
 * identical and the separation that matters is in the data: every contact
 * carries `audience`, so a hiring lead never lands in a campaign written for
 * people waiting on a build. Plunk segments split them on `data.audience`.
 *
 * Unlike the waitlist, nobody is subscribed to anything here. An enquiry is the
 * start of a conversation, not consent to be marketed at — so contacts are
 * created with `subscribed: false` and the only mail sent is the notification to
 * us. That is also why there is no confirmation email: a reply from a person is
 * the confirmation.
 *
 * Env: PLUNK_API_KEY, PLUNK_API_BASE, PLUNK_FROM, PLUNK_FROM_NAME (as the
 * waitlist function), plus ENQUIRY_TO for where notifications land.
 */
export const config = { path: ['/api/pilot', '/api/partner'] }

declare const process: { env: Record<string, string | undefined> }

interface Payload {
  email?: unknown
  audience?: unknown
  organisation?: unknown
  role?: unknown
  context?: unknown
  cohort?: unknown
  source?: unknown
  botField?: unknown
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DEFAULT_BASE = 'https://next-api.useplunk.com'
const DEFAULT_FROM = 'admin@alexandria.ifftu.dev'
const DEFAULT_FROM_NAME = 'Alexandria'
const DEFAULT_TO = 'admin@ifftu.dev'

const AUDIENCES = new Set(['employer', 'institution', 'partner'])

/** Trim and cap anything free-text before it reaches the account. */
function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c] as string
  ))
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405)

  let payload: Payload
  try {
    payload = await request.json() as Payload
  }
  catch {
    return json({ ok: false, error: 'Malformed request' }, 400)
  }

  if (typeof payload.botField === 'string' && payload.botField.trim() !== '') {
    return json({ ok: true })
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  if (!EMAIL.test(email) || email.length > 254) {
    return json({ ok: false, error: 'That address does not look right — check and try again.' }, 400)
  }

  const audience = typeof payload.audience === 'string' && AUDIENCES.has(payload.audience)
    ? payload.audience
    : 'partner'
  const organisation = clean(payload.organisation, 120)
  const role = clean(payload.role, 120)
  const context = clean(payload.context, 2000)
  const cohort = clean(payload.cohort, 40)
  const source = clean(payload.source, 120)

  const apiKey = process.env.PLUNK_API_KEY
  const base = (process.env.PLUNK_API_BASE ?? DEFAULT_BASE).replace(/\/$/, '')
  if (!apiKey) {
    console.error('enquiry: PLUNK_API_KEY is not set')
    return json({ ok: false, error: 'Enquiries are not configured yet. Try again shortly.' }, 503)
  }

  const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }

  // Empty strings are ignored by Plunk's merge, so optional fields left blank
  // simply do not appear rather than overwriting something already known.
  const data: Record<string, unknown> = {
    audience,
    enquiry: true,
    organisation,
    contact_role: role,
    cohort,
    source_page: source,
    // The waitlist keys must not collide: a commercial contact is not a learner.
    role: null,
    platforms: null,
  }

  try {
    const res = await fetch(`${base}/contacts`, {
      method: 'POST',
      headers: auth,
      // Not subscribed: an enquiry is not consent to be marketed at.
      body: JSON.stringify({ email, subscribed: false, data }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('enquiry: Plunk /contacts responded', res.status, detail.slice(0, 300))
      return json({ ok: false, error: 'Could not send that just now. Try again in a moment.' }, 502)
    }
  }
  catch (error) {
    console.error('enquiry: request to Plunk failed', error)
    return json({ ok: false, error: 'Could not reach us. Try again in a moment.' }, 502)
  }

  // Notify a human. A lead nobody sees is worse than no form at all.
  try {
    const rows = [
      ['Audience', audience],
      ['Email', email],
      ['Organisation', organisation || '—'],
      ['Role', role || '—'],
      ['Size', cohort || '—'],
      ['From page', source || '—'],
    ]
      .map(([k, v]) => `<tr><td><b>${escapeHtml(k!)}</b></td><td>${escapeHtml(v!)}</td></tr>`)
      .join('')

    const res = await fetch(`${base}/v1/send`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        to: process.env.ENQUIRY_TO ?? DEFAULT_TO,
        from: process.env.PLUNK_FROM ?? DEFAULT_FROM,
        name: process.env.PLUNK_FROM_NAME ?? DEFAULT_FROM_NAME,
        subject: `${audience} enquiry — ${organisation || email}`,
        body: `<p>New ${escapeHtml(audience)} enquiry.</p><table>${rows}</table>`
          + (context ? `<p><b>What they said</b><br>${escapeHtml(context).replace(/\n/g, '<br>')}</p>` : '')
          + `<p>Reply to <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>.</p>`,
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('enquiry: notification failed', res.status, detail.slice(0, 300))
    }
  }
  catch (error) {
    // They are recorded either way; failing the request would invite a
    // duplicate submission for a notification problem that is ours.
    console.error('enquiry: notification threw', error)
  }

  return json({ ok: true })
}
