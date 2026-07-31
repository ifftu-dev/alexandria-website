<script setup lang="ts">
// Theme initialization happens in useTheme composable
// which is called in the layout

// Preload the above-the-fold face. The hero H1 is the LCP element and it is set
// in the display serif, so that is the one font worth racing the render-blocking
// CSS. The body and mono faces both have metric-matched local fallbacks, which
// makes their swap invisible and their preload not worth the bandwidth it takes
// from this one.
import displayUrl from '~/assets/fonts/newsreader-normal.woff2?url'

useHead({
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: displayUrl, crossorigin: '' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
