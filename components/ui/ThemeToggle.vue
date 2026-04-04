<script setup lang="ts">
const { theme, setTheme } = useTheme()

const themes = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'monitor' },
] as const

const currentTheme = computed(() => themes.find(t => t.value === theme.value) || themes[2])
const isOpen = ref(false)

function selectTheme(value: 'light' | 'dark' | 'system') {
  setTheme(value)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-toggle')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="theme-toggle relative">
    <button
      type="button"
      class="flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-[rgb(var(--color-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-ring))]"
      :aria-label="`Current theme: ${currentTheme.label}. Click to change.`"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <svg
        v-if="currentTheme.icon === 'sun'"
        class="w-5 h-5 text-[rgb(var(--color-foreground))]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg
        v-else-if="currentTheme.icon === 'moon'"
        class="w-5 h-5 text-[rgb(var(--color-foreground))]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
      <svg
        v-else
        class="w-5 h-5 text-[rgb(var(--color-foreground))]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-36 origin-top-right rounded-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-lg z-50"
        role="listbox"
        aria-label="Theme options"
      >
        <div class="p-1">
          <button
            v-for="t in themes"
            :key="t.value"
            type="button"
            role="option"
            :aria-selected="theme === t.value"
            class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors text-left"
            :class="theme === t.value
              ? 'bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]'
              : 'text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))]'"
            @click="selectTheme(t.value)"
          >
            <svg
              v-if="t.icon === 'sun'"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg
              v-else-if="t.icon === 'moon'"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{{ t.label }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
