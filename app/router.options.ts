import type { RouterConfig } from '@nuxt/schema'

/**
 * `scroll-behavior: smooth` on <html> is what makes the in-page anchor links
 * glide (#features, #how-it-works, #early-access). It also, unhelpfully,
 * applies to the router's scroll-to-top on navigation: arriving on a new page
 * rendered it at the previous page's scroll offset and then animated upward,
 * which reads as the page drifting under you.
 *
 * So: route changes jump, hash targets glide, and the back button restores
 * exactly where you were.
 */
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      return { el: to.hash, top: HEADER_OFFSET, behavior: 'smooth' }
    }

    // Same page, only the hash was dropped — leave the viewport alone.
    if (to.path === from.path) return false

    return { left: 0, top: 0, behavior: 'instant' }
  },
}

/** Sticky header height plus a little breathing room. */
const HEADER_OFFSET = 78
