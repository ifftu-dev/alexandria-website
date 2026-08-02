/**
 * Whether the nav's search button should still be drawing attention to itself.
 *
 * The palette is the most enjoyable thing on the site and the least discoverable
 * — nobody presses `/` on a marketing page. So the button pulses until it has
 * been used, once, and then never again on that browser.
 *
 * `useState` rather than a module-level ref, matching `useWaitlist`: a
 * module-level ref is shared across requests on the server.
 *
 * It starts false and is only armed in `onMounted`, which matters twice over.
 * The server has no way to know whether this visitor has used it, so rendering
 * the ping into the HTML would hydrate to different markup for anyone who has —
 * and a pulsing ring is exactly the kind of thing that should not appear before
 * the page has settled.
 */
const KEY = 'alexandria-search-used'

export function useSearchPing() {
  const pinging = useState('search-ping', () => false)
  const used = useState('search-used', () => false)

  /** Call from `onMounted`. Arms the ping unless this browser has used it. */
  function arm(delayMs = 2600) {
    if (import.meta.server || used.value) return
    try {
      if (localStorage.getItem(KEY) === '1') { used.value = true; return }
    }
    catch { /* private mode: a visitor who cannot be remembered simply sees it again */ }

    // Late enough that it cannot compete with the hero for a first impression.
    setTimeout(() => { if (!used.value) pinging.value = true }, delayMs)
  }

  /** Opening the palette by any route retires the ping for good. */
  function markUsed() {
    used.value = true
    pinging.value = false
    try { localStorage.setItem(KEY, '1') }
    catch { /* nothing to do; it will pulse again next visit, which is survivable */ }
  }

  return { pinging, used, arm, markUsed }
}
