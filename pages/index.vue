<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Alexandria — Free Learning, Credentials You Own',
  meta: [
    { name: 'description', content: 'A free, open-source learning app for macOS, Windows, Linux, iOS, and Android. Study offline, earn credentials you truly own, and keep your learning and data on your own device — no accounts, no tracking.' },
    { property: 'og:title', content: 'Alexandria — Free Learning, Credentials You Own' },
    { property: 'og:description', content: 'A free learning app for every device. Study offline, earn credentials that are truly yours, and keep your data on your own device.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/' },
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

const { download, allPlatformsUrl, releaseTag } = useDownload()

const features = [
  {
    span: 'span-4',
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
    title: 'Credentials you own',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    body: 'Signed under your own identity and made tamper-proof, so anyone can check it — even offline, even without Alexandria.',
  },
  {
    span: 'span-3',
    title: 'Teach and assess anything',
    icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82c-1.517.19-3.058.309-4.616.354a.64.64 0 01-.657-.643z',
    body: 'Video, text and multiple choice are not enough. Plugins let Alexandria teach and assess welding, music, engineering, surgery, and beyond.',
  },
  {
    span: 'span-3',
    title: 'Classrooms and live tutoring',
    icon: 'M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342',
    body: 'Channels for the class, plus one-on-one video, audio and screen-share device to device. No call runs through a company.',
  },
  {
    span: 'span-3',
    title: 'Reputation without the star rating',
    icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
    body: 'Instructors are scored on their impact on learners — a per-skill distribution with confidence bounds, not one global number.',
  },
  {
    span: 'span-3',
    title: 'Own your data',
    icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z',
    body: 'Your identity and content live only on your device, encrypted, syncing directly between your own devices. The relays that help you connect cannot read a thing.',
  },
]

const stats = [
  { n: '5', label: 'Platforms', detail: 'One codebase, native on each' },
  { n: '9', label: 'Languages', detail: 'Hindi, Bengali and Telugu at launch' },
  { n: '6', label: 'Credential kinds', detail: 'Share only what you choose' },
  { n: '0', label: 'Accounts or servers', detail: 'Identity is made on your device' },
  { n: '100%', label: 'On-device integrity', detail: 'Camera and keystrokes never uploaded' },
]

const codeTab = ref<'credential' | 'verify' | 'output'>('credential')
</script>

<template>
  <div>
    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <MeshGradient />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">One app · five platforms · nine languages</p>
        <h1>Knowledge belongs to everyone.</h1>
        <p class="hero-lede">
          Free, open-source learning for every device. Study offline, own the credentials you earn,
          and keep your data on your own device — no accounts, no servers, no tracking.
        </p>
        <div class="hero-cta">
          <a
            v-if="download.installable"
            :href="download.downloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-Download btn"
          >{{ download.ctaLabel }}</a>
          <span v-else class="btn-ghost">{{ download.ctaLabel }}</span>
          <a
            href="https://github.com/ifftu-dev/alexandria"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-GitHub btn-ghost"
          >View the source</a>
        </div>
        <p class="hero-note">
          <a v-if="releaseTag" :href="allPlatformsUrl" target="_blank" rel="noopener noreferrer" class="tag-link">{{ releaseTag }}</a>
          <span v-if="releaseTag"> · </span>MIT core · macOS, Windows, Linux, iOS, Android
        </p>
      </div>
    </section>

    <!-- ═══ APP WINDOW, straddling the fold ═══ -->
    <div class="pad shelf">
      <div class="shelf-window">
        <AppReplica />
      </div>
      <p class="shelf-cap">
        The real shell — press <b>/</b> for search, open <b>Skills &amp; Credentials</b> and verify one
      </p>
    </div>

    <!-- ═══ FEATURES ═══ -->
    <section class="section pad">
      <p class="eyebrow">One app, the whole system</p>
      <h2 class="h-sec">Everything education needs, with no infrastructure behind it.</h2>
      <p class="p-sub">
        No subscriptions, no data collection — a native app that turns your device into a full
        participant in a global learning network.
      </p>

      <div class="bento">
        <article v-for="feature in features" :key="feature.title" class="tile" :class="feature.span">
          <div class="tile-ic">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
            </svg>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.body }}</p>
          <ul v-if="feature.bullets">
            <li v-for="bullet in feature.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- ═══ STATS ═══ -->
    <section class="band">
      <div class="pad">
        <p class="eyebrow">Built to outlast us</p>
        <h2 class="h-sec">The numbers that actually matter.</h2>
        <div class="stats">
          <div v-for="stat in stats" :key="stat.label">
            <div class="stat-n">{{ stat.n }}</div>
            <div class="stat-l"><b>{{ stat.label }}</b>{{ stat.detail }}</div>
          </div>
        </div>
      </div>
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
            <NuxtLink to="/recruiter" class="plausible-event-name=Nav-Recruiter chev" style="color: rgb(var(--color-recruiter))">
              Explore recruiting <i>›</i>
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

    <!-- ═══ CTA ═══ -->
    <section class="cta">
      <MeshGradient />
      <div class="hero-scrim" />
      <div class="pad cta-inner">
        <h2>Start learning. Own your credentials.</h2>
        <p>Alexandria runs on every platform and is free for learners, forever.</p>
        <div class="cta-row">
          <a
            v-if="download.installable"
            :href="download.downloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-Download btn"
          >{{ download.ctaLabel }}</a>
          <a
            href="https://github.com/ifftu-dev/alexandria"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-GitHub btn-ghost"
          >Star on GitHub</a>
          <a
            href="https://x.com/Alexandria_FTU"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-Follow btn-ghost"
          >Follow for updates</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tag-link { color: rgb(255 255 255 / 0.9); text-decoration: underline; text-underline-offset: 2px; }
</style>
