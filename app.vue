<script setup lang="ts">
// Theme initialization happens in useTheme composable
// which is called in the layout

// Preload the two faces the hero H1 is set in. It is the LCP element, so these
// are the fonts worth racing the render-blocking CSS. The body and mono faces
// have metric-matched local fallbacks, which makes their swap invisible and
// their preload not worth the bandwidth it takes from these.
//
// The italic is here because the H1 ends in an italic phrase, and a fallback
// cannot be relied on to hold its place. The metric-matched faces are built on
// `local('Georgia')` and `local('Arial')`, which only exist on machines that
// have them: macOS and Windows do, Linux and Android do not. On Android the
// override silently does not apply, the fallback is whatever serif the system
// ships, and the H1 re-wraps when the real italic lands — moving everything
// below the hero. That is a 0.104 layout shift, measured on a Linux CI runner
// standing in for exactly that case.
//
// 17 KB to remove a Core Web Vital failure for every visitor without Georgia.
import displayUrl from '~/assets/fonts/newsreader-normal.woff2?url'
import italicUrl from '~/assets/fonts/newsreader-italic.woff2?url'

useHead({
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: displayUrl, crossorigin: '' },
    { rel: 'preload', as: 'font', type: 'font/woff2', href: italicUrl, crossorigin: '' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
