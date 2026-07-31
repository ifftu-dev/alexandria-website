<script setup lang="ts">
/**
 * The claim "anyone can check a credential without asking us", made executable.
 *
 * Verification runs entirely in this page — see `utils/credential.ts`. Nothing
 * is uploaded, because there is nothing to upload to; a credential pasted here
 * never leaves the tab. That is worth saying plainly on the page, since a
 * verifier that quietly posted credentials to a server would invert the whole
 * promise.
 */
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Verify a credential — Alexandria',
  meta: [
    { name: 'description', content: 'Check an Alexandria credential yourself. The signature is verified in your browser against the issuer’s key — no account, no upload, nothing sent anywhere.' },
    { property: 'og:title', content: 'Verify a credential — Alexandria' },
    { property: 'og:description', content: 'Check an Alexandria credential in your own browser. No account, no upload.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/verify' },
    { name: 'twitter:title', content: 'Verify a credential — Alexandria' },
    { name: 'twitter:description', content: 'Check an Alexandria credential in your own browser. No account, no upload.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/verify' }],
})

const input = ref('')
const outcome = ref<VerifyOutcome | null>(null)
const busy = ref(false)
const dragging = ref(false)

async function run() {
  if (!input.value.trim()) return
  busy.value = true
  outcome.value = null
  try {
    const parsed = JSON.parse(input.value)
    outcome.value = await verifyCredential(parsed)
  }
  catch {
    outcome.value = {
      valid: false,
      checks: [],
      error: 'That is not valid JSON. Paste the whole credential file, including the outer braces.',
    }
  }
  finally {
    busy.value = false
  }
}

async function loadSample() {
  const res = await fetch('/sample-credential.json')
  input.value = JSON.stringify(await res.json(), null, 2)
  await run()
}

/** Tamper with the loaded credential, to show the check has teeth. */
async function tamper() {
  try {
    const vc = JSON.parse(input.value)
    if (!vc.credentialSubject) return
    vc.credentialSubject.level = vc.credentialSubject.level === 'Create' ? 'Apply' : 'Create'
    input.value = JSON.stringify(vc, null, 2)
    await run()
  }
  catch { /* nothing loaded yet */ }
}

async function onDrop(event: DragEvent) {
  dragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  input.value = await file.text()
  await run()
}

const hasSubject = computed(() => Boolean(outcome.value?.subject || outcome.value?.claim))
</script>

<template>
  <div>
    <section class="hero hero-short">
      <MeshGradient />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Verify</p>
        <h1>Check a credential yourself.</h1>
        <p class="hero-lede">
          Paste a credential and this page checks its signature against the issuer's own key —
          in your browser, with no account and nothing sent anywhere.
        </p>
      </div>
    </section>

    <section class="pad section">
      <div class="v-grid">
        <div>
          <div class="v-head">
            <h2 class="h-sec">The credential</h2>
            <StatusChip state="alpha" label="Working now" />
          </div>

          <div
            class="v-drop"
            :class="{ on: dragging }"
            @dragover.prevent="dragging = true"
            @dragleave="dragging = false"
            @drop.prevent="onDrop"
          >
            <label class="sr-only" for="vc-input">Credential JSON</label>
            <textarea
              id="vc-input"
              v-model="input"
              spellcheck="false"
              placeholder="Paste credential JSON here, or drop the file."
            />
          </div>

          <div class="v-actions">
            <button type="button" class="btn" :disabled="busy || !input.trim()" @click="run">
              {{ busy ? 'Checking…' : 'Verify' }}
            </button>
            <button type="button" class="btn-ghost dark" @click="loadSample">Load a sample</button>
            <button v-if="input.trim()" type="button" class="btn-ghost dark" @click="tamper">
              Alter it
            </button>
          </div>
          <p class="v-note">
            Altering the sample changes one claim in it — the signature fails immediately, which is
            the entire point of a credential you can check.
          </p>
        </div>

        <div>
          <div class="v-head">
            <h2 class="h-sec">Result</h2>
          </div>

          <div v-if="!outcome" class="v-empty">
            <p>Nothing checked yet.</p>
            <p class="v-note">Load the sample if you don't have a credential to hand.</p>
          </div>

          <div v-else class="v-result" :class="outcome.valid ? 'ok' : 'no'">
            <p class="v-verdict">
              <span aria-hidden="true">{{ outcome.valid ? '✓' : '✕' }}</span>
              {{ outcome.valid ? 'Signature valid' : 'Not valid' }}
            </p>
            <p v-if="outcome.error" class="v-err">{{ outcome.error }}</p>

            <dl v-if="hasSubject" class="v-meta">
              <template v-if="outcome.issuer">
                <dt>Issued by</dt><dd class="mono">{{ outcome.issuer }}</dd>
              </template>
              <template v-if="outcome.subject">
                <dt>Held by</dt><dd class="mono">{{ outcome.subject }}</dd>
              </template>
              <template v-if="outcome.claim">
                <dt>Claim</dt><dd>{{ outcome.claim }}</dd>
              </template>
            </dl>

            <ul v-if="outcome.checks.length" class="v-checks">
              <li v-for="check in outcome.checks" :key="check.id" :class="check.state">
                <span class="v-mark" aria-hidden="true">
                  {{ check.state === 'pass' ? '✓' : check.state === 'fail' ? '✕' : '–' }}
                </span>
                <span>
                  <b>{{ check.label }}</b>
                  <span class="v-detail">{{ check.detail }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="v-explain">
        <h2 class="h-sec">What just happened</h2>
        <ol class="v-steps">
          <li>
            <b>The issuer's key came out of the credential itself.</b>
            An Alexandria issuer is a <span class="mono">did:key</span>, which carries its own public
            key. There is no key server to ask and no directory to trust.
          </li>
          <li>
            <b>The credential was canonicalised.</b>
            Field order does not change meaning, so the bytes are normalised (RFC 8785) before
            checking — reorder the fields and it still verifies; change a value and it does not.
          </li>
          <li>
            <b>The signature was checked with Ed25519.</b>
            This is the same procedure the app performs, reimplemented here. If it passes, the
            credential is exactly as the issuer signed it.
          </li>
        </ol>
        <p class="v-note">
          Two things this page does not do, and says so in the results rather than passing them
          quietly: it does not fetch the issuer's revocation list, and it does not query the chain
          for an anchor. Both need data a static page cannot have. The signature stands on its own
          either way — that is what makes a credential portable.
        </p>
        <p class="v-note">
          <NuxtLink to="/developers">The credential format and source</NuxtLink> if you would rather
          read the implementation than trust this page.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-short { padding-bottom: clamp(46px, 7vw, 74px); }
.v-grid { display: grid; gap: 26px; }
@media (min-width: 900px) { .v-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }

.v-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.h-sec { font-size: 15px; font-weight: 700; margin: 0; }

.v-drop {
  border: 1px dashed rgb(var(--color-border));
  border-radius: 12px;
  padding: 4px;
  transition: border-color 150ms ease, background 150ms ease;
}
.v-drop.on { border-color: rgb(var(--color-primary)); background: rgb(var(--color-primary) / 0.05); }
.v-drop textarea {
  width: 100%;
  min-height: 260px;
  resize: vertical;
  border: 0;
  outline: none;
  background: transparent;
  color: rgb(var(--color-foreground));
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  padding: 12px;
}

.v-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.btn-ghost.dark {
  border: 1px solid rgb(var(--color-border));
  color: rgb(var(--color-foreground));
  background: rgb(var(--color-card));
  backdrop-filter: none;
}
.btn-ghost.dark:hover { background: rgb(var(--color-muted)); }

.v-note { margin: 10px 0 0; font-size: 12.5px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }
.v-note a { color: rgb(var(--color-primary)); }

.v-empty, .v-result {
  border: 1px solid rgb(var(--color-border));
  border-radius: 12px;
  padding: 18px;
  background: rgb(var(--color-card));
}
.v-empty p { margin: 0; font-size: 14px; color: rgb(var(--color-muted-foreground)); }
.v-result.ok { border-color: rgb(var(--color-ok) / 0.5); }
.v-result.no { border-color: rgb(var(--color-no) / 0.5); }

.v-verdict { margin: 0; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 9px; }
.v-result.ok .v-verdict { color: rgb(var(--color-ok)); }
.v-result.no .v-verdict { color: rgb(var(--color-no)); }
.v-err { margin: 8px 0 0; font-size: 13px; color: rgb(var(--color-no)); }

.v-meta { display: grid; grid-template-columns: max-content 1fr; gap: 4px 14px; margin: 16px 0 0; }
.v-meta dt { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: rgb(var(--color-muted-foreground)); padding-top: 2px; }
.v-meta dd { margin: 0; font-size: 12.5px; line-height: 1.5; word-break: break-all; }

.v-checks { list-style: none; margin: 16px 0 0; padding: 14px 0 0; border-top: 1px solid rgb(var(--color-border)); display: grid; gap: 10px; }
.v-checks li { display: flex; gap: 10px; font-size: 12.5px; line-height: 1.5; }
.v-mark { flex: none; width: 15px; font-weight: 700; }
.v-checks li.pass .v-mark { color: rgb(var(--color-ok)); }
.v-checks li.fail .v-mark { color: rgb(var(--color-no)); }
.v-checks li.skip .v-mark { color: rgb(var(--color-muted-foreground)); }
.v-checks b { display: block; font-size: 12.5px; }
.v-detail { display: block; color: rgb(var(--color-muted-foreground)); margin-top: 1px; }

.v-explain { margin-top: 42px; max-width: 74ch; }
.v-steps { margin: 12px 0 0; padding-inline-start: 20px; display: grid; gap: 12px; }
.v-steps li { font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }
.v-steps b { color: rgb(var(--color-foreground)); font-weight: 600; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap;
}
</style>
