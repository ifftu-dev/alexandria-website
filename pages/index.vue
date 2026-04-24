<script setup lang="ts">
definePageMeta({
  layout: 'landing',
})

useHead({
  title: 'Alexandria — Free, Decentralized Learning for Everyone',
  meta: [
    { name: 'description', content: 'A free, open-source learning platform that runs natively on macOS, Windows, Linux, iOS, and Android. Peer-to-peer networking, offline-first design, Verifiable Credentials anchored to Cardano. No servers. No gatekeepers.' },
    { property: 'og:title', content: 'Alexandria — Free, Decentralized Learning for Everyone' },
    { property: 'og:description', content: 'A native app for every platform. P2P learning with Verifiable Credentials anchored to Cardano, offline-first by design.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/' },
    { name: 'twitter:title', content: 'Alexandria — Free, Decentralized Learning for Everyone' },
    { name: 'twitter:description', content: 'A native app for every platform. P2P learning with Verifiable Credentials anchored to Cardano, offline-first by design.' },
  ],
  link: [
    { rel: 'canonical', href: 'https://alexandria.ifftu.dev/' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Alexandria',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'macOS, Windows, Linux, iOS, Android',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'A free, open-source, decentralized learning platform with Verifiable Credentials anchored to Cardano.',
        url: 'https://alexandria.ifftu.dev',
        downloadUrl: 'https://github.com/ifftu-dev/alexandria/releases/latest',
        author: {
          '@type': 'Organization',
          name: 'IFFTU',
          url: 'https://ifftu.dev',
        },
      }),
    },
  ],
})


// ─── Scroll-triggered reveal via IntersectionObserver ───
function useScrollReveal() {
  onMounted(() => {
    const els = document.querySelectorAll('.landing-scroll-reveal, .landing-scroll-stagger')
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => observer.observe(el))

    // Safety: force all content visible after 3s in case observer fails
    setTimeout(() => {
      els.forEach((el) => el.classList.add('is-visible'))
    }, 3000)
  })
}

useScrollReveal()

// ─── Scroll indicator visibility ───
const heroRef = ref<HTMLElement | null>(null)
const { showIndicator } = useScrollIndicator(heroRef)

// ─── Parallax scroll effect for hero background layers ───
const layerBack = ref<HTMLElement | null>(null)
const layerMid = ref<HTMLElement | null>(null)
const layerFront = ref<HTMLElement | null>(null)

function useHeroParallax() {
  let ticking = false
  let rafId: number | null = null

  function applyParallax() {
    const hero = heroRef.value
    if (!hero) return

    const rect = hero.getBoundingClientRect()
    if (rect.bottom < 0 || rect.top > window.innerHeight) return

    const scrollY = -rect.top
    const backY = scrollY * 0.04
    const midY = scrollY * 0.08
    const frontY = scrollY * 0.14

    if (layerBack.value) layerBack.value.style.transform = `translate3d(0, ${backY}px, 0)`
    if (layerMid.value) layerMid.value.style.transform = `translate3d(0, ${midY}px, 0)`
    if (layerFront.value) layerFront.value.style.transform = `translate3d(0, ${frontY}px, 0)`

    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      ticking = true
      rafId = requestAnimationFrame(applyParallax)
    }
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    window.addEventListener('scroll', onScroll, { passive: true })
    applyParallax()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
  })
}

useHeroParallax()

const features = [
  {
    title: 'Learn Without Limits',
    icon: 'video',
    description: 'Courses, tutorials, and Opinions from credentialed practitioners. Free, open-source, offline-first.',
    bullets: [
      'Courses with real assessments',
      'Works offline — no internet required',
      'macOS, Windows, Linux, iOS, Android',
    ],
  },
  {
    title: 'A Shared Map of Knowledge',
    icon: 'graph',
    description: 'Every lesson and credential is anchored to a public skill graph, so a credential means the same thing everywhere.',
    bullets: [
      'Three-tier taxonomy with prerequisite edges',
      'Bloom\'s levels: Remember → Create',
      'DAO-ratified, Ed25519-signed, versioned',
    ],
  },
  {
    title: 'Earn Verifiable Credentials',
    icon: 'shield',
    description: 'W3C Verifiable Credentials, signed under your own DID and hash-anchored to Cardano. Verifiable without the platform — even offline.',
    bullets: [
      'Six credential types',
      'Selective disclosure',
      'Offline-verifiable bundles',
    ],
  },
  {
    title: 'Reputation Without the Star Rating',
    icon: 'reputation',
    description: 'Instructors are scored on their impact on learners — a per-skill distribution with confidence bounds, not a single global number.',
    bullets: [
      'Grounded in learner outcomes, not popularity',
      'Per-skill distributions with confidence bounds',
      'No five-star averages, no global scores',
    ],
  },
  {
    title: 'Own Your Data',
    icon: 'key',
    description: 'Your keys, your identity, your content. Local encrypted storage; peer-to-peer sync — no cloud, no servers.',
    bullets: [
      'Self-sovereign identity + local key vault',
      'Content-addressed via iroh',
      'P2P — no central server',
    ],
  },
  {
    title: 'Community Governed',
    icon: 'building',
    description: 'DAOs mirror the skill taxonomy. Voting power comes from demonstrated expertise — not stake, not seniority.',
    bullets: [
      'Meritocratic, scoped per domain',
      'Draft → committee → public vote',
      'Transparent, on-chain decisions',
    ],
  },
]

const steps = [
  {
    number: '01',
    title: 'Download & Launch',
    description: 'Install the native app on any platform. Create your identity with a local cryptographic vault — no account creation, no email, no server.',
  },
  {
    number: '02',
    title: 'Learn & Build Evidence',
    description: 'Access free courses, tutorials, and assessments. Every completion generates evidence records that aggregate into verifiable skill proofs.',
  },
  {
    number: '03',
    title: 'Issue & Anchor',
    description: 'Credentials are signed under your DID, hashed, and anchored to Cardano in a metadata-only transaction (preprod testnet). Verifiable by anyone, anywhere — independent of Alexandria.',
  },
  {
    number: '04',
    title: 'Share & Govern',
    description: 'Share credentials selectively with employers. Stake your reputation to participate in platform governance. Connect peer-to-peer with other learners.',
  },
]

</script>

<template>
  <div>
    <!-- ═══ HERO SECTION ═══ -->
    <section ref="heroRef" class="landing-hero relative flex h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden">
      <!-- Background layer: galaxy starfield — 3 parallax layers -->
      <div class="absolute inset-0" aria-hidden="true">
        <!-- Base gradient (static) -->
        <div class="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-primary)/0.04)] via-transparent to-[rgb(var(--color-muted)/0.3)]" />

        <!-- Shared SVG defs -->
        <svg class="absolute" width="0" height="0" aria-hidden="true">
          <defs>
            <radialGradient id="hero-node-glow">
              <stop offset="0%" stop-color="rgb(var(--color-primary))" stop-opacity="0.35" />
              <stop offset="50%" stop-color="rgb(var(--color-primary))" stop-opacity="0.08" />
              <stop offset="100%" stop-color="rgb(var(--color-primary))" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="hero-node-glow-soft">
              <stop offset="0%" stop-color="rgb(var(--color-primary))" stop-opacity="0.2" />
              <stop offset="60%" stop-color="rgb(var(--color-primary))" stop-opacity="0.04" />
              <stop offset="100%" stop-color="rgb(var(--color-primary))" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="hero-glow-cyan">
              <stop offset="0%" stop-color="rgb(34 211 238)" stop-opacity="0.25" />
              <stop offset="50%" stop-color="rgb(34 211 238)" stop-opacity="0.06" />
              <stop offset="100%" stop-color="rgb(34 211 238)" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="hero-glow-cyan-soft">
              <stop offset="0%" stop-color="rgb(34 211 238)" stop-opacity="0.12" />
              <stop offset="60%" stop-color="rgb(34 211 238)" stop-opacity="0.02" />
              <stop offset="100%" stop-color="rgb(34 211 238)" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="hero-glow-rose">
              <stop offset="0%" stop-color="rgb(244 114 182)" stop-opacity="0.2" />
              <stop offset="50%" stop-color="rgb(244 114 182)" stop-opacity="0.05" />
              <stop offset="100%" stop-color="rgb(244 114 182)" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="hero-glow-rose-soft">
              <stop offset="0%" stop-color="rgb(244 114 182)" stop-opacity="0.1" />
              <stop offset="60%" stop-color="rgb(244 114 182)" stop-opacity="0.02" />
              <stop offset="100%" stop-color="rgb(244 114 182)" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="hero-glow-amber">
              <stop offset="0%" stop-color="rgb(251 191 36)" stop-opacity="0.15" />
              <stop offset="50%" stop-color="rgb(251 191 36)" stop-opacity="0.04" />
              <stop offset="100%" stop-color="rgb(251 191 36)" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="hero-fade-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="rgb(var(--color-background))" stop-opacity="1" />
              <stop offset="100%" stop-color="rgb(var(--color-background))" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="hero-fade-right" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stop-color="rgb(var(--color-background))" stop-opacity="1" />
              <stop offset="100%" stop-color="rgb(var(--color-background))" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="hero-fade-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgb(var(--color-background))" stop-opacity="0.8" />
              <stop offset="100%" stop-color="rgb(var(--color-background))" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="hero-fade-bottom" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="rgb(var(--color-background))" stop-opacity="1" />
              <stop offset="40%" stop-color="rgb(var(--color-background))" stop-opacity="0.6" />
              <stop offset="100%" stop-color="rgb(var(--color-background))" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <!-- BACK LAYER — slow drift for ambient movement -->
        <div ref="layerBack" class="landing-parallax-layer absolute inset-0 will-change-transform">
          <svg class="absolute inset-0 h-full w-full landing-drift-slow will-change-transform" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
            <circle cx="160" cy="160" r="120" fill="url(#hero-node-glow)" />
            <circle cx="1280" cy="140" r="110" fill="url(#hero-node-glow)" />
            <circle cx="200" cy="640" r="115" fill="url(#hero-node-glow)" />
            <circle cx="1250" cy="680" r="100" fill="url(#hero-node-glow)" />
            <circle cx="1100" cy="80" r="90" fill="url(#hero-glow-cyan)" />
            <circle cx="350" cy="700" r="80" fill="url(#hero-glow-cyan)" />
            <circle cx="50" cy="300" r="70" fill="url(#hero-glow-cyan-soft)" />
            <circle cx="1400" cy="500" r="65" fill="url(#hero-glow-cyan-soft)" />
            <circle cx="400" cy="100" r="70" fill="url(#hero-glow-rose)" />
            <circle cx="1050" cy="700" r="65" fill="url(#hero-glow-rose)" />
            <circle cx="300" cy="350" r="50" fill="url(#hero-glow-amber)" />
            <circle cx="1200" cy="400" r="45" fill="url(#hero-glow-amber)" />
            <circle cx="600" cy="60" r="80" fill="url(#hero-node-glow-soft)" />
            <circle cx="880" cy="40" r="70" fill="url(#hero-node-glow-soft)" />
            <circle cx="540" cy="780" r="75" fill="url(#hero-node-glow-soft)" />
            <circle cx="920" cy="800" r="65" fill="url(#hero-node-glow-soft)" />
            <g opacity="0.05">
              <path d="M300,200 Q500,320 720,280" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M720,280 Q940,240 1140,170" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M280,600 Q540,530 760,570" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
            </g>
          </svg>
        </div>

        <!-- MID LAYER -->
        <div ref="layerMid" class="landing-parallax-layer absolute inset-0 will-change-transform">
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
            <g class="landing-line-draw" opacity="0.1">
              <path d="M40,120 Q130,80 220,140" stroke="rgb(var(--color-primary))" stroke-width="1" fill="none" />
              <path d="M220,140 Q310,200 180,260" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M1200,100 Q1300,60 1400,130" stroke="rgb(var(--color-primary))" stroke-width="1" fill="none" />
              <path d="M1200,100 Q1140,170 1260,220" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M520,50 Q600,90 680,60" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M680,60 Q760,30 840,70" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M80,540 Q200,480 280,570" stroke="rgb(var(--color-primary))" stroke-width="1" fill="none" />
              <path d="M280,570 Q360,640 200,660" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M1100,580 Q1200,520 1320,590" stroke="rgb(var(--color-primary))" stroke-width="1" fill="none" />
              <path d="M1320,590 Q1400,640 1280,680" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M560,680 Q640,650 720,690" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
              <path d="M720,690 Q800,720 880,680" stroke="rgb(var(--color-primary))" stroke-width="0.75" fill="none" />
            </g>
            <g class="landing-line-draw" opacity="0.06">
              <path d="M1100,100 Q1200,150 1300,120" stroke="rgb(34 211 238)" stroke-width="0.75" fill="none" />
              <path d="M300,650 Q400,600 500,680" stroke="rgb(34 211 238)" stroke-width="0.75" fill="none" />
            </g>
            <g class="landing-line-draw" opacity="0.05">
              <path d="M380,80 Q440,120 520,90" stroke="rgb(244 114 182)" stroke-width="0.6" fill="none" />
              <path d="M1050,650 Q1150,620 1200,680" stroke="rgb(244 114 182)" stroke-width="0.6" fill="none" />
            </g>
            <circle cx="420" cy="650" r="50" fill="url(#hero-node-glow-soft)" />
            <circle cx="1060" cy="590" r="55" fill="url(#hero-node-glow-soft)" />
            <circle cx="300" cy="200" r="40" fill="url(#hero-glow-cyan-soft)" />
            <circle cx="1160" cy="180" r="45" fill="url(#hero-glow-rose-soft)" />
          </svg>
        </div>

        <!-- FRONT LAYER — Starfield -->
        <div ref="layerFront" class="landing-parallax-layer absolute inset-0 will-change-transform">
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
            <g fill="rgb(var(--color-primary))">
              <circle cx="220" cy="140" r="4" opacity="0.6" />
              <circle cx="1200" cy="100" r="4" opacity="0.55" />
              <circle cx="280" cy="600" r="4" opacity="0.55" />
              <circle cx="1320" cy="620" r="3.5" opacity="0.45" />
              <circle cx="600" cy="90" r="3" opacity="0.35" />
              <circle cx="840" cy="70" r="3" opacity="0.3" />
              <circle cx="720" cy="730" r="3" opacity="0.3" />
              <circle cx="40" cy="120" r="3" opacity="0.45" />
              <circle cx="1400" cy="130" r="3" opacity="0.4" />
              <circle cx="80" cy="560" r="3.5" opacity="0.5" />
              <circle cx="1100" cy="610" r="3.5" opacity="0.5" />
              <circle cx="60" cy="230" r="2.5" opacity="0.35" />
              <circle cx="520" cy="50" r="2.5" opacity="0.3" />
              <circle cx="560" cy="710" r="2.5" opacity="0.28" />
              <circle cx="30" cy="370" r="2.5" opacity="0.3" />
              <circle cx="1390" cy="350" r="2.5" opacity="0.3" />
              <circle cx="130" cy="60" r="2" opacity="0.3" />
              <circle cx="1320" cy="60" r="2" opacity="0.3" />
              <circle cx="140" cy="500" r="2" opacity="0.25" />
              <circle cx="1040" cy="560" r="2" opacity="0.25" />
              <circle cx="160" cy="340" r="1.5" opacity="0.15" />
              <circle cx="1300" cy="300" r="1.5" opacity="0.15" />
              <circle cx="480" cy="30" r="1.5" opacity="0.15" />
              <circle cx="880" cy="40" r="1.5" opacity="0.15" />
            </g>
            <g fill="rgb(34 211 238)">
              <circle cx="1120" cy="90" r="3" opacity="0.35" />
              <circle cx="330" cy="680" r="2.5" opacity="0.3" />
              <circle cx="50" cy="310" r="2" opacity="0.25" />
              <circle cx="1410" cy="480" r="2" opacity="0.22" />
              <circle cx="400" cy="80" r="1.5" opacity="0.2" />
              <circle cx="1040" cy="50" r="1.5" opacity="0.18" />
              <circle cx="620" cy="780" r="1.5" opacity="0.15" />
            </g>
            <g fill="rgb(244 114 182)">
              <circle cx="380" cy="100" r="2.5" opacity="0.28" />
              <circle cx="1060" cy="680" r="2.5" opacity="0.25" />
              <circle cx="1380" cy="210" r="2" opacity="0.2" />
              <circle cx="80" cy="580" r="2" opacity="0.2" />
              <circle cx="270" cy="120" r="1.5" opacity="0.18" />
              <circle cx="1200" cy="680" r="1.5" opacity="0.16" />
            </g>
            <g fill="rgb(251 191 36)">
              <circle cx="300" cy="370" r="2" opacity="0.18" />
              <circle cx="1200" cy="420" r="2" opacity="0.15" />
              <circle cx="860" cy="110" r="1.5" opacity="0.12" />
            </g>
            <g fill="white">
              <circle cx="190" cy="150" r="1.5" opacity="0.3" />
              <circle cx="1250" cy="120" r="1.5" opacity="0.28" />
              <circle cx="310" cy="580" r="1.5" opacity="0.25" />
              <circle cx="650" cy="70" r="1" opacity="0.2" />
              <circle cx="100" cy="400" r="1" opacity="0.2" />
              <circle cx="660" cy="760" r="1" opacity="0.15" />
            </g>
            <!-- Pulsing rings -->
            <circle cx="220" cy="140" r="14" stroke="rgb(var(--color-primary))" stroke-width="0.5" fill="none" opacity="0.15" class="landing-pulse" />
            <circle cx="1200" cy="100" r="12" stroke="rgb(var(--color-primary))" stroke-width="0.5" fill="none" opacity="0.12" class="landing-pulse" style="animation-delay: -2s" />
            <circle cx="280" cy="600" r="12" stroke="rgb(var(--color-primary))" stroke-width="0.5" fill="none" opacity="0.1" class="landing-pulse" style="animation-delay: -3.5s" />
            <circle cx="1120" cy="90" r="10" stroke="rgb(34 211 238)" stroke-width="0.5" fill="none" opacity="0.1" class="landing-pulse" style="animation-delay: -1s" />
            <circle cx="380" cy="100" r="8" stroke="rgb(244 114 182)" stroke-width="0.5" fill="none" opacity="0.08" class="landing-pulse" style="animation-delay: -1.5s" />
          </svg>
        </div>

        <!-- Edge fades -->
        <svg class="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect x="0" y="0" width="200" height="900" fill="url(#hero-fade-left)" />
          <rect x="1240" y="0" width="200" height="900" fill="url(#hero-fade-right)" />
          <rect x="0" y="0" width="1440" height="160" fill="url(#hero-fade-top)" />
          <rect x="0" y="640" width="1440" height="260" fill="url(#hero-fade-bottom)" />
        </svg>
      </div>

      <!-- Gradient overlay for smooth transition -->
      <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[rgb(var(--color-background))] pointer-events-none" aria-hidden="true" />

      <div class="container relative flex flex-col items-center justify-center pt-14 pb-8 sm:py-12">
        <div class="mx-auto max-w-5xl">
          <!-- Headline -->
          <h1 class="landing-serif text-center text-4xl font-bold leading-[1.2] tracking-tight text-[rgb(var(--color-foreground))] sm:text-5xl lg:text-6xl">
            Knowledge belongs<br>
            <span class="text-[rgb(var(--color-primary))]">to everyone.</span>
          </h1>

          <!-- Subheading -->
          <p class="landing-reveal landing-reveal-delay-1 mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-xl">
            Free, open-source learning for every platform.
            Peer-to-peer, offline-first, with Verifiable Credentials anchored to Cardano.
          </p>

          <!-- CTA + Coming Soon -->
          <div class="landing-reveal landing-reveal-delay-2 mt-10 flex flex-col items-center gap-5">
            <div class="flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="https://github.com/ifftu-dev/alexandria"
                target="_blank"
                rel="noopener noreferrer"
                class="plausible-event-name=CTA-GitHub btn btn-outline btn-lg w-full sm:w-auto"
              >
                View on GitHub
              </a>
              <span class="inline-flex items-center gap-2 text-sm text-[rgb(var(--color-muted-foreground))]">
                <span class="relative flex h-2 w-2">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--color-primary))] opacity-50" />
                  <span class="relative inline-flex h-2 w-2 rounded-full bg-[rgb(var(--color-primary))]" />
                </span>
                Coming Soon
              </span>
            </div>

            <!-- Platforms -->
            <p class="text-xs tracking-wide text-[rgb(var(--color-muted-foreground)/0.6)]">
              macOS &middot; Windows &middot; Linux &middot; iOS &middot; Android
            </p>
          </div>
        </div>

      </div>

      <!-- Scroll indicator — only visible when content below is off-screen -->
      <Transition name="scroll-indicator">
        <div v-show="showIndicator" class="scroll-indicator-wrapper landing-reveal landing-reveal-delay-5 absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
          <div class="flex flex-col items-center gap-1.5">
            <span class="text-[10px] font-medium uppercase tracking-widest text-[rgb(var(--color-muted-foreground))]">Scroll</span>
            <svg class="scroll-indicator-chevron h-5 w-5 text-[rgb(var(--color-primary)/0.7)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </Transition>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="relative bg-[rgb(var(--color-background))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="landing-scroll-reveal text-center">
          <h2 class="landing-serif text-2xl font-bold tracking-tight text-[rgb(var(--color-foreground))] sm:text-4xl lg:text-5xl">
            Education without infrastructure.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            No cloud servers, no subscriptions, no data collection. Just a native app that connects learners directly.
          </p>
        </div>

        <div class="mt-12 grid gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="landing-scroll-reveal rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 transition hover:border-[rgb(var(--color-primary)/0.4)] sm:p-8"
          >
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]">
              <!-- video -->
              <svg v-if="feature.icon === 'video'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <!-- graph -->
              <svg v-else-if="feature.icon === 'graph'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <!-- shield -->
              <svg v-else-if="feature.icon === 'shield'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <!-- key -->
              <svg v-else-if="feature.icon === 'key'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              <!-- reputation -->
              <svg v-else-if="feature.icon === 'reputation'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <!-- building -->
              <svg v-else-if="feature.icon === 'building'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <h3 class="mt-5 text-lg font-semibold text-[rgb(var(--color-foreground))]">{{ feature.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[rgb(var(--color-muted-foreground))]">
              {{ feature.description }}
            </p>
            <ul class="mt-4 space-y-2">
              <li
                v-for="bullet in feature.bullets"
                :key="bullet"
                class="flex items-start gap-2 text-sm text-[rgb(var(--color-muted-foreground))]"
              >
                <svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-[rgb(var(--color-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="relative bg-[rgb(var(--color-muted))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="landing-scroll-reveal text-center">
          <h2 class="landing-serif text-2xl font-bold tracking-tight text-[rgb(var(--color-foreground))] sm:text-4xl lg:text-5xl">
            How it works.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            From download to decentralized credentials in four steps.
          </p>
        </div>

        <div class="relative mt-12 sm:mt-20">
          <!-- Connecting line -->
          <div class="absolute left-5 top-0 bottom-0 z-0 hidden w-px bg-gradient-to-b from-[rgb(var(--color-primary))] via-[rgb(var(--color-primary)/0.3)] to-transparent sm:block" />

          <div class="space-y-12">
            <div
              v-for="(step, i) in steps"
              :key="step.number"
              class="landing-scroll-reveal relative z-10 flex gap-8"
            >
              <div class="hidden sm:flex">
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--color-primary)/0.3)] text-sm font-mono font-semibold text-[rgb(var(--color-primary))]" :style="{ background: 'color-mix(in srgb, rgb(var(--color-primary)) 10%, rgb(var(--color-background)))' }">
                  {{ step.number }}
                </div>
              </div>
              <div class="flex-1 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 sm:p-8">
                <div class="sm:hidden mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--color-primary)/0.1)] text-xs font-mono font-semibold text-[rgb(var(--color-primary))]">
                  {{ step.number }}
                </div>
                <h3 class="text-lg font-semibold text-[rgb(var(--color-foreground))]">{{ step.title }}</h3>
                <p class="mt-2 text-[rgb(var(--color-muted-foreground))]">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ PLATFORM SUPPORT ═══ -->
    <section class="relative bg-[rgb(var(--color-background))] py-16 sm:py-24 lg:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="landing-scroll-reveal text-center">
          <h2 class="landing-serif text-2xl font-bold tracking-tight text-[rgb(var(--color-foreground))] sm:text-4xl lg:text-5xl">
            Runs everywhere.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-lg">
            One codebase. Every platform. Native performance.
          </p>
        </div>

        <div class="mt-10 grid grid-cols-3 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
          <div
            v-for="platform in ['macOS', 'Windows', 'Linux', 'iOS', 'Android']"
            :key="platform"
            class="landing-scroll-reveal flex flex-col items-center gap-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 text-center transition-all hover:border-[rgb(var(--color-primary)/0.3)] hover:shadow-md sm:gap-3 sm:rounded-2xl sm:p-6"
          >
            <!-- macOS -->
            <svg v-if="platform === 'macOS'" class="h-6 w-6 sm:h-8 sm:w-8 text-[rgb(var(--color-foreground))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <!-- Windows -->
            <svg v-else-if="platform === 'Windows'" class="h-6 w-6 sm:h-8 sm:w-8 text-[rgb(var(--color-foreground))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
            </svg>
            <!-- Linux -->
            <svg v-else-if="platform === 'Linux'" class="h-6 w-6 sm:h-8 sm:w-8 text-[rgb(var(--color-foreground))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z" />
            </svg>
            <!-- iOS -->
            <svg v-else-if="platform === 'iOS'" class="h-6 w-6 sm:h-8 sm:w-8 text-[rgb(var(--color-foreground))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <!-- Android -->
            <svg v-else class="h-6 w-6 sm:h-8 sm:w-8 text-[rgb(var(--color-foreground))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.532 15.106a1.003 1.003 0 1 1 .001-2.007 1.003 1.003 0 0 1 0 2.007m-11.044 0a1.003 1.003 0 1 1 .001-2.007 1.003 1.003 0 0 1 0 2.007m11.4-6.018 2.006-3.459a.413.413 0 1 0-.721-.403l-2.03 3.5A12.26 12.26 0 0 0 12.011 7.5a12.26 12.26 0 0 0-5.132 1.226l-2.03-3.5a.413.413 0 1 0-.72.403l2.005 3.46C2.593 11.066.003 14.812 0 19.2h24.022c-.003-4.388-2.593-8.134-6.134-10.112" />
            </svg>
            <span class="text-sm font-medium text-[rgb(var(--color-foreground))]">{{ platform }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <div class="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary)/0.06)] via-[rgb(var(--color-muted)/0.4)] to-[rgb(var(--color-primary)/0.03)]" />
      <div class="absolute inset-0 bg-grid opacity-[0.03]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[rgb(var(--color-primary)/0.06)] blur-3xl" />

      <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div class="landing-scroll-reveal">
          <h2 class="landing-serif text-2xl font-bold tracking-tight text-[rgb(var(--color-foreground))] sm:text-4xl lg:text-5xl">
            Start learning. Own your credentials.
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:mt-6 sm:text-lg">
            Alexandria is coming to every platform. Free for learners, forever.
          </p>
          <div class="mt-6 flex flex-col items-center gap-5">
            <span class="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-primary)/0.25)] bg-[rgb(var(--color-card)/0.6)] px-5 py-2 text-sm font-semibold text-[rgb(var(--color-primary))] backdrop-blur-sm">
              Coming Soon
            </span>
            <div class="flex flex-wrap items-center justify-center gap-5 text-[rgb(var(--color-muted-foreground))]">
              <div class="flex items-center gap-1.5">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                <span class="text-xs font-medium">macOS</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" /></svg>
                <span class="text-xs font-medium">Windows</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z" /></svg>
                <span class="text-xs font-medium">Linux</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                <span class="text-xs font-medium">iOS</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.532 15.106a1.003 1.003 0 1 1 .001-2.007 1.003 1.003 0 0 1 0 2.007m-11.044 0a1.003 1.003 0 1 1 .001-2.007 1.003 1.003 0 0 1 0 2.007m11.4-6.018 2.006-3.459a.413.413 0 1 0-.721-.403l-2.03 3.5A12.26 12.26 0 0 0 12.011 7.5a12.26 12.26 0 0 0-5.132 1.226l-2.03-3.5a.413.413 0 1 0-.72.403l2.005 3.46C2.593 11.066.003 14.812 0 19.2h24.022c-.003-4.388-2.593-8.134-6.134-10.112" /></svg>
                <span class="text-xs font-medium">Android</span>
              </div>
            </div>
            <a
              href="https://github.com/ifftu-dev/alexandria"
              target="_blank"
              rel="noopener noreferrer"
              class="plausible-event-name=CTA-GitHub btn btn-outline btn-lg"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
