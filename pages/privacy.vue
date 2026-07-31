<script setup lang="ts">
/**
 * Plain-language privacy policy, rewritten to the mockup.
 *
 * The structure is the argument: the short version first, then what actually
 * reaches us, then what the design costs the reader. That last section matters —
 * a policy listing only the benefits of local-first storage is not being straight
 * about the trade, which is that we cannot recover an identity we never held.
 *
 * NOT LEGALLY REVIEWED. The design brief flagged this and it is still true: this
 * is an honest description of how the product works, written by the people who
 * built it, and it wants a lawyer before it is relied on as a policy.
 */
definePageMeta({ layout: 'landing' })

const UPDATED = '31 July 2026'
const CONTACT = 'pratyush@ifftu.dev'
const GITHUB = 'https://github.com/ifftu-dev/alexandria'

useHead({
  title: 'Privacy — Alexandria',
  meta: [
    { name: 'description', content: 'We designed the product so there would be very little to write here. No account, no server-side record of your learning, no advertising, and no trackers on this site.' },
    { property: 'og:title', content: 'Privacy — Alexandria' },
    { property: 'og:description', content: 'Mostly a description of data we never receive in the first place.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/privacy' },
    { property: 'og:image', content: 'https://alexandria.ifftu.dev/og/privacy.jpg' },
    { property: 'og:image:alt', content: 'Alexandria privacy — we don’t track you.' },
    { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og/privacy.jpg' },
    { name: 'twitter:image:alt', content: 'Alexandria privacy — we don’t track you.' },
    { name: 'twitter:title', content: 'Privacy — Alexandria' },
    { name: 'twitter:description', content: 'Mostly a description of data we never receive in the first place.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/privacy' }],
})

const short = [
  { t: 'There is no account with us', b: 'Your identity is a keypair generated on your device. We never see it, cannot reset it, and hold no email or password for it.' },
  { t: 'Your learning stays local', b: 'What you study, how you score and how often you retry is stored on your device. There is no server-side copy for us to analyse or sell.' },
  { t: 'Integrity data never leaves', b: 'Sentinel’s camera, keystroke and pointer signals are processed on your hardware. Only a score and its reasoning attach to a credential.' },
  { t: 'Sync is sealed', b: 'Devices sync end-to-end encrypted. Relays pass along bytes they cannot read, and we operate them without keys.' },
  { t: 'You choose what to reveal', b: 'Sharing a credential with an employer is an explicit act, one credential at a time. Nothing is discoverable without your consent.' },
  { t: 'No advertising, ever', b: 'We do not sell data, run ads, or share anything with data brokers. The platform is funded by employers and institutions.' },
]

const received = [
  {
    t: 'Waiting-list email',
    keep: 'Kept until you ask us to delete it',
    b: 'If you join the waiting list we store the address you gave us, the platforms you picked and the role you chose, so we can email you when it is your turn. We do not use it for anything else, and there is no newsletter.',
  },
  {
    t: 'Messages you send us',
    keep: 'Kept while the conversation is live',
    b: 'Enquiries from the employer and institution pages, and any email you send us, are read by a person and kept as ordinary correspondence.',
  },
  {
    t: 'Encrypted sync traffic',
    keep: 'Transient — not stored as content',
    b: 'Our relays forward encrypted blocks between your own devices. We hold no key to them and keep no readable copy. Operational logs record volume and timing, not content.',
  },
  {
    t: 'Crash reports',
    keep: 'Opt-in, off by default',
    b: 'If you choose to send a crash report, it contains the technical state of the failure and your platform version. It is never sent automatically, and it carries no identity or learning data.',
  },
  {
    t: 'This website',
    keep: 'No third-party trackers',
    b: 'The site sets no advertising cookies and embeds nothing from another origin — the fonts are served from this domain for that reason. Your dark or light mode preference is stored in your own browser and never sent anywhere.',
  },
]

const practice = [
  { t: 'We cannot recover your identity', b: 'This is the honest cost of the design. If you lose every device holding your key and have no backup, we have no way to restore it, because we never had it. The app will nag you to make a backup, and you should.' },
  { t: 'A credential you shared stays shared', b: 'Once you reveal a credential to an employer, they hold a copy that verifies on its own. You can stop sharing going forward; you cannot un-give what was given.' },
  { t: 'Institutions you join set their own terms', b: 'If you enrol in a classroom run by a school or employer, what you submit there is visible to them under their policy, not ours. The app tells you when you are entering such a space.' },
  { t: 'Deleting is local, and real', b: 'Removing the app removes your data, because that is where it lived. To remove a waiting-list address or an enquiry from our side, email us and we will delete it.' },
]
</script>

<template>
  <div class="page-accent p-narrow">
    <section class="hero hero-page">
      <MeshGradient :blobs="['79,70,229', '99,102,241', '129,140,248', '34,211,238', '79,70,229']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Privacy · Last updated {{ UPDATED }}</p>
        <h1>We designed the product so there would be very little to write here.</h1>
        <p class="hero-lede">
          Most privacy policies describe what a company does with the data it collects. This one
          mostly describes data we never receive in the first place, because the app runs on your
          device and does not have an account system behind it.
        </p>
      </div>
    </section>

    <section class="section pad">
      <h2 class="h-sec">The short version</h2>
      <div class="pv-short">
        <div v-for="s in short" :key="s.t">
          <b>{{ s.t }}</b>
          <span>{{ s.b }}</span>
        </div>
      </div>
    </section>

    <section class="section pad section-wash">
      <h2 class="h-sec">What we actually receive</h2>
      <p class="p-sub">
        There are only a few points where information reaches us at all. Each is listed below with
        why it exists and how long we keep it.
      </p>
      <div class="pv-rows">
        <div v-for="r in received" :key="r.t" class="pv-row">
          <div class="pv-row-k">
            <b>{{ r.t }}</b>
            <span class="pv-keep">{{ r.keep }}</span>
          </div>
          <p>{{ r.b }}</p>
        </div>
      </div>
    </section>

    <section class="section pad">
      <h2 class="h-sec">What this means in practice</h2>
      <div class="pv-cards">
        <article v-for="p in practice" :key="p.t" class="pv-card">
          <h3>{{ p.t }}</h3>
          <p>{{ p.b }}</p>
        </article>
      </div>
    </section>

    <section class="section pad section-wash">
      <h2 class="h-sec">Your rights, and how to use them</h2>
      <div class="pv-prose">
        <p>
          For the small amount of information we do hold — essentially an email address and any
          correspondence — you can ask us for a copy of it, ask us to correct it, or ask us to delete
          it. One email is enough; we do not require a form or an account, and there is no charge.
        </p>
        <p>
          We will tell you here when this page changes materially, and the date at the top always
          reflects the current version. Because everything is open source, you can also read the code
          that implements all of the above rather than taking our word for it.
        </p>
      </div>

      <div class="pv-contact">
        <div>
          <p class="pv-c-k">Contact</p>
          <p><a :href="`mailto:${CONTACT}`">{{ CONTACT }}</a></p>
          <p class="pv-c-s">Alexandria Pvt. Ltd., an IFFTU product.</p>
        </div>
        <div>
          <p class="pv-c-k">Read the code</p>
          <p><a :href="GITHUB" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub">github.com/ifftu-dev/alexandria</a></p>
          <p class="pv-c-s">Core under the MIT Licence.</p>
        </div>
        <div>
          <p class="pv-c-k">How the design works</p>
          <p><NuxtLink to="/technology">Technology ›</NuxtLink></p>
          <p class="pv-c-s">Identity, sync and integrity, in detail.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* A policy is read, not scanned, so the measure is tighter than the rest of the
   site — the mockup drops its container from 1220 to 980 for the same reason. */
.p-narrow :deep(.pad) { max-width: 980px; }

.h-sec { margin-bottom: 14px; }
.p-sub { max-width: 66ch; }

.pv-short { display: grid; gap: 18px; border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
@media (min-width: 760px) { .pv-short { grid-template-columns: 1fr 1fr; gap: 22px 34px; } }
.pv-short > div { display: grid; gap: 4px; align-content: start; }
.pv-short b { font-size: 14.5px; }
.pv-short span { font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }

.pv-rows { border-top: 1px solid rgb(var(--color-border)); }
.pv-row { display: grid; gap: 6px 30px; padding: 18px 0; border-bottom: 1px solid rgb(var(--color-border)); }
@media (min-width: 820px) { .pv-row { grid-template-columns: 0.42fr 1fr; } }
.pv-row-k { display: grid; gap: 5px; align-content: start; }
.pv-row-k b { font-size: 14.5px; }
.pv-keep { font-family: var(--font-mono); font-size: 10.5px; line-height: 1.5; color: rgb(var(--color-muted-foreground)); }
.pv-row p { margin: 0; font-size: 14px; line-height: 1.7; color: rgb(var(--color-muted-foreground)); }

.pv-cards { display: grid; gap: 16px; }
@media (min-width: 780px) { .pv-cards { grid-template-columns: 1fr 1fr; } }
.pv-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.pv-card h3 { margin: 0 0 8px; font-size: 15.5px; letter-spacing: -0.01em; }
.pv-card p { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }

.pv-prose { display: grid; gap: 14px; max-width: 70ch; margin-bottom: 30px; }
.pv-prose p { margin: 0; font-size: 15px; line-height: 1.75; color: rgb(var(--color-muted-foreground)); }

.pv-contact { display: grid; gap: 18px; border-top: 1px solid rgb(var(--color-border)); padding-top: 24px; }
@media (min-width: 780px) { .pv-contact { grid-template-columns: repeat(3, 1fr); gap: 30px; } }
.pv-contact p { margin: 0; font-size: 14px; line-height: 1.6; }
.pv-c-k { font-family: var(--font-mono); font-size: 10.5px !important; text-transform: uppercase; letter-spacing: 0.12em; color: rgb(var(--color-muted-foreground)); margin-bottom: 7px !important; }
.pv-c-s { margin-top: 5px !important; font-size: 12.5px !important; color: rgb(var(--color-muted-foreground)); }
.pv-contact a { color: rgb(var(--color-primary)); overflow-wrap: anywhere; }
</style>
