<script setup lang="ts">
/**
 * Waiting-list signup.
 *
 * Posts to `/api/early-access`, a Netlify function that forwards to Plunk. The
 * secret key stays server-side, and the function drops honeypot hits, malformed
 * addresses and anything outside the role/platform allowlists before they reach
 * the account.
 *
 * The role and platform controls stay collapsed until the visitor touches the
 * email field. Both have defaults, so the fast path is still
 * type-an-address-and-submit, and anyone who wants to correct the guess can. The
 * expansion is caused by user input, so it does not count toward CLS.
 *
 * Swapping providers later means changing that function; this component only
 * knows it posts an address, a role and some platform ids to an endpoint that
 * answers `{ ok: true }`.
 */
const props = withDefaults(defineProps<{
  /** `hero` sits on the gradient, `band` on a light section. */
  variant?: 'hero' | 'band'
}>(), { variant: 'hero' })

const ENDPOINT = '/api/early-access'

/**
 * Mirrors the app's own `AccountRole` — see `src/types/index.ts` and the role
 * cards in `src/pages/Onboarding.vue`, from which these labels are taken
 * verbatim and the hints shortened. The site should ask what onboarding asks.
 *
 * Learner is the default because every account is a learner, and an instructor
 * can switch into learner mode in the app, so the choice binds nobody.
 */
const ROLES = [
  { id: 'instructor', label: 'Instructor', hint: 'Author courses, review work, mentor' },
  { id: 'parent', label: 'Parent / Guardian', hint: 'Follow a child’s learning' },
] as const

/** Ids match `usePlatform`, so the detected platform maps straight onto one. */
const PLATFORMS = [
  { id: 'macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
] as const

type RoleId = 'learner' | typeof ROLES[number]['id']
type PlatformId = typeof PLATFORMS[number]['id']

const email = ref('')
const botField = ref('')
const role = ref<RoleId>('learner')
const chosen = ref<PlatformId[]>([])
const expanded = ref(false)
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const errorMessage = ref('')

// Detection reads the user agent and needs no network. `useDownload` would fetch
// every GitHub release to answer the same question.
const { platform: detected, label: detectedLabel } = usePlatform()

/**
 * Tick the detected platform once detection resolves. It settles in
 * `onMounted`, i.e. after first render, so this cannot be an initial value — and
 * it must not overwrite a choice already made, hence the `touched` guard.
 */
const touched = ref(false)
watch(detected, (value) => {
  if (touched.value || chosen.value.length > 0) return
  if (value !== 'unknown') chosen.value = [value as PlatformId]
}, { immediate: true })

/**
 * Learner is not one of the options — it is the floor. Choosing Instructor or
 * Parent adds to it, and choosing it again drops back to learner alone, which a
 * radio group cannot express (a radio cannot be unchecked by clicking it). Hence
 * buttons with `aria-pressed` rather than inputs.
 *
 * The stored value stays a single `role`, mirroring the app's `AccountRole`, so
 * the Plunk segments keep working unchanged.
 */
function toggleRole(id: typeof ROLES[number]['id']) {
  role.value = role.value === id ? 'learner' : id
}

function togglePlatform(id: PlatformId) {
  touched.value = true
  chosen.value = chosen.value.includes(id)
    ? chosen.value.filter(p => p !== id)
    : [...chosen.value, id]
}

async function submit() {
  if (state.value === 'sending') return

  const value = email.value.trim()
  if (!value || !value.includes('@')) {
    state.value = 'error'
    errorMessage.value = 'That address does not look right — check and try again.'
    return
  }
  if (chosen.value.length === 0) {
    // Only reachable if detection failed and they submitted without choosing.
    expanded.value = true
    state.value = 'error'
    errorMessage.value = 'Pick at least one platform, so we know what to tell you about.'
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
        role: role.value,
        platforms: chosen.value,
        detected: detected.value,
        botField: botField.value,
      }),
    })
    const body = await res.json().catch(() => ({})) as { ok?: boolean, error?: string }

    if (!res.ok || !body.ok) {
      state.value = 'error'
      // The function explains itself when it can — a bad address and an outage
      // are not the same problem and should not read the same.
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
    <!--
      The goal is tagged on the FORM, not on the submit button, and that is not a
      style choice. Plausible's click handler walks up from whatever was clicked
      and returns the moment it meets a `form` element:

          for (i = e.target, a = 0; a <= 3 && i; a++) {
            if (i.tagName && "form" === i.tagName.toLowerCase()) return
            ...
          }

      so a tagged control inside a form fires nothing, silently. Form conversions
      are read by a separate `submit` listener that looks at the form's own
      classes. `@submit.prevent` does not interfere: preventDefault stops the
      navigation, not the event, which still bubbles to Plausible's listener on
      document.

      Deliberately NOT `EarlyAccess` either. Every CTA on the site fires that one
      to open this dialog, so naming the completion the same thing counted each
      signup twice. Split, `EarlyAccess` is the top of the funnel and this is the
      bottom, and the ratio between them is a real conversion rate.
    -->
    <form
      v-if="state !== 'done'"
      class="ea-form plausible-event-name=EarlyAccess-Submit"
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
          :aria-expanded="expanded"
          aria-controls="ea-more"
          :disabled="state === 'sending'"
          @focus="expanded = true"
          @input="expanded = true"
        >
        <button type="submit" class="btn" :disabled="state === 'sending'">
          {{ state === 'sending' ? 'Adding you…' : 'Join the waiting list' }}
        </button>
      </div>

      <div v-if="expanded" id="ea-more" class="ea-more">
        <fieldset class="ea-set">
          <legend class="ea-legend">I'm joining as</legend>
          <div class="ea-chips" role="group" aria-label="Role">
            <span class="ea-chip on locked">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Learner
            </span>
            <button
              v-for="r in ROLES"
              :key="r.id"
              type="button"
              class="ea-chip"
              :class="{ on: role === r.id }"
              :aria-pressed="role === r.id"
              :title="r.hint"
              @click="toggleRole(r.id)"
            >{{ r.label }}</button>
          </div>
          <p class="ea-hint">Everyone is a learner, so that one stays on. Add another if you'll also teach or follow a child's learning — changeable in the app later.</p>
        </fieldset>

        <fieldset class="ea-set">
          <legend class="ea-legend">Platforms I'd use</legend>
          <div class="ea-chips">
            <label
              v-for="p in PLATFORMS"
              :key="p.id"
              class="ea-chip"
              :class="{ on: chosen.includes(p.id) }"
            >
              <input
                type="checkbox"
                name="ea-platforms"
                :value="p.id"
                :checked="chosen.includes(p.id)"
                @change="togglePlatform(p.id)"
              >
              <span>{{ p.label }}</span>
            </label>
          </div>
          <p class="ea-hint">
            {{ detected === 'unknown'
              ? 'Pick as many as you like.'
              : `We guessed ${detectedLabel} — change it if that's wrong, or add more.` }}
          </p>
        </fieldset>
      </div>

      <p class="ea-note" :class="{ 'ea-err': state === 'error' }" role="status" aria-live="polite">
        {{ state === 'error' ? errorMessage : 'This joins the waiting list, not the alpha — we email you when it’s your turn.' }}
      </p>
    </form>

    <div v-else class="ea-done" role="status" aria-live="polite">
      <span class="ea-tick" aria-hidden="true">✓</span>
      <div>
        <p class="ea-done-t">You're on the waiting list.</p>
        <p class="ea-note">
          Check your inbox — we've sent a confirmation. This doesn't open the alpha yet: we'll
          email you what to do next when we have apps on these platforms ready for you to take on
          a test drive. Don't worry! It's close :)
        </p>
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

/* Revealed once the visitor touches the email field. Faded in because it appears
   directly under their cursor and an instant jump reads as a glitch. The height
   is deliberately not reserved: shifts caused by input are excluded from CLS,
   and reserving it would put the de-cluttered hero back where it started. */
.ea-more {
  margin-top: 16px;
  display: grid;
  gap: 14px;
  text-align: start;
  animation: ea-reveal 200ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes ea-reveal {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ea-more { animation: none; }
}

.ea-set { border: 0; padding: 0; margin: 0; min-width: 0; }
.ea-legend {
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.ea-hero .ea-legend { color: rgb(255 255 255 / 0.8); }
.ea-band .ea-legend { color: rgb(var(--color-muted-foreground)); }

.ea-chips { display: flex; flex-wrap: wrap; gap: 7px; }

/* The native control keeps its place in the accessibility tree and its keyboard
   behaviour — arrow keys across the radio group, space on a checkbox. Only its
   painting is replaced by the chip. */
.ea-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-size: 13.5px;
  font-weight: 600;
  padding: 7px 13px;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}
.ea-chip input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
}
.ea-hero .ea-chip {
  background: rgb(255 255 255 / 0.12);
  border-color: rgb(255 255 255 / 0.2);
  color: rgb(255 255 255 / 0.86);
}
.ea-hero .ea-chip.on {
  background: rgb(255 255 255 / 0.92);
  border-color: rgb(255 255 255 / 0.92);
  color: rgb(var(--color-primary));
}
.ea-band .ea-chip {
  background: rgb(var(--color-card));
  border-color: rgb(var(--color-border));
  color: rgb(var(--color-foreground));
}
.ea-band .ea-chip.on {
  background: rgb(var(--color-primary));
  border-color: rgb(var(--color-primary));
  color: rgb(var(--color-primary-foreground));
}
/* Focus must show on the chip, since the input painting it is hidden. The role
   chips are buttons now and focus themselves, so both cases are covered. */
.ea-chip:has(input:focus-visible),
.ea-chip:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }

/* Learner is a statement, not a choice: it reads as selected, carries a tick, and
   does not invite a click. Not `disabled`, because it is not a control at all —
   a <span> keeps it out of the tab order without announcing a dead button. */
.ea-chip.locked { cursor: default; gap: 5px; }
.ea-chip.locked svg { width: 11px; height: 11px; }
button.ea-chip { font-family: inherit; }

.ea-hint { margin: 7px 0 0; font-size: 12px; line-height: 1.45; }
.ea-hero .ea-hint { color: rgb(255 255 255 / 0.62); }
.ea-band .ea-hint { color: rgb(var(--color-muted-foreground)); }

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
