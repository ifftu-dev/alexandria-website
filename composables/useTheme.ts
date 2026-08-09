type Theme = 'light' | 'dark' | 'system'

/**
 * Unset follows the operating system, and falls back to dark.
 *
 * The pre-paint script in nuxt.config.ts encodes the same rule and is the one
 * that actually decides the first frame; this has to agree with it or the page
 * flips after hydration.
 */
const theme = ref<Theme>('system')

function getSystemTheme(): 'light' | 'dark' {
  // Dark on the server so SSR matches the pre-paint default rather than
  // flashing, and the query asks for light because `prefers-color-scheme` has a
  // third state — `no-preference` — which should land on dark, not light.
  if (import.meta.server) return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(value: Theme) {
  if (import.meta.server) return
  const resolved = value === 'system' ? getSystemTheme() : value
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function useTheme() {
  function setTheme(value: Theme) {
    theme.value = value
    if (!import.meta.server) {
      localStorage.setItem('alexandria-theme', value)
    }
    applyTheme(value)
  }

  onMounted(() => {
    const stored = localStorage.getItem('alexandria-theme') as Theme | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      theme.value = stored
    }
    applyTheme(theme.value)

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system')
      }
    })
  })

  return { theme: readonly(theme), setTheme }
}
