<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useHead({
  title: `${props.error.statusCode ?? 'Error'} — Alexandria`,
})

useTheme()

function handleError() {
  clearError({ redirect: '/' })
}

onMounted(() => {
  if (props.error.statusCode === 404) {
    (window as unknown as { plausible?: (event: string, opts?: { props?: Record<string, string> }) => void })
      .plausible?.('404', { props: { path: window.location.pathname } })
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-[rgb(var(--color-background))] px-4 py-16 text-center">
    <p class="font-mono text-xs uppercase tracking-widest text-[rgb(var(--color-muted-foreground))]">
      {{ error.statusCode === 404 ? '// page not found' : '// system error' }}
    </p>
    <h1 class="mt-6 text-7xl font-bold leading-none text-[rgb(var(--color-foreground))] sm:text-9xl">
      {{ error.statusCode ?? 'Error' }}
    </h1>
    <p class="mx-auto mt-8 max-w-md text-lg text-[rgb(var(--color-muted-foreground))]">
      {{ error.statusCode === 404
        ? 'The page you’re looking for isn’t here. Maybe it moved, maybe it never was.'
        : 'Something broke. We’re probably already looking at it.' }}
    </p>
    <button
      type="button"
      class="mt-10 rounded-lg border border-[rgb(var(--color-border))] px-6 py-3 text-sm font-semibold text-[rgb(var(--color-foreground))] transition-colors hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]"
      @click="handleError"
    >
      Back to Alexandria
    </button>
  </div>
</template>
