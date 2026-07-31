<script setup lang="ts">
/**
 * The employer case, following the mockup's flow: evidence, then the problem
 * they already have, then the mechanism, then money, then the admission that
 * nobody has hired through this.
 *
 * The route stays `/employers` rather than the brief's `/recruiter`. "Recruiter"
 * reads as agency, the audience here is anyone hiring, and the site already
 * migrated off that path once — moving it back would break the links a second
 * time to no benefit.
 *
 * Pricing is the one thing held back. The brief's figures came from an investor
 * deck and its own handoff notes flag them as needing clearance before
 * publication; see the comment on `packages` below.
 */
import { RECOGNITION_GAP, SOURCES } from '~/content/evidence'

definePageMeta({ layout: 'landing' })

useHead({
  title: 'For employers — Alexandria',
  meta: [
    { name: 'description', content: 'A resume is a claim. An Alexandria credential is a signed record of an assessment you can open, inspect and verify yourself — without asking us, and without taking the candidate’s word for it.' },
    { property: 'og:title', content: 'For employers — Alexandria' },
    { property: 'og:description', content: 'Hire verified talent, not resumes. Verify credentials independently, with candidate consent.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/employers' },
    { name: 'twitter:title', content: 'For employers — Alexandria' },
    { name: 'twitter:description', content: 'Hire verified talent, not resumes.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/employers' }],
})

const problems = [
  { n: '01', k: 'Screening', t: 'The degree filter is a blunt proxy', b: 'It removes most of the working population to approximate a capability you could simply measure.' },
  { n: '02', k: 'Assessment', t: 'You pay to re-discover known facts', b: 'The candidate has probably proven this exact skill before. You have no way to see it, so you buy the test again.' },
  { n: '03', k: 'Trust', t: 'Certificates are unverifiable', b: 'A PDF badge proves nothing about who sat the assessment, or whether it was ever passed at all.' },
]

const steps = [
  { n: '01', t: 'Search on skill', b: 'Query the public skill map directly — welding.pipe.6g · apply — not job titles or keywords.', state: 'planned' as const },
  { n: '02', t: 'Candidate consents', b: 'Nothing is visible without the holder choosing to reveal it, and they reveal only the parts they choose.', state: 'planned' as const },
  { n: '03', t: 'Verify it yourself', b: 'Check the signature with our tooling, your own, or any W3C-compliant verifier. No API call to us required.', state: 'alpha' as const },
  { n: '04', t: 'See the whole record', b: 'Behind each credential: what was assessed, how it was scored, and the integrity signals at the time.', state: 'alpha' as const },
]

/**
 * Deliberately without figures. The brief priced placement at 8–12% of first-year
 * compensation against a 15–25% contingency benchmark, and its own handoff marks
 * that as "confirm before publishing — came from the investor deck". A published
 * price is very hard to walk back, and the current position — that pricing is not
 * settled — is a stronger one than a number that later moves.
 */
const packages = [
  { name: 'Placement', value: 'Priced against the standard contingency range, and below it. The figure is not settled, so it is not published yet.', state: 'planned' as const },
  { name: 'Hiring assessments', value: 'Run your own assessments on the platform, or accept credentials the candidate already holds.', state: 'planned' as const },
  { name: 'Verification', value: 'Per-check verification at scale for high-volume screening. Offline checking is always free.', state: 'planned' as const },
]
</script>

<template>
  <div class="page-employer">
    <section class="hero hero-page">
      <MeshGradient :blobs="['14,159,110', '34,211,238', '16,185,129', '45,212,191', '59,130,246']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">For recruiters &amp; employers</p>
        <h1>Hire verified talent, not resumes.</h1>
        <p class="hero-lede">
          A resume is a claim. A credential on Alexandria is a signed record of an assessment you can
          open, inspect and verify yourself — without asking us, and without taking the candidate’s
          word for it.
        </p>
        <div class="hero-cta">
          <a href="#talk" class="btn btn-lg">Become a design partner</a>
          <NuxtLink to="/verify" class="btn-ghost">How verification works</NuxtLink>
        </div>
        <p class="e-prenote">
          Pre-launch. We are looking for a small number of employers to build this with, not to sell
          to.
        </p>
      </div>
    </section>

    <!-- ═══ EVIDENCE BAND ═══ -->
    <section class="gap">
      <div class="pad">
        <div class="gap-figs">
          <div v-for="f in RECOGNITION_GAP.slice(1)" :key="f.id" class="gap-fig">
            <p class="gap-n">{{ f.value }}</p>
            <p class="gap-l">{{ f.label }}</p>
          </div>
        </div>
        <div class="gap-foot">
          <p class="gap-src">{{ SOURCES.bgi2024!.line }}</p>
          <NuxtLink to="/why-recognition" class="plausible-event-name=Nav-Evidence chev">
            Read the evidence in full <i>›</i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ THE PROBLEM ═══ -->
    <section class="section pad">
      <p class="eyebrow">The problem you already have</p>
      <h2 class="h-sec">Everyone re-tests every candidate, from scratch, forever.</h2>
      <p class="p-sub">
        Your assessment budget exists because nothing a candidate brings with them can be trusted.
        That work is duplicated at every company the candidate applies to, and paid for every time.
      </p>
      <div class="prob">
        <article v-for="p in problems" :key="p.n" class="prob-card">
          <p class="prob-n">{{ p.n }} / {{ p.k }}</p>
          <h3>{{ p.t }}</h3>
          <p>{{ p.b }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">How it works</p>
      <h2 class="h-sec">Search a skill. Check the proof yourself. Talk to the person.</h2>
      <div class="e-steps">
        <article v-for="s in steps" :key="s.n" class="e-step">
          <p class="prob-n">{{ s.n }}</p>
          <h3>{{ s.t }}</h3>
          <p>{{ s.b }}</p>
          <StatusChip :state="s.state" />
        </article>
      </div>

      <div class="e-cand">
        <div class="e-cand-h">
          <b>Candidate view · shared with your consent</b>
          <StatusChip state="sample" />
        </div>
        <div class="e-cand-g">
          <div>
            <p class="e-cand-k">Skill</p>
            <p class="mono e-cand-v">welding.pipe.6g</p>
            <p class="e-cand-s">Bloom level: apply</p>
          </div>
          <div>
            <p class="e-cand-k">Assessed</p>
            <p class="e-cand-v">On device, 14 March 2026</p>
            <p class="e-cand-s">Integrity score 0.94 · high</p>
          </div>
          <div>
            <p class="e-cand-k">Issued by</p>
            <p class="mono e-cand-v">did:key:z6Mkha…QYtP</p>
            <p class="e-cand-s">Signature checks without us</p>
          </div>
          <div>
            <p class="e-cand-k">Not shared</p>
            <p class="e-cand-v">11 other credentials</p>
            <p class="e-cand-s">Selective disclosure is the default</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ COMMERCIALLY ═══ -->
    <section class="section pad">
      <p class="eyebrow">Commercially</p>
      <h2 class="h-sec">You are the side that pays. That is deliberate.</h2>
      <p class="p-sub">
        Learners are never charged — not for courses, not for assessments, not for the credential.
        The commons is funded by the people who get commercial value from it, which is you, and forty
        per cent of what we earn goes to the educators who built the skills you are hiring on. The
        trade is straightforward: you get a verified talent pool that costs less to screen, and the
        pool stays free to grow.
      </p>
      <div class="e-packs">
        <div v-for="p in packages" :key="p.name" class="e-pack">
          <div class="e-pack-h"><h3>{{ p.name }}</h3><StatusChip :state="p.state" /></div>
          <p>{{ p.value }}</p>
        </div>
      </div>
      <p class="e-priced">
        Nothing here is purchasable yet, and no rate card is published. When prices are settled they
        will appear on this page rather than in a quote that varies by who is asking.
      </p>
    </section>

    <!-- ═══ STRAIGHT WITH YOU ═══ -->
    <section id="talk" class="section pad section-wash">
      <p class="eyebrow">Straight with you</p>
      <h2 class="h-sec">Nobody has hired through this yet.</h2>
      <div class="e-close">
        <div class="t-prose">
          <p>
            The platform is pre-launch, there are no candidates on it, and whether employers will pay
            for verified skill is the single biggest thing we have not proven. We would rather say
            that than pretend otherwise.
          </p>
          <p>
            What we are looking for is a handful of design partners: employers with a real hiring
            problem who will tell us honestly whether this solves it. No cost during the alpha.
          </p>
          <p>
            Everything is open source, so you can read the whole thing before you reply —
            <NuxtLink to="/technology">how it works</NuxtLink> is written down in detail.
          </p>
        </div>
        <div class="e-form"><EnquiryForm audience="employer" /></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.h-sec { margin-bottom: 14px; }
.p-sub { max-width: 70ch; }
.e-prenote { margin: 20px 0 0; font-size: 13px; color: rgb(255 255 255 / 0.72); }

.e-steps { display: grid; gap: 16px; margin-bottom: 30px; }
@media (min-width: 900px) { .e-steps { grid-template-columns: repeat(4, 1fr); } }
.e-step { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.e-step h3 { margin: 0; font-size: 15.5px; letter-spacing: -0.01em; }
.e-step p:last-of-type { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); flex: 1; }

.e-cand { border: 1px solid rgb(var(--color-border)); border-radius: 14px; background: rgb(var(--color-card)); overflow: hidden; }
.e-cand-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 14px 18px; border-bottom: 1px solid rgb(var(--color-border)); font-size: 13.5px; }
.e-cand-g { display: grid; gap: 1px; background: rgb(var(--color-border)); }
@media (min-width: 820px) { .e-cand-g { grid-template-columns: repeat(4, 1fr); } }
.e-cand-g > div { background: rgb(var(--color-card)); padding: 16px 18px; }
.e-cand-k { margin: 0 0 7px; font-family: var(--font-mono); font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.12em; color: rgb(var(--color-muted-foreground)); }
.e-cand-v { margin: 0; font-size: 13.5px; line-height: 1.5; overflow-wrap: anywhere; }
.e-cand-s { margin: 5px 0 0; font-size: 12px; line-height: 1.5; color: rgb(var(--color-muted-foreground)); }

.e-packs { display: grid; gap: 14px; }
@media (min-width: 860px) { .e-packs { grid-template-columns: repeat(3, 1fr); } }
.e-pack { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.e-pack-h { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.e-pack-h h3 { margin: 0; font-size: 15.5px; }
.e-pack p { margin: 0; font-size: 14px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }
.e-priced { margin: 20px 0 0; font-family: var(--font-mono); font-size: 11.5px; line-height: 1.7; color: rgb(var(--color-muted-foreground)); max-width: 74ch; }

.e-close { display: grid; gap: 30px; align-items: start; }
@media (min-width: 940px) { .e-close { grid-template-columns: 1fr 1fr; gap: 44px; } }
.t-prose { display: grid; gap: 14px; max-width: 58ch; }
.t-prose p { margin: 0; font-size: 15px; line-height: 1.75; color: rgb(var(--color-muted-foreground)); }
.t-prose a { color: rgb(var(--page-accent, var(--color-primary))); }
.e-form { max-width: 620px; }
.mono { font-family: var(--font-mono); font-size: 0.92em; }

@media (max-width: 600px) {
  /* 10.5px mono is fine at desk distance and tight on a phone. */
  .e-cand-k { font-size: 11.5px; }
  .e-cand-s { font-size: 12.5px; }
}
</style>
