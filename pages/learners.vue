<script setup lang="ts">
// The two figures below are quoted, not asserted — `content/evidence.ts` is the
// single source for both, and both carry `status: 'sourced'` there.
import { RECOGNITION_GAP, SOURCES } from '~/content/evidence'

definePageMeta({ layout: 'landing' })

useHead({
  title: 'For learners — Alexandria',
  meta: [
    { name: 'description', content: 'Study offline, own the credentials you earn, and keep your data on your own device. Free, open source, and yours to prove without asking anyone.' },
    { property: 'og:title', content: 'For learners — Alexandria' },
    { property: 'og:description', content: 'Study offline, own what you earn, keep your data on your device.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/learners' },
    { property: 'og:image', content: 'https://alexandria.ifftu.dev/og/learners.jpg' },
    { property: 'og:image:alt', content: 'For learners — learn free, keep the proof.' },
    { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og/learners.jpg' },
    { name: 'twitter:image:alt', content: 'For learners — learn free, keep the proof.' },
    { name: 'twitter:title', content: 'For learners — Alexandria' },
    { name: 'twitter:description', content: 'Study offline, own what you earn, keep your data on your device.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/learners' }],
})

const waitlist = useWaitlist()

const noDegree = RECOGNITION_GAP.find(f => f.id === 'no-degree')!
const oneIn700 = RECOGNITION_GAP.find(f => f.id === 'one-in-700')!

/**
 * The page used to open with four promises and then admit it was an alpha —
 * a learner never found out what problem this solves for them, or how it works.
 * Its two sibling audience pages both run problem → mechanism → what it costs →
 * honesty; these two sections are the half that was missing.
 */
const problems = [
  {
    n: '01',
    k: 'The gate',
    t: 'A degree is still the shortest way to be taken seriously',
    b: `And most people do not have one — ${noDegree.value} of American adults over 25 hold no bachelor's degree. The jobs that quietly assume one have not become fewer.`,
  },
  {
    n: '02',
    k: 'The promise',
    t: 'Dropping degree requirements mostly did not happen',
    b: `Employers announced it widely. Fewer than 1 in 700 new hires actually benefited. The announcements changed; the hiring did not.`,
  },
  {
    n: '03',
    k: 'The receipt',
    t: 'What you did earn belongs to a platform',
    b: 'A PDF or a profile on someone else\'s site. Nobody can check it without trusting them — and neither can you, once they shut down.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Install it',
    body: 'Download it on any device you own. Your account is created on the device itself: no email, no password to lose, nothing held by a company.',
  },
  {
    n: '02',
    title: 'Learn offline',
    body: 'Courses download to your device. Study on a train, somewhere with no signal, on a laptop that has been offline for a week. Assessments run locally too.',
  },
  {
    n: '03',
    title: 'Earn the credential',
    body: 'Finish an assessment and it is signed under a key that lives on your device. It is issued to you, not held for you.',
  },
  {
    n: '04',
    title: 'Prove it to anyone',
    body: 'Share it with an employer or an institution, choosing how much evidence travels with it. They verify it without an Alexandria account, and without asking us.',
  },
]

const promises = [
  {
    title: 'Free, and free in the way that matters',
    body: 'Learning is free. Earning a credential is free. Proving it to someone is free. Those three are not the parts we intend to charge for — organisations pay for hosting, integrations and support, never a learner for their own proof.',
    state: 'alpha' as const,
  },
  {
    title: 'The credential is yours, not ours',
    body: 'It is signed under a key that lives on your device. Anyone can check it without an Alexandria account, and it keeps working if this project stops existing. That is the difference between a certificate and a receipt from a company.',
    state: 'alpha' as const,
  },
  {
    title: 'Works where the internet does not',
    body: 'Courses download to your device and assessments run on it. Nine languages ship today, across three continents — and adding one is translation work, not engineering work, so the list is the beginning rather than the limit.',
    state: 'alpha' as const,
  },
  {
    title: 'You decide what anyone sees',
    body: 'Sharing a credential is a deliberate act, and you choose how much of the evidence travels with it. There is no profile being quietly indexed for recruiters.',
    state: 'building' as const,
  },
]
</script>

<template>
  <div class="page-learner">
    <section class="hero hero-page">
      <MeshGradient :blobs="['79,70,229', '99,102,241', '129,140,248', '34,211,238', '79,70,229']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">For learners</p>
        <h1>Learn free. Keep the proof.</h1>
        <p class="hero-lede">
          Study offline, earn credentials signed under your own key, and prove them to anyone —
          without an account they control or a company in the middle.
        </p>
        <div class="hero-cta">
          <button type="button" class="btn btn-lg plausible-event-name=EarlyAccess" @click="waitlist.open()">
            Join the waiting list
          </button>
          <NuxtLink to="/verify" class="plausible-event-name=Nav-Verify btn-ghost">See a credential verified</NuxtLink>
        </div>
      </div>
    </section>

    <!-- The problem, from the learner's side. Both figures are sourced in
         content/evidence.ts and the source lines are printed under them. -->
    <section class="section pad">
      <p class="eyebrow">The problem</p>
      <h2 class="h-sec">You can already learn almost anything. You still cannot prove any of it.</h2>
      <p class="p-sub">
        Every course you have finished lives inside someone else's account. The certificate is a page
        on their website, it is true because they say it is, and it stops being true the day they
        decide otherwise.
      </p>
      <div class="prob">
        <article v-for="p in problems" :key="p.n" class="prob-card">
          <p class="prob-n">{{ p.n }} / {{ p.k }}</p>
          <h3>{{ p.t }}</h3>
          <p>{{ p.b }}</p>
        </article>
      </div>
      <p class="l-src">{{ SOURCES.census2022!.line }} {{ SOURCES.bgi2024!.line }}</p>
      <p class="prob-more">
        <NuxtLink to="/why-recognition" class="plausible-event-name=Nav-Recognition chev">
          The full argument, with sources <i>›</i>
        </NuxtLink>
      </p>
    </section>

    <section class="section pad section-wash">
      <p class="eyebrow">How it works</p>
      <h2 class="h-sec">Install it, learn, and walk away with something that is yours.</h2>
      <p class="p-sub">Four steps. None of them registers you with anyone.</p>

      <ol class="flow">
        <li v-for="step in steps" :key="step.n">
          <span class="flow-n">{{ step.n }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.body }}</p>
        </li>
      </ol>

      <p class="prob-more">
        <NuxtLink to="/verify" class="plausible-event-name=Nav-Verify chev">
          See it from the other side <i>›</i>
        </NuxtLink>
      </p>
    </section>

    <section class="section pad">
      <h2 class="h-sec">What you get, and what it costs</h2>
      <p class="p-sub">Labelled, so you can tell what exists today from what is being built.</p>
      <div class="l-grid">
        <div v-for="p in promises" :key="p.title" class="l-card">
          <div class="l-head"><h3>{{ p.title }}</h3><StatusChip :state="p.state" /></div>
          <p>{{ p.body }}</p>
        </div>
      </div>
    </section>

    <section class="section pad section-wash">
      <h2 class="h-sec">The honest part</h2>
      <div class="l-close">
        <div class="l-honest">
          <p>
            It is an alpha. The interface needs real design work, there is no content moderation yet,
            and nobody outside the project is using it in earnest. The waiting list exists because we
            are letting people in a group at a time rather than pretending the first day will go well.
          </p>
          <p>
            If that makes you want to wait, that is a reasonable thing to want. You will still hear
            from us when there is something worth your time.
          </p>
        </div>

        <aside class="l-join">
          <h3>What joining actually does</h3>
          <ol>
            <li>You tell us your role and which platforms you want. Both can change later.</li>
            <li>We email you when there is a build ready for one of them.</li>
            <li>Nothing else. No drip sequence, and one click unsubscribes.</li>
          </ol>
          <button type="button" class="btn plausible-event-name=EarlyAccess" @click="waitlist.open()">
            Join the waiting list
          </button>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.h-sec { margin-bottom: 14px; }

/* Source lines under the problem cards, matching the evidence band elsewhere. */
.l-src {
  margin: 22px 0 0;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.7;
  color: rgb(var(--color-muted-foreground));
  max-width: 88ch;
}

.l-grid { display: grid; gap: 16px; }
@media (min-width: 800px) { .l-grid { grid-template-columns: 1fr 1fr; } }
.l-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.l-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.l-head h3 { font-size: 15.5px; margin: 0; letter-spacing: -0.01em; }
.l-card p { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }
.l-close { display: grid; gap: 24px; align-items: start; }
@media (min-width: 900px) { .l-close { grid-template-columns: 1fr 0.78fr; gap: 40px; } }
.l-honest { max-width: 62ch; display: grid; gap: 14px; }
.l-honest p { margin: 0; font-size: 15px; line-height: 1.7; color: rgb(var(--color-muted-foreground)); }

.l-join { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.l-join h3 { margin: 0 0 12px; font-size: 15.5px; letter-spacing: -0.01em; }
.l-join ol { list-style: revert; margin: 0 0 18px; padding-inline-start: 20px; display: grid; gap: 8px; }
.l-join li { font-size: 14px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }
.l-join .btn { width: 100%; }
</style>
