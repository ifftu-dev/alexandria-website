import { expect, test } from '@playwright/test'

/**
 * The two Netlify functions that talk to Plunk: the learner waiting list
 * (/api/early-access) and the pilot/partner enquiries (/api/pilot, /api/partner).
 *
 * These only exist on a deploy — `nuxt generate` produces no /api routes at all —
 * so this suite runs against BASE_URL like the Plausible one.
 *
 * WHAT IS AND IS NOT EXERCISED
 *
 * Everything here is safe to run repeatedly against production. The validation
 * paths never reach Plunk. The one test that does reach it re-submits an address
 * that already exists, so Plunk merges rather than creating, answers
 * `isNew: false`, and the function skips the confirmation email on that basis —
 * the round trip is proven without a new contact or a sent message.
 *
 * The enquiry endpoints are only exercised as far as validation. A successful
 * enquiry creates a contact AND emails a human, and there is no equivalent of
 * `isNew` to make that idempotent — a suite that pages someone every run would
 * be turned off within a week. Set PLUNK_E2E_WRITE=1 to include it deliberately.
 */

const SEEDED = 'admin+prodcheck@ifftu.dev' // already in Plunk from earlier verification

/**
 * `page.goto` resolves on `load`, which is before Vue has hydrated — a click
 * placed in that window lands on inert server-rendered markup and does nothing,
 * intermittently, depending on how fast the bundle parsed. Waiting for the
 * network to settle is the cheap reliable signal that hydration has happened.
 */
async function gotoHydrated(page: import('@playwright/test').Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

test.describe('waiting list → Plunk', () => {
  test('rejects an address that is not one', async ({ request }) => {
    const res = await request.post('/api/early-access', {
      data: { email: 'not-an-address', role: 'learner', platforms: ['macos'] },
    })
    expect(res.status()).toBe(400)
    expect((await res.json()).ok).toBe(false)
  })

  test('rejects a malformed body', async ({ request }) => {
    const res = await request.post('/api/early-access', {
      headers: { 'Content-Type': 'application/json' },
      data: '{ not json',
    })
    expect(res.status()).toBe(400)
  })

  test('answers a honeypot submission as though it worked', async ({ request }) => {
    // A bot must not learn that it was caught, so this is a 200 with no write.
    const res = await request.post('/api/early-access', {
      data: { email: 'bot@example.com', role: 'learner', platforms: ['macos'], botField: 'filled' },
    })
    expect(res.status()).toBe(200)
    expect((await res.json()).ok).toBe(true)
  })

  test('reaches Plunk, and does not re-send to a known address', async ({ request }) => {
    // The real round trip: a 200 here means the API key is valid and /contacts
    // accepted the write, because the function only reports ok after that.
    const res = await request.post('/api/early-access', {
      data: { email: SEEDED, role: 'learner', platforms: ['macos'], detected: 'macos' },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    // False proves the contact already existed — so no email was sent by this run.
    expect(body.isNew).toBe(false)
  })
})

test.describe('enquiries → Plunk', () => {
  for (const path of ['/api/pilot', '/api/partner']) {
    test(`${path} rejects a bad address`, async ({ request }) => {
      const res = await request.post(path, { data: { email: 'nope' } })
      expect(res.status()).toBe(400)
    })

    test(`${path} refuses anything but POST`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(405)
    })

    test(`${path} swallows a honeypot submission`, async ({ request }) => {
      const res = await request.post(path, {
        data: { email: 'bot@example.com', audience: 'employer', botField: 'x' },
      })
      expect(res.status()).toBe(200)
      expect((await res.json()).ok).toBe(true)
    })
  }

  // Opt-in: this creates a contact and emails a person.
  test('a real enquiry reaches Plunk', async ({ request }) => {
    test.skip(process.env.PLUNK_E2E_WRITE !== '1',
      'writes a contact and emails a human — set PLUNK_E2E_WRITE=1 to include')

    const res = await request.post('/api/pilot', {
      data: {
        email: 'admin+e2e-enquiry@ifftu.dev',
        audience: 'employer',
        organisation: 'E2E test — safe to delete',
        context: 'Automated end-to-end check of the enquiry endpoint.',
        cohort: '25-200',
        source: '/employers',
      },
    })
    expect(res.status()).toBe(200)
    expect((await res.json()).ok).toBe(true)
  })
})

test.describe('the forms that call them', () => {
  test('the waiting-list dialog opens and posts to the right endpoint', async ({ page }) => {
    await gotoHydrated(page, '/learners')
    // Specifically the hero CTA. The dialog's own submit button carries the same
    // goal class and sits in the closed dialog, so `.first()` can land on it.
    await page.locator('.hero-cta button.plausible-event-name\\=EarlyAccess').click()

    const form = page.locator('dialog[open]')
    await expect(form).toBeVisible()
    // Scoped to the dialog throughout: the waiting-list form is also rendered
    // once at the layout level, so page-wide selectors match two of everything.

    // Intercept rather than submit: this asserts the wiring, not Plunk again.
    let posted: { url: string, body: string } | null = null
    await page.route('**/api/early-access', async (route) => {
      posted = { url: route.request().url(), body: route.request().postData() ?? '' }
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"isNew":true}' })
    })

    await form.locator('input[type="email"]').fill('e2e@example.com')
    await form.locator('button[type="submit"]').first().click()
    await expect.poll(() => posted).toBeTruthy()
    expect(posted!.url).toContain('/api/early-access')
    const sent = JSON.parse(posted!.body)
    expect(sent.email).toBe('e2e@example.com')
    // Role and platforms are what make the list segmentable; losing them is silent.
    expect(sent.role).toBeTruthy()
    expect(Array.isArray(sent.platforms)).toBe(true)
  })

  test('the enquiry form posts audience and organisation', async ({ page }) => {
    await gotoHydrated(page, '/pilots')
    let posted: string | null = null
    await page.route('**/api/pilot', async (route) => {
      posted = route.request().postData() ?? ''
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    })

    // The enquiry form's own submit — /pilots also carries the waiting-list
    // dialog, so an unqualified button[type=submit] matches both.
    const enquiry = page.locator('form.plausible-event-name\\=Enquiry')
    await enquiry.locator('input[type="email"]').fill('e2e@example.com')
    await enquiry.locator('input[autocomplete="organization"]').fill('E2E Org')
    await enquiry.locator('button[type="submit"]').click()

    await expect.poll(() => posted).toBeTruthy()
    const sent = JSON.parse(posted!)
    expect(sent.email).toBe('e2e@example.com')
    expect(sent.organisation).toBe('E2E Org')
    // Without this the two lists merge, which is the thing the split exists to stop.
    expect(['institution', 'employer']).toContain(sent.audience)
  })
})
