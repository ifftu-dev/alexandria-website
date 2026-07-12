<script setup lang="ts">
// Theme initialization happens in useTheme composable
// which is called in the layout

// Preload the above-the-fold faces (Playfair = hero H1/LCP, Inter = body)
// so they download in parallel with the render-blocking CSS instead of after.
import playfairUrl from '@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2?url'
import interUrl from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'

useHead({
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: playfairUrl, crossorigin: '' },
    { rel: 'preload', as: 'font', type: 'font/woff2', href: interUrl, crossorigin: '' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
