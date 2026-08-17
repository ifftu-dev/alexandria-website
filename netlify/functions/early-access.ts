/**
 * Waiting-list signup → Plunk.
 *
 * The browser posts here rather than to Plunk directly, so the secret key stays
 * server-side and honeypot hits, malformed addresses and anything outside the
 * role/platform allowlists are dropped before they reach the account.
 *
 * Two calls, in order:
 *   1. POST /contacts   upsert the address with their role and platforms, in a
 *                       shape Plunk can filter on. Answers with `_meta.isNew`.
 *   2. POST /v1/send    the designed confirmation in netlify/email/confirmation.ts,
 *                       but only when the contact is new — a
 *                       second submission of the same address should not send
 *                       a second email.
 *
 * A failed confirmation does not fail the signup: they are on the list either
 * way, and telling someone to retry would create a duplicate.
 *
 * Configure in Netlify → Site settings → Environment variables:
 *   PLUNK_API_KEY    secret key (sk_…)
 *   PLUNK_API_BASE   optional, defaults to Plunk's hosted API
 *   PLUNK_FROM       optional sender address; must be on a domain verified in
 *                    Plunk. Defaults to admin@alexandria.ifftu.dev
 *   PLUNK_FROM_NAME  optional display name, defaults to Alexandria
 *
 * Netlify v2 function: routed by `config.path`, so no redirect rule.
 */
import { confirmationHtml } from '../email/confirmation.js'

import { isRateLimited, tooManyRequests } from './_ratelimit.js'

export const config = { path: '/api/early-access' }

// The Netlify runtime provides `process.env`. Declared here rather than pulling
// in @types/node, so this file stays inside the app's `vue-tsc` run instead of
// being excluded from CI.
declare const process: { env: Record<string, string | undefined> }

interface Payload {
  email?: unknown
  role?: unknown
  platforms?: unknown
  detected?: unknown
  botField?: unknown
}

interface ContactMeta { isNew?: boolean, isUpdate?: boolean }
interface PlunkContact { _meta?: ContactMeta, data?: { _meta?: ContactMeta } }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Mirrors the app's `AccountRole` ('learner' | 'instructor' | 'parent'). Labels
 * match the role cards in the app's onboarding.
 */
const ROLES: Record<string, string> = {
  learner: 'Learner',
  instructor: 'Instructor',
  parent: 'Parent / Guardian',
}

const PLATFORMS: Record<string, string> = {
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
  ios: 'iOS',
  android: 'Android',
}
const DEFAULT_BASE = 'https://next-api.useplunk.com'
// Plunk rejects /v1/send without a sender: 422 "Sender email is required
// either in request or template". Must be an address on a domain verified in
// the Plunk account, or the mail is accepted and then never delivered.
const DEFAULT_FROM = 'admin@alexandria.ifftu.dev'
const DEFAULT_FROM_NAME = 'Alexandria'

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

  if (isRateLimited(request)) return tooManyRequests()

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

  // Both arrive from a browser, so both are checked against the allowlists above
  // rather than stored as sent. An unknown role falls back to the default the
  // form ships with; unknown platform ids are dropped silently.
  const role = typeof payload.role === 'string' && payload.role in ROLES ? payload.role : 'learner'

  const platforms = Array.isArray(payload.platforms)
    ? [...new Set(payload.platforms.filter((p): p is string => typeof p === 'string' && p in PLATFORMS))]
    : []

  if (platforms.length === 0) {
    return json({ ok: false, error: 'Pick at least one platform, so we know what to tell you about.' }, 400)
  }

  const detected = typeof payload.detected === 'string' && payload.detected in PLATFORMS
    ? payload.detected
    : null

  // Keys in the order PLATFORMS declares them, so the string reads the way the
  // form's chips do rather than in click order.
  const platformLabels = Object.keys(PLATFORMS).filter(id => platforms.includes(id)).map(id => PLATFORMS[id]!)

  /**
   * The shape is dictated by how Plunk filters. `SegmentService` turns
   * `data.<key>` into a JSON path, where `equals` is exact equality and
   * `contains` is Prisma's `string_contains` — a substring match on a *string*.
   * An array is therefore unfilterable: `equals` would need the whole array and
   * `contains` needs a string. One boolean per platform filters exactly, with
   * `data.platform_windows equals true`.
   *
   * `detected_platform` deliberately avoids the `platform_*` prefix: everything
   * with that prefix is a boolean flag, and a key that looked like one but held
   * a string would invite `data.platform_detected equals true`, which silently
   * matches nothing.
   *
   * `null` is load-bearing. Plunk *merges* incoming data into what is already
   * stored and deletes any key sent as null, so unselected platforms must be
   * nulled explicitly — otherwise someone who picks macOS today and Linux
   * tomorrow ends up filed under both forever. `platform` is nulled for the same
   * reason: it is the retired key from when this stored one display string.
   */
  const data: Record<string, unknown> = {
    role,
    role_label: ROLES[role],
    platforms: platformLabels.join(', '),
    detected_platform: detected,
    platform: null,
  }
  for (const id of Object.keys(PLATFORMS)) {
    data[`platform_${id}`] = platforms.includes(id) ? true : null
  }

  const apiKey = process.env.PLUNK_API_KEY
  const base = (process.env.PLUNK_API_BASE ?? DEFAULT_BASE).replace(/\/$/, '')

  if (!apiKey) {
    // Misconfiguration is ours, not the visitor's — say so plainly and leave a
    // trace in the function log rather than blaming their address.
    console.error('early-access: PLUNK_API_KEY is not set')
    return json({ ok: false, error: 'Signup is not configured yet. Try again shortly.' }, 503)
  }

  const auth = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }

  let isNew = true
  try {
    const res = await fetch(`${base}/contacts`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        email,
        subscribed: true,
        data,
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('early-access: Plunk /contacts responded', res.status, detail.slice(0, 300))
      return json({ ok: false, error: 'Could not add you just now. Try again in a moment.' }, 502)
    }

    // Plunk's dashboard endpoints "return the resource directly — no
    // success/data wrapper", so `_meta` sits at the top level. The wrapped
    // shape is checked too, because the public endpoints do wrap and the base
    // URL is a versioned host that may change.
    const body = await res.json().catch(() => null) as PlunkContact | null
    const meta = body?._meta ?? body?.data?._meta

    if (meta?.isNew === undefined && meta?.isUpdate === undefined) {
      // Never seen in testing, but if the shape moves again this is the branch
      // that would email somebody on every submission. Log it and stay quiet.
      console.error('early-access: no _meta on contact response, skipping confirmation; keys were', Object.keys(body ?? {}).join(','))
      isNew = false
    }
    else {
      isNew = meta?.isNew ?? meta?.isUpdate === false
    }
  }
  catch (error) {
    console.error('early-access: request to Plunk failed', error)
    return json({ ok: false, error: 'Could not reach the list. Try again in a moment.' }, 502)
  }

  if (isNew) {
    try {
      const res = await fetch(`${base}/v1/send`, {
        method: 'POST',
        headers: auth,
        body: JSON.stringify({
          to: email,
          from: process.env.PLUNK_FROM ?? DEFAULT_FROM,
          name: process.env.PLUNK_FROM_NAME ?? DEFAULT_FROM_NAME,
          subject: "You're on the Alexandria waitlist for early access",
          body: confirmationHtml(role),
        }),
      })
      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        console.error('early-access: confirmation send failed', res.status, detail.slice(0, 300))
      }
    }
    catch (error) {
      // They are subscribed; the courtesy email is not worth a retry that
      // would enter them twice.
      console.error('early-access: confirmation send threw', error)
    }
  }

  return json({ ok: true, isNew })
}
