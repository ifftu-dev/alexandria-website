<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Alexandria for Institutions — Your LMS, Their Credentials',
  meta: [
    { name: 'description', content: 'The open-source LMS that gives credentials back to students: W3C Verifiable Credentials they own and keep, skill-mapped curricula, and no vendor lock-in.' },
    { property: 'og:title', content: 'Alexandria for Institutions — Your LMS, Their Credentials' },
    { property: 'og:description', content: 'An open-source LMS where students own credentials they can prove anywhere, every skill is mapped, and students keep their achievements forever.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/institutions' },
    { property: 'og:image', content: 'https://alexandria.ifftu.dev/og/institutions.jpg' },
    { property: 'og:image:alt', content: 'Alexandria for institutions — your LMS, their credentials.' },
    { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og/institutions.jpg' },
    { name: 'twitter:image:alt', content: 'Alexandria for institutions — your LMS, their credentials.' },
    { name: 'twitter:title', content: 'Alexandria for Institutions — Your LMS, Their Credentials' },
    { name: 'twitter:description', content: 'An open-source LMS where students own credentials they can prove anywhere and keep their achievements forever.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/institutions' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Alexandria for Institutions',
        'description': 'The open-source LMS that gives credentials back to students. Credentials students can prove anywhere, skill-mapped curricula, FERPA/GDPR support in progress.',
        'url': 'https://alexandria.ifftu.dev/institutions',
        'isPartOf': { '@type': 'WebSite', 'name': 'Alexandria', 'url': 'https://alexandria.ifftu.dev' },
      }),
    },
  ],
})

const GITHUB_URL = 'https://github.com/ifftu-dev/alexandria'
const INSTITUTION_BLOBS = ['37,99,235', '129,140,248', '96,165,250', '34,211,238', '79,70,229']

const promises = [
  {
    title: 'Credentials students truly own',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    body: "Signed under the student's own identity and made tamper-proof, so employers can check them independently — even offline, with no middleman. Students keep them permanently.",
    tech: 'W3C Verifiable Credentials · student DID · hash-anchored to Cardano',
  },
  {
    title: 'Skill-mapped curriculum',
    icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z',
    body: "Map every course, module and assessment to a skill taxonomy with Bloom's levels. See exactly which skills your programs actually develop.",
  },
  {
    title: 'No single point of failure',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9M3 12h18',
    body: 'Course content is shared directly between devices, so it stays available even if the platform goes down — no central server to take it offline.',
    tech: 'Content-addressed with BLAKE3 · distributed peer-to-peer via iroh',
  },
]

const categories = [
  { key: 'core', label: 'Core LMS' },
  { key: 'diff', label: 'Unfair advantages' },
  { key: 'admin', label: 'Administration' },
  { key: 'analytics', label: 'Analytics & outcomes' },
] as const

type CategoryKey = typeof categories[number]['key']
const activeCategory = ref<CategoryKey>('core')

const featuresByCategory: Record<CategoryKey, { title: string, body: string, planned?: boolean }[]> = {
  core: [
    { title: 'Course authoring & delivery', body: 'Multimedia content, structured modules, release conditions, prerequisite chains and adaptive pathways.' },
    { title: 'Assignments, quizzes & gradebook', body: 'Rubrics, auto-grading, peer review, and a unified gradebook with weighted categories, late policies and bulk actions.', planned: true },
    { title: 'Discussion forums', body: 'Threaded discussions with rich text, inline media, mentions and instructor endorsement. Graded participation supported.', planned: true },
    { title: 'Video lectures', body: 'Chaptering, speed controls, in-video quizzes and automatic transcription. No third-party streaming fees.', planned: true },
    { title: 'Mobile-responsive with offline', body: 'Native app across desktop and mobile. Students download content for offline access and sync progress when reconnected.' },
  ],
  diff: [
    { title: 'Credentials students truly own', body: "Signed under the student's identity, tamper-proof, checkable by employers with no middleman. Kept permanently." },
    { title: 'Skill-mapped curriculum', body: "Every course, module and assessment mapped to a taxonomy with Bloom's proficiency levels." },
    { title: 'Credential-backed portfolios', body: 'Students build credentials for graded work, peer reviews and projects — every skill claim backed by proof anyone can check.' },
    { title: 'Outcome-derived instructor reputation', body: 'Instructor quality measured through student outcomes and earned credentials, not popularity surveys. Scoped to skills.' },
    { title: 'No single point of failure', body: 'Content shared device to device, so it survives the platform going down.' },
  ],
  admin: [
    { title: 'Multi-department management', body: 'Colleges, departments and programs in a hierarchy. Delegate administration while keeping institutional oversight.', planned: true },
    { title: 'SIS integration', body: 'Bi-directional sync via REST APIs. Automate enrolments, grade passback and student records.', planned: true },
    { title: 'SSO via SAML/OIDC', body: 'SAML 2.0 and OpenID Connect against Active Directory, Okta, Auth0 or a custom provider.', planned: true },
    { title: 'Custom branding', body: 'White-label with your logo, colours, typography and domain.', planned: true },
    { title: 'FERPA/GDPR compliance', body: 'Self-hosted deployment, student-controlled keys, no personal data recorded publicly. Role-based access, retention policies and audit logging are on the roadmap.' },
    { title: 'LTI 1.3 & SCORM/xAPI import', body: 'Bring existing content: LTI 1.3 tools, SCORM 1.2/2004 packages, xAPI statement tracking.', planned: true },
  ],
  analytics: [
    { title: 'Real-time learning analytics', body: 'Live dashboards for engagement, completion and performance. Drill from institutional overview to individual activity.', planned: true },
    { title: 'Skill gap analysis', body: 'See which skills your curriculum develops well and where gaps are. Compare intended outcomes against measured proficiency.' },
    { title: 'Instructor effectiveness', body: 'Outcome-based analytics tied to student results. Identify effective teaching patterns — without popularity contests.' },
    { title: 'Predictive at-risk identification', body: 'Models flag students showing early warning signals, with data-driven intervention recommendations.', planned: true },
    { title: 'Accreditation-ready reports', body: 'Reports mapped to accreditation standards — evidence-backed documentation of learning outcomes.', planned: true },
  ],
}

type Cell = true | false | string
interface Row { feature: string, alexandria: Cell, canvas: Cell, blackboard: Cell, moodle: Cell }

const comparison: Row[] = [
  // Licensing and hosting. Canvas is genuinely open source (AGPLv3) and saying
  // otherwise was the single worst error in the old version of this table.
  { feature: 'Open source', alexandria: 'MIT (core)', canvas: 'AGPLv3', blackboard: false, moodle: 'GPL' },
  { feature: 'Self-hosted option', alexandria: true, canvas: true, blackboard: 'Extended support only', moodle: true },
  { feature: 'Runs with no server at all †', alexandria: true, canvas: false, blackboard: false, moodle: false },
  { feature: 'Content shared device to device', alexandria: true, canvas: false, blackboard: false, moodle: false },

  // Credentials. All three incumbents issue Open Badges — two of them on 3.0,
  // which is the W3C VC data model. The difference is who holds the signing
  // key, not whether the format is verifiable.
  //
  // There is deliberately no "still verifies if the issuer disappears" row.
  // It is true of us, but whether it is false of them turns on their choice of
  // DID method and where they host status lists — someone else's
  // implementation detail, which can change without telling us. The
  // learner-signed row makes the same point and stays true on its own terms;
  // the offline consequence is in the footnote.
  { feature: 'Open Badges 3.0 / W3C VC data model', alexandria: true, canvas: true, blackboard: true, moodle: 'Planned (2.0 today)' },
  { feature: 'Credential signed by the learner, not the platform', alexandria: true, canvas: false, blackboard: false, moodle: false },

  // Skills. Competency tagging is table stakes; a shared graph is not.
  { feature: 'Competency mapping inside the platform', alexandria: true, canvas: true, blackboard: true, moodle: true },
  { feature: 'Shared skill graph across institutions', alexandria: true, canvas: false, blackboard: false, moodle: false },
  { feature: 'Prerequisites and Bloom levels on every skill', alexandria: true, canvas: false, blackboard: false, moodle: false },

  // Where we are behind. These rows are the reason the table is worth showing.
  { feature: 'LTI 1.3 support', alexandria: 'Planned', canvas: true, blackboard: true, moodle: true },
  { feature: 'SCORM / xAPI', alexandria: 'Planned', canvas: 'Limited', blackboard: true, moodle: true },
  { feature: 'SSO (SAML/OIDC)', alexandria: 'Planned', canvas: true, blackboard: true, moodle: true },
  { feature: 'FERPA/GDPR ready', alexandria: 'In progress', canvas: true, blackboard: true, moodle: 'Varies' },
  { feature: 'Predictive analytics', alexandria: 'Planned', canvas: 'Add-on', blackboard: 'Add-on', moodle: 'Core' },
  { feature: 'Mobile app', alexandria: true, canvas: true, blackboard: true, moodle: true },
  { feature: 'Per-student cost, per year', alexandria: 'Free / $24', canvas: '$5-30*', blackboard: '$17-26*', moodle: 'Free + hosting' },
]

const onlyDifferences = ref(false)

// "Where we differ" means no incumbent matches us — the rows that actually
// distinguish Alexandria, in both directions. It keeps the rows where we are
// behind (LTI, SCORM, SSO are all "Planned"), which is the point of the table.
const visibleRows = computed(() => {
  if (!onlyDifferences.value) return comparison
  return comparison.filter(row =>
    row.canvas !== row.alexandria
    && row.blackboard !== row.alexandria
    && row.moodle !== row.alexandria,
  )
})

const tiers = [
  {
    name: 'Community',
    price: 'Free',
    period: 'self-hosted, forever',
    desc: 'Full-featured LMS for institutions that want complete control.',
    features: [
      'Unlimited students & courses',
      'All core LMS features',
      'Live code editors & interactive assessments',
      'Custom assessment types as sandboxed plugins',
      'Student-owned credentials + anchoring',
      'Skill-mapped curriculum',
      'Community support via GitHub',
    ],
    cta: 'View on GitHub',
    highlighted: false,
  },
  {
    name: 'Academic',
    price: '$2',
    period: 'per student / month',
    desc: 'Managed hosting with premium support for universities and colleges.',
    features: [
      'Everything in Community',
      'Managed cloud hosting',
      'SIS integration & SSO',
      'Custom branding & domain',
      'Predictive analytics',
      'Priority email & chat support',
      '99.9% uptime SLA',
    ],
    cta: 'Request a demo',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored to your needs',
    desc: 'Dedicated infrastructure, white-glove migration, strategic partnership.',
    features: [
      'Everything in Academic',
      'Dedicated infrastructure',
      'White-glove migration',
      'Custom integrations',
      'On-premise deployment option',
      'Dedicated success manager',
      'Custom SLA & compliance',
    ],
    cta: 'Talk to us',
    highlighted: false,
  },
]

const faqs = [
  {
    q: 'Do students really own their credentials?',
    a: "Yes. Each credential is signed under the student's own identity and made tamper-proof, and students can export self-contained copies that anyone can check offline — independent of Alexandria. If the platform disappears, the credentials remain provable forever.",
    tech: "W3C Verifiable Credential signed under the student's DID (did:key / Ed25519), hash anchored to Cardano in a metadata-only transaction.",
  },
  {
    q: 'What happens to credentials if we leave Alexandria?',
    a: 'Nothing changes for the students. Credentials are already signed under their own identity and tamper-proof, so anyone can still check them with or without Alexandria. Course content is shared directly between devices, so any device holding a copy can keep serving it. There is no vendor lock-in by design.',
    tech: 'Content-addressed with BLAKE3, distributed peer-to-peer.',
  },
  {
    q: 'How does the skill-mapped curriculum work?',
    a: "You map each course, module and assessment to skills in a taxonomy with Bloom's proficiency levels (Remember through Create). The system tracks how each student progresses across skills based on actual assessment evidence, giving a real-time view of what your curriculum actually teaches.",
  },
  {
    q: 'Can we migrate from Canvas, Blackboard or Moodle?',
    a: 'LTI 1.3 tool integration, SCORM 1.2/2004 package import and xAPI statement ingestion are on the roadmap. Once available, these will enable bulk content transfer from major LMS platforms.',
  },
  {
    q: 'How is instructor reputation different from student evaluations?',
    a: 'Traditional student evaluations measure popularity and are well-documented to be biased. Alexandria derives instructor reputation from student outcomes — actual skill progression and the credentials learners earn — as a per-skill distribution with confidence bounds. Reputation is scoped to specific skills, never a single global score.',
  },
  {
    q: 'Is the Community tier actually free?',
    a: 'Yes. Alexandria is open-core: the core app is MIT-licensed open-source, with enterprise modules under a separate IFFTU Enterprise License. The Community tier is self-hosted and completely free — no feature restrictions, no student caps, no hidden costs. You run it on your own infrastructure.',
  },
  {
    q: 'What about FERPA compliance?',
    a: 'Alexandria is designed with FERPA compliance in mind. The self-hosted deployment model keeps data in your jurisdiction, and credentials are signed under identities the student controls — only a tamper-proof fingerprint is recorded publicly, so no personal data is ever exposed. Students can share just the level they reached, not the full credential. Role-based access controls, audit logging, data retention policies and consent management tooling are on the roadmap.',
    tech: 'Student-controlled DIDs · only a hash anchored on-chain · selective disclosure of credential fields.',
  },
]

// Structured data for the FAQ below. Built from the same array the page
// renders, so the two cannot drift apart — a mismatch between visible text and
// FAQ markup is the thing Google penalises here. Kept as its own useHead call
// because `faqs` is declared after the one at the top of this file.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': faq.tech ? `${faq.a} ${faq.tech}` : faq.a },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div class="accent-institution">
    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <MeshGradient :blobs="INSTITUTION_BLOBS" base="#08132e" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-split">
        <div>
          <p class="eyebrow hero-eyebrow">Alexandria for Institutions</p>
          <p class="notice">
            <span aria-hidden="true">⚠</span>
            <span><b>Not built yet.</b> This page describes what we're building — institution features are not implemented.</span>
          </p>
          <h1>Your LMS, their credentials.</h1>
          <p class="hero-lede">
            An open-source learning management system where students own credentials they can prove
            anywhere, curricula map to real skills, and institutions keep full control.
          </p>
          <div class="hero-cta">
            <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub btn">Request a demo</a>
            <a href="#features" class="btn-ghost">Explore features</a>
          </div>
          <div class="trust">
            <span><i />Student-owned credentials</span>
            <span><i />Open-core (MIT)</span>
            <span><i />FERPA/GDPR in progress</span>
            <span><i />Zero vendor lock-in</span>
          </div>
        </div>

        <LazyCurriculumMap hydrate-on-idle />
      </div>
    </section>

    <!-- ═══ PROMISE ═══ -->
    <section class="section pad">
      <p class="eyebrow">The promise</p>
      <h2 class="h-sec">The LMS that gives credentials back to students.</h2>
      <p class="p-sub">
        Most learning platforms lock credentials inside their walls. Alexandria makes them portable,
        verifiable and permanently student-owned.
      </p>

      <div class="tiles">
        <article v-for="item in promises" :key="item.title" class="tile">
          <div class="tile-ic">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
            </svg>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
          <p v-if="item.tech" class="tile-tech">{{ item.tech }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ FEATURE TABS ═══ -->
    <section id="features" class="section section-wash">
      <div class="pad">
        <p class="eyebrow">Capabilities</p>
        <h2 class="h-sec">Everything you need. Nothing you don't.</h2>
        <p class="p-sub">
          A complete LMS with capabilities no other platform offers — open-source, and built for
          institutions that care what credentials actually mean.
        </p>

        <div class="tabs" role="tablist">
          <button
            v-for="category in categories"
            :key="category.key"
            type="button"
            role="tab"
            :aria-selected="activeCategory === category.key"
            @click="activeCategory = category.key"
          >
            {{ category.label }}
          </button>
        </div>

        <div :key="activeCategory" class="tabpanel">
          <article v-for="feature in featuresByCategory[activeCategory]" :key="feature.title" class="tile">
            <h3>
              {{ feature.title }}
              <span v-if="feature.planned" class="planned">Planned</span>
            </h3>
            <p>{{ feature.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══ COMPARISON ═══ -->
    <section class="section pad">
      <p class="eyebrow">Honest comparison</p>
      <h2 class="h-sec">How Alexandria compares.</h2>
      <p class="p-sub">Checked against vendor documentation in July 2026 — including the rows where we are behind.</p>

      <div class="tablewrap">
        <div class="tablescroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col" class="us">Alexandria</th>
                <th scope="col">Canvas</th>
                <th scope="col">Blackboard</th>
                <th scope="col">Moodle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in visibleRows" :key="row.feature">
                <td>{{ row.feature }}</td>
                <td class="us" :class="{ 'mark-yes': row.alexandria === true, 'mark-no': row.alexandria === false }">
                  {{ typeof row.alexandria === 'string' ? row.alexandria : '' }}
                </td>
                <td :class="{ 'mark-yes': row.canvas === true, 'mark-no': row.canvas === false }">
                  {{ typeof row.canvas === 'string' ? row.canvas : '' }}
                </td>
                <td :class="{ 'mark-yes': row.blackboard === true, 'mark-no': row.blackboard === false }">
                  {{ typeof row.blackboard === 'string' ? row.blackboard : '' }}
                </td>
                <td :class="{ 'mark-yes': row.moodle === true, 'mark-no': row.moodle === false }">
                  {{ typeof row.moodle === 'string' ? row.moodle : '' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="tablebar">
          <label class="switch">
            <input v-model="onlyDifferences" type="checkbox">
            <span class="track" />
            Only show where we differ
          </label>
          <p>{{ visibleRows.length }} of {{ comparison.length }} rows</p>
        </div>
        <p class="tablenote">
          * Neither vendor publishes list pricing on its own site; both quote per institution, and
          large buyers negotiate below any published figure. The Blackboard range converts a
          published UK G-Cloud framework rate for Learn SaaS (£13-£20 per user); the Canvas range is
          a third-party estimate. Alexandria's $24 is the Academic tier at $2 per student per month
          — inside Canvas's range, under Blackboard's framework rate, and above what the largest
          institutions negotiate on Canvas. The Community tier stays free at any size. Every other
          row here comes from vendor documentation, checked July 2026 — including the rows where an
          incumbent is ahead of us.
        </p>
        <p class="tablenote">
          † Relay servers do exist, for finding other people. Anyone can run one, they hold no
          authority over what passes through them, and no course or credential depends on ours
          staying up. Because a learner signs their own credentials under a key only they control,
          verifying one needs nothing but the file itself — no lookup with us, no network, and it
          keeps working if this project stops existing.
        </p>
      </div>
    </section>

    <!-- ═══ PRICING ═══ -->
    <section id="pricing" class="section section-wash">
      <div class="pad">
        <p class="eyebrow">Pricing</p>
        <h2 class="h-sec">Simple, transparent pricing.</h2>
        <p class="p-sub">Start free. Scale when you're ready. No surprises.</p>

        <div class="prices">
          <article v-for="tier in tiers" :key="tier.name" class="price" :class="{ 'price-hot': tier.highlighted }">
            <h3>{{ tier.name }}</h3>
            <div class="amt">{{ tier.price }}</div>
            <div class="per">{{ tier.period }}</div>
            <p class="desc">{{ tier.desc }}</p>
            <ul>
              <li v-for="item in tier.features" :key="item">{{ item }}</li>
            </ul>
            <a
              :href="GITHUB_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="plausible-event-name=CTA-GitHub"
              :class="tier.highlighted ? 'btn' : 'btn-out'"
            >{{ tier.cta }}</a>
          </article>
        </div>
        <p class="p-sub" style="font-size: 12.5px; margin-top: 16px">Final pricing will be confirmed at launch.</p>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="section pad">
      <p class="eyebrow">Questions</p>
      <h2 class="h-sec">Frequently asked questions.</h2>
      <p class="p-sub">Everything you need to know about deploying Alexandria at your institution.</p>

      <div class="faq">
        <details v-for="(faq, i) in faqs" :key="faq.q" :open="i === 0">
          <summary>{{ faq.q }}</summary>
          <div class="ans">
            {{ faq.a }}
            <p v-if="faq.tech" class="tech">{{ faq.tech }}</p>
          </div>
        </details>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="cta">
      <MeshGradient :blobs="INSTITUTION_BLOBS" base="#08132e" />
      <div class="hero-scrim" />
      <div class="pad cta-inner">
        <h2>Give your students credentials they actually own.</h2>
        <p>Join the institutions building an open, verifiable future for education. Free to start. Open-source forever.</p>
        <div class="cta-row">
          <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub btn">Request a demo</a>
          <NuxtLink to="/recruiter" class="plausible-event-name=Nav-Recruiter btn-ghost">For recruiters</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
