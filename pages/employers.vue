<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'For employers — Alexandria',
  meta: [
    { name: 'description', content: 'Verify skill credentials independently, inspect the evidence a candidate chooses to share, and bring proof into the hiring process you already run.' },
    { property: 'og:title', content: 'For employers — Alexandria' },
    { property: 'og:description', content: 'Hire from proof, not claims. Verify credentials independently, with candidate consent.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/employers' },
    { name: 'twitter:title', content: 'For employers — Alexandria' },
    { name: 'twitter:description', content: 'Hire from proof, not claims.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/employers' }],
})

/**
 * Packaging, deliberately without prices. The brief that proposed these names
 * had no access to the financial model, and a price published now is a price
 * retracted later.
 */
const packages = [
  { name: 'Verify', value: 'Check any credential and its signature. No account, nothing to buy.', basis: 'Free, permanently', state: 'alpha' as const },
  { name: 'Team', value: 'Shared evidence review, saved requirements, and a record of who decided what.', basis: 'Per seat or per team', state: 'planned' as const },
  { name: 'Integration', value: 'ATS connectors, a verification API, webhooks, bulk verification.', basis: 'Usage or annual platform fee', state: 'planned' as const },
  { name: 'Enterprise', value: 'SSO, audit logs, policy controls, dedicated support, custom deployment.', basis: 'Annual contract', state: 'planned' as const },
]

const flow = [
  { step: 'The candidate shares', body: 'They send a credential, or a link to one. Nothing is published to a searchable index without them choosing it.' },
  { step: 'You verify it', body: 'The signature checks against the issuer’s key. No Alexandria account, no call to us — you can do it on this site right now.' },
  { step: 'You inspect what they revealed', body: 'A credential carries the evidence the holder chose to include: the assessment, the level reached, when it was earned.' },
  { step: 'You decide, in your own tools', body: 'The result belongs in your ATS and your process. Connectors are planned; today it is a verified file and a link.' },
]
</script>

<template>
  <div>
    <section class="hero hero-short">
      <MeshGradient :blobs="['14,159,110', '34,211,238', '16,185,129', '45,212,191', '59,130,246']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">For employers</p>
        <h1>Hire from proof, not claims.</h1>
        <p class="hero-lede">
          Verify a skill credential independently, see the evidence a candidate chose to share, and
          keep the decision inside the process you already run.
        </p>
        <div class="hero-cta">
          <NuxtLink to="/pilots?for=employer" class="btn btn-lg">Start an employer pilot</NuxtLink>
          <NuxtLink to="/verify" class="btn-ghost">Verify a sample credential</NuxtLink>
        </div>
      </div>
    </section>

    <section class="pad section">
      <div class="notice">
        <b>What works today:</b> independent verification of any Alexandria credential, by anyone, with
        no account — <NuxtLink to="/verify">including on this site</NuxtLink>. Team tools, ATS
        integrations and candidate discovery are not built yet and are labelled accordingly below.
      </div>
    </section>

    <section class="pad section">
      <h2 class="h-sec">Consent comes first, then discovery</h2>
      <p class="p-sub">
        A searchable pool of candidates is a promise about other people's data, so it is worth being
        exact about the order. Credentials live on the learner's device. Nothing is discoverable
        because it exists — only because its holder chose to publish or send it. The first product
        here is verification inside a hiring process you already have, not a marketplace.
      </p>
      <ol class="e-flow">
        <li v-for="f in flow" :key="f.step">
          <b>{{ f.step }}</b>
          <span>{{ f.body }}</span>
        </li>
      </ol>
    </section>

    <section class="pad section">
      <div class="e-demo-h">
        <h2 class="h-sec">What a verified requirement looks like</h2>
        <StatusChip state="sample" />
      </div>
      <p class="p-sub">
        Composite skill queries with proficiency levels and confidence thresholds. Sample data —
        there is no candidate pool behind it, and there will not be one until consent is designed
        properly.
      </p>
      <SkillQuery />
    </section>

    <section class="pad section">
      <h2 class="h-sec">Packaging</h2>
      <p class="p-sub">
        Named so you can tell what would be paid for. Prices are not published because they are not
        settled — when they are, they will appear here rather than in a quote that varies by who is
        asking.
      </p>
      <div class="e-packs">
        <div v-for="p in packages" :key="p.name" class="e-pack">
          <div class="e-pack-h"><h3>{{ p.name }}</h3><StatusChip :state="p.state" /></div>
          <p>{{ p.value }}</p>
          <p class="e-basis">{{ p.basis }}</p>
        </div>
      </div>
      <p class="p-sub" style="margin-top: 18px">
        Candidates are never charged — not to be discovered, not to share a credential, not to have
        one verified. That is the line that makes the rest of it defensible.
      </p>
    </section>

    <section class="pad section">
      <h2 class="h-sec">Start an employer pilot</h2>
      <p class="p-sub">One role family, a real requisition, and measures agreed up front.</p>
      <div class="e-form"><EnquiryForm audience="employer" /></div>
    </section>
  </div>
</template>

<style scoped>
.hero-short { padding-bottom: clamp(46px, 7vw, 74px); }
.h-sec { font-size: clamp(21px, 3vw, 26px); letter-spacing: -0.02em; margin: 0 0 8px; }
.p-sub { margin: 0 0 22px; font-size: 14.5px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); max-width: 68ch; }
.p-sub a, .notice a { color: rgb(var(--color-primary)); }
.notice { border: 1px solid rgb(var(--color-border)); border-inline-start: 3px solid rgb(var(--color-primary)); border-radius: 10px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); background: rgb(var(--color-card)); }
.e-flow { margin: 0; padding-inline-start: 20px; display: grid; gap: 14px; max-width: 72ch; }
.e-flow li { font-size: 14.5px; line-height: 1.6; }
.e-flow b { display: block; }
.e-flow span { color: rgb(var(--color-muted-foreground)); }
.e-packs { display: grid; gap: 14px; }
@media (min-width: 780px) { .e-packs { grid-template-columns: repeat(2, 1fr); } }
.e-pack { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 18px; background: rgb(var(--color-card)); }
.e-pack-h { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.e-pack-h h3 { margin: 0; font-size: 15.5px; }
.e-pack p { margin: 0; font-size: 14px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }
.e-basis { margin-top: 8px !important; font-size: 12.5px !important; font-weight: 600; color: rgb(var(--color-foreground)) !important; }
.e-form { max-width: 620px; }
.e-demo-h { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
.e-demo-h .h-sec { margin-bottom: 0; }
</style>
