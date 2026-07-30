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
  <div class="err">
    <MeshGradient />
    <div class="hero-scrim" />
    <div class="err-inner">
      <p class="mono err-kicker">
        {{ error.statusCode === 404 ? 'page not found' : 'system error' }}
      </p>
      <p class="err-code">{{ error.statusCode ?? 'Error' }}</p>
      <p class="err-msg">
        {{ error.statusCode === 404
          ? 'The page you’re looking for isn’t here. Maybe it moved, maybe it never was.'
          : 'Something broke. We’re probably already looking at it.' }}
      </p>
      <button type="button" class="btn-ghost" @click="handleError">
        Back to Alexandria
      </button>
    </div>
  </div>
</template>

<style scoped>
.err {
  position: relative;
  overflow: hidden;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
  color: #fff;
}
.err-inner { position: relative; z-index: 2; }
.err-kicker {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgb(255 255 255 / 0.7);
  margin: 0;
}
.err-code {
  font-size: clamp(72px, 16vw, 148px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  margin: 18px 0 0;
}
.err-msg {
  margin: 20px auto 30px;
  max-width: 42ch;
  font-size: 17px;
  color: rgb(255 255 255 / 0.85);
}
</style>
