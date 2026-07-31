<script setup lang="ts">
import { RECOGNITION_GAP, SOURCES } from '~/content/evidence'

definePageMeta({ layout: 'landing' })

useHead({
  title: 'Alexandria — Free Learning, Credentials You Own',
  meta: [
    { name: 'description', content: 'A free, open-source learning app for Mac, Windows, Linux, iOS and Android. Study offline, earn credentials you truly own, and keep your data on your own device.' },
    { property: 'og:title', content: 'Alexandria — Free Learning, Credentials You Own' },
    { property: 'og:description', content: 'A free learning app for every device. Study offline, earn credentials that are truly yours, and keep your data on your own device.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/' },
    { property: 'og:image', content: 'https://alexandria.ifftu.dev/og/home.jpg' },
    { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og/home.jpg' },
    { name: 'twitter:title', content: 'Alexandria — Free Learning, Credentials You Own' },
    { name: 'twitter:description', content: 'A free learning app for every device. Study offline, earn credentials that are truly yours, and keep your data on your own device.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Alexandria',
        'applicationCategory': 'EducationalApplication',
        'operatingSystem': 'macOS, Windows, Linux, iOS, Android',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'A free, open-source learning app where you study offline and earn credentials you truly own.',
        'url': 'https://alexandria.ifftu.dev',
        'downloadUrl': 'https://github.com/ifftu-dev/alexandria/releases/latest',
        'author': { '@type': 'Organization', 'name': 'Alexandria Pvt. Ltd.', 'url': 'https://alexandria.ifftu.dev' },
      }),
    },
  ],
})

interface Feature {
  span: string
  accent: 'primary' | 'cyan' | 'rose' | 'amber'
  title: string
  icon: string
  body: string
  bullets?: string[]
  motif?: 'plugins' | 'channels' | 'sentinel' | 'graph' | 'credential' | 'reputation'
}

// Every capability the site has ever claimed, in the order the old page told
// the story. Nothing here is aspirational — the two audience pages carry the
// not-yet-built work behind their own notices.
const features: Feature[] = [
  {
    span: 'span-4',
    accent: 'primary',
    title: 'Learn without limits',
    icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
    body: 'Courses, video tutorials and Opinions — takes from practitioners who hold the very skill they teach. Free, open-source, offline-first.',
    bullets: [
      'Courses with real, hands-on assessments',
      'Works offline — no internet required',
      'Nine languages, including Hindi, Bengali and Telugu',
    ],
  },
  {
    span: 'span-2',
    accent: 'cyan',
    title: 'Opinions',
    icon: 'M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
    body: 'Real learning is not only settled facts — it is weighing competing views and forming your own.',
    bullets: [
      'Credentialed takes, not anonymous hot takes',
      'See where experts genuinely disagree',
    ],
  },
  {
    span: 'span-3',
    accent: 'amber',
    title: 'Teach and assess anything',
    icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82c-1.517.19-3.058.309-4.616.354a.64.64 0 01-.657-.643z',
    body: 'Video, text and multiple choice are not enough — different skills need different ways to teach and test. Plugins let Alexandria assess welding, music, engineering, surgery, and beyond.',
    motif: 'plugins',
  },
  {
    span: 'span-3',
    accent: 'cyan',
    title: 'Classrooms',
    icon: 'M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342',
    body: 'Teachers stay close to the students they invite, inside a safe, contained space — organised into channels.',
    motif: 'channels',
  },
  {
    span: 'span-2',
    accent: 'rose',
    title: 'Learn live, together',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    body: 'Face-to-face tutoring is built in — video, audio and screen-share connect learners and mentors directly, device to device.',
    bullets: ['Live one-on-one video tutoring', 'Peer to peer — no call runs through a company'],
  },
  {
    span: 'span-4',
    accent: 'rose',
    title: 'A shared map of knowledge',
    icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z',
    body: 'Every lesson and credential ties to a public map of skills with clear prerequisites, so a credential means the same thing everywhere — and it is kept accurate by the community, not one company.',
    motif: 'graph',
  },
  {
    span: 'span-3',
    accent: 'cyan',
    title: 'Your credentials, your data, your device',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    body: 'One identity, created on your device. It signs every credential you earn and encrypts everything you keep — syncing straight between your own devices, with relays that cannot read a thing.',
    motif: 'credential',
  },
  {
    span: 'span-3',
    accent: 'amber',
    title: 'Assessments you can trust',
    icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
    body: 'Sentinel, an optional integrity layer, keeps credentials honest — and runs entirely on your device.',
    motif: 'sentinel',
  },
  {
    span: 'span-3',
    accent: 'primary',
    title: 'Reputation without the star rating',
    icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
    body: 'Instructors are scored on their impact on learners — a per-skill distribution with confidence bounds, not one global number.',
    motif: 'reputation',
  },
  {
    span: 'span-3',
    accent: 'amber',
    title: 'Community governed',
    icon: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z',
    body: 'Only people who have proven expertise in a subject get a vote on how it is taught — not money, not seniority.',
    bullets: ['A vote is earned by what you can do, per subject', 'Draft → committee → public vote'],
  },
]

const channels = ['announcements', 'questions', 'assignments', 'showcase']

// Signal names come from the app's own Sentinel panel (sentinel.engine.*).
const sentinelSignals = [
  { label: 'Typing', value: 96 },
  { label: 'Mouse', value: 91 },
  { label: 'Smart models', value: 88 },
]

const reputation = [
  { skill: 'welding.pipe.6g', low: 62, mid: 74, high: 83 },
  { skill: 'welding.tig', low: 38, mid: 57, high: 79 },
  { skill: 'inspection.ndt', low: 70, mid: 78, high: 85 },
]

// Sized and re-encoded for the box they actually render in; the source PNGs
// were 1800px wide and 464 KB between them. 512px wide covers the 256px
// display box at 2x, and the intrinsic w/h below must keep matching the files
// or the aspect-ratio reservation goes wrong and CLS returns.
const pluginShots = [
  { src: '/plugins/editor.webp', label: 'Code editor', w: 512, h: 574 },
  { src: '/plugins/music.webp', label: 'Music trainer', w: 512, h: 319 },
]

const steps = [
  { n: '01', title: 'Download & launch', body: 'Install on any device. Your account is created on the device itself — no email, no password to lose, and nothing registered with a company.' },
  { n: '02', title: 'Learn & earn credentials', body: 'Take free courses, tutorials and assessments. Finish an assessment and you earn a credential for it — no waiting, no paperwork.' },
  { n: '03', title: 'Own & prove', body: 'Each credential is signed under your own identity and made tamper-proof, so anyone can check it is genuine — anywhere, even without Alexandria.' },
  { n: '04', title: 'Share & take part', body: 'Share credentials with employers, choosing exactly what to reveal. What you have proven gives you a say in how your community is run.' },
]

const platforms = [
  { name: 'macOS', d: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' },
  { name: 'Windows', d: 'M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801' },
  { name: 'Linux', d: 'M12.5 2c-2.5 0-3 2-3 4 0 1.2-.3 2-1 3-1 1.4-2 3-2 5 0 1 .3 2 1 3 .3.4.2 1-.2 1.4-.4.4-.8.6-.8 1.2 0 .8.8 1 1.8 1 1.2 0 2.4.4 3.4.4s2.2-.4 3.4-.4c1 0 1.8-.2 1.8-1 0-.6-.4-.8-.8-1.2-.4-.4-.5-1-.2-1.4.7-1 1-2 1-3 0-2-1-3.6-2-5-.7-1-1-1.8-1-3 0-2-.5-4-2.4-4zm-1.2 4.2c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9zm2.6 0c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9z' },
  { name: 'iOS', d: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' },
  { name: 'Android', d: 'M17.532 15.106a1.003 1.003 0 111.001-2.007 1.003 1.003 0 01-1 2.007m-11.044 0a1.003 1.003 0 111.001-2.007 1.003 1.003 0 01-1 2.007m11.4-6.018 2.006-3.459a.413.413 0 10-.721-.403l-2.03 3.5A12.26 12.26 0 0012.011 7.5a12.26 12.26 0 00-5.132 1.226l-2.03-3.5a.413.413 0 10-.72.403l2.005 3.46C2.593 11.066.003 14.812 0 19.2h24.022c-.003-4.388-2.593-8.134-6.134-10.112' },
]

/**
 * Both lists are checkable rather than rhetorical: the platform and language
 * counts match the app repo, and every item in `notYet` is a thing a reader
 * could otherwise assume from the rest of the page.
 */
const worksToday = [
  'Learning, assessment and credentials, in the alpha, on five platforms',
  'Credentials that verify with no account and no network — including on this site',
  'Nine languages, among them Hindi, Bengali, Telugu, Marathi and Urdu',
  'An MIT-licensed core, public and forkable today',
]

const notYet = [
  'No institution has deployed this',
  'Nobody has been hired through a credential issued by it',
  'No independent validity study has been completed',
  'No content moderation, and the interface needs real design work',
]

const problems = [
  {
    n: '01',
    k: 'Locked',
    title: 'It lives on someone else’s server',
    body: 'A certificate belongs to the platform that issued it. When the platform pivots, prices up or shuts down, your proof goes with it.',
  },
  {
    n: '02',
    k: 'Not portable',
    title: 'It rarely crosses a border',
    body: 'Recognition stops at the edge of the institution that granted it, and at the edge of the country that recognises that institution.',
  },
  {
    n: '03',
    k: 'Unequal',
    title: 'The price of proof is the barrier',
    body: 'Free courses reach everyone and leave no proof behind. Paid certificates carry weight and cost money the learner does not have.',
  },
]

const codeTab = ref<'credential' | 'verify' | 'output'>('credential')

// The form lives in a dialog now; every trigger opens the same one.
const waitlist = useWaitlist()

/**
 * The feature grid is capped until asked. Ten tiles is an honest inventory and a
 * wall of text at the same time — collapsed, a reader can see the shape of it and
 * decide, rather than scrolling past the lot to reach what comes next.
 */
const featuresOpen = ref(false)
const hiddenFeatureCount = computed(() => Math.max(features.length - 4, 0))
</script>

<template>
  <div>
    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <MeshGradient />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Alpha · waiting list open</p>
        <!-- Both dashes are bound: the first to the word before it, the second to
             the phrase after it. Left loose, either can wrap alone onto a line,
             and an em dash starting a line reads as a typo. The second is not
             also bound backwards — "recognition — free, forever." as one
             unbreakable run is wider than a 390px viewport. -->
        <h1>An honest attempt at making education&nbsp;— and its recognition —&nbsp;<em>free, forever.</em></h1>
        <p class="hero-lede">
          Learning became free. Recognition did not. Alexandria is a free, open-source learning app
          for every device — and a credential you own outright, that anyone can verify, anywhere,
          without us.
        </p>
        <div id="early-access" class="hero-cta">
          <button type="button" class="btn btn-lg plausible-event-name=EarlyAccess" @click="waitlist.open()">
            Join the waiting list
          </button>
          <NuxtLink to="/verify" class="plausible-event-name=Nav-Verify btn-ghost">Verify a credential</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ APP WINDOW, straddling the fold ═══ -->
    <div class="pad shelf">
      <div class="shelf-window">
        <LazyAppReplica hydrate-on-idle />
      </div>
      <p class="shelf-cap">
        The real shell — press <b>/</b> for search, open <b>Skills &amp; Credentials</b> and verify one
      </p>
    </div>

    <!-- ═══ THE GAP — the thesis, with its evidence attached ═══ -->
    <section class="gap">
      <div class="pad">
        <div class="gap-figs">
          <div v-for="f in RECOGNITION_GAP" :key="f.id" class="gap-fig">
            <p class="gap-n">{{ f.value }}</p>
            <p class="gap-l">{{ f.label }}</p>
          </div>
        </div>
        <div class="gap-foot">
          <p class="gap-src">{{ SOURCES.bgi2024!.line }} {{ SOURCES.census2022!.line }}</p>
          <NuxtLink to="/why-recognition" class="plausible-event-name=Nav-Evidence chev">
            Read the evidence in full <i>›</i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ THE PROBLEM ═══ -->
    <section class="section pad">
      <p class="eyebrow">The problem</p>
      <h2 class="h-sec">
        The knowledge is identical. The recognition is not — and it is the recognition that changes
        the life.
      </h2>
      <p class="p-sub">
        A teenager in a Mumbai slum can take the same course as one at MIT — the same lectures, the
        same problems, the same hours. Only one of them ends up with a credential anyone will accept.
        Employers have tried to fix this from their side and largely failed, because nothing replaced
        the degree as a signal they could trust.
      </p>
      <div class="prob">
        <article v-for="p in problems" :key="p.k" class="prob-card">
          <p class="prob-n">{{ p.n }} / {{ p.k }}</p>
          <h3>{{ p.title }}</h3>
          <p>{{ p.body }}</p>
        </article>
      </div>
      <p class="prob-more">
        <NuxtLink to="/why-recognition" class="plausible-event-name=Nav-Evidence chev">
          The research behind this, and what we cannot prove <i>›</i>
        </NuxtLink>
      </p>
    </section>

    <!-- ═══ PROOF ═══ -->
    <section class="proof">
      <div class="pad proof-grid">
        <div>
          <p class="eyebrow">Verify it yourself</p>
          <h2>Don't trust us. Check the credential.</h2>
          <p class="p-sub">
            Every credential is a W3C Verifiable Credential, Ed25519-signed under the holder's own DID
            and hash-anchored on-chain. Confirm it with our tooling, someone else's, or none at all.
          </p>
          <div class="proof-metrics">
            <div><div class="n">Offline</div><div class="l">Verification needs no network</div></div>
            <div><div class="n">0</div><div class="l">Calls to Alexandria required</div></div>
            <div><div class="n">MIT</div><div class="l">Core licence, forever</div></div>
          </div>
          <p style="margin-top: 24px">
            <a
              href="https://github.com/ifftu-dev/alexandria"
              target="_blank"
              rel="noopener noreferrer"
              class="plausible-event-name=CTA-GitHub chev"
            >Read the credential spec <i>›</i></a>
          </p>
        </div>

        <div class="code">
          <div class="code-tabs" role="tablist">
            <button role="tab" :aria-selected="codeTab === 'credential'" @click="codeTab = 'credential'">credential.json</button>
            <button role="tab" :aria-selected="codeTab === 'verify'" @click="codeTab = 'verify'">verify.sh</button>
            <button role="tab" :aria-selected="codeTab === 'output'" @click="codeTab = 'output'">output</button>
          </div>
          <pre v-if="codeTab === 'credential'"><span class="c">// issued on device, no server involved</span>
{
  <span class="k">"@context"</span>: [<span class="s">"https://www.w3.org/ns/credentials/v2"</span>],
  <span class="k">"type"</span>: [<span class="s">"VerifiableCredential"</span>, <span class="s">"SkillCredential"</span>],
  <span class="k">"issuer"</span>: <span class="s">"did:key:z6MkhaXgBZD…QYtP"</span>,
  <span class="k">"credentialSubject"</span>: {
    <span class="k">"skill"</span>: <span class="s">"welding.pipe.6g"</span>,
    <span class="k">"level"</span>: <span class="s">"apply"</span>,
    <span class="k">"evidence"</span>: <span class="s">"blake3:9f2c…e17a"</span>
  },
  <span class="k">"proof"</span>: { <span class="k">"type"</span>: <span class="s">"Ed25519Signature2020"</span>,
    <span class="k">"anchor"</span>: <span class="s">"cardano:tx/8a41…c92f"</span> }
}</pre>
          <pre v-else-if="codeTab === 'verify'"><span class="c"># works with the network unplugged</span>
<span class="g">$</span> alexandria verify credential.json --offline

<span class="c"># or without Alexandria at all</span>
<span class="g">$</span> npm i -g @digitalbazaar/vc
<span class="g">$</span> vc verify --input credential.json \
     --did-resolver did-key</pre>
          <pre v-else><span class="g">✓</span> signature valid        <span class="c">ed25519 · holder key</span>
<span class="g">✓</span> contents unchanged     <span class="c">blake3 digest match</span>
<span class="g">✓</span> anchor found           <span class="c">cardano tx 8a41…c92f</span>
<span class="g">✓</span> checked offline        <span class="c">0 network calls</span>

<span class="y">GENUINE</span> — issued by the holder, unaltered</pre>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="section pad">
      <p class="eyebrow">One app, the whole system</p>
      <h2 class="h-sec">Everything education needs, with no infrastructure behind it.</h2>
      <p class="p-sub">
        No subscriptions, no data collection — a native app that turns your device into a full
        participant in a global learning network.
      </p>

      <div class="bento-wrap" :class="{ open: featuresOpen }">
        <div class="bento">
          <article
              v-for="feature in features"
            :key="feature.title"
            class="tile tile-accent"
            :class="[feature.span, `accent-${feature.accent}`]"
        >
            <div class="tile-glow" aria-hidden="true" />
            <div class="tile-ic">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
              </svg>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.body }}</p>

            <!-- real plugin screenshots, as on the old page -->
            <div v-if="feature.motif === 'plugins'" class="shots">
              <figure v-for="shot in pluginShots" :key="shot.src">
                <figcaption>{{ shot.label }}</figcaption>
                <img
                  :src="shot.src"
                  :alt="shot.label"
                  :width="shot.w"
                  :height="shot.h"
                  loading="lazy"
                  decoding="async"
                >
              </figure>
            </div>

            <div v-else-if="feature.motif === 'channels'" class="channels">
              <span v-for="(channel, i) in channels" :key="channel" :class="{ on: i === 0 }">
                <b>#</b>{{ channel }}
              </span>
              <p>invite-only · you decide who's in</p>
            </div>

            <!-- Sentinel status, mirroring the panel in SentinelTrainingWizard.vue -->
            <div v-else-if="feature.motif === 'sentinel'" class="shot">
              <div class="shot-bar"><b>Sentinel status</b><span class="mono">3/3 ready</span></div>
              <div class="shot-body">
                <div class="sig" v-for="signal in sentinelSignals" :key="signal.label">
                  <span class="sig-name">{{ signal.label }}</span>
                  <span class="sig-track"><i :style="{ width: `${signal.value}%` }" /></span>
                  <span class="sig-val mono">{{ (signal.value / 100).toFixed(2) }}</span>
                </div>
                <div class="score">
                  <span class="score-n mono">0.94</span>
                  <span class="score-l">Integrity score · <b>High</b></span>
                </div>
                <p class="shot-foot">Quiet snapshots every 15–45s. Raw camera, typing and mouse data never leave this device.</p>
              </div>
            </div>

            <!-- the app's own sidebar skill-graph widget -->
            <div v-else-if="feature.motif === 'graph'" class="shot">
              <div class="shot-bar"><b>Skill map</b><span class="mono">FROM THE APP SIDEBAR</span></div>
              <div class="shot-body">
                <LazySkillGraph hydrate-on-visible :height="196" />
              </div>
            </div>

            <!-- a credential as the app renders it, plus device sync -->
            <div v-else-if="feature.motif === 'credential'" class="shot">
              <div class="shot-bar"><b>Credential</b><span class="mono">SIGNED BY YOU</span></div>
              <div class="shot-body">
                <div class="cred-row">
                  <span class="cred-seal">✦</span>
                  <span>
                    <span class="cred-t">Root pass, 6G pipe</span>
                    <span class="cred-m mono">did:key:z6Mkha…QYtP · ed25519</span>
                  </span>
                  <span class="cred-ok">Genuine</span>
                </div>
                <div class="sync">
                  <span>This Mac</span>
                  <span class="sync-line"><i /></span>
                  <span>Your phone</span>
                </div>
                <p class="shot-foot">Encrypted end to end. Six kinds of credential — yours forever, even if Alexandria disappears.</p>
              </div>
            </div>

            <!-- per-skill distribution with confidence bounds -->
            <div v-else-if="feature.motif === 'reputation'" class="shot">
              <div class="shot-bar"><b>Instructor impact</b><span class="mono">PER SKILL</span></div>
              <div class="shot-body">
                <div v-for="row in reputation" :key="row.skill" class="dist">
                  <span class="dist-name mono">{{ row.skill }}</span>
                  <span class="dist-track">
                    <i class="bound" :style="{ left: `${row.low}%`, width: `${row.high - row.low}%` }" />
                    <i class="point" :style="{ left: `${row.mid}%` }" />
                  </span>
                </div>
                <p class="shot-foot">Bars show confidence bounds — wider means less evidence. No global score anywhere.</p>
              </div>
            </div>

              <ul v-else-if="feature.bullets">
                <li v-for="bullet in feature.bullets" :key="bullet">{{ bullet }}</li>
              </ul>
            </article>
        </div>
        <div v-if="!featuresOpen" class="bento-veil" aria-hidden="true" />
      </div>

      <div class="bento-more">
        <button type="button" class="btn-ghost btn-solid" :aria-expanded="featuresOpen" @click="featuresOpen = !featuresOpen">
          {{ featuresOpen ? 'Right, that is enough. Fold it away.' : `Show the other ${hiddenFeatureCount}. There are, regrettably, more.` }}
        </button>
        <p class="bento-joke">
          {{ featuresOpen
            ? 'Ten. We counted twice and it is still ten. Nobody set out to build ten of anything.'
            : 'We tried to cut this list. Every one of them turned out to be load-bearing.' }}
        </p>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="section section-wash">
      <div class="pad">
        <p class="eyebrow">How it works</p>
        <h2 class="h-sec">From download to credentials you own, in four steps.</h2>
        <p class="p-sub">Nothing in this sequence registers you with anyone — the first step creates your account on the device itself.</p>

        <ol class="flow">
          <li v-for="step in steps" :key="step.n">
            <span class="flow-n">{{ step.n }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ═══ PLATFORMS ═══ -->
    <section class="section pad">
      <p class="eyebrow">Runs everywhere</p>
      <h2 class="h-sec">One codebase. Every platform. Native performance.</h2>

      <div class="platforms">
        <div v-for="platform in platforms" :key="platform.name">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="platform.d" /></svg>
          <span>{{ platform.name }}</span>
        </div>
      </div>
      <p class="platform-note">
        Runs on macOS 10.15+, Windows 10+, Linux, iOS 16.4+, and Android 9+.
        For live video tutoring on Android we recommend a device with 6&nbsp;GB+ RAM.
      </p>
    </section>

    <!-- ═══ AUDIENCES ═══ -->
    <section class="section pad">
      <p class="eyebrow">Beyond learners</p>
      <h2 class="h-sec">Proof that travels to the people who need it.</h2>
      <p class="p-sub">The same credential a learner earns is the one a recruiter checks and an institution issues.</p>

      <div class="aud">
        <article class="aud-card">
          <div class="aud-rule aud-rule-r" />
          <div class="aud-body">
            <p class="aud-tag" style="color: rgb(var(--color-recruiter))">For recruiters</p>
            <h3>Hire verified talent, not resumes.</h3>
            <p>Discover candidates through credentials you can verify yourself and a transparent record of how they learned.</p>
            <div class="aud-pills">
              <span>Skill-based discovery</span>
              <span>Full record behind each credential</span>
              <span>Candidate consent required</span>
            </div>
            <NuxtLink to="/employers" class="plausible-event-name=Nav-Recruiter chev" style="color: rgb(var(--color-recruiter))">
              Explore for employers <i>›</i>
            </NuxtLink>
          </div>
        </article>

        <article class="aud-card">
          <div class="aud-rule aud-rule-i" />
          <div class="aud-body">
            <p class="aud-tag" style="color: rgb(var(--color-institution))">For institutions</p>
            <h3>Your LMS, their credentials.</h3>
            <p>An open-source LMS where students own credentials they can prove anywhere, and institutions keep full control.</p>
            <div class="aud-pills">
              <span>Free self-hosted tier</span>
              <span>Skill-mapped curriculum</span>
              <span>Zero vendor lock-in</span>
            </div>
            <NuxtLink to="/institutions" class="plausible-event-name=Nav-Institutions chev" style="color: rgb(var(--color-institution))">
              Explore for institutions <i>›</i>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>


    <!-- ═══ FREE FOREVER ═══ -->
    <section id="free" class="section pad section-wash">
      <p class="eyebrow">Free forever</p>
      <h2 class="h-sec">Free cannot be a promise. It has to be a structure.</h2>
      <p class="p-sub">
        Right now, it is still a promise — and we should say that plainly, because every platform
        that started free and ended paywalled was telling the truth at the time too. Here is what
        actually holds today, and what we are putting in place so it stops depending on us.
      </p>

      <div class="free-grid">
        <article class="free-card">
          <StatusChip state="alpha" label="Real today" />
          <h3>A fork always exists</h3>
          <p>
            The core is MIT-licensed. If we ever betrayed this, the work could be taken and run by
            anyone, without our permission and without our cooperation. That is a floor, not a
            ceiling — but it is a real one, and you can check it.
          </p>
          <a
            href="https://github.com/ifftu-dev/alexandria/blob/main/LICENSE.md"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-GitHub"
          >Read the licence</a>
        </article>

        <article class="free-card">
          <StatusChip state="planned" label="Not drafted yet" />
          <h3>A non-profit veto over free access</h3>
          <p>
            The intended structure: a permanent, dilution-proof veto over free learner access, held
            by IFFTU as a Section 8 non-profit — so that nobody, including us and including a future
            investor, can charge a learner for their own proof.
          </p>
          <p class="free-gap">
            The instrument does not exist yet. When it is executed we will publish the clause here,
            and you can hold us to the distance between this paragraph and that one.
          </p>
        </article>

        <article class="free-card">
          <h3>Why not simply promise?</h3>
          <p>
            Because a promise is exactly what every paywalled platform once made. A guarantee that
            depends on the continued good intentions of the people who benefit from breaking it is
            not a guarantee. The point of the structure is to remove our own ability to change our
            minds.
          </p>
        </article>
      </div>
    </section>

    <!-- ═══ WHO PAYS ═══ -->
    <section class="section pad">
      <p class="eyebrow">Who pays</p>
      <h2 class="h-sec">Free for learners. Paid for organisations.</h2>
      <p class="p-sub">
        The split is deliberate, and it is the whole business model. Learning, owning a credential and
        proving it are free permanently. Organisations pay for running this at scale — never for a
        learner's right to their own proof.
      </p>
      <div class="who">
        <article class="who-card">
          <h3>Always free</h3>
          <ul>
            <li>Taking courses and assessments</li>
            <li>Earning and holding credentials</li>
            <li>Proving one to anybody, forever</li>
            <li>Running the app, self-hosting the core</li>
          </ul>
          <StatusChip state="alpha" label="True in the alpha today" />
        </article>
        <article class="who-card">
          <h3>What organisations pay for</h3>
          <ul>
            <li>Managed hosting and operations</li>
            <li>SSO, SIS and ATS integrations</li>
            <li>Team workflows and shared review</li>
            <li>Support, migration and deployment</li>
          </ul>
          <StatusChip state="planned" label="Planned · nothing purchasable yet" />
        </article>
      </div>

      <div class="who-share">
        <p class="who-share-n">40%</p>
        <p class="who-share-t">
          <b>of everything earned goes to the educators who create the skills.</b>
          Not as a revenue-share experiment — as the point. Charity that runs out is not permanence;
          the commons stays open because the people getting commercial value from it pay for it.
        </p>
      </div>
    </section>

    <!-- ═══ WHERE WE ACTUALLY ARE ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">Where we actually are</p>
      <h2 class="h-sec">Built, shipped, and unproven.</h2>
      <p class="p-sub">
        Two lists, because a page that only tells you what works has told you what it wants to be
        true.
      </p>
      <div class="state">
        <article class="state-card state-yes">
          <h3>Works today</h3>
          <ul>
            <li v-for="item in worksToday" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="state-card state-no">
          <h3>Does not yet</h3>
          <ul>
            <li v-for="item in notYet" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
      <p class="state-close">
        Two claims underpin the whole project and neither has evidence behind it: that employers
        will pay for verified skill, and that a credential like this earns real recognition.
        <NuxtLink to="/why-recognition">Both are written down, with what would change our minds</NuxtLink>.
      </p>
    </section>

    <!-- ═══ TRUST ═══ -->
    <section class="section pad">
      <p class="eyebrow">Check for yourself</p>
      <h2 class="h-sec">Nothing here asks to be taken on faith.</h2>
      <div class="trust-strip">
        <NuxtLink to="/verify" class="trust-item plausible-event-name=Nav-Verify">
          <b>Verify a credential</b><span>Checked in your browser, no account</span>
        </NuxtLink>
        <NuxtLink to="/technology" class="trust-item">
          <b>Read the format</b><span>The stack and credential scheme, named</span>
        </NuxtLink>
        <NuxtLink to="/trust" class="trust-item">
          <b>What we can claim</b><span>Security and compliance, dated</span>
        </NuxtLink>
        <a href="https://github.com/ifftu-dev/alexandria" target="_blank" rel="noopener noreferrer" class="trust-item plausible-event-name=CTA-GitHub">
          <b>Read the source</b><span>MIT core, enterprise modules separate</span>
        </a>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="cta">
      <MeshGradient />
      <div class="hero-scrim" />
      <div class="pad cta-inner">
        <h2>Get in the queue.</h2>
        <p>Individuals join the waiting list and we write when it is their turn. Organisations run a pilot: one programme or one role family, with success measures agreed before anyone starts.</p>
        <div class="cta-row">
          <button type="button" class="btn btn-lg plausible-event-name=EarlyAccess" @click="waitlist.open()">
            Join the waiting list
          </button>
          <NuxtLink to="/pilots" class="plausible-event-name=Nav-Pilots btn-ghost">Run a pilot</NuxtLink>
        </div>
        <p class="cta-alt">
          Prefer to read the code first?
          <a
            href="https://github.com/ifftu-dev/alexandria"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-GitHub"
          >It's all on GitHub</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tag-link { color: rgb(255 255 255 / 0.9); text-decoration: underline; text-underline-offset: 2px; }
.who { display: grid; gap: 16px; margin-top: 26px; }
@media (min-width: 780px) { .who { grid-template-columns: 1fr 1fr; } }
.who-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.who-card h3 { margin: 0 0 12px; font-size: 15.5px; letter-spacing: -0.01em; }
.who-card ul { list-style: revert; margin: 0 0 14px; padding-inline-start: 18px; display: grid; gap: 7px; }
.who-card li { font-size: 14px; line-height: 1.5; color: rgb(var(--color-muted-foreground)); }

.trust-strip { display: grid; gap: 12px; margin-top: 22px; }
@media (min-width: 700px) { .trust-strip { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1040px) { .trust-strip { grid-template-columns: repeat(4, 1fr); } }
.trust-item {
  display: block; padding: 16px 18px; border-radius: 14px; text-decoration: none;
  border: 1px solid rgb(var(--color-border)); background: rgb(var(--color-card));
  transition: border-color 150ms ease, transform 150ms ease;
}
.trust-item:hover { border-color: rgb(var(--color-primary) / 0.5); transform: translateY(-2px); }
.trust-item b { display: block; font-size: 14px; color: rgb(var(--color-foreground)); }
.trust-item span { display: block; margin-top: 4px; font-size: 12.5px; line-height: 1.5; color: rgb(var(--color-muted-foreground)); }

</style>
