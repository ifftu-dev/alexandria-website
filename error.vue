<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useHead({
  title: `${props.error.statusCode ?? 'Error'} — Alexandria`,
})

useTheme()

const isMissing = computed(() => props.error.statusCode === 404)

/**
 * A project named after the most famous lost library in history has no business
 * shipping a dull 404.
 *
 * The first line is the SSR default and every visitor sees it first; the rest are
 * swapped in on mount. Randomising during render would hydrate to different text
 * than the server sent, which Vue rightly complains about — and a console warning
 * is a poor price for a joke.
 */
const LINES = [
  'Alexandria has lost things before. This one is a considerably smaller loss.',
  'Not in the library. And unlike last time, nothing is on fire.',
  'This URL cannot be verified. Fittingly, we built a whole product about that.',
  'Somewhere between here and there, a link stopped being true.',
  'The page is gone. The knowledge, presumably, survives elsewhere.',
]
const line = ref(LINES[0]!)

function handleError() {
  clearError({ redirect: '/' })
}

onMounted(() => {
  if (isMissing.value) {
    line.value = LINES[Math.floor(Math.random() * LINES.length)]!
    ;(window as unknown as { plausible?: (event: string, opts?: { props?: Record<string, string> }) => void })
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
        {{ isMissing ? 'not in the library' : 'system error' }}
      </p>
      <p class="err-code">{{ error.statusCode ?? 'Error' }}</p>
      <p class="err-msg">
        {{ isMissing ? line : 'Something broke. We are probably already looking at it.' }}
      </p>

      <!--
        The one thing a wrong URL definitely proves. It is a real shape — the same
        fields a genuine credential carries — signed by nobody, assessed by
        nothing, and labelled as such. The joke only works because the product is
        honest about exactly this distinction elsewhere.
      -->
      <div v-if="isMissing" class="err-cred">
        <div class="err-cred-h">
          <span class="err-cred-mark" aria-hidden="true">✦</span>
          <b>Credential earned</b>
          <span class="err-cred-chip">Unassessed</span>
        </div>
        <dl class="err-cred-body">
          <dt>Skill</dt>
          <dd class="mono">navigation.url.recall</dd>
          <dt>Level</dt>
          <dd>Needs work · self-attested</dd>
          <dt>Issued by</dt>
          <dd class="mono">did:key:z6Mkfa…yours</dd>
        </dl>
        <p class="err-cred-foot">
          Verifiable, portable and completely worthless. Two out of three is the
          part we are proud of.
        </p>
      </div>

      <div class="err-cta">
        <button type="button" class="btn-gradient" @click="handleError">
          Back to Alexandria
        </button>
        <NuxtLink v-if="isMissing" to="/blog" class="err-link">Read something that does exist</NuxtLink>
      </div>
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
.err-inner { position: relative; z-index: 2; max-width: 30rem; }
.err-kicker {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgb(255 255 255 / 0.7);
  margin: 0;
}
.err-code {
  font-family: var(--font-display);
  font-size: clamp(78px, 17vw, 156px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.03em;
  margin: 14px 0 0;
}
.err-msg {
  margin: 14px auto 0;
  max-width: 40ch;
  font-size: 17px;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.86);
}

/* Deliberately the same construction as a real credential row in the app
   replica — border, mark, chip, DID — because a parody that does not resemble
   the thing it parodies is just a box. */
.err-cred {
  margin: 30px 0 0;
  padding: 16px 18px;
  text-align: start;
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: 14px;
  background: rgb(8 11 24 / 0.42);
  backdrop-filter: blur(6px);
}
.err-cred-h { display: flex; align-items: center; gap: 9px; font-size: 13.5px; }
.err-cred-mark { color: rgb(var(--page-accent-hero, 186 182 255)); }
.err-cred-chip {
  margin-inline-start: auto;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.28);
  color: rgb(255 255 255 / 0.85);
}
.err-cred-body {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 6px 16px;
  margin: 14px 0 0;
  padding-top: 13px;
  border-top: 1px solid rgb(255 255 255 / 0.14);
}
.err-cred-body dt {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.6);
  padding-top: 2px;
}
.err-cred-body dd { margin: 0; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
.err-cred-foot {
  margin: 14px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.66);
}

.err-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; margin-top: 28px; }
.err-link { font-size: 14px; font-weight: 600; color: rgb(255 255 255 / 0.82); text-decoration: underline; text-underline-offset: 0.18em; }
.err-link:hover { color: #fff; }
</style>
