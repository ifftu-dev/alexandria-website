<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Developers — Alexandria',
  meta: [
    { name: 'description', content: 'Source, credential format, architecture and licence. Alexandria’s core is MIT-licensed; credentials are W3C-style Verifiable Credentials signed under the holder’s own did:key.' },
    { property: 'og:title', content: 'Developers — Alexandria' },
    { property: 'og:description', content: 'Source, credential format, architecture and licence.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/developers' },
    { name: 'twitter:title', content: 'Developers — Alexandria' },
    { name: 'twitter:description', content: 'Source, credential format, architecture and licence.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/developers' }],
})

const GITHUB = 'https://github.com/ifftu-dev/alexandria'

/**
 * Deliberately concrete. A developer page that says "modern, secure, scalable"
 * tells a reader nothing they can check; naming the actual primitives lets them
 * disagree with the choices, which is the point of publishing them.
 */
const stack = [
  { area: 'Application', detail: 'Tauri v2 · Rust core · Vue 3 front end. One codebase, native on macOS, Windows, Linux, iOS and Android.', state: 'alpha' as const },
  { area: 'Storage', detail: 'SQLite via rusqlite, encrypted with SQLCipher. Everything a learner owns lives on their device.', state: 'alpha' as const },
  { area: 'Networking', detail: 'libp2p (gossipsub, Kademlia, QUIC) for peer discovery and messaging; iroh for content-addressed blobs.', state: 'alpha' as const },
  { area: 'Credentials', detail: 'W3C-style Verifiable Credentials, Ed25519 over JCS-canonicalised JSON, holder’s own did:key.', state: 'alpha' as const },
  { area: 'Plugins', detail: 'Sandboxed WebAssembly (wasmtime) with a frozen, permanence-oriented interface, so lesson types can be added without the app changing.', state: 'alpha' as const },
  { area: 'Anchoring', detail: 'Optional Cardano anchoring of credential hashes and governance outcomes. A credential stands on its signature without it.', state: 'building' as const },
]

const facts = [
  { k: 'Licence', v: 'MIT for the core; enterprise modules under the IFFTU Enterprise License. The split is by directory and stated in LICENSE.md.' },
  { k: 'Signature scheme', v: 'Detached JWS. Canonicalise the envelope with proof.jws emptied (RFC 8785), sign header + canonical bytes with Ed25519.' },
  { k: 'Identity', v: 'did:key — self-resolving, so verification needs no directory, registry or network call.' },
  { k: 'Content addressing', v: 'BLAKE3 hashes; lessons and media are shared between devices rather than served centrally.' },
]
</script>

<template>
  <div>
    <section class="hero hero-short">
      <MeshGradient :blobs="['79,70,229', '34,211,238', '99,102,241', '129,140,248', '79,70,229']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Developers</p>
        <h1>Read it before you believe it.</h1>
        <p class="hero-lede">
          The core is open source, the credential format is documented, and verification is
          reproducible without our cooperation. Everything below is checkable.
        </p>
        <div class="hero-cta">
          <a :href="GITHUB" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub btn">View the source</a>
          <NuxtLink to="/verify" class="btn-ghost">Verify a credential</NuxtLink>
        </div>
      </div>
    </section>

    <section class="pad section">
      <h2 class="h-sec">What it is built on</h2>
      <p class="p-sub">Named so you can argue with the choices.</p>
      <div class="d-rows">
        <div v-for="row in stack" :key="row.area" class="d-row">
          <div class="d-area">{{ row.area }}<StatusChip :state="row.state" /></div>
          <p class="d-detail">{{ row.detail }}</p>
        </div>
      </div>
    </section>

    <section class="pad section">
      <h2 class="h-sec">Credential format</h2>
      <p class="p-sub">
        Enough to write a conforming verifier — <NuxtLink to="/verify">ours runs in the browser</NuxtLink>
        and is about two hundred lines.
      </p>
      <dl class="d-facts">
        <template v-for="fact in facts" :key="fact.k">
          <dt>{{ fact.k }}</dt>
          <dd>{{ fact.v }}</dd>
        </template>
      </dl>
      <p class="p-sub">
        The normative specification lives with the project rather than on this page, so it cannot
        drift from the implementation:
        <a :href="`${GITHUB}#documentation`" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub">protocol specification and vision paper</a>.
      </p>
    </section>

    <section class="pad section">
      <h2 class="h-sec">Contributing</h2>
      <p class="p-sub" style="max-width: 70ch">
        The peer-to-peer protocol is implementation-complete and would benefit from adversarial
        testing at scale. The credential vault, identity system and the on-device integrity layer
        want independent review. Frontend test coverage is thin and known to be. None of that is a
        secret, and pretending otherwise would waste the time of the people best placed to help.
      </p>
      <div class="hero-cta" style="margin-top: 22px">
        <a :href="`${GITHUB}/issues`" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub btn">Open issues</a>
        <NuxtLink to="/trust" class="btn-ghost dark">Security and privacy</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-short { padding-bottom: clamp(46px, 7vw, 74px); }
.h-sec { font-size: clamp(21px, 3vw, 26px); letter-spacing: -0.02em; margin: 0 0 8px; }
.p-sub { margin: 0 0 22px; font-size: 14.5px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); max-width: 62ch; }
.p-sub a { color: rgb(var(--color-primary)); }

.d-rows { display: grid; gap: 1px; background: rgb(var(--color-border)); border: 1px solid rgb(var(--color-border)); border-radius: 12px; overflow: hidden; }
.d-row { background: rgb(var(--color-card)); padding: 16px 18px; }
.d-area { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 700; }
.d-detail { margin: 6px 0 0; font-size: 13.5px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }

.d-facts { display: grid; gap: 14px; margin: 0 0 22px; }
@media (min-width: 760px) { .d-facts { grid-template-columns: max-content 1fr; gap: 12px 24px; } }
.d-facts dt { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: rgb(var(--color-muted-foreground)); }
.d-facts dd { margin: 0; font-size: 14px; line-height: 1.6; }

.btn-ghost.dark { border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-foreground)); background: rgb(var(--color-card)); backdrop-filter: none; }
.btn-ghost.dark:hover { background: rgb(var(--color-muted)); }
</style>
