<script setup lang="ts">
// Theme initialization happens in useTheme composable
// which is called in the layout

// Preload the above-the-fold face. The redesign sets everything in Inter —
// including the hero H1, which is the LCP element — so this is the only
// font that needs to race the render-blocking CSS.
import interUrl from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'

useHead({
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: interUrl, crossorigin: '' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
