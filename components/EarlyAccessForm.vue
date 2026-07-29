<script setup lang="ts">
/**
 * Early-access signup.
 *
 * Posts to Netlify Forms, which is already part of this site's deploy — no
 * extra service, no API keys, and the addresses stay in the same account that
 * hosts the site. Netlify registers the form by parsing the prerendered HTML
 * at deploy time, which is why the markup carries `data-netlify` and the
 * hidden `form-name` field even though submission happens over fetch.
 *
 * Swapping providers later means changing `submit()` and the form attributes;
 * nothing else on the page knows how this works.
 */
const props = withDefaults(defineProps<{
  /** `hero` sits on the gradient, `band` on a light section. */
  variant?: 'hero' | 'band'
}>(), { variant: 'hero' })

const FORM_NAME = 'early-access'

const email = ref('')
const botField = ref('')
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const errorMessage = ref('')

// Reuse the platform detection the download button used, so we learn which
// builds people are actually waiting for without asking them.
const { download } = useDownload()

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

async function submit() {
  if (state.value === 'sending') return

  const value = email.value.trim()
  if (!value || !value.includes('@')) {
    state.value = 'error'
    errorMessage.value = 'That address does not look right — check and try again.'
    return
  }

  state.value = 'sending'
  errorMessage.value = ''

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': FORM_NAME,
        'email': value,
        'platform': download.value.platformLabel,
        'bot-field': botField.value,
      }),
    })
    if (!res.ok) throw new Error(String(res.status))
    state.value = 'done'
  }
  catch {
    state.value = 'error'
    errorMessage.value = 'Could not reach the list. Try again in a moment.'
  }
}
</script>

<template>
  <div class="ea" :class="`ea-${props.variant}`">
    <form
      v-if="state !== 'done'"
      :name="FORM_NAME"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      class="ea-form"
      @submit.prevent="submit"
    >
      <!-- Netlify reads these from the prerendered HTML -->
      <input type="hidden" name="form-name" :value="FORM_NAME">
      <input type="hidden" name="platform" :value="download.platformLabel">
      <p class="ea-bot">
        <label>Leave this field empty<input v-model="botField" name="bot-field" tabindex="-1" autocomplete="off"></label>
      </p>

      <label class="ea-label" for="ea-email">Email address</label>
      <div class="ea-row">
        <input
          id="ea-email"
          v-model="email"
          type="email"
          name="email"
          required
          autocomplete="email"
          inputmode="email"
          placeholder="you@example.com"
          class="ea-input"
          :aria-invalid="state === 'error'"
          :disabled="state === 'sending'"
        >
        <button type="submit" class="btn plausible-event-name=EarlyAccess" :disabled="state === 'sending'">
          {{ state === 'sending' ? 'Adding you…' : 'Get early access' }}
        </button>
      </div>
      <p class="ea-note" :class="{ 'ea-err': state === 'error' }" role="status" aria-live="polite">
        {{ state === 'error' ? errorMessage : 'We email you when a build is ready for your platform. Nothing else, ever.' }}
      </p>
    </form>

    <div v-else class="ea-done" role="status" aria-live="polite">
      <span class="ea-tick" aria-hidden="true">✓</span>
      <div>
        <p class="ea-done-t">You're on the list.</p>
        <p class="ea-note">We'll be in touch when the alpha opens up for {{ download.platformLabel }}.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ea { width: 100%; max-width: 30rem; }
.ea-hero { margin-inline: auto; }

.ea-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
  text-align: start;
}
.ea-hero .ea-label { color: rgb(255 255 255 / 0.75); }
.ea-band .ea-label { color: rgb(var(--color-muted-foreground)); }

.ea-row { display: flex; gap: 8px; }
@media (max-width: 460px) { .ea-row { flex-direction: column; } .ea-row .btn { justify-content: center; } }

.ea-input {
  flex: 1;
  min-width: 0;
  font-family: inherit;
  font-size: 15px;
  padding: 11px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: border-color 150ms ease, background 150ms ease;
}
.ea-hero .ea-input {
  background: rgb(255 255 255 / 0.16);
  color: #fff;
  border-color: rgb(255 255 255 / 0.22);
  backdrop-filter: blur(6px);
}
.ea-hero .ea-input::placeholder { color: rgb(255 255 255 / 0.6); }
.ea-hero .ea-input:focus { border-color: rgb(255 255 255 / 0.6); outline: none; background: rgb(255 255 255 / 0.24); }
.ea-band .ea-input {
  background: rgb(var(--color-card));
  color: rgb(var(--color-foreground));
  border-color: rgb(var(--color-border));
}
.ea-band .ea-input:focus { border-color: rgb(var(--color-primary)); outline: none; }
.ea-input[aria-invalid="true"] { border-color: rgb(var(--color-no)); }
.ea-input:disabled { opacity: 0.6; }

.ea-note { margin: 10px 0 0; font-size: 12.5px; line-height: 1.5; text-align: start; }
.ea-hero .ea-note { color: rgb(255 255 255 / 0.7); }
.ea-band .ea-note { color: rgb(var(--color-muted-foreground)); }
.ea-err { color: #ffd0d6; }
.ea-band .ea-err { color: rgb(var(--color-no)); }

/* Honeypot — off-screen rather than display:none, so bots still fill it. */
.ea-bot { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }

.ea-done { display: flex; align-items: flex-start; gap: 12px; text-align: start; }
.ea-tick {
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 700;
  background: rgb(var(--color-ok) / 0.18);
  color: rgb(var(--color-ok));
}
.ea-done-t { margin: 0; font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
.ea-hero .ea-done-t { color: #fff; }
.ea-done .ea-note { margin-top: 3px; }
</style>
