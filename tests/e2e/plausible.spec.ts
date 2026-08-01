import type { Page, Route } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * Every analytics goal, from the element that fires it.
 *
 * Two things about Plausible make this test look stranger than it is, and both
 * cost an afternoon to discover:
 *
 *  1. Its script ignores events when `navigator.webdriver` is true. Any
 *     automated run records nothing and reports no error. `window.__plausible`
 *     is their own opt-in for exactly this case, and it has to be set before the
 *     script loads.
 *  2. It also refuses to send from localhost, and that check is NOT bypassed by
 *     the same flag. So this suite only means anything against a deployed site.
 *
 * Requests to /api/event are captured and then ABORTED. The point is to prove
 * the right event name leaves the page, not to write test conversions into a
 * real dashboard — a test that pollutes the data it verifies is worse than none.
 *
 * `engagement` and `pageview` are Plausible's own automatic events and are
 * filtered out everywhere below.
 */

/** Set up capture-and-block, and return the collected custom event names. */
async function captureEvents(page: Page): Promise<string[]> {
  const seen: string[] = []
  await page.route('**/api/event*', async (route: Route) => {
    try {
      const body = JSON.parse(route.request().postData() ?? '{}') as { n?: string }
      if (body.n) seen.push(body.n)
    }
    catch { /* a payload we cannot parse is not a payload we care about */ }
    await route.abort()
  })
  return seen
}

const AUTOMATIC = new Set(['pageview', 'engagement'])
const custom = (events: string[]) => events.filter(e => !AUTOMATIC.has(e))

/**
 * `page.goto` resolves on `load`, before Vue has hydrated and before Plausible's
 * script has attached its click handlers. A click in that window fires nothing,
 * intermittently. Waiting for the network to settle covers both.
 */
async function gotoReady(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    ;(window as unknown as { __plausible: boolean }).__plausible = true
  })
})

test.describe('Plausible goals', () => {
  test('the tagged-events script is the one that is loaded', async ({ page }) => {
    await gotoReady(page, '/')
    const src = await page.locator('script[src*="plausible"]').first().getAttribute('src')
    // Without this variant none of the plausible-event-name classes do anything.
    expect(src).toContain('tagged-events')
    expect(await page.locator('script[src*="plausible"]').first().getAttribute('data-domain'))
      .toBe('alexandria.ifftu.dev')
  })

  const navGoals: Array<{ goal: string, from: string, click: string }> = [
    { goal: 'Nav-Recognition', from: '/', click: '.nav-links a[href="/why-recognition"]' },
    { goal: 'Nav-Technology', from: '/', click: '.nav-links a[href="/technology"]' },
    { goal: 'Nav-Blog', from: '/', click: '.nav-links a[href="/blog"]' },
    { goal: 'Nav-Recruiter', from: '/', click: '.nav-links a[href="/employers"]' },
    { goal: 'Nav-Institutions', from: '/', click: '.nav-links a[href="/institutions"]' },
    // Clicked from a different page on purpose. A footer link to the page you are
    // already on is a router no-op, and the click races the event in a way that
    // made these two intermittently fail for no product reason.
    { goal: 'Nav-Learners', from: '/', click: '.foot-col a[href="/learners"]' },
    { goal: 'Nav-Pilots', from: '/', click: '.foot-col a[href="/pilots"]' },
  ]

  for (const { goal, from, click } of navGoals) {
    test(`${goal} fires`, async ({ page }) => {
      const events = await captureEvents(page)
      await gotoReady(page, from)
      await page.locator(click).first().click()
      await expect.poll(() => custom(events)).toContain(goal)
    })
  }

  test('Nav-Verify fires from a hero CTA, not only from the nav', async ({ page }) => {
    // This is the regression this test exists for: the goal was tagged in the
    // header and footer but not on the audience-page CTAs, which are the actual
    // route to the verifier — so the funnel read as near-empty while in use.
    const events = await captureEvents(page)
    await gotoReady(page, '/learners')
    await page.locator('.hero-cta a[href="/verify"]').click()
    await expect.poll(() => custom(events)).toContain('Nav-Verify')
  })

  test('EarlyAccess fires when the waiting-list dialog opens', async ({ page }) => {
    const events = await captureEvents(page)
    await gotoReady(page, '/learners')
    await page.locator('button.plausible-event-name\\=EarlyAccess').first().click()
    await expect.poll(() => custom(events)).toContain('EarlyAccess')
  })

  test('EarlyAccess-Submit fires on submit, and EarlyAccess does not fire twice', async ({ page }) => {
    // The regression this exists for: the submit button used to carry
    // `EarlyAccess` as well, so one signup recorded two of them and the goal
    // measured neither opens nor completions. Opening must count exactly once,
    // and finishing must be its own event.
    const events = await captureEvents(page)
    // Stub the endpoint — this test is about what leaves the page, and a real
    // POST would write a contact to Plunk on every run.
    await page.route('**/api/early-access', route => route.fulfill({
      status: 200, contentType: 'application/json', body: '{"ok":true,"isNew":false}',
    }))

    await gotoReady(page, '/learners')
    await page.locator('.hero-cta button.plausible-event-name\\=EarlyAccess').click()

    const form = page.locator('dialog[open]')
    await expect(form).toBeVisible()
    await form.locator('input[type="email"]').fill('e2e@example.com')
    await form.locator('button[type="submit"]').first().click()

    await expect.poll(() => custom(events)).toContain('EarlyAccess-Submit')
    expect(custom(events).filter(e => e === 'EarlyAccess')).toHaveLength(1)
  })

  test('Announcement fires from the toast', async ({ page }) => {
    const events = await captureEvents(page)
    await gotoReady(page, '/')
    // It is deliberately delayed so it cannot compete with first paint.
    const toast = page.locator('.toast-link')
    await toast.waitFor({ state: 'visible' })
    await toast.click()
    await expect.poll(() => custom(events)).toContain('Announcement')
  })

  test('CTA-GitHub fires on an outbound source link', async ({ page, context }) => {
    const events = await captureEvents(page)
    await gotoReady(page, '/technology')
    // It opens a new tab; we only care that the event left this one.
    context.on('page', p => p.close().catch(() => {}))
    await page.locator('a.plausible-event-name\\=CTA-GitHub').first().click()
    await expect.poll(() => custom(events)).toContain('CTA-GitHub')
  })

  test('404 fires with the path that was missed', async ({ page }) => {
    const withProps: Array<{ n?: string, p?: Record<string, string> }> = []
    await page.route('**/api/event*', async (route: Route) => {
      try { withProps.push(JSON.parse(route.request().postData() ?? '{}')) }
      catch { /* ignore */ }
      await route.abort()
    })
    await page.goto('/a-page-that-does-not-exist')
    await expect.poll(() => withProps.find(e => e.n === '404')).toBeTruthy()
    // The path prop is what makes the goal actionable rather than just a count.
    expect(withProps.find(e => e.n === '404')?.p?.path).toBe('/a-page-that-does-not-exist')
  })

  test('every internal link to a tracked page carries its goal class', async ({ page }) => {
    // Static coverage check. Catches the class going missing on a new link,
    // which is how Nav-Verify came to be under-reported in the first place.
    const goals: Record<string, string> = {
      '/verify': 'Nav-Verify',
      '/technology': 'Nav-Technology',
      '/blog': 'Nav-Blog',
      '/why-recognition': 'Nav-Recognition',
      '/learners': 'Nav-Learners',
      '/employers': 'Nav-Recruiter',
      '/institutions': 'Nav-Institutions',
      '/pilots': 'Nav-Pilots',
    }
    const pages = ['/', '/learners', '/employers', '/institutions', '/technology',
      '/why-recognition', '/verify', '/trust', '/privacy', '/blog']

    const untagged: string[] = []
    for (const path of pages) {
      await page.goto(path)
      const found = await page.evaluate((map) => {
        const bad: string[] = []
        for (const a of Array.from(document.querySelectorAll('a[href]'))) {
          const href = a.getAttribute('href') ?? ''
          const goal = (map as Record<string, string>)[href]
          if (goal && !a.className.includes(goal)) bad.push(`${href} → expected ${goal}`)
        }
        return bad
      }, goals)
      untagged.push(...found.map(f => `${path}: ${f}`))
    }
    expect(untagged, `untagged links:\n${untagged.join('\n')}`).toEqual([])
  })
})
