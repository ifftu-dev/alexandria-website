<script setup lang="ts">
definePageMeta({
  layout: 'landing',
})

const { download, allPlatformsUrl } = useDownload()

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
  })
}

useScrollReveal()

// ─── Parallax scroll effect for hero background layers ───
const heroRef = ref<HTMLElement | null>(null)
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
    description: 'Tutorials, courses, assessments, and articles — all free and open-source. A native app that works offline, syncs peer-to-peer, and runs on every platform.',
    bullets: [
      'Structured courses with real assessments',
      'Works offline — no internet required',
      'Runs on macOS, Windows, Linux, iOS, Android',
    ],
  },
  {
    title: 'Earn Verifiable Credentials',
    description: 'Achievements stored on the Cardano blockchain — portable, tamper-proof, and independently verifiable without the platform.',
    bullets: [
      'Blockchain-backed skill proofs',
      'Portable, employer-verifiable credentials',
      'Instructors earn reputation through learner success',
    ],
  },
  {
    title: 'Own Your Data',
    description: 'Your keys, your identity, your content. Everything stored locally with military-grade encryption. Peer-to-peer sync — no cloud, no corporate servers.',
    bullets: [
      'Self-sovereign identity with local key vault',
      'Content-addressed storage via iroh',
      'P2P networking — no central server',
    ],
  },
  {
    title: 'Community Governed',
    description: 'DAOs mirror the knowledge taxonomy. Elections, nominations, and voting are driven by demonstrated expertise — not money.',
    bullets: [
      'Meritocratic governance model',
      'Reputation-based voting power',
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
    title: 'Mint Credentials',
    description: 'SkillProofs mint as NFTs on Cardano. Metadata is content-addressed. Your credentials exist independently of Alexandria — forever.',
  },
  {
    number: '04',
    title: 'Share & Govern',
    description: 'Share credentials selectively with employers. Stake your reputation to participate in platform governance. Connect peer-to-peer with other learners.',
  },
]

const stats = [
  { label: 'Open Source', value: '100%' },
  { label: 'Cost to Learners', value: 'Free' },
  { label: 'Servers Required', value: 'Zero' },
]
</script>

<template>
  <div>
    <!-- ═══ HERO SECTION ═══ -->
    <section ref="heroRef" class="landing-hero relative flex min-h-[90vh] items-center justify-center overflow-hidden">
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

        <!-- BACK LAYER -->
        <div ref="layerBack" class="landing-parallax-layer absolute inset-0 will-change-transform">
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
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

      <div class="container relative">
        <div class="mx-auto max-w-5xl">
          <!-- Kicker -->
          <div class="landing-reveal mb-8 flex items-center justify-center gap-3">
            <span class="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-primary)/0.2)] bg-[rgb(var(--color-card)/0.8)] px-4 py-1.5 text-sm font-medium text-[rgb(var(--color-primary))] backdrop-blur-sm">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--color-primary))] opacity-50" />
                <span class="relative inline-flex h-2 w-2 rounded-full bg-[rgb(var(--color-primary))]" />
              </span>
              Free & Open Source
            </span>
          </div>

          <!-- Headline -->
          <h1 class="landing-reveal landing-reveal-delay-1 landing-serif text-center text-4xl font-bold leading-[1.2] tracking-tight text-[rgb(var(--color-foreground))] sm:text-5xl lg:text-6xl">
            Knowledge belongs<br>
            <span class="text-[rgb(var(--color-primary))]">to everyone.</span>
          </h1>

          <!-- Subheading -->
          <p class="landing-reveal landing-reveal-delay-2 mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-[rgb(var(--color-muted-foreground))] sm:text-xl">
            A native app for every platform. Peer-to-peer learning with
            blockchain-verified credentials, offline-first by design, and
            zero servers between you and knowledge.
          </p>

          <!-- CTA buttons -->
          <div class="landing-reveal landing-reveal-delay-3 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              :href="download.downloadUrl"
              class="btn btn-primary btn-lg group w-full sm:w-auto"
            >
              <!-- Platform icons -->
              <svg v-if="download.platformIcon === 'apple'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <svg v-else-if="download.platformIcon === 'windows'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              <svg v-else-if="download.platformIcon === 'linux'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.5.899.2 1.983-.26 3.181-.734.803-.334 1.503-.73 1.998-1.198.39-.37.704-.73.87-1.205.088-.251.112-.478.166-.733.054-.259.132-.532.132-.803v-.2c0-.26-.008-.47-.06-.67-.085-.32-.263-.6-.455-.86-.377-.4-.848-.597-1.302-.85-.259-.133-.535-.25-.715-.385-.18-.132-.29-.266-.29-.466 0-.2.2-.93.244-1.403.044-.468 0-.867-.26-1.334-.268-.466-.739-.8-1.346-.8H14.5c-.003 0-.008 0-.015.003-.26 0-.515.065-.737.2-.212.133-.39.333-.536.534-1.025 1.268-2.174 2.131-2.65 3.598-.178.602-.313 1.335-.156 1.835.16.6.47 1.05.867 1.368.184.133.395.2.612.266.07.02.14.05.21.067a3.58 3.58 0 001.154.2c.195.012.39.005.578-.025h.005a1.16 1.16 0 00.154-.04c.078-.02.154-.05.22-.08.132-.066.25-.2.37-.3z" />
              </svg>
              <svg v-else class="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download for {{ download.platformLabel }}
            </a>
            <a
              :href="allPlatformsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline btn-lg w-full sm:w-auto"
            >
              All Platforms
            </a>
          </div>

          <!-- Stats badges -->
          <div class="landing-reveal landing-reveal-delay-4 mt-16 flex flex-wrap items-center justify-center gap-3">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card)/0.8)] px-4 py-2 backdrop-blur-sm"
            >
              <span class="text-sm font-semibold text-[rgb(var(--color-primary))]">{{ stat.value }}</span>
              <span class="text-xs text-[rgb(var(--color-muted-foreground))]">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="relative bg-[rgb(var(--color-background))] py-24 sm:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="landing-scroll-reveal text-center">
          <h2 class="landing-serif text-3xl font-bold tracking-tight text-[rgb(var(--color-foreground))] sm:text-4xl lg:text-5xl">
            Education without infrastructure.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-[rgb(var(--color-muted-foreground))]">
            No cloud servers, no subscriptions, no data collection. Just a native app that connects learners directly.
          </p>
        </div>

        <div class="mt-20 grid gap-12 md:grid-cols-2">
          <div
            v-for="(feature, i) in features"
            :key="feature.title"
            class="landing-scroll-reveal"
          >
            <h3 class="text-xl font-semibold text-[rgb(var(--color-foreground))]">{{ feature.title }}</h3>
            <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
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
    <section class="relative bg-[rgb(var(--color-muted))] py-24 sm:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="landing-scroll-reveal text-center">
          <h2 class="landing-serif text-3xl font-bold tracking-tight text-[rgb(var(--color-foreground))] sm:text-4xl lg:text-5xl">
            How it works.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-[rgb(var(--color-muted-foreground))]">
            From download to decentralized credentials in four steps.
          </p>
        </div>

        <div class="relative mt-20">
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
    <section class="relative bg-[rgb(var(--color-background))] py-24 sm:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="landing-scroll-reveal text-center">
          <h2 class="landing-serif text-3xl font-bold tracking-tight text-[rgb(var(--color-foreground))] sm:text-4xl lg:text-5xl">
            Runs everywhere.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-[rgb(var(--color-muted-foreground))]">
            One codebase. Every platform. Native performance.
          </p>
        </div>

        <div class="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          <div
            v-for="platform in ['macOS', 'Windows', 'Linux', 'iOS', 'Android']"
            :key="platform"
            class="landing-scroll-reveal flex flex-col items-center gap-3 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 text-center transition-all hover:border-[rgb(var(--color-primary)/0.3)] hover:shadow-md"
          >
            <!-- macOS -->
            <svg v-if="platform === 'macOS'" class="h-8 w-8 text-[rgb(var(--color-foreground))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <!-- Windows -->
            <svg v-else-if="platform === 'Windows'" class="h-8 w-8 text-[rgb(var(--color-foreground))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
            </svg>
            <!-- Linux -->
            <svg v-else-if="platform === 'Linux'" class="h-8 w-8 text-[rgb(var(--color-foreground))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2l.003.003c.391.778 1.113 1.368 1.884 1.5.899.2 1.983-.26 3.181-.734.803-.334 1.503-.73 1.998-1.198.39-.37.704-.73.87-1.205.088-.251.112-.478.166-.733.054-.259.132-.532.132-.803v-.2c0-.26-.008-.47-.06-.67-.085-.32-.263-.6-.455-.86-.377-.4-.848-.597-1.302-.85-.259-.133-.535-.25-.715-.385-.18-.132-.29-.266-.29-.466z" />
            </svg>
            <!-- iOS -->
            <svg v-else-if="platform === 'iOS'" class="h-8 w-8 text-[rgb(var(--color-foreground))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            <!-- Android -->
            <svg v-else class="h-8 w-8 text-[rgb(var(--color-foreground))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            <span class="text-sm font-medium text-[rgb(var(--color-foreground))]">{{ platform }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="relative overflow-hidden py-24 sm:py-32">
      <div class="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary)/0.06)] via-[rgb(var(--color-muted)/0.4)] to-[rgb(var(--color-primary)/0.03)]" />
      <div class="absolute inset-0 bg-grid opacity-[0.03]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[rgb(var(--color-primary)/0.06)] blur-3xl" />

      <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div class="landing-scroll-reveal">
          <h2 class="landing-serif text-3xl font-bold tracking-tight text-[rgb(var(--color-foreground))] sm:text-4xl lg:text-5xl">
            Start learning. Own your credentials.
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg text-[rgb(var(--color-muted-foreground))]">
            Download Alexandria and join a decentralized learning network. Free for learners, forever.
          </p>
          <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              :href="download.downloadUrl"
              class="btn btn-primary btn-lg"
            >
              Download for {{ download.platformLabel }}
            </a>
            <a
              href="https://github.com/ifftu-dev/alexandria"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline btn-lg"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
