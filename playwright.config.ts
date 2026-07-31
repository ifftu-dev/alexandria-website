import { defineConfig, devices } from '@playwright/test'

/**
 * These suites test third-party integrations, which means they run against a
 * deployed site rather than a local build. Two reasons, both learned the hard
 * way:
 *
 *  - Plausible's script refuses to send anything when `location.hostname` is
 *    localhost, so goal wiring is simply not observable locally.
 *  - The Netlify functions only exist on a deploy; `nuxt generate` output has no
 *    /api routes at all.
 *
 * Point BASE_URL at a deploy preview to test a branch before it lands.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // these touch shared third-party state; keep it ordered
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.BASE_URL ?? 'https://alexandria.ifftu.dev',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
})
