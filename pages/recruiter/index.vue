<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Alexandria Recruiting — Hire Verified Talent, Not Resumes',
  meta: [
    { name: 'description', content: 'Discover candidates through credentials you can verify yourself and a transparent record of how they learned. No resumes. No guesswork.' },
    { property: 'og:title', content: 'Alexandria Recruiting — Hire Verified Talent, Not Resumes' },
    { property: 'og:description', content: 'Discover candidates through credentials you can verify yourself. No resumes. No guesswork. Just proof.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/recruiter' },
    { property: 'og:image', content: 'https://alexandria.ifftu.dev/og/recruiter.jpg' },
    { property: 'og:image:alt', content: 'Alexandria for recruiters — hire verified talent, not resumes.' },
    { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og/recruiter.jpg' },
    { name: 'twitter:image:alt', content: 'Alexandria for recruiters — hire verified talent, not resumes.' },
    { name: 'twitter:title', content: 'Alexandria Recruiting — Hire Verified Talent, Not Resumes' },
    { name: 'twitter:description', content: 'Discover candidates through credentials you can verify yourself. No resumes. Just proof.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/recruiter' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Alexandria Recruiting',
        'description': 'Hire verified talent through credentials you can verify yourself and a transparent record of how each candidate learned.',
        'url': 'https://alexandria.ifftu.dev/recruiter',
        'isPartOf': { '@type': 'WebSite', 'name': 'Alexandria', 'url': 'https://alexandria.ifftu.dev' },
      }),
    },
  ],
})

const RECRUITER_BLOBS = ['14,159,110', '34,211,238', '16,185,129', '45,212,191', '59,130,246']

const problems = [
  { label: 'Resumes lie', detail: 'Self-reported claims are easy to embellish and hard to verify.' },
  { label: 'Skill tests are shallow', detail: 'One-shot assessments miss depth and learning trajectory.' },
  { label: 'Degree bias persists', detail: 'Credentials from prestigious institutions outweigh actual ability.' },
  { label: 'No verification standard', detail: 'Reference checks are slow, unreliable and biased.' },
]

const answers = [
  { label: 'Proofs replace claims', detail: 'Every skill backed by a credential you can verify and the assessments behind it.' },
  { label: 'Depth, not snapshots', detail: "Bloom's taxonomy levels from Remember through Create." },
  { label: 'Merit, not pedigree', detail: 'Reputation derived from outcomes, scoped to skills — not institutions.' },
  { label: 'Verify it yourself', detail: 'Tamper-proof credentials you can confirm in seconds, offline — no need to trust us.' },
]

const features = [
  {
    title: 'Skill-based discovery',
    icon: 'M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z',
    body: "Search by verified competencies, not keywords. Composite queries with Bloom's proficiency levels and confidence thresholds.",
  },
  {
    title: 'A full record behind every credential',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    body: 'Every credential links back to the assessments, courses and instructors behind it. Trace how a candidate actually learned — not just what they claim.',
  },
  {
    title: 'Credentials you verify yourself',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    body: 'Each credential is signed by the candidate and made tamper-proof, so you can confirm it on your own — even offline. No fabrication possible.',
    tech: "W3C Verifiable Credentials · Ed25519 under the candidate's DID · hash-anchored to Cardano",
  },
  {
    title: 'The candidate chooses what to share',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    body: 'Just the level reached, or the full record behind it — one credential at a time, and each share works only for you.',
  },
]

const steps = [
  { n: 'STEP 01', title: 'Define your requirements', body: "Required and optional skills, each with a Bloom's level and optional confidence threshold. Search by what people can do, not what they say." },
  { n: 'STEP 02', title: 'Review verified matches', body: 'Ranked by skill match — no global scores, no opaque algorithm. Each result explains in plain language why it matched and what gaps remain.' },
  { n: 'STEP 03', title: 'Verify and deep-dive', body: 'Inspect each credential, confirm it independently, view learning timelines, and see which instructors were involved.' },
  { n: 'STEP 04', title: 'Build your pipeline', body: 'Pools, pipeline stages, saved-search alerts for new matches, and team collaboration — with full audit trails.' },
]
</script>

<template>
  <div class="accent-recruiter">
    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <MeshGradient :blobs="RECRUITER_BLOBS" base="#04231c" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-split">
        <div>
          <p class="eyebrow hero-eyebrow">Alexandria Recruiting</p>
          <p class="notice">
            <span aria-hidden="true">⚠</span>
            <span><b>Not built yet.</b> This page describes what we're building — recruiter features are not implemented.</span>
          </p>
          <h1>Hire verified talent, not resumes.</h1>
          <p class="hero-lede">
            Discover candidates through credentials you can verify yourself and a transparent record
            of how they learned. No guesswork. No fabrication. Just proof.
          </p>
          <div class="hero-cta">
            <a href="#how-it-works" class="btn">See how it works</a>
            <a href="#features" class="btn-ghost">Explore features</a>
          </div>
          <div class="trust">
            <span><i />Independently verifiable</span>
            <span><i />Candidate consent required</span>
            <span><i />No global rankings</span>
          </div>
        </div>

        <LazySkillQuery hydrate-on-idle />
      </div>
    </section>

    <!-- ═══ PROBLEM / ANSWER ═══ -->
    <section id="how-it-works" class="section pad">
      <p class="eyebrow">The core problem</p>
      <h2 class="h-sec">The hiring problem is a verification problem.</h2>
      <p class="p-sub">Traditional hiring relies on unverifiable claims. Alexandria replaces trust with proof.</p>

      <div class="grid2">
        <div>
          <div class="pa-head">
            <span style="color: rgb(var(--color-no))">Today</span>
            <i style="background: rgb(var(--color-no) / 0.3)" />
          </div>
          <div v-for="problem in problems" :key="problem.label" class="pa-item pa-bad">
            <b><span class="mk">✕</span>{{ problem.label }}</b>
            <p>{{ problem.detail }}</p>
          </div>
        </div>
        <div>
          <div class="pa-head">
            <span style="color: rgb(var(--color-ok))">Alexandria's answer</span>
            <i style="background: rgb(var(--color-ok) / 0.3)" />
          </div>
          <div v-for="answer in answers" :key="answer.label" class="pa-item pa-good">
            <b><span class="mk">✓</span>{{ answer.label }}</b>
            <p>{{ answer.detail }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section id="features" class="section section-wash">
      <div class="pad">
        <p class="eyebrow">What you get</p>
        <h2 class="h-sec">Intelligence, not intuition.</h2>
        <p class="p-sub">Every tool built on proof you can check, not claims you have to trust.</p>

        <div class="tiles">
          <article v-for="feature in features" :key="feature.title" class="tile">
            <div class="tile-ic">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
              </svg>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.body }}</p>
            <p v-if="feature.tech" class="tile-tech">{{ feature.tech }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══ PIPELINE ═══ -->
    <section class="section pad">
      <p class="eyebrow">The workflow</p>
      <h2 class="h-sec">From search to hire.</h2>
      <p class="p-sub">Transparent at every stage — including the parts that tell you a candidate isn't a fit.</p>

      <div class="steps">
        <article v-for="step in steps" :key="step.n" class="step">
          <div class="n">{{ step.n }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.body }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="cta">
      <MeshGradient :blobs="RECRUITER_BLOBS" base="#04231c" />
      <div class="hero-scrim" />
      <div class="pad cta-inner">
        <h2>Stop guessing. Start verifying.</h2>
        <p>For teams who want to hire on credentials they can check themselves. Free for learners. Powerful for recruiters.</p>
        <div class="cta-row">
          <a
            href="https://github.com/ifftu-dev/alexandria"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-GitHub btn"
          >Get started</a>
          <NuxtLink to="/institutions" class="plausible-event-name=Nav-Institutions btn-ghost">For institutions</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
