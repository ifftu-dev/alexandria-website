<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Alexandria Recruiting — Hire Verified Talent, Not Resumes',
  meta: [
    { name: 'description', content: 'Discover candidates through Verifiable Credentials, evidence-based credentials, and transparent learning trajectories. No resumes. No guesswork.' },
    { property: 'og:title', content: 'Alexandria Recruiting — Hire Verified Talent, Not Resumes' },
    { property: 'og:description', content: 'Discover candidates through Verifiable Credentials and evidence-based credentials. No resumes. No guesswork. Just proof.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/recruiter' },
    { name: 'twitter:title', content: 'Alexandria Recruiting — Hire Verified Talent, Not Resumes' },
    { name: 'twitter:description', content: 'Discover candidates through Verifiable Credentials and evidence-based credentials. No resumes. Just proof.' },
  ],
  link: [
    { rel: 'canonical', href: 'https://alexandria.ifftu.dev/recruiter' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Alexandria Recruiting',
        description: 'Hire verified talent through Verifiable Credentials, evidence-based credentials, and transparent learning trajectories.',
        url: 'https://alexandria.ifftu.dev/recruiter',
        isPartOf: { '@type': 'WebSite', name: 'Alexandria', url: 'https://alexandria.ifftu.dev' },
      }),
    },
  ],
})

const features = [
  {
    title: 'Skill-Based Discovery',
    description: 'Search by verified competencies, not keywords. Define composite skill queries with Bloom\'s proficiency levels and confidence thresholds.',
    icon: 'search',
  },
  {
    title: 'Evidence Chains',
    description: 'Every skill proof links back to assessments, courses, and instructor attributions. Trace how a candidate actually learned — not just what they claim.',
    icon: 'chain',
  },
  {
    title: 'Blockchain-Anchored Credentials',
    description: 'W3C-style Verifiable Credentials, Ed25519-signed under the candidate\'s DID and anchored to Cardano by hash. Independently verifiable — even offline. No fabrication possible.',
    icon: 'shield',
  },
  {
    title: 'Selective Disclosure & Consent',
    description: 'Candidates choose what to reveal — the level only, or the full evidence chain. Opt-in by credential, replay-protected per recipient. Learners stay in control.',
    icon: 'lock',
  },
]

const problems = [
  { label: 'Resumes lie', detail: '78% of resumes contain misleading information' },
  { label: 'Skill tests are shallow', detail: 'One-shot assessments miss depth and learning trajectory' },
  { label: 'Degree bias persists', detail: 'Credentials from prestigious institutions outweigh actual ability' },
  { label: 'No verification standard', detail: 'Employer reference checks are slow, unreliable, and biased' },
]

const solutions = [
  { label: 'Proofs replace claims', detail: 'Every skill backed by evidence records and weighted assessments' },
  { label: 'Depth, not snapshots', detail: 'Bloom\'s taxonomy levels from Remember through Create' },
  { label: 'Merit, not pedigree', detail: 'Reputation derived from outcomes, scoped to skills — not institutions' },
  { label: 'On-chain verification', detail: 'Verifiable Credentials hash-anchored to Cardano — verify in seconds, even offline' },
]

// Scroll-triggered reveal
onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
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

const heroRef = ref<HTMLElement | null>(null)
const { showIndicator } = useScrollIndicator(heroRef)
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- ═══ HERO ═══ -->
    <section ref="heroRef" class="relative h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-recruiter)/0.06)] via-transparent to-[rgb(var(--color-muted)/0.3)]" />
      <div class="absolute inset-0 bg-grid opacity-[0.04]" />

      <svg class="absolute inset-0 h-full w-full landing-drift-slow" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="rec-glow-a"><stop offset="0%" stop-color="rgb(var(--color-recruiter))" stop-opacity="0.25" /><stop offset="60%" stop-color="rgb(var(--color-recruiter))" stop-opacity="0.04" /><stop offset="100%" stop-color="rgb(var(--color-recruiter))" stop-opacity="0" /></radialGradient>
          <radialGradient id="rec-glow-b"><stop offset="0%" stop-color="rgb(34 211 238)" stop-opacity="0.15" /><stop offset="60%" stop-color="rgb(34 211 238)" stop-opacity="0.03" /><stop offset="100%" stop-color="rgb(34 211 238)" stop-opacity="0" /></radialGradient>
          <radialGradient id="rec-glow-c"><stop offset="0%" stop-color="rgb(var(--color-primary))" stop-opacity="0.12" /><stop offset="60%" stop-color="rgb(var(--color-primary))" stop-opacity="0.02" /><stop offset="100%" stop-color="rgb(var(--color-primary))" stop-opacity="0" /></radialGradient>
        </defs>
        <circle cx="180" cy="140" r="130" fill="url(#rec-glow-a)" />
        <circle cx="1260" cy="120" r="110" fill="url(#rec-glow-a)" />
        <circle cx="720" cy="800" r="100" fill="url(#rec-glow-a)" />
        <circle cx="1050" cy="60" r="90" fill="url(#rec-glow-b)" />
        <circle cx="350" cy="720" r="80" fill="url(#rec-glow-b)" />
        <circle cx="400" cy="100" r="75" fill="url(#rec-glow-c)" />
        <circle cx="1100" cy="700" r="70" fill="url(#rec-glow-c)" />
      </svg>

      <div class="absolute top-20 left-[10%] h-64 w-64 rounded-full bg-[rgb(var(--color-recruiter)/0.06)] blur-3xl landing-drift" />
      <div class="absolute bottom-32 right-[15%] h-48 w-48 rounded-full bg-[rgb(var(--color-recruiter)/0.08)] blur-3xl landing-drift" style="animation-delay: -7s" />

      <div class="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-4 pt-14 pb-8 text-center sm:py-12 lg:px-8">
        <div class="landing-reveal mb-4 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-recruiter)/0.2)] bg-[rgb(var(--color-recruiter)/0.06)] px-4 py-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-recruiter))] animate-pulse" />
          <span class="text-xs font-medium tracking-wide text-[rgb(var(--color-recruiter))] uppercase">Alexandria Recruiting</span>
        </div>

        <div class="landing-reveal mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-5 py-2.5 backdrop-blur-sm">
          <p class="text-xs font-medium text-amber-400/90 sm:text-sm">This page describes what we're building. Recruiter features are not yet implemented.</p>
        </div>

        <h1 class="recruiter-serif text-4xl leading-[1.2] tracking-tight text-[rgb(var(--color-foreground))] sm:text-5xl lg:text-6xl">
          Hire verified talent,
          <br>
          <span class="text-recruiter-gradient">not resumes.</span>
        </h1>

        <p class="landing-reveal landing-reveal-delay-2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-xl">
          Discover candidates through Verifiable Credentials, evidence-based credentials, and transparent learning trajectories.
          <span class="text-[rgb(var(--color-foreground)/0.8)]">No guesswork. No fabrication. Just proof.</span>
        </p>

        <div class="landing-reveal landing-reveal-delay-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#how-it-works"
            class="btn btn-lg btn-recruiter group relative overflow-hidden rounded-lg px-8 py-4 text-base font-semibold"
          >
            <span class="relative z-10">See How It Works</span>
            <div class="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
          </a>
          <a
            href="#features"
            class="btn btn-lg rounded-lg border border-[rgb(var(--color-border))] px-8 py-4 text-base font-medium text-[rgb(var(--color-foreground))] transition-all hover:border-[rgb(var(--color-recruiter)/0.4)] hover:text-[rgb(var(--color-recruiter))]"
          >
            Explore Features
          </a>
        </div>

        <div class="landing-reveal landing-reveal-delay-4 mt-8 hidden flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[rgb(var(--color-muted-foreground))] sm:mt-16 sm:flex">
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-[rgb(var(--color-recruiter))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Blockchain verified
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-[rgb(var(--color-recruiter))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Candidate consent required
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-[rgb(var(--color-recruiter))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            No global rankings
          </span>
        </div>
      </div>

      <!-- Scroll indicator — only visible when content below is off-screen -->
      <Transition name="scroll-indicator">
        <div v-show="showIndicator" class="scroll-indicator-wrapper landing-reveal landing-reveal-delay-5 absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
          <div class="flex flex-col items-center gap-1.5">
            <span class="text-[10px] font-medium uppercase tracking-widest text-[rgb(var(--color-muted-foreground))]">Scroll</span>
            <svg class="scroll-indicator-chevron h-5 w-5 text-[rgb(var(--color-recruiter)/0.7)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </Transition>
    </section>

    <!-- ═══ PROBLEM / SOLUTION ═══ -->
    <section id="how-it-works" class="relative bg-[rgb(var(--color-background))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="recruiter-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            The hiring problem is a
            <span class="text-recruiter-gradient">verification</span> problem.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            Traditional hiring relies on unverifiable claims. Alexandria replaces trust with proof.
          </p>
        </div>

        <div class="mt-16 grid gap-8 lg:grid-cols-2">
          <div class="scroll-reveal">
            <div class="mb-6 flex items-center gap-2">
              <div class="h-px flex-1 bg-red-500/20" />
              <span class="text-[11px] font-semibold uppercase tracking-wider text-red-400">The Problem</span>
              <div class="h-px flex-1 bg-red-500/20" />
            </div>
            <div class="space-y-4">
              <div
                v-for="(problem, i) in problems"
                :key="i"
                class="rounded-xl border border-red-500/10 bg-red-500/[0.03] p-5 transition-colors hover:border-red-500/20"
              >
                <div class="flex items-start gap-3">
                  <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <p class="font-semibold text-[rgb(var(--color-foreground))]">{{ problem.label }}</p>
                    <p class="mt-1 text-sm text-[rgb(var(--color-muted-foreground))]">{{ problem.detail }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="scroll-reveal" style="transition-delay: 0.15s">
            <div class="mb-6 flex items-center gap-2">
              <div class="h-px flex-1 bg-emerald-500/20" />
              <span class="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Alexandria's Answer</span>
              <div class="h-px flex-1 bg-emerald-500/20" />
            </div>
            <div class="space-y-4">
              <div
                v-for="(solution, i) in solutions"
                :key="i"
                class="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5 transition-colors hover:border-emerald-500/20"
              >
                <div class="flex items-start gap-3">
                  <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p class="font-semibold text-[rgb(var(--color-foreground))]">{{ solution.label }}</p>
                    <p class="mt-1 text-sm text-[rgb(var(--color-muted-foreground))]">{{ solution.detail }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section id="features" class="relative bg-[rgb(var(--color-muted))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="recruiter-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            Intelligence, not intuition.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            Every tool built on verifiable evidence and cryptographic proof.
          </p>
        </div>

        <div class="mt-16 grid gap-6 sm:grid-cols-2">
          <div
            v-for="(feature, i) in features"
            :key="i"
            class="scroll-reveal group rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8 transition-all hover:border-[rgb(var(--color-recruiter)/0.3)] hover:shadow-lg"
            :style="{ transitionDelay: `${i * 0.1}s` }"
          >
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--color-recruiter)/0.1)] text-[rgb(var(--color-recruiter))] transition-colors group-hover:bg-[rgb(var(--color-recruiter)/0.15)]">
              <svg v-if="feature.icon === 'search'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="7" />
                <path stroke-linecap="round" d="M11 8v6m-3-3h6m4 7l4 4" />
              </svg>
              <svg v-else-if="feature.icon === 'chain'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <svg v-else-if="feature.icon === 'shield'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <svg v-else-if="feature.icon === 'lock'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h3 class="text-lg font-semibold text-[rgb(var(--color-foreground))]">{{ feature.title }}</h3>
            <p class="mt-2 leading-relaxed text-[rgb(var(--color-muted-foreground))]">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS (Pipeline) ═══ -->
    <section class="relative bg-[rgb(var(--color-background))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="recruiter-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            From search to hire.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            A streamlined workflow built on transparency at every stage.
          </p>
        </div>

        <div class="relative mt-20">
          <div class="absolute left-8 top-0 bottom-0 z-0 hidden w-px bg-gradient-to-b from-[rgb(var(--color-recruiter))] via-[rgb(var(--color-recruiter)/0.3)] to-transparent sm:block" />

          <div class="space-y-12">
            <div
              v-for="(step, i) in [
                { n: 1, title: 'Define Your Requirements', desc: 'Build composite skill queries — required and optional skills, each with a Bloom\'s proficiency level and optional confidence threshold. Search by what people can do, not what they say.' },
                { n: 2, title: 'Review Verified Matches', desc: 'See candidates ranked by skill match — no global scores, no opaque algorithms. Each result includes a human-readable explanation of why they matched and what gaps remain.' },
                { n: 3, title: 'Verify & Deep-Dive', desc: 'Inspect evidence chains, verify credentials on-chain, view learning timelines, and see instructor attributions. Every data point is cryptographically anchored and independently verifiable.' },
                { n: 4, title: 'Build Your Pipeline', desc: 'Organize candidates into pools, track pipeline stages, set up saved search alerts for new matches, and collaborate with your team — all with full audit trails.' },
              ]"
              :key="step.n"
              class="scroll-reveal relative z-10 flex gap-8"
              :style="{ transitionDelay: `${i * 0.1}s` }"
            >
              <div class="hidden sm:flex">
                <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-[rgb(var(--color-recruiter)/0.3)] text-[rgb(var(--color-recruiter))]" :style="{ background: 'color-mix(in srgb, rgb(var(--color-recruiter)) 10%, rgb(var(--color-background)))' }">
                  <span class="recruiter-serif text-2xl">{{ step.n }}</span>
                </div>
              </div>
              <div class="flex-1 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 sm:p-8">
                <div class="sm:hidden mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--color-recruiter)/0.1)] text-[rgb(var(--color-recruiter))]">
                  <span class="recruiter-serif text-lg">{{ step.n }}</span>
                </div>
                <h3 class="text-xl font-semibold text-[rgb(var(--color-foreground))]">{{ step.title }}</h3>
                <p class="mt-2 text-[rgb(var(--color-muted-foreground))]">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="relative bg-[rgb(var(--color-muted))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="scroll-reveal text-center">
          <h2 class="recruiter-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            Trusted by forward-thinking teams.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            Early adopters are already transforming how they discover and verify talent.
          </p>
        </div>

        <div class="mt-16 grid gap-8 md:grid-cols-3">
          <div
            v-for="n in 3"
            :key="n"
            class="scroll-reveal rounded-2xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-card)/0.5)] p-8 text-center"
            :style="{ transitionDelay: `${n * 0.1}s` }"
          >
            <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-[rgb(var(--color-recruiter)/0.08)]" />
            <div class="mx-auto h-4 w-32 rounded bg-[rgb(var(--color-border)/0.5)]" />
            <div class="mx-auto mt-2 h-3 w-24 rounded bg-[rgb(var(--color-border)/0.3)]" />
            <p class="mt-4 text-sm italic text-[rgb(var(--color-muted-foreground)/0.6)]">
              Testimonial coming soon
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <div class="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-recruiter)/0.06)] via-[rgb(var(--color-muted)/0.4)] to-[rgb(var(--color-recruiter)/0.03)]" />
      <div class="absolute inset-0 bg-grid opacity-[0.03]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[rgb(var(--color-recruiter)/0.06)] blur-3xl" />

      <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div class="scroll-reveal">
          <h2 class="recruiter-serif text-2xl text-[rgb(var(--color-foreground))] sm:text-3xl lg:text-5xl">
            Stop guessing. Start verifying.
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg text-[rgb(var(--color-muted-foreground))]">
            Join forward-thinking teams already hiring with Verifiable Credentials. Free for learners. Powerful for recruiters.
          </p>
          <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://github.com/ifftu-dev/alexandria"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-lg btn-recruiter rounded-lg px-10 py-4 text-base font-semibold"
            >
              Get Started
            </a>
            <NuxtLink
              to="/"
              class="btn btn-lg rounded-lg border border-[rgb(var(--color-border))] px-8 py-4 text-base font-medium text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-recruiter)/0.4)] hover:text-[rgb(var(--color-recruiter))]"
            >
              Learn More
            </NuxtLink>
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
