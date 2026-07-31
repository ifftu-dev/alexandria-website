<script setup lang="ts">
/**
 * The evidence behind the thesis, and the parts of it we cannot evidence.
 *
 * This page exists so the rest of the site can make claims. Everything here is
 * either sourced to published research or marked as our own projection, and the
 * figures come from `content/evidence.ts` rather than being typed next to the
 * prose — a number and its attribution drift apart the moment they live in
 * different places.
 *
 * Section 06 is the point of the page, not an appendix to it. A site that lists
 * only its supporting evidence has told you what it wants to be true; naming the
 * two claims that could still sink this is the only thing that makes the other
 * five sections worth reading.
 */
import { MODEL_NOTE, RECOGNITION_GAP, SOURCES, TARGETS } from '~/content/evidence'

definePageMeta({ layout: 'landing' })

const waitlist = useWaitlist()

useHead({
  title: 'Why recognition — Alexandria',
  meta: [
    { name: 'description', content: 'Free learning already exists; it was never enough. The research behind the recognition gap, our own projections labelled as projections, and the two claims we cannot yet evidence.' },
    { property: 'og:title', content: 'Why recognition — Alexandria' },
    { property: 'og:description', content: 'Free learning already exists. It was never enough. The evidence, and what we still cannot prove.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/why-recognition' },
    { name: 'twitter:title', content: 'Why recognition — Alexandria' },
    { name: 'twitter:description', content: 'Free learning already exists. It was never enough.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/why-recognition' }],
})

const invisible = [
  { title: 'Learners without institutions', body: 'Capable, self-taught, and invisible to every employer’s filter.' },
  { title: 'Workers changing trade', body: 'Skills earned on the job that no certificate anywhere records.' },
  { title: 'The displaced', body: 'People whose paperwork was left behind, or never issued at all.' },
]

/**
 * Framed as works/fails rather than a feature matrix. Every one of these
 * genuinely solves something — a table of crosses against competitors would be
 * both less true and less persuasive than saying what each got right.
 */
const options = [
  { option: 'Free courses', works: 'Reach everyone, cost nothing', fails: 'Leave no proof behind at all' },
  { option: 'Paid certificates', works: 'Carry some weight', fails: 'Cost money the learner does not have, and belong to the issuer' },
  { option: 'Degrees', works: 'Open doors worldwide', fails: 'Gated by geography, price and time' },
  { option: 'Platform badges', works: 'Easy to earn and share', fails: 'Disappear with the company that issued them' },
]

const chain = [
  { n: '01', k: 'Grant', v: 'funds the build and the free tier' },
  { n: '02', k: 'Platform', v: 'free learning and assessment, any device' },
  { n: '03', k: 'Credentials', v: 'portable proof a learner owns outright' },
  { n: '04', k: 'Employers', v: 'pay to hire on verified skill' },
  { n: '05', k: 'Sustained', v: 'earned revenue funds the commons' },
]

const unknowns = [
  {
    title: 'That employers will pay for verified skill',
    body: 'The research says they want to hire this way. It does not prove they will buy the infrastructure that lets them. Finding out is the purpose of this stage.',
  },
  {
    title: 'That the credential earns real recognition',
    body: 'A credential is only worth what people accept it for. No independent validity study has been completed. When one is, we publish it — including negative results.',
  },
]

const accountability = [
  { k: 'Reach', v: 'Learners, geographies and languages. Reported quarterly.' },
  { k: 'Outcomes', v: 'Credentials issued, hires made, earnings unlocked.' },
  { k: 'Rigour', v: 'Independent validity studies, published openly — including the ones that go against us.' },
]

const method = [
  {
    k: 'Skills-based hiring',
    v: 'Harvard Business School Managing the Future of Work with the Burning Glass Institute, 12 February 2024 (Joseph Fuller): 11,300 large US firms, 2014–2023. Fewer than 1 in 700 new hires benefited; where it did take hold, pay rose 25% and retention ran 10 points higher.',
    url: 'https://www.burningglassinstitute.org/research/skills-based-hiring-2024',
  },
  {
    k: 'Degree attainment',
    v: 'US Census Bureau educational attainment: 37.7% of Americans aged 25 and over hold a bachelor’s degree or higher, leaving 62.3% who do not.',
    url: 'https://www.census.gov/topics/education/educational-attainment.html',
  },
  {
    k: 'Projections',
    v: 'Alexandria’s own bottom-up model, July 2026 — built from unit drivers, not market share. Base case throughout. Pre-launch, with no external users.',
  },
  {
    k: 'Educator revenue share',
    v: '40% of earned revenue is a policy of ours, not a forecast. We have deliberately not published modelled educator earnings: nobody has earned anything here yet, and a projection shaped like an income claim is not something a pre-launch company should put in front of people deciding how to spend their time.',
  },
  {
    k: 'Examination data',
    v: 'National Testing Agency, India, 2025: NEET-UG 22.76 lakh registered, JEE Main 15.4 lakh across two sessions.',
    url: 'https://www.nta.ac.in/',
  },
]
</script>

<template>
  <div class="page-accent">
    <section class="hero hero-page">
      <MeshGradient :blobs="['79,70,229', '99,102,241', '34,211,238', '129,140,248', '79,70,229']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">The evidence</p>
        <h1>Free learning already exists. It was never enough.</h1>
        <p class="hero-lede">
          Everything on this page is either sourced to published research or labelled as our own
          projection. Where we have no evidence, we say so — that is what section six is for.
        </p>
      </div>
    </section>

    <!-- ═══ 01 THE GAP ═══ -->
    <section class="section pad">
      <p class="eyebrow">01 / The gap</p>
      <h2 class="h-sec">
        Some of the best teaching on earth is already free. Nobody has ever been hired on a watch
        history.
      </h2>
      <div class="w-prose">
        <p>
          A teenager in a Mumbai slum can take the same course as one at MIT — the same lectures,
          the same problems, the same hours put in. Only one of them ends up with a credential
          anyone will accept. The knowledge is identical; the recognition is not, and it is the
          recognition that changes the life.
        </p>
        <p>
          Nearly two-thirds of American adults hold no bachelor’s degree, and in most of the world
          the share is far higher. The content problem was solved a decade ago. The proof problem
          was not.
        </p>
      </div>

      <div class="w-cards">
        <div v-for="c in invisible" :key="c.title" class="w-card">
          <h3>{{ c.title }}</h3>
          <p>{{ c.body }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ 02 WHAT FAILED ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">02 / What already failed</p>
      <h2 class="h-sec">Every existing option solves half the problem.</h2>
      <p class="p-sub">
        Free video, paid certificates, degrees, badges — each covers part of the gap and leaves the
        rest wide open.
      </p>

      <div class="w-tablewrap">
        <table class="w-table">
          <thead>
            <tr>
              <th scope="col"><span class="sr-only">Option</span></th>
              <th scope="col">What works</th>
              <th scope="col">What fails</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in options" :key="o.option">
              <th scope="row">{{ o.option }}</th>
              <td>{{ o.works }}</td>
              <td>{{ o.fails }}</td>
            </tr>
            <tr class="w-us">
              <th scope="row">Alexandria</th>
              <td colspan="2">
                Free, portable and independently verifiable at once — the combination nobody has
                shipped. Whether it earns recognition is exactly what we cannot yet claim.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="w-close">The missing piece was never content. It was proof that travels.</p>
    </section>

    <!-- ═══ 03 EMPLOYERS TRIED ═══ -->
    <section class="section pad">
      <p class="eyebrow">03 / Employers already tried</p>
      <h2 class="h-sec">They dropped the degree requirement. Almost nothing changed.</h2>
      <div class="w-prose">
        <p>
          Apple, Walmart, General Motors and more than twenty US state governments removed degree
          requirements from job postings. Harvard Business School and the Burning Glass Institute
          tracked what happened next across 11,300 large firms over nine years.
        </p>
        <p>
          Fewer than one in 700 new hires actually benefited — about 97,000 people out of 77 million
          hires in 2023. Not for lack of will, but because nothing replaced the degree as a signal
          an employer could trust.
        </p>
        <p>
          The same study found that where skills-based hiring did take hold, the outcomes were
          better, not worse.
        </p>
      </div>

      <div class="w-stats">
        <div v-for="f in RECOGNITION_GAP.slice(1)" :key="f.id" class="w-stat">
          <p class="w-fig">{{ f.value }}</p>
          <p class="w-figlabel">{{ f.label }}</p>
          <p v-if="f.basis" class="w-basis">{{ f.basis }}</p>
        </div>
      </div>

      <p class="w-close">
        The appetite is proven and the mobility is measured. The missing piece is proof an employer
        can check.
      </p>
      <p class="w-src">
        {{ SOURCES.bgi2024!.line }}
        <a :href="SOURCES.bgi2024!.url" target="_blank" rel="noopener noreferrer">Read the study</a>.
        All three figures above come from this one piece of research, not from three converging ones.
      </p>
    </section>

    <!-- ═══ 04 THEORY OF CHANGE ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">04 / Theory of change</p>
      <h2 class="h-sec">Philanthropy starts it. Employers sustain it.</h2>
      <p class="p-sub">
        A free commons needs a funding model that does not depend on being funded forever. Grant
        capital opens it; the people who get commercial value out of it keep it open.
      </p>
      <ol class="w-chain">
        <li v-for="s in chain" :key="s.n">
          <span class="w-n">{{ s.n }}</span>
          <b>{{ s.k }}</b>
          <span class="w-v">{{ s.v }}</span>
        </li>
      </ol>
    </section>

    <!-- ═══ 05 TARGETS ═══ -->
    <section class="section pad">
      <div class="w-head">
        <p class="eyebrow">05 / What we are aiming at</p>
        <StatusChip state="planned" label="Projections, not results" />
      </div>
      <h2 class="h-sec">Our targets for 2031.</h2>
      <p class="p-sub">
        These come from our own bottom-up model built on unit drivers, not market-share guesses. No
        learner is on the platform yet, so treat every number below as an objective we expect to be
        held to.
      </p>

      <div class="w-stats w-stats-proj">
        <div v-for="f in TARGETS" :key="f.id" class="w-stat">
          <p class="w-fig">{{ f.value }}</p>
          <p class="w-figlabel">{{ f.label }}</p>
          <p class="w-tag">{{ f.status === 'projection' ? 'Projection' : 'Our policy' }}</p>
        </div>
      </div>
      <p class="w-src">{{ MODEL_NOTE }}</p>
    </section>

    <!-- ═══ 06 WHAT WE DO NOT KNOW ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">06 / What we do not know</p>
      <h2 class="h-sec">The two things that could still make this fail.</h2>

      <div class="w-unknowns">
        <div v-for="u in unknowns" :key="u.title" class="w-unknown">
          <StatusChip state="planned" label="Unevidenced" />
          <h3>{{ u.title }}</h3>
          <p>{{ u.body }}</p>
        </div>
      </div>

      <dl class="w-acc">
        <template v-for="a in accountability" :key="a.k">
          <dt>{{ a.k }}</dt><dd>{{ a.v }}</dd>
        </template>
      </dl>
      <p class="w-close">
        Open source, open data, open method. Anyone can check our claims — including you, and
        including <NuxtLink to="/verify">the credential itself</NuxtLink>.
      </p>
    </section>

    <!-- ═══ SOURCES ═══ -->
    <section class="section pad">
      <h2 class="h-sec">Sources and method</h2>
      <dl class="w-method">
        <template v-for="m in method" :key="m.k">
          <dt>{{ m.k }}</dt>
          <dd>
            {{ m.v }}
            <a v-if="m.url" :href="m.url" target="_blank" rel="noopener noreferrer">Source</a>
          </dd>
        </template>
      </dl>
    </section>

    <!-- ═══ CLOSING ═══ -->
    <section class="section pad section-wash">
      <div class="w-quote">
        <blockquote>
          “We have plenty of free content. We do not have free recognition.”
        </blockquote>
        <div>
          <p class="p-sub">
            That is the whole thesis. The app is free, the code is open, and the alpha is filling up
            in groups.
          </p>
          <div class="hero-cta">
            <button type="button" class="btn plausible-event-name=EarlyAccess" @click="waitlist.open()">
              Join the waiting list
            </button>
            <NuxtLink to="/verify" class="btn-ghost btn-solid">Check a credential</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.h-sec { font-size: clamp(22px, 3.2vw, 30px); letter-spacing: -0.02em; margin: 0 0 14px; max-width: 24ch; line-height: 1.15; }
.p-sub { margin: 0 0 24px; font-size: 15px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); max-width: 62ch; }

.w-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.w-prose { max-width: 64ch; display: grid; gap: 14px; margin-bottom: 30px; }
.w-prose p { margin: 0; font-size: 15.5px; line-height: 1.7; color: rgb(var(--color-muted-foreground)); }

.w-cards { display: grid; gap: 16px; }
@media (min-width: 800px) { .w-cards { grid-template-columns: repeat(3, 1fr); } }
.w-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.w-card h3 { margin: 0 0 8px; font-size: 15.5px; letter-spacing: -0.01em; }
.w-card p { margin: 0; font-size: 14px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }

/* The table scrolls rather than reflowing: these rows are a comparison, and a
   comparison that stacks into four separate lists stops being one. */
.w-tablewrap { overflow-x: auto; border: 1px solid rgb(var(--color-border)); border-radius: 14px; background: rgb(var(--color-card)); }
.w-table { width: 100%; min-width: 620px; border-collapse: collapse; font-size: 14px; }
.w-table th, .w-table td { text-align: start; padding: 14px 16px; border-bottom: 1px solid rgb(var(--color-border)); vertical-align: top; line-height: 1.55; }
.w-table thead th { font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgb(var(--color-muted-foreground)); background: rgb(var(--color-muted)); }
.w-table tbody th { font-weight: 700; white-space: nowrap; }
.w-table td { color: rgb(var(--color-muted-foreground)); }
.w-table tr:last-child th, .w-table tr:last-child td { border-bottom: 0; }
.w-us th, .w-us td { background: rgb(var(--color-primary) / 0.07); color: rgb(var(--color-foreground)); }

.w-stats { display: grid; gap: 18px; margin-top: 4px; }
@media (min-width: 720px) { .w-stats { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 720px) { .w-stats-proj { grid-template-columns: repeat(4, 1fr); } }
.w-stat { border-top: 2px solid rgb(var(--color-primary)); padding-top: 14px; }
.w-fig { margin: 0; font-family: var(--font-display); font-size: clamp(34px, 4.4vw, 50px); font-weight: 300; letter-spacing: -0.01em; line-height: 1.02; }
.w-figlabel { margin: 8px 0 0; font-size: 13.5px; line-height: 1.55; color: rgb(var(--color-muted-foreground)); }
.w-basis { margin: 6px 0 0; font-size: 12px; line-height: 1.5; color: rgb(var(--color-muted-foreground)); opacity: 0.85; }
/* Projections must not borrow the visual authority of the sourced figures. */
.w-stats-proj .w-stat { border-top-color: rgb(var(--color-border)); border-top-width: 1px; }
.w-tag { margin: 8px 0 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgb(var(--color-muted-foreground)); }

.w-close { margin: 26px 0 0; font-size: 16px; line-height: 1.6; font-weight: 600; max-width: 56ch; }
.w-close a { color: rgb(var(--color-primary)); }
.w-src { margin: 14px 0 0; font-size: 12.5px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); max-width: 72ch; }
.w-src a { color: rgb(var(--color-primary)); }

.w-chain { list-style: none; margin: 0; padding: 0; display: grid; gap: 1px; background: rgb(var(--color-border)); border: 1px solid rgb(var(--color-border)); border-radius: 14px; overflow: hidden; }
@media (min-width: 940px) { .w-chain { grid-template-columns: repeat(5, 1fr); } }
.w-chain li { background: rgb(var(--color-card)); padding: 18px; display: grid; gap: 5px; align-content: start; }
.w-n { font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em; color: rgb(var(--color-primary)); }
.w-chain b { font-size: 15px; }
.w-v { font-size: 13.5px; line-height: 1.55; color: rgb(var(--color-muted-foreground)); }

.w-unknowns { display: grid; gap: 16px; margin-bottom: 30px; }
@media (min-width: 820px) { .w-unknowns { grid-template-columns: 1fr 1fr; } }
.w-unknown { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.w-unknown h3 { margin: 12px 0 8px; font-size: 16px; letter-spacing: -0.01em; }
.w-unknown p { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }

.w-acc, .w-method { display: grid; gap: 12px; margin: 0; }
@media (min-width: 760px) { .w-acc, .w-method { grid-template-columns: max-content 1fr; gap: 14px 28px; } }
.w-acc dt, .w-method dt { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: rgb(var(--color-muted-foreground)); padding-top: 2px; }
.w-acc dd, .w-method dd { margin: 0; font-size: 14px; line-height: 1.65; }
.w-method dd { color: rgb(var(--color-muted-foreground)); max-width: 78ch; }
.w-method dd a { color: rgb(var(--color-primary)); margin-inline-start: 4px; }

.w-quote { display: grid; gap: 26px; align-items: center; }
@media (min-width: 900px) { .w-quote { grid-template-columns: 1.1fr 0.9fr; gap: 44px; } }
.w-quote blockquote { margin: 0; font-size: clamp(21px, 3vw, 30px); line-height: 1.3; letter-spacing: -0.02em; font-weight: 600; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
