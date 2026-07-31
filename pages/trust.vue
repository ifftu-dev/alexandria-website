<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Trust — Alexandria',
  meta: [
    { name: 'description', content: 'What Alexandria can and cannot claim today: security review status, data handling, compliance posture, and where the infrastructure actually sits.' },
    { property: 'og:title', content: 'Trust — Alexandria' },
    { property: 'og:description', content: 'Security status, data handling and compliance posture — dated, not asserted.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/trust' },
    { name: 'twitter:title', content: 'Trust — Alexandria' },
    { name: 'twitter:description', content: 'Security status, data handling and compliance posture.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/trust' }],
})

/**
 * Every row carries a date and a status rather than an adjective. A compliance
 * claim without a date is a claim that quietly expires.
 */
const posture = [
  { area: 'Security review', status: 'A full review of the Rust core, Tauri configuration, dependencies and frontend was carried out in February 2026: 32 findings, of which 21 were fixed as of the March remediation pass.', state: 'building' as const },
  { area: 'Independent audit', status: 'Not yet commissioned. The credential vault, identity system and integrity layer are the areas we would want reviewed first.', state: 'planned' as const },
  { area: 'FERPA', status: 'Readiness work in progress. Not certified, and nobody has assessed us against it.', state: 'building' as const },
  { area: 'GDPR', status: 'The architecture helps — personal data stays on the learner’s device — but a deployment still needs its own assessment. No DPA is published yet.', state: 'building' as const },
  { area: 'Accessibility', status: 'No formal WCAG audit has been done. The interface needs design work generally, and this is part of it.', state: 'planned' as const },
  { area: 'Service levels', status: 'None offered. There is no managed service to attach them to yet.', state: 'planned' as const },
]

const dataFacts = [
  { k: 'Where learner data lives', v: 'On the learner’s device, in an encrypted SQLite database. Not on our servers, because there are no servers holding it.' },
  { k: 'What relays see', v: 'Relays help peers find each other. They carry no authority over what passes through them, anyone can run one, and a deployment can use its own.' },
  { k: 'What this website collects', v: 'An email address if you join the waiting list or send an enquiry, plus the role and platforms you pick. Analytics are cookieless and carry no personal identifiers.' },
  { k: 'Credential verification', v: 'Runs in your browser. A credential you check on this site is never uploaded — there is nowhere for it to go.' },
]
</script>

<template>
  <div class="page-accent">
    <section class="hero hero-page">
      <MeshGradient :blobs="['79,70,229', '99,102,241', '34,211,238', '129,140,248', '79,70,229']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Trust</p>
        <h1>What we can claim today.</h1>
        <p class="hero-lede">
          Dated statuses instead of adjectives. If something is not reviewed, certified or built,
          this page says so — that is more useful to you than a badge.
        </p>
      </div>
    </section>

    <section class="section pad">
      <h2 class="h-sec">Security and compliance posture</h2>
      <p class="p-sub">Last reviewed 31 July 2026.</p>
      <div class="t-rows">
        <div v-for="row in posture" :key="row.area" class="t-row">
          <div class="t-area">{{ row.area }}<StatusChip :state="row.state" /></div>
          <p>{{ row.status }}</p>
        </div>
      </div>
    </section>

    <section class="section pad section-wash">
      <h2 class="h-sec">Where the data is</h2>
      <dl class="t-facts">
        <template v-for="f in dataFacts" :key="f.k">
          <dt>{{ f.k }}</dt><dd>{{ f.v }}</dd>
        </template>
      </dl>
      <p class="p-sub" style="margin-top: 20px">
        The full policy for this website is on the <NuxtLink to="/privacy">privacy page</NuxtLink>.
        The implementation is in <NuxtLink to="/technology">the technology page</NuxtLink>.
      </p>
    </section>

    <section class="section pad">
      <h2 class="h-sec">Reporting something</h2>
      <p class="p-sub">
        Security findings go to <a href="mailto:admin@ifftu.dev">admin@ifftu.dev</a>. We would rather
        hear it from you than read about it later, and we will credit you unless you ask us not to.
      </p>
    </section>
  </div>
</template>

<style scoped>
.h-sec { font-size: clamp(21px, 3vw, 26px); letter-spacing: -0.02em; margin: 0 0 8px; }
.p-sub { margin: 0 0 22px; font-size: 14.5px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); max-width: 68ch; }
.p-sub a { color: rgb(var(--color-primary)); }
.t-rows { display: grid; gap: 1px; background: rgb(var(--color-border)); border: 1px solid rgb(var(--color-border)); border-radius: 12px; overflow: hidden; }
.t-row { background: rgb(var(--color-card)); padding: 16px 18px; }
.t-area { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13.5px; font-weight: 700; }
.t-row p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }
.t-facts { display: grid; gap: 14px; margin: 0; }
@media (min-width: 760px) { .t-facts { grid-template-columns: max-content 1fr; gap: 12px 24px; } }
.t-facts dt { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: rgb(var(--color-muted-foreground)); }
.t-facts dd { margin: 0; font-size: 14px; line-height: 1.65; }
</style>
