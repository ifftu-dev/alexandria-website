<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Alexandria for Institutions — Your LMS, Their Credentials',
  meta: [
    { name: 'description', content: 'The open-source LMS that gives credentials back to students. Blockchain-verified, skill-mapped, and decentralised by default. FERPA/GDPR ready with zero vendor lock-in.' },
    { property: 'og:title', content: 'Alexandria for Institutions — Your LMS, Their Credentials' },
    { property: 'og:description', content: 'An open-source LMS where every credential is blockchain-verified, every skill is structurally mapped, and students own their achievements forever.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/institutions' },
    { name: 'twitter:title', content: 'Alexandria for Institutions — Your LMS, Their Credentials' },
    { name: 'twitter:description', content: 'An open-source LMS where every credential is blockchain-verified and students own their achievements forever.' },
  ],
  link: [
    { rel: 'canonical', href: 'https://alexandria.ifftu.dev/institutions' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Alexandria for Institutions',
        description: 'The open-source LMS that gives credentials back to students. Blockchain-verified, skill-mapped, FERPA/GDPR ready.',
        url: 'https://alexandria.ifftu.dev/institutions',
        isPartOf: { '@type': 'WebSite', name: 'Alexandria', url: 'https://alexandria.ifftu.dev' },
      }),
    },
  ],
})

const GITHUB_URL = 'https://github.com/ifftu-dev/alexandria'

// ─── Tabbed Features ───
const activeCategory = ref('core')

const featureCategories = [
  { key: 'core', label: 'Core LMS' },
  { key: 'differentiators', label: "Alexandria's Unfair Advantages" },
  { key: 'admin', label: 'Institutional Administration' },
  { key: 'analytics', label: 'Analytics & Outcomes' },
]

const featuresByCategory: Record<string, Array<{ title: string, description: string, icon: string }>> = {
  core: [
    { title: 'Course Authoring & Delivery', description: 'Build rich courses with multimedia content, structured modules, and flexible release conditions. Supports drag-and-drop organisation, prerequisite chains, and adaptive pathways.', icon: 'pen' },
    { title: 'Assignments, Quizzes & Gradebook', description: 'Full-featured assessment engine with rubrics, auto-grading, peer review, and a unified gradebook with weighted categories, late policies, and bulk actions.', icon: 'clipboard' },
    { title: 'Discussion Forums', description: 'Threaded discussions with rich text, inline media, @mentions, and instructor endorsement. Supports graded participation and topic pinning.', icon: 'chat' },
    { title: 'Video Lectures', description: 'Integrated video hosting with chaptering, speed controls, in-video quizzes, and automatic transcription. No third-party streaming fees.', icon: 'video' },
    { title: 'Mobile-Responsive with Offline', description: 'Progressive web app that works across all devices. Students can download content for offline access and sync progress when reconnected.', icon: 'mobile' },
  ],
  differentiators: [
    { title: 'Blockchain-Verified Credentials', description: 'Every credential minted as an NFT on Cardano with full metadata on IPFS. Students own them permanently. Employers verify them independently. No middleman.', icon: 'shield' },
    { title: 'Skill-Mapped Curriculum', description: 'Map every course, module, and assessment to a skill taxonomy with Bloom\'s proficiency levels. See exactly which skills your programs actually develop.', icon: 'graph' },
    { title: 'Evidence-Based Portfolios', description: 'Students accumulate evidence records — graded work, peer reviews, projects — that anchor every skill claim to verifiable proof.', icon: 'proof' },
    { title: 'Evidence-Derived Instructor Reputation', description: 'Instructor quality measured through student outcomes and evidence chains, not popularity surveys. Reputation is scoped to skills, not global scores.', icon: 'reputation' },
    { title: 'IPFS Decentralised Content', description: 'Course content stored on IPFS for permanent availability. No single point of failure. Content persists even if the platform goes down.', icon: 'decentralised' },
  ],
  admin: [
    { title: 'Multi-Department Management', description: 'Hierarchical organisation structure supporting colleges, departments, and programs. Delegate administration while maintaining institutional oversight.', icon: 'building' },
    { title: 'SIS Integration', description: 'Bi-directional sync with Student Information Systems via REST APIs and standard data interchange formats. Automate enrolments, grade passback, and student records.', icon: 'sync' },
    { title: 'SSO via SAML/OIDC', description: 'Enterprise single sign-on supporting SAML 2.0 and OpenID Connect. Integrate with your existing identity provider — Active Directory, Okta, Auth0, or custom.', icon: 'key' },
    { title: 'Custom Branding', description: 'White-label the platform with your institution\'s logo, colours, typography, and custom domain. Your LMS, your brand.', icon: 'palette' },
    { title: 'FERPA/GDPR Compliance', description: 'Built-in privacy controls, data retention policies, consent management, and audit logging. Deploy in your jurisdiction. Your data stays where you need it.', icon: 'lock' },
    { title: 'LTI 1.3 & SCORM/xAPI Import', description: 'Bring your existing content. Full LTI 1.3 tool integration, SCORM 1.2/2004 package import, and xAPI statement tracking for interoperability.', icon: 'plug' },
  ],
  analytics: [
    { title: 'Real-Time Learning Analytics', description: 'Live dashboards showing engagement, completion, and performance metrics. Drill down from institutional overview to individual student activity.', icon: 'chart' },
    { title: 'Skill Gap Analysis', description: 'Identify which skills your curriculum develops well and where gaps exist. Compare intended learning outcomes against actual measured proficiency.', icon: 'gap' },
    { title: 'Instructor Effectiveness', description: 'Evidence-based instructor analytics tied to student outcomes. Identify effective teaching patterns and support continuous improvement — without relying on popularity contests.', icon: 'impact' },
    { title: 'Predictive At-Risk Identification', description: 'Machine learning models flag students showing early warning signals. Intervene before failure with data-driven recommendations.', icon: 'alert' },
    { title: 'Accreditation-Ready Reports', description: 'Generate reports mapped to accreditation standards. Evidence-backed documentation of student learning outcomes for review cycles.', icon: 'report' },
  ],
}

// ─── Comparison Table ───
const comparisonFeatures = [
  { feature: 'Open-Source', alexandria: true, canvas: false, blackboard: false, moodle: true },
  { feature: 'Self-Hosted Option', alexandria: true, canvas: true, blackboard: false, moodle: true },
  { feature: 'Blockchain Credentials', alexandria: true, canvas: false, blackboard: false, moodle: false },
  { feature: 'Skill-Mapped Curriculum', alexandria: true, canvas: false, blackboard: false, moodle: false },
  { feature: 'Evidence-Based Portfolios', alexandria: true, canvas: false, blackboard: false, moodle: false },
  { feature: 'Student-Owned Data', alexandria: true, canvas: false, blackboard: false, moodle: false },
  { feature: 'IPFS Decentralised Storage', alexandria: true, canvas: false, blackboard: false, moodle: false },
  { feature: 'LTI 1.3 Support', alexandria: true, canvas: true, blackboard: true, moodle: true },
  { feature: 'SCORM/xAPI', alexandria: true, canvas: true, blackboard: true, moodle: true },
  { feature: 'FERPA/GDPR Ready', alexandria: true, canvas: true, blackboard: true, moodle: 'Varies' },
  { feature: 'SSO (SAML/OIDC)', alexandria: true, canvas: true, blackboard: true, moodle: true },
  { feature: 'Mobile App', alexandria: true, canvas: true, blackboard: true, moodle: true },
  { feature: 'Predictive Analytics', alexandria: true, canvas: 'Add-on', blackboard: 'Add-on', moodle: false },
  { feature: 'Vendor Lock-In', alexandria: 'None', canvas: 'High', blackboard: 'High', moodle: 'Low' },
  { feature: 'Per-Student Cost', alexandria: 'Free / $3', canvas: '$15–40', blackboard: '$20–50', moodle: 'Free + hosting' },
]

// ─── FAQ ───
const openFaq = ref<number | null>(null)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

const faqs = [
  {
    question: 'Do students really own their credentials?',
    answer: 'Yes. Credentials are minted as NFTs on the Cardano blockchain with full metadata stored on IPFS. Students hold them in their own wallets. They persist independently of Alexandria — even if the platform disappears, the credentials remain verifiable on-chain.',
  },
  {
    question: 'What happens to credentials if we leave Alexandria?',
    answer: 'Nothing changes for the students. Credentials already minted on the blockchain are permanent and independently verifiable. Course content stored on IPFS remains accessible via any IPFS gateway. There is no vendor lock-in by design.',
  },
  {
    question: 'How does the skill-mapped curriculum work?',
    answer: 'You map each course, module, and assessment to skills in a taxonomy with Bloom\'s proficiency levels (Remember through Create). The system then tracks how each student progresses across skills based on actual assessment evidence, giving you a real-time view of what your curriculum actually teaches.',
  },
  {
    question: 'Can we migrate from Canvas/Blackboard/Moodle?',
    answer: 'Yes. Alexandria supports LTI 1.3 tool integration, SCORM 1.2/2004 package import, and xAPI statement ingestion. We provide migration guides and tooling for bulk content transfer from major LMS platforms.',
  },
  {
    question: 'How is instructor reputation different from student evaluations?',
    answer: 'Traditional student evaluations measure popularity and are well-documented to be biased. Alexandria derives instructor reputation from student outcomes — actual skill progression, evidence quality, and learning trajectory data. Reputation is scoped to specific skills, not a single global score.',
  },
  {
    question: 'Is the Community tier actually free?',
    answer: 'Yes. Alexandria is MIT-licensed open-source software. The Community tier is self-hosted and completely free with no feature restrictions, no student caps, and no hidden costs. You run it on your own infrastructure.',
  },
  {
    question: 'What about FERPA compliance?',
    answer: 'Alexandria is built with FERPA compliance in mind: role-based access controls, audit logging, data retention policies, consent management, and the ability to self-host within your jurisdiction. Blockchain credentials use student-controlled wallets, so the institution doesn\'t expose PII on-chain.',
  },
]

// ─── Pricing ───
const pricingTiers = [
  {
    name: 'Community',
    price: 'Free',
    period: 'self-hosted, forever',
    description: 'Full-featured LMS for institutions that want complete control.',
    features: [
      'Unlimited students & courses',
      'All core LMS features',
      'Blockchain credential minting',
      'Skill-mapped curriculum',
      'SCORM/xAPI/LTI 1.3',
      'Community support via GitHub',
    ],
    cta: 'View on GitHub',
    ctaHref: GITHUB_URL,
    highlighted: false,
  },
  {
    name: 'Academic',
    price: '$3',
    period: 'per student / month',
    description: 'Managed hosting with premium support for universities and colleges.',
    features: [
      'Everything in Community',
      'Managed cloud hosting',
      'SIS integration & SSO',
      'Custom branding & domain',
      'Predictive analytics',
      'Priority email & chat support',
      '99.9% uptime SLA',
    ],
    cta: 'Request a Demo',
    ctaHref: GITHUB_URL,
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored to your needs',
    description: 'Dedicated infrastructure, white-glove migration, and strategic partnership.',
    features: [
      'Everything in Academic',
      'Dedicated infrastructure',
      'White-glove migration',
      'Custom integrations',
      'On-premise deployment option',
      'Dedicated success manager',
      'Custom SLA & compliance',
    ],
    cta: 'Talk to Us',
    ctaHref: GITHUB_URL,
    highlighted: false,
  },
]

// ─── Scroll-triggered reveal ───
onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 },
  )

  nextTick(() => {
    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })
  })
})
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- HERO                                                              -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="relative h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden">
      <!-- Gradient backdrop -->
      <div class="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-institution)/0.06)] via-transparent to-[rgb(var(--color-muted)/0.3)]" />
      <div class="absolute inset-0 bg-grid opacity-[0.04]" />

      <!-- Sapphire blue nebula SVG -->
      <svg class="absolute inset-0 h-full w-full landing-drift-slow" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="inst-glow-a"><stop offset="0%" stop-color="rgb(var(--color-institution))" stop-opacity="0.25" /><stop offset="60%" stop-color="rgb(var(--color-institution))" stop-opacity="0.04" /><stop offset="100%" stop-color="rgb(var(--color-institution))" stop-opacity="0" /></radialGradient>
          <radialGradient id="inst-glow-b"><stop offset="0%" stop-color="rgb(99 102 241)" stop-opacity="0.15" /><stop offset="60%" stop-color="rgb(99 102 241)" stop-opacity="0.03" /><stop offset="100%" stop-color="rgb(99 102 241)" stop-opacity="0" /></radialGradient>
          <radialGradient id="inst-glow-c"><stop offset="0%" stop-color="rgb(var(--color-primary))" stop-opacity="0.12" /><stop offset="60%" stop-color="rgb(var(--color-primary))" stop-opacity="0.02" /><stop offset="100%" stop-color="rgb(var(--color-primary))" stop-opacity="0" /></radialGradient>
        </defs>
        <circle cx="200" cy="160" r="140" fill="url(#inst-glow-a)" />
        <circle cx="1240" cy="130" r="120" fill="url(#inst-glow-a)" />
        <circle cx="700" cy="780" r="110" fill="url(#inst-glow-a)" />
        <circle cx="1080" cy="80" r="95" fill="url(#inst-glow-b)" />
        <circle cx="380" cy="700" r="85" fill="url(#inst-glow-b)" />
        <circle cx="440" cy="120" r="75" fill="url(#inst-glow-c)" />
        <circle cx="1120" cy="680" r="70" fill="url(#inst-glow-c)" />
      </svg>

      <!-- Floating blurs -->
      <div class="absolute top-20 left-[10%] h-64 w-64 rounded-full bg-[rgb(var(--color-institution)/0.06)] blur-3xl landing-drift" />
      <div class="absolute bottom-32 right-[15%] h-48 w-48 rounded-full bg-[rgb(var(--color-institution)/0.08)] blur-3xl landing-drift" style="animation-delay: -7s" />

      <!-- Hero content -->
      <div class="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <!-- Eyebrow badge -->
        <div class="landing-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-institution)/0.2)] bg-[rgb(var(--color-institution)/0.06)] px-4 py-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-institution))] animate-pulse" />
          <span class="text-xs font-medium tracking-wide text-[rgb(var(--color-institution))] uppercase">Alexandria for Institutions</span>
        </div>

        <!-- Headline -->
        <h1 class="landing-reveal landing-reveal-delay-1 institution-serif text-4xl leading-[1.2] tracking-tight text-[rgb(var(--color-foreground))] sm:text-5xl lg:text-6xl">
          Your LMS, their
          <br>
          <span class="text-institution-gradient">credentials.</span>
        </h1>

        <!-- Subhead -->
        <p class="landing-reveal landing-reveal-delay-2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-xl">
          An open-source learning management system where students own blockchain-verified credentials, curricula map to real skills, and institutions keep full control.
        </p>

        <!-- CTAs -->
        <div class="landing-reveal landing-reveal-delay-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-lg btn-institution group relative overflow-hidden rounded-lg px-8 py-4 text-base font-semibold"
          >
            <span class="relative z-10">Request a Demo</span>
            <div class="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
          </a>
          <a
            href="#features"
            class="btn btn-lg btn-institution-outline rounded-lg px-8 py-4 text-base font-medium"
          >
            Explore Features
          </a>
        </div>

        <!-- Trust signals -->
        <div class="landing-reveal landing-reveal-delay-4 mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[rgb(var(--color-muted-foreground))]">
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-[rgb(var(--color-institution))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Student-owned credentials
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-[rgb(var(--color-institution))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            Open-source MIT
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-[rgb(var(--color-institution))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            FERPA/GDPR ready
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-[rgb(var(--color-institution))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Zero vendor lock-in
          </span>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 landing-reveal landing-reveal-delay-5">
        <div class="flex flex-col items-center gap-1.5">
          <span class="text-[10px] font-medium uppercase tracking-widest text-[rgb(var(--color-muted-foreground))]">Scroll</span>
          <svg class="scroll-indicator-chevron h-5 w-5 text-[rgb(var(--color-institution)/0.7)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- PROMISE SECTION                                                   -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="relative bg-[rgb(var(--color-background))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="institution-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            The LMS that gives credentials
            <span class="text-institution-gradient">back to students.</span>
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            Most learning platforms lock credentials inside their walls. Alexandria makes them portable, verifiable, and permanently student-owned.
          </p>
        </div>

        <div class="mt-16 grid gap-8 md:grid-cols-3">
          <!-- Pillar 1: Verifiable Not Claimable -->
          <div class="scroll-reveal group rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 transition-all hover:border-[rgb(var(--color-institution)/0.3)] hover:shadow-lg">
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--color-institution)/0.1)] text-[rgb(var(--color-institution))] transition-colors group-hover:bg-[rgb(var(--color-institution)/0.15)]">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-[rgb(var(--color-foreground))]">Verifiable, Not Claimable</h3>
            <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
              Every credential is minted on Cardano and anchored to IPFS. Anyone can verify it independently — no API call to Alexandria required. Claims become proofs.
            </p>
          </div>

          <!-- Pillar 2: Structurally Mapped -->
          <div class="scroll-reveal group rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 transition-all hover:border-[rgb(var(--color-institution)/0.3)] hover:shadow-lg" style="transition-delay: 0.1s">
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--color-institution)/0.1)] text-[rgb(var(--color-institution))] transition-colors group-hover:bg-[rgb(var(--color-institution)/0.15)]">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-[rgb(var(--color-foreground))]">Structurally Mapped</h3>
            <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
              Curricula connect to a skill taxonomy with Bloom's proficiency levels. You see exactly which competencies your programs develop — and where the gaps are.
            </p>
          </div>

          <!-- Pillar 3: Decentralised by Default -->
          <div class="scroll-reveal group rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 transition-all hover:border-[rgb(var(--color-institution)/0.3)] hover:shadow-lg" style="transition-delay: 0.2s">
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--color-institution)/0.1)] text-[rgb(var(--color-institution))] transition-colors group-hover:bg-[rgb(var(--color-institution)/0.15)]">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-[rgb(var(--color-foreground))]">Decentralised by Default</h3>
            <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
              Content on IPFS. Credentials on blockchain. No single point of failure, no vendor lock-in. Self-host or use our cloud — your data, your terms.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- TABBED FEATURES                                                   -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section id="features" class="relative bg-[rgb(var(--color-muted))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="institution-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            Everything you need.
            <span class="text-institution-gradient">Nothing you don't.</span>
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            A complete LMS with capabilities no other platform offers — open-source and built for institutions that care about what credentials actually mean.
          </p>
        </div>

        <!-- Category pills -->
        <div class="scroll-reveal mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-12">
          <button
            v-for="cat in featureCategories"
            :key="cat.key"
            class="rounded-full px-4 py-2.5 text-xs font-medium transition-all sm:px-5 sm:py-2 sm:text-sm"
            :class="activeCategory === cat.key
              ? 'bg-[rgb(var(--color-institution))] text-white shadow-lg shadow-[rgb(var(--color-institution)/0.25)]'
              : 'bg-[rgb(var(--color-card))] text-[rgb(var(--color-muted-foreground))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-institution)/0.3)] hover:text-[rgb(var(--color-foreground))]'"
            @click="activeCategory = cat.key"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Feature cards -->
        <div class="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <div
            v-for="(feature, i) in featuresByCategory[activeCategory]"
            :key="`${activeCategory}-${i}`"
            class="group rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:rounded-2xl sm:p-7 transition-all hover:border-[rgb(var(--color-institution)/0.3)] hover:shadow-lg"
          >
            <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgb(var(--color-institution)/0.1)] text-[rgb(var(--color-institution))] transition-colors group-hover:bg-[rgb(var(--color-institution)/0.15)]">
              <!-- pen -->
              <svg v-if="feature.icon === 'pen'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <!-- clipboard -->
              <svg v-else-if="feature.icon === 'clipboard'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <!-- chat -->
              <svg v-else-if="feature.icon === 'chat'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
              <!-- video -->
              <svg v-else-if="feature.icon === 'video'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <!-- mobile -->
              <svg v-else-if="feature.icon === 'mobile'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              <!-- shield -->
              <svg v-else-if="feature.icon === 'shield'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <!-- graph -->
              <svg v-else-if="feature.icon === 'graph'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <!-- proof -->
              <svg v-else-if="feature.icon === 'proof'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <!-- reputation -->
              <svg v-else-if="feature.icon === 'reputation'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <!-- decentralised -->
              <svg v-else-if="feature.icon === 'decentralised'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <!-- building -->
              <svg v-else-if="feature.icon === 'building'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <!-- sync -->
              <svg v-else-if="feature.icon === 'sync'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
              </svg>
              <!-- key -->
              <svg v-else-if="feature.icon === 'key'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              <!-- palette -->
              <svg v-else-if="feature.icon === 'palette'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
              </svg>
              <!-- lock -->
              <svg v-else-if="feature.icon === 'lock'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <!-- plug -->
              <svg v-else-if="feature.icon === 'plug'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <!-- chart -->
              <svg v-else-if="feature.icon === 'chart'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <!-- gap -->
              <svg v-else-if="feature.icon === 'gap'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
              <!-- impact -->
              <svg v-else-if="feature.icon === 'impact'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <!-- alert -->
              <svg v-else-if="feature.icon === 'alert'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <!-- report -->
              <svg v-else-if="feature.icon === 'report'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>

            <h3 class="text-base font-semibold text-[rgb(var(--color-foreground))]">{{ feature.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[rgb(var(--color-muted-foreground))]">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- COMPETITOR COMPARISON TABLE                                       -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="relative bg-[rgb(var(--color-background))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="institution-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            How Alexandria
            <span class="text-institution-gradient">compares.</span>
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            A transparent look at how we stack up against the incumbents.
          </p>
        </div>

        <p class="scroll-reveal mt-8 text-center text-xs text-[rgb(var(--color-muted-foreground))] sm:hidden">Swipe to compare &rarr;</p>
        <div class="scroll-reveal mt-2 overflow-x-auto rounded-xl border border-[rgb(var(--color-border))] sm:mt-12 sm:rounded-2xl">
          <table class="w-full min-w-[640px] text-xs sm:text-sm">
            <thead>
              <tr class="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-muted))]">
                <th class="px-3 py-3 text-left font-semibold text-[rgb(var(--color-foreground))] sm:px-6 sm:py-4">Feature</th>
                <th class="px-3 py-3 text-center font-semibold text-[rgb(var(--color-institution))] bg-[rgb(var(--color-institution)/0.06)] sm:px-6 sm:py-4">Alexandria</th>
                <th class="px-3 py-3 text-center font-semibold text-[rgb(var(--color-muted-foreground))] sm:px-6 sm:py-4">Canvas</th>
                <th class="px-3 py-3 text-center font-semibold text-[rgb(var(--color-muted-foreground))] sm:px-6 sm:py-4">Blackboard</th>
                <th class="px-3 py-3 text-center font-semibold text-[rgb(var(--color-muted-foreground))] sm:px-6 sm:py-4">Moodle</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in comparisonFeatures"
                :key="i"
                class="border-b border-[rgb(var(--color-border))] last:border-b-0 transition-colors hover:bg-[rgb(var(--color-muted)/0.5)]"
              >
                <td class="px-6 py-3.5 font-medium text-[rgb(var(--color-foreground))]">{{ row.feature }}</td>
                <!-- Alexandria column (highlighted) -->
                <td class="px-6 py-3.5 text-center bg-[rgb(var(--color-institution)/0.03)]">
                  <template v-if="row.alexandria === true">
                    <svg class="mx-auto h-5 w-5 text-[rgb(var(--color-institution))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </template>
                  <template v-else-if="row.alexandria === false">
                    <svg class="mx-auto h-5 w-5 text-[rgb(var(--color-muted-foreground)/0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </template>
                  <template v-else>
                    <span class="font-medium text-[rgb(var(--color-institution))]">{{ row.alexandria }}</span>
                  </template>
                </td>
                <!-- Canvas -->
                <td class="px-6 py-3.5 text-center">
                  <template v-if="row.canvas === true">
                    <svg class="mx-auto h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </template>
                  <template v-else-if="row.canvas === false">
                    <svg class="mx-auto h-5 w-5 text-[rgb(var(--color-muted-foreground)/0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </template>
                  <template v-else>
                    <span class="text-[rgb(var(--color-muted-foreground))]">{{ row.canvas }}</span>
                  </template>
                </td>
                <!-- Blackboard -->
                <td class="px-6 py-3.5 text-center">
                  <template v-if="row.blackboard === true">
                    <svg class="mx-auto h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </template>
                  <template v-else-if="row.blackboard === false">
                    <svg class="mx-auto h-5 w-5 text-[rgb(var(--color-muted-foreground)/0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </template>
                  <template v-else>
                    <span class="text-[rgb(var(--color-muted-foreground))]">{{ row.blackboard }}</span>
                  </template>
                </td>
                <!-- Moodle -->
                <td class="px-6 py-3.5 text-center">
                  <template v-if="row.moodle === true">
                    <svg class="mx-auto h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </template>
                  <template v-else-if="row.moodle === false">
                    <svg class="mx-auto h-5 w-5 text-[rgb(var(--color-muted-foreground)/0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </template>
                  <template v-else>
                    <span class="text-[rgb(var(--color-muted-foreground))]">{{ row.moodle }}</span>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- PRICING                                                           -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section id="pricing" class="relative bg-[rgb(var(--color-muted))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="institution-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            Simple, transparent
            <span class="text-institution-gradient">pricing.</span>
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            Start free. Scale when you're ready. No surprises.
          </p>
        </div>

        <div class="mt-16 grid gap-8 lg:grid-cols-3">
          <div
            v-for="(tier, i) in pricingTiers"
            :key="i"
            class="scroll-reveal relative flex flex-col rounded-2xl border bg-[rgb(var(--color-card))] p-8"
            :class="tier.highlighted
              ? 'border-[rgb(var(--color-institution))] shadow-xl shadow-[rgb(var(--color-institution)/0.1)]'
              : 'border-[rgb(var(--color-border))]'"
            :style="{ transitionDelay: `${i * 0.1}s` }"
          >
            <!-- Most Popular badge -->
            <div
              v-if="tier.highlighted"
              class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[rgb(var(--color-institution))] px-4 py-1 text-xs font-semibold text-white"
            >
              Most Popular
            </div>

            <div class="mb-6">
              <h3 class="text-xl font-semibold text-[rgb(var(--color-foreground))]">{{ tier.name }}</h3>
              <div class="mt-3 flex items-baseline gap-1">
                <span class="text-4xl font-bold text-[rgb(var(--color-foreground))]">{{ tier.price }}</span>
                <span v-if="tier.price !== 'Custom'" class="text-sm text-[rgb(var(--color-muted-foreground))]">{{ tier.period }}</span>
              </div>
              <p v-if="tier.price === 'Custom'" class="mt-1 text-sm text-[rgb(var(--color-muted-foreground))]">{{ tier.period }}</p>
              <p class="mt-3 text-sm text-[rgb(var(--color-muted-foreground))]">{{ tier.description }}</p>
            </div>

            <ul class="mb-8 flex-1 space-y-3">
              <li
                v-for="(feat, fi) in tier.features"
                :key="fi"
                class="flex items-start gap-2 text-sm text-[rgb(var(--color-foreground))]"
              >
                <svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-[rgb(var(--color-institution))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ feat }}
              </li>
            </ul>

            <a
              :href="tier.ctaHref"
              target="_blank"
              rel="noopener noreferrer"
              class="btn rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all"
              :class="tier.highlighted
                ? 'btn-institution'
                : 'border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-institution)/0.4)] hover:text-[rgb(var(--color-institution))]'"
            >
              {{ tier.cta }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- ENTERPRISE CONTACT CALLOUT                                        -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="relative bg-[rgb(var(--color-background))] py-16 sm:py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal rounded-2xl border border-[rgb(var(--color-institution)/0.2)] bg-gradient-to-r from-[rgb(var(--color-institution)/0.04)] to-[rgb(var(--color-institution)/0.08)] p-8 sm:p-12 text-center">
          <h3 class="institution-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl">
            Need a custom deployment?
          </h3>
          <p class="mx-auto mt-4 max-w-xl text-[rgb(var(--color-muted-foreground))]">
            On-premise hosting, custom integrations, white-glove migration, and dedicated support. Let's build the right solution for your institution.
          </p>
          <a
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-lg btn-institution mt-8 inline-flex rounded-lg px-8 py-4 text-base font-semibold"
          >
            Talk to Us
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- TESTIMONIALS PLACEHOLDER                                          -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="relative bg-[rgb(var(--color-muted))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="institution-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            Trusted by forward-thinking institutions.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            Early adopters are already transforming how they deliver and verify education.
          </p>
        </div>

        <div class="mt-16 grid gap-8 md:grid-cols-3">
          <div
            v-for="n in 3"
            :key="n"
            class="scroll-reveal rounded-2xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-card)/0.5)] p-8 text-center"
            :style="{ transitionDelay: `${n * 0.1}s` }"
          >
            <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-[rgb(var(--color-institution)/0.08)]" />
            <div class="mx-auto h-4 w-32 rounded bg-[rgb(var(--color-border)/0.5)]" />
            <div class="mx-auto mt-2 h-3 w-24 rounded bg-[rgb(var(--color-border)/0.3)]" />
            <p class="mt-4 text-sm italic text-[rgb(var(--color-muted-foreground)/0.6)]">
              Testimonial coming soon
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- FAQ                                                               -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section id="faq" class="relative bg-[rgb(var(--color-background))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="institution-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            Frequently asked
            <span class="text-institution-gradient">questions.</span>
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-lg text-[rgb(var(--color-muted-foreground))]">
            Everything you need to know about deploying Alexandria at your institution.
          </p>
        </div>

        <div class="mt-12 space-y-3">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="scroll-reveal rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] transition-colors"
            :class="openFaq === i ? 'border-[rgb(var(--color-institution)/0.3)]' : ''"
            :style="{ transitionDelay: `${i * 0.05}s` }"
          >
            <button
              class="flex w-full items-center justify-between px-6 py-5 text-left"
              @click="toggleFaq(i)"
            >
              <span class="pr-4 font-semibold text-[rgb(var(--color-foreground))]">{{ faq.question }}</span>
              <svg
                class="h-5 w-5 flex-shrink-0 text-[rgb(var(--color-muted-foreground))] transition-transform duration-200"
                :class="openFaq === i ? 'rotate-180' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-show="openFaq === i"
              class="px-6 pb-5"
            >
              <p class="leading-relaxed text-[rgb(var(--color-muted-foreground))]">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- CTA                                                               -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <div class="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-institution)/0.06)] via-[rgb(var(--color-muted)/0.4)] to-[rgb(var(--color-institution)/0.03)]" />
      <div class="absolute inset-0 bg-grid opacity-[0.03]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[rgb(var(--color-institution)/0.06)] blur-3xl" />

      <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div class="scroll-reveal">
          <h2 class="institution-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            Give your students credentials
            <span class="text-institution-gradient">they actually own.</span>
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg text-[rgb(var(--color-muted-foreground))]">
            Join the institutions building an open, verifiable future for education. Free to start. Open-source forever.
          </p>
          <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              :href="GITHUB_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-lg btn-institution rounded-lg px-10 py-4 text-base font-semibold"
            >
              Request a Demo
            </a>
            <a
              :href="GITHUB_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-lg rounded-lg border border-[rgb(var(--color-border))] px-8 py-4 text-base font-medium text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-institution)/0.4)] hover:text-[rgb(var(--color-institution))]"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
