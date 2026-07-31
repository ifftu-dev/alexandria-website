<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'For learners — Alexandria',
  meta: [
    { name: 'description', content: 'Study offline, own the credentials you earn, and keep your data on your own device. Free, open source, and yours to prove without asking anyone.' },
    { property: 'og:title', content: 'For learners — Alexandria' },
    { property: 'og:description', content: 'Study offline, own what you earn, keep your data on your device.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/learners' },
    { name: 'twitter:title', content: 'For learners — Alexandria' },
    { name: 'twitter:description', content: 'Study offline, own what you earn, keep your data on your device.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/learners' }],
})

const waitlist = useWaitlist()

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
    body: 'Courses download to your device and assessments run on it. Nine languages ship today, including Hindi, Bengali, Telugu, Marathi and Urdu, because access is the point.',
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
  <div>
    <section class="hero hero-short">
      <MeshGradient />
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
          <NuxtLink to="/verify" class="btn-ghost">See a credential verified</NuxtLink>
        </div>
      </div>
    </section>

    <section class="pad section">
      <h2 class="h-sec">What you get, and what it costs</h2>
      <p class="p-sub">Labelled, so you can tell what exists today from what is being built.</p>
      <div class="l-grid">
        <div v-for="p in promises" :key="p.title" class="l-card">
          <div class="l-head"><h3>{{ p.title }}</h3><StatusChip :state="p.state" /></div>
          <p>{{ p.body }}</p>
        </div>
      </div>
    </section>

    <section class="pad section">
      <h2 class="h-sec">The honest part</h2>
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
      <div class="hero-cta" style="margin-top: 24px">
        <button type="button" class="btn plausible-event-name=EarlyAccess" @click="waitlist.open()">
          Join the waiting list
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-short { padding-bottom: clamp(46px, 7vw, 74px); }
.h-sec { font-size: clamp(21px, 3vw, 26px); letter-spacing: -0.02em; margin: 0 0 8px; }
.p-sub { margin: 0 0 22px; font-size: 14.5px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }
.l-grid { display: grid; gap: 16px; }
@media (min-width: 800px) { .l-grid { grid-template-columns: 1fr 1fr; } }
.l-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.l-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.l-head h3 { font-size: 15.5px; margin: 0; letter-spacing: -0.01em; }
.l-card p { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }
.l-honest { max-width: 70ch; display: grid; gap: 14px; }
.l-honest p { margin: 0; font-size: 15px; line-height: 1.7; color: rgb(var(--color-muted-foreground)); }
</style>
