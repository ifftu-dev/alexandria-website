<script setup lang="ts">
/**
 * The institution case, rebuilt to the mockup's flow.
 *
 * The previous version of this page led with an amber "mostly not built yet"
 * warning above the headline, then ran a feature-tab interface and a competitor
 * comparison table. This one makes the same admission — it is the closing
 * section, "No institution has deployed this yet" — but earns it by first saying
 * what the platform is for, which is the order the reader needs.
 *
 * The examination figure carries its base. 3.8M is NEET-UG plus JEE Main, not
 * the full NTA slate, and without saying which it is an ambiguous number on a
 * page aimed at the people who would know.
 */
import { NTA_2025, SOURCES } from '~/content/evidence'

definePageMeta({ layout: 'landing' })

const GITHUB_URL = 'https://github.com/ifftu-dev/alexandria'

useHead({
  title: 'For institutions — Alexandria',
  meta: [
    { name: 'description', content: 'An open-source learning platform you can host yourself, issuing credentials your students own outright and can prove anywhere — long after they leave you.' },
    { property: 'og:title', content: 'For institutions — Alexandria' },
    { property: 'og:description', content: 'Your LMS. Their credentials. Free self-hosted tier, AGPL core, no vendor lock-in.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/institutions' },
    { property: 'og:image', content: 'https://alexandria.ifftu.dev/og/institutions.jpg' },
    { property: 'og:image:alt', content: 'For institutions — your LMS, their credentials.' },
    { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og/institutions.jpg' },
    { name: 'twitter:image:alt', content: 'For institutions — your LMS, their credentials.' },
    { name: 'twitter:title', content: 'For institutions — Alexandria' },
    { name: 'twitter:description', content: 'Your LMS. Their credentials.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/institutions' }],
})

const fourPoints = [
  { t: 'Free self-hosted tier', b: 'Run the whole platform on your own infrastructure at no cost, forever.' },
  { t: 'Skill-mapped curriculum', b: 'Your modules tie to public skill nodes with explicit prerequisites and levels.' },
  { t: 'Zero lock-in', b: 'AGPL-licensed core. Your data is yours; fork it if we ever disappoint you.' },
  { t: 'Students own the proof', b: 'Credentials issued under your authority, held by the student, verifiable anywhere.' },
]

const features = [
  { t: 'Classrooms', b: 'Invite-only cohorts organized into channels — announcements, questions, assignments, showcase. Teachers decide who is in.', state: 'alpha' as const },
  { t: 'Practical assessment', b: 'Plugins assess what multiple choice cannot — welding, music, code, inspection. Code is graded automatically; practical work is captured as structured evidence and reviewed by an assessor on the same node. Routing a submission to an assessor on another device is not built yet.', state: 'alpha' as const },
  { t: 'Auditable integrity', b: 'Optional on-device integrity scoring with the reasoning attached to each result. No third-party proctoring vendor, no recordings leaving the student’s machine.', state: 'alpha' as const },
  { t: 'Live tutoring', b: 'Video, audio and screen-share peer to peer, so remote cohorts do not depend on a third-party conferencing contract.', state: 'alpha' as const },
  { t: 'Works where bandwidth doesn’t', b: 'Offline-first by design. Rural campuses and field programs keep teaching through an outage and sync afterwards.', state: 'alpha' as const },
  { t: 'Nine languages', b: 'English, Chinese, Spanish, French, Hindi, Urdu, Telugu, Marathi and Bengali at launch, on macOS, Windows, Linux, iOS and Android from one codebase.', state: 'alpha' as const },
]

const fits = [
  { t: 'Universities', b: 'Issue verifiable credentials alongside the degree, so graduates can prove specific capabilities, not just attendance.' },
  { t: 'Trade & vocational schools', b: 'Assess practical skill properly and give graduates proof that travels to any employer, in any country.' },
  { t: 'NGOs & training programs', b: 'Reach learners with no reliable connectivity and leave them with recognition that outlasts the grant cycle.' },
  { t: 'Examination bodies', b: 'Open, auditable integrity at national scale — where the method that produced a score can be inspected by anyone.' },
]

const tiers = [
  { name: 'Self-hosted', price: 'Free, permanently', b: 'Full platform, unlimited students, community support. You run the infrastructure.', state: 'alpha' as const },
  { name: 'Managed', price: 'Priced per institution', b: 'We host, update and support it. Integration with your student records and identity systems.', state: 'planned' as const },
  { name: 'Examination scale', price: 'By arrangement', b: 'High-volume integrity, published audit method, and independent validity work commissioned jointly.', state: 'planned' as const },
]
</script>

<template>
  <div class="accent-institution page-institution">
    <section class="hero hero-page">
      <MeshGradient :blobs="['37,99,235', '129,140,248', '96,165,250', '34,211,238', '79,70,229']" base="#08132e" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">For institutions</p>
        <h1>Your LMS. Their credentials.</h1>
        <p class="hero-lede">
          An open-source learning platform you can host yourself, mapped to a public skill graph,
          issuing credentials your students own outright and can prove anywhere — long after they
          have left you.
        </p>
        <div class="hero-cta">
          <a href="#talk" class="plausible-event-name=Nav-Pilots btn btn-lg">Talk to us</a>
          <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub btn-ghost">Self-host it</a>
        </div>
        <p class="i-prenote">
          Free self-hosted tier, permanently. AGPL core, no vendor lock-in, no per-student license.
        </p>
      </div>
    </section>

    <!-- ═══ FOUR POINTS ═══ -->
    <section class="section-note pad">
      <div class="i-four">
        <div v-for="p in fourPoints" :key="p.t">
          <b>{{ p.t }}</b>
          <span>{{ p.b }}</span>
        </div>
      </div>
    </section>

    <!-- ═══ WHAT YOU GET ═══ -->
    <section class="section pad">
      <p class="eyebrow">What you get</p>
      <h2 class="h-sec">A full teaching platform, not a credential bolt-on.</h2>
      <div class="i-cards">
        <article v-for="f in features" :key="f.t" class="i-card">
          <div class="i-card-h"><h3>{{ f.t }}</h3><StatusChip :state="f.state" /></div>
          <p>{{ f.b }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ WHO THIS FITS ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">Who this fits</p>
      <h2 class="h-sec">Four kinds of institution, one platform.</h2>
      <div class="i-cards i-cards-4">
        <article v-for="f in fits" :key="f.t" class="i-card">
          <h3>{{ f.t }}</h3>
          <p>{{ f.b }}</p>
        </article>
      </div>

      <div class="i-exam">
        <div class="t-prose">
          <h3 class="i-exam-h">For public examinations, the audit is the product.</h3>
          <p>
            High-stakes exams live and die on public confidence in their integrity. Closed proctoring
            vendors ask everyone to take that on trust. An open, inspectable integrity layer that
            runs on the candidate’s own device — and never uploads their camera feed — is a different
            proposition entirely.
          </p>
          <p>
            We are early in these conversations, and public procurement is slow. We would rather
            start them honestly now than oversell later.
          </p>
        </div>
        <div class="i-figcard">
          <p class="i-fig">{{ NTA_2025.value }}</p>
          <p class="i-fig-l">{{ NTA_2025.label }}</p>
          <p class="i-fig-s">{{ NTA_2025.basis }} {{ SOURCES.nta2025!.line }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ HOW YOU RUN IT ═══ -->
    <section class="section pad">
      <p class="eyebrow">How you run it</p>
      <h2 class="h-sec">Self-host it for nothing, or pay us to run it.</h2>
      <div class="i-split">
        <div class="t-prose">
          <p>
            The core is AGPL-licensed and the free tier is not a trial — it is the whole platform, on
            your servers, with no student cap. Paid tiers exist for institutions that want us to
            operate it, integrate it, or support it under contract. Enterprise features are a
            separate service entirely, not a locked part of this one; nothing you rely on to teach
            sits behind them.
          </p>
          <p>
            Whichever you choose, the credential your students walk away with is identical — and it
            does not depend on your subscription, or ours.
          </p>
        </div>
        <div class="i-tiers">
          <div v-for="t in tiers" :key="t.name" class="i-tier">
            <div class="i-tier-h">
              <b>{{ t.name }}</b>
              <span class="i-tier-p">{{ t.price }}</span>
            </div>
            <p>{{ t.b }}</p>
            <StatusChip :state="t.state" />
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ STRAIGHT WITH YOU ═══ -->
    <section id="talk" class="section pad section-wash">
      <p class="eyebrow">Straight with you</p>
      <h2 class="h-sec">No institution has deployed this yet.</h2>
      <div class="i-close">
        <div class="t-prose">
          <p>
            The platform is built and shipping in alpha, but it has not been run by a real
            institution with real students, and no independent validity study has been completed. If
            you need a proven system today, this is not yet it.
          </p>
          <p>
            If you would rather help shape one — and are willing to be honest with us about what
            breaks — we would like to hear from you. Everything is open source, so you can
            <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub">read the whole thing</a>
            before you reply.
          </p>
        </div>
        <div class="i-form"><EnquiryForm audience="institution" /></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.h-sec { margin-bottom: 14px; }
.i-prenote { margin: 20px 0 0; font-size: 13px; color: rgb(255 255 255 / 0.72); }

.i-four { display: grid; gap: 18px; }
@media (min-width: 780px) { .i-four { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
.i-four > div { display: grid; gap: 5px; align-content: start; border-top: 2px solid rgb(var(--page-accent, var(--color-primary))); padding-top: 13px; }
.i-four b { font-size: 14.5px; }
.i-four span { font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }

.i-cards { display: grid; gap: 16px; }
@media (min-width: 820px) { .i-cards { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 820px) { .i-cards-4 { grid-template-columns: repeat(4, 1fr); } }
.i-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.i-card-h { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; margin-bottom: 8px; }
.i-card h3 { margin: 0 0 8px; font-size: 15.5px; letter-spacing: -0.01em; }
.i-card-h h3 { margin: 0; }
.i-card p { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }

.i-exam { display: grid; gap: 26px; align-items: center; margin-top: 34px; padding-top: 30px; border-top: 1px solid rgb(var(--color-border)); }
@media (min-width: 900px) { .i-exam { grid-template-columns: 1.25fr 0.75fr; gap: 44px; } }
.i-exam-h { margin: 0 0 4px; font-size: 18px; letter-spacing: -0.01em; }
.i-figcard { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.i-fig { margin: 0; font-family: var(--font-display); font-size: clamp(40px, 5vw, 56px); font-weight: 300; line-height: 1; color: rgb(var(--page-accent, var(--color-primary))); }
.i-fig-l { margin: 10px 0 0; font-size: 14px; line-height: 1.55; }
.i-fig-s { margin: 12px 0 0; font-family: var(--font-mono); font-size: 10.5px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }

.i-split, .i-close { display: grid; gap: 28px; align-items: start; }
@media (min-width: 940px) { .i-split, .i-close { grid-template-columns: 1fr 1fr; gap: 44px; } }
.t-prose { display: grid; gap: 14px; max-width: 60ch; }
.t-prose p { margin: 0; font-size: 15px; line-height: 1.75; color: rgb(var(--color-muted-foreground)); }
.t-prose a { color: rgb(var(--page-accent, var(--color-primary))); }

.i-tiers { display: grid; gap: 14px; }
.i-tier { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); display: flex; flex-direction: column; align-items: flex-start; gap: 9px; }
.i-tier-h { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 8px 16px; width: 100%; }
.i-tier-h b { font-size: 15.5px; }
.i-tier-p { font-family: var(--font-mono); font-size: 11.5px; color: rgb(var(--page-accent, var(--color-primary))); }
.i-tier p { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }
.i-form { max-width: 620px; }

@media (max-width: 600px) {
  .i-fig-s { font-size: 11.5px; }
}
</style>
