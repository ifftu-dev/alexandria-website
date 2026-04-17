type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>('dark')

function getSystemTheme(): 'light' | 'dark' {
  if (import.meta.server) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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
