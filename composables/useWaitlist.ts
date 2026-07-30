/**
 * Whether the waiting-list dialog is open.
 *
 * `useState` rather than a module-level ref: this is shared by the nav, the
 * hero, the CTA band and the drawer, and a module-level ref would be reused
 * across requests on the server. Nothing here is user data, but the habit is
 * worth keeping.
 */
export function useWaitlist() {
  const isOpen = useState('waitlist-open', () => false)

  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
  }
}
