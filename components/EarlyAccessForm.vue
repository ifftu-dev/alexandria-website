<script setup lang="ts">
/**
 * Early-access signup.
 *
 * Posts to `/api/early-access`, a Netlify function that forwards to Plunk. The
 * secret key stays server-side, and the function drops honeypot hits and
 * malformed addresses before they reach the account.
 *
 * Swapping providers later means changing that function; this component only
 * knows it posts an email and a platform to an endpoint that answers
 * `{ ok: true }`.
 */
const props = withDefaults(defineProps<{
  /** `hero` sits on the gradient, `band` on a light section. */
  variant?: 'hero' | 'band'
}>(), { variant: 'hero' })

const ENDPOINT = '/api/early-access'

const email = ref('')
const botField = ref('')
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const errorMessage = ref('')

// Which build they're waiting for, so that's learnable without asking. This
// deliberately uses usePlatform rather than useDownload: the label comes from
// the user agent, and useDownload would fetch every GitHub release to answer a
// question that needs no network at all.
const { label: platformLabel } = usePlatform()

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
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: value,
        platform: platformLabel.value,
        botField: botField.value,
      }),
    })
    const body = await res.json().catch(() => ({})) as { ok?: boolean, error?: string }

    if (!res.ok || !body.ok) {
      state.value = 'error'
      // The function explains itself when it can — a bad address and an
      // outage are not the same problem and should not read the same.
      errorMessage.value = body.error ?? 'Could not add you just now. Try again in a moment.'
      return
    }
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
      class="ea-form"
      @submit.prevent="submit"
    >
      <!-- Off-screen rather than hidden, so bots still fill it in. -->
      <p class="ea-bot">
        <label>Leave this field empty<input v-model="botField" name="bot-field" tabindex="-1" autocomplete="off"></label>
      </p>

      <label class="ea-label sr-only" for="ea-email">Email address</label>
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
        {{ state === 'error' ? errorMessage : 'One email when a build is ready for your platform. Nothing else.' }}
      </p>
    </form>

    <div v-else class="ea-done" role="status" aria-live="polite">
      <span class="ea-tick" aria-hidden="true">✓</span>
      <div>
        <p class="ea-done-t">You're on the list.</p>
        <p class="ea-note">Check your inbox for a confirmation. We'll write again when the alpha opens up for {{ platformLabel }}.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ea { width: 100%; max-width: 30rem; }
.ea-hero { margin-inline: auto; }

/* Kept for screen readers — the placeholder carries it visually. */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

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
/* Same trade as .btn-ghost: no backdrop blur on phones, slightly more opaque
   fill in its place. */
@media (max-width: 700px) {
  .ea-hero .ea-input { backdrop-filter: none; background: rgb(255 255 255 / 0.24); }
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
