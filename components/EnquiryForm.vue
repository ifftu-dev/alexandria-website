<script setup lang="ts">
/**
 * Pilot and partnership enquiries.
 *
 * Deliberately not the learner waitlist. A hiring lead and someone waiting for
 * a build want different things and must not share a list — so these post to
 * their own endpoints (`/api/pilot`, `/api/partner`) and land in their own Plunk
 * segments. The learner form stays at `/api/early-access`.
 *
 * Every field beyond the address is optional. The point is to start a
 * conversation, not to qualify someone out of one at the first screen.
 */
const props = withDefaults(defineProps<{
  audience: 'employer' | 'institution' | 'partner'
  variant?: 'card' | 'bare'
}>(), { variant: 'card' })

const ENDPOINTS: Record<string, string> = {
  employer: '/api/pilot',
  institution: '/api/pilot',
  partner: '/api/partner',
}

const COHORTS: Record<string, { value: string, label: string }[]> = {
  employer: [
    { value: 'exploring', label: 'Still exploring' },
    { value: '1-25', label: 'Up to 25 hires a year' },
    { value: '25-200', label: '25–200 a year' },
    { value: '200+', label: '200+ a year' },
  ],
  institution: [
    { value: 'exploring', label: 'Still exploring' },
    { value: '50-250', label: '50–250 learners' },
    { value: '250-2000', label: '250–2,000 learners' },
    { value: '2000+', label: '2,000+ learners' },
  ],
  partner: [
    { value: 'exploring', label: 'Still exploring' },
    { value: 'single', label: 'A single site or program' },
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'National' },
  ],
}

const email = ref('')
// Deliberately not `organization`, despite the label above it reading that way.
// This name is the wire format: it is the JSON key the front end posts, the key
// `netlify/functions/enquiry.ts` parses, the field stored on every Plunk contact
// collected so far, and what `tests/e2e/plunk.spec.ts` asserts. Renaming it would
// split the contact data and break the front end against the deployed function
// for as long as the two were out of step. The label is what a reader sees; this
// is what the wire carries.
const organisation = ref('')
const role = ref('')
const context = ref('')
const cohort = ref('exploring')
const botField = ref('')
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const errorMessage = ref('')

const cohortLabel = computed(() => (props.audience === 'partner' ? 'Scale' : 'Rough size'))
const cohorts = computed(() => COHORTS[props.audience]!)

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
    const res = await fetch(ENDPOINTS[props.audience]!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: value,
        audience: props.audience,
        organisation: organisation.value.trim(),
        role: role.value.trim(),
        context: context.value.trim(),
        cohort: cohort.value,
        source: useRoute().path,
        botField: botField.value,
      }),
    })
    const body = await res.json().catch(() => ({})) as { ok?: boolean, error?: string }
    if (!res.ok || !body.ok) {
      state.value = 'error'
      errorMessage.value = body.error ?? 'Could not send that just now. Try again in a moment.'
      return
    }
    state.value = 'done'
  }
  catch {
    state.value = 'error'
    errorMessage.value = 'Could not reach us. Try again in a moment.'
  }
}
</script>

<template>
  <div class="eq" :class="`eq-${props.variant}`">
    <!--
      Tagged on the form, not the button. Plausible's click handler returns as
      soon as it walks up into a `form`, so a goal class on a control inside one
      fires nothing at all — this goal recorded zero conversions for as long as it
      sat on the submit. Form conversions are read by a separate `submit`
      listener that looks at the form's own classes; see EarlyAccessForm.vue for
      the relevant few lines of their script.
    -->
    <form v-if="state !== 'done'" class="plausible-event-name=Enquiry" @submit.prevent="submit">
      <p class="eq-bot">
        <label>Leave this field empty<input v-model="botField" name="bot-field" tabindex="-1" autocomplete="off"></label>
      </p>

      <div class="eq-grid">
        <label class="eq-field">
          <span>Work email</span>
          <input v-model="email" type="email" required autocomplete="email" placeholder="you@organization.org">
        </label>
        <label class="eq-field">
          <span>Organization</span>
          <input v-model="organisation" type="text" autocomplete="organization" placeholder="Optional">
        </label>
        <label class="eq-field">
          <span>Your role</span>
          <input v-model="role" type="text" autocomplete="organization-title" placeholder="Optional">
        </label>
        <label class="eq-field">
          <span>{{ cohortLabel }}</span>
          <select v-model="cohort">
            <option v-for="c in cohorts" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </label>
      </div>

      <label class="eq-field">
        <span>What are you trying to do?</span>
        <textarea v-model="context" rows="3" placeholder="Optional. A sentence is plenty." />
      </label>

      <button type="submit" class="btn eq-submit" :disabled="state === 'sending'">
        {{ state === 'sending' ? 'Sending…' : 'Start the conversation' }}
      </button>
      <p class="eq-note" :class="{ 'eq-err': state === 'error' }" role="status" aria-live="polite">
        {{ state === 'error'
          ? errorMessage
          : 'Goes to a person, not a sales sequence. We reply or we say no — no drip campaign either way.' }}
      </p>
    </form>

    <div v-else class="eq-done" role="status" aria-live="polite">
      <p class="eq-done-t">Thanks — that reached us.</p>
      <p class="eq-note">
        You'll get a reply from a person. If a pilot doesn't make sense yet, we'll say so rather
        than keep you warm.
      </p>
    </div>
  </div>
</template>

<style scoped>
.eq-card {
  border: 1px solid rgb(var(--color-border));
  border-radius: 14px;
  padding: 22px;
  background: rgb(var(--color-card));
}
.eq-grid { display: grid; gap: 14px; }
@media (min-width: 640px) { .eq-grid { grid-template-columns: 1fr 1fr; } }

.eq-field { display: block; margin-bottom: 14px; }
.eq-field > span {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgb(var(--color-muted-foreground));
  margin-bottom: 6px;
}
.eq-field input, .eq-field select, .eq-field textarea {
  width: 100%;
  font-family: inherit;
  font-size: 14.5px;
  padding: 10px 13px;
  border-radius: 10px;
  border: 1px solid rgb(var(--color-border));
  background: rgb(var(--color-background));
  color: rgb(var(--color-foreground));
  min-height: 42px;
}
.eq-field textarea { resize: vertical; line-height: 1.55; }
.eq-field input:focus, .eq-field select:focus, .eq-field textarea:focus {
  outline: none;
  border-color: rgb(var(--color-primary));
}
.eq-grid .eq-field { margin-bottom: 0; }
.eq-grid + .eq-field { margin-top: 14px; }

.eq-note { margin: 12px 0 0; font-size: 12.5px; line-height: 1.55; color: rgb(var(--color-muted-foreground)); }
.eq-err { color: rgb(var(--color-no)); }
.eq-bot { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }

.eq-done-t { margin: 0; font-size: 16px; font-weight: 700; }
</style>
