<script setup lang="ts">
/**
 * How the thing works, at the level a skeptic needs.
 *
 * The page's own claim is that everything on the site is checkable, so it names
 * primitives rather than adjectives — Ed25519, JCS, blake3, wasmtime. A reader
 * can disagree with those. Nobody can disagree with "secure and scalable".
 *
 * Several things here are deliberately marked rather than asserted, because the
 * design brief described all of them in the present tense. On-chain anchoring
 * runs against preprod but does nothing in a build without a Blockfrost key.
 * The Sentinel panel is sample data — the shape of an integrity report, not a
 * reading taken from anyone. The music plugin has no grader. Practical-trade
 * review happens on the same node as the learner. And the organisation side is
 * finished in another repository that nobody is running.
 *
 * The rule this page keeps failing and re-learning: "the API could support X"
 * is not the same claim as "X exists".
 */
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Technology — Alexandria',
  meta: [
    { name: 'description', content: 'Identity, sync, integrity, assessment plugins and the skill map — how each part of Alexandria works, named precisely enough to argue with.' },
    { property: 'og:title', content: 'Technology — Alexandria' },
    { property: 'og:description', content: 'Every claim on this site is a thing you can check. Here is how each part works.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/technology' },
    { property: 'og:image', content: 'https://alexandria.ifftu.dev/og/technology.jpg' },
    { property: 'og:image:alt', content: 'Technology — every claim on this site is a thing you can check.' },
    { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og/technology.jpg' },
    { name: 'twitter:image:alt', content: 'Technology — every claim on this site is a thing you can check.' },
    { name: 'twitter:title', content: 'Technology — Alexandria' },
    { name: 'twitter:description', content: 'Every claim on this site is a thing you can check.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/technology' }],
})

const GITHUB = 'https://github.com/ifftu-dev/alexandria'

const chips = [
  { label: 'Tauri · one codebase', state: 'alpha' as const },
  { label: 'W3C Verifiable Credentials', state: 'alpha' as const },
  { label: 'did:key · Ed25519', state: 'alpha' as const },
  { label: 'Cardano anchoring', state: 'building' as const },
  { label: 'AGPL core', state: 'alpha' as const },
]

const identity = [
  { k: 'Selective disclosure', v: 'Reveal one skill without revealing the rest of your record.' },
  { k: 'Offline verification', v: 'The signature checks with public key math alone. No call to us.' },
  { k: 'Survives us', v: 'If Alexandria disappeared tomorrow, every credential still verifies.' },
]

const sync = [
  { t: 'Everything works offline', b: 'Courses, assessments and credential issuance all run against local storage. A connection is an optimization, not a requirement.' },
  { t: 'Sync is device to device', b: 'Your laptop and your phone sync directly, end-to-end encrypted. Relays exist to pass sealed bytes along and cannot read a thing.' },
  { t: 'No profile to sell', b: 'There is no server-side record of what you study, how fast you learn or how often you fail. Not policy — architecture.' },
]

/** Illustrative. The numbers show the shape of a report, not anyone's reading. */
const signals = [
  { k: 'Typing rhythm', v: 0.96 },
  { k: 'Pointer behavior', v: 0.91 },
  { k: 'On-device models', v: 0.88 },
]

const plugins = [
  { t: 'Code', b: 'A real editor with a test harness, in JavaScript, TypeScript, Python and C++. Graded on what runs, not on what is recalled — the grader is a sandboxed WebAssembly module, so the same submission scores the same everywhere.' },
  { t: 'Music', b: 'Audio capture and live pitch detection. Play the passage and the plugin marks each note as you go. It does not yet produce a score a credential can be issued from — a person reads the result.' },
  { t: 'Practical trades', b: 'One general plugin rather than a plugin per trade: the learner submits work in any format — photo, video, audio, document — and asks a human assessor to score it against the skills claimed. Usable for welding, inspection and site work; none of those has a purpose-built plugin. The assessor reviews on the same node today, and sending a submission to one somewhere else is a later phase.' },
  { t: 'Yours', b: 'The plugin API is open. If you can define how a skill is proven, you can ship the assessment for it.' },
]

const skillRows = [
  { id: 'metallurgy.basics', level: 'analyze', dot: 13, tone: 'on' },
  { id: 'welding.safety', level: 'apply', dot: 12, tone: 'on' },
  { id: 'welding.pipe.6g', level: 'apply', dot: 14, tone: 'violet' },
  { id: 'welding.tig', level: 'available', dot: 9, tone: 'off' },
  { id: 'inspection.ndt', level: 'locked', dot: 9, tone: 'off' },
]

const people = [
  { t: 'Live tutoring, device to device', b: 'Video, audio and screen-share connect learner and mentor directly. No call runs through a company, and none is recorded by one.' },
  { t: 'Classrooms, invite-only', b: 'A teacher’s own contained space, organized into channels — announcements, questions, assignments, showcase. You decide who is in it.' },
  { t: 'Reputation without stars', b: 'Instructors are scored on measured impact on learners, per skill, with confidence bounds — wider bars mean less evidence. There is no global score anywhere.' },
]

const platforms = [
  { k: 'macOS', v: '10.15+' },
  { k: 'Windows', v: '10+' },
  { k: 'Linux', v: 'deb · rpm · AppImage' },
  { k: 'iOS', v: '16.4+' },
  { k: 'Android', v: '9+' },
]
</script>

<template>
  <div class="page-accent">
    <section class="hero hero-page">
      <MeshGradient :blobs="['79,70,229', '34,211,238', '99,102,241', '129,140,248', '79,70,229']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Technology</p>
        <h1>Every claim on this site is a thing you can check.</h1>
        <p class="hero-lede">
          Alexandria is one native codebase that turns a device into a full participant in a learning
          network — issuing credentials, assessing skills and connecting peers, with no server in the
          middle that has to be trusted. Here is how each part of that works.
        </p>
        <div class="t-chips">
          <StatusChip v-for="c in chips" :key="c.label" :state="c.state" :label="c.label" />
        </div>
      </div>
    </section>

    <!-- ═══ 01 IDENTITY ═══ -->
    <section class="section pad">
      <p class="eyebrow">01 / Identity &amp; credentials</p>
      <h2 class="h-sec">One identity, created on your device.</h2>
      <div class="t-split">
        <div>
          <div class="t-prose">
            <p>
              Launching the app generates a keypair locally. That key is your identity — there is no
              signup, no email, no password and no record of you on any server of ours. It signs
              every credential you earn and encrypts everything you keep.
            </p>
            <p>
              Each credential is a W3C Verifiable Credential signed with Ed25519 under your own DID.
              Six kinds of credential exist, and each is a separate object you can share on its own.
            </p>
            <p class="t-note">
              A hash of the evidence is also intended to be anchored on-chain, so a credential’s
              existence and timing can be proven independently of us. That part is in development —
              a credential stands on its signature without it, which is why
              <NuxtLink to="/verify" class="plausible-event-name=Nav-Verify">the verifier on this site</NuxtLink> reports the anchor check as
              skipped rather than passed.
            </p>
          </div>
          <dl class="t-facts">
            <template v-for="f in identity" :key="f.k">
              <dt>{{ f.k }}</dt><dd>{{ f.v }}</dd>
            </template>
          </dl>
        </div>

        <div class="t-code">
          <div class="t-code-bar"><span class="on">credential.json</span></div>
          <pre><code><span class="c">// issued on device, no server involved</span>
{
  <span class="k">"@context"</span>: [<span class="s">"https://www.w3.org/ns/credentials/v2"</span>],
  <span class="k">"type"</span>: [<span class="s">"VerifiableCredential"</span>, <span class="s">"SkillCredential"</span>],
  <span class="k">"issuer"</span>: <span class="s">"did:key:z6MkhaXgBZD…QYtP"</span>,
  <span class="k">"credentialSubject"</span>: {
    <span class="k">"skill"</span>: <span class="s">"welding.pipe.6g"</span>,
    <span class="k">"level"</span>: <span class="s">"apply"</span>,
    <span class="k">"evidence"</span>: <span class="s">"blake3:9f2c…e17a"</span>
  },
  <span class="k">"proof"</span>: {
    <span class="k">"type"</span>: <span class="s">"Ed25519Signature2020"</span>
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══ 02 DATA & SYNC ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">02 / Data &amp; sync</p>
      <h2 class="h-sec">Local-first, and encrypted before it ever moves.</h2>
      <div class="t-cards">
        <article v-for="s in sync" :key="s.t" class="t-card">
          <h3>{{ s.t }}</h3>
          <p>{{ s.b }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ 03 SENTINEL ═══ -->
    <section class="section pad">
      <p class="eyebrow">03 / Sentinel</p>
      <h2 class="h-sec">Integrity checks that never phone home.</h2>
      <div class="t-split">
        <div class="t-prose">
          <p>
            A credential is only worth what the assessment behind it is worth. Sentinel is an
            optional integrity layer that watches for the obvious ways an assessment gets faked — and
            runs entirely on the learner’s own hardware.
          </p>
          <p>
            It takes quiet snapshots every 15–45 seconds and scores consistency across typing rhythm,
            pointer behavior and small on-device models. Raw camera, keystroke and pointer data
            never leave the machine; what leaves is a score and the reasoning behind it, attached to
            the credential for anyone to audit.
          </p>
          <p>
            Every proctoring vendor asks you to trust a black box. This one is inspectable: the code
            is open, and the signals that produced a score travel with the score.
          </p>
        </div>

        <div class="t-panel">
          <div class="t-panel-h">
            <b>Sentinel status</b>
            <StatusChip state="sample" />
          </div>
          <div v-for="s in signals" :key="s.k" class="t-sig">
            <span class="t-sig-k">{{ s.k }}</span>
            <span class="t-track"><span class="t-fill" :style="{ width: `${s.v * 100}%` }" /></span>
            <span class="t-sig-v">{{ s.v }}</span>
          </div>
          <div class="t-panel-f">
            <p class="t-score">0.94</p>
            <p class="t-score-l">Integrity score · <b>High</b></p>
          </div>
          <p class="t-panel-n">Raw camera, typing and pointer data never leave this device.</p>
        </div>
      </div>
    </section>

    <!-- ═══ 04 PLUGINS ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">04 / Assessment plugins</p>
      <h2 class="h-sec">Multiple choice cannot measure a weld.</h2>
      <p class="p-sub">
        Different skills need different ways to teach and test. A plugin is a self-contained
        assessment engine — it defines what a candidate does, what evidence is captured and how it is
        scored — and once installed it can issue credentials like any other assessment. They run as
        sandboxed WebAssembly, so a plugin cannot reach anything the learner did not give it.
      </p>
      <div class="t-cards t-cards-4">
        <article v-for="p in plugins" :key="p.t" class="t-card">
          <h3>{{ p.t }}</h3>
          <p>{{ p.b }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ 05 SKILL MAP ═══ -->
    <section class="section pad">
      <p class="eyebrow">05 / The skill map</p>
      <h2 class="h-sec">A credential has to mean the same thing everywhere.</h2>
      <div class="t-split">
        <div class="t-prose">
          <p>
            Every lesson and every credential ties to a node on a public map of skills, with explicit
            prerequisites and Bloom levels — recall, apply, analyze, and beyond. That is what lets an
            employer read <span class="mono">welding.pipe.6g · apply</span> and know exactly what was
            demonstrated.
          </p>
          <p>
            The map is maintained by the people who hold the skills, not by us. Changes go draft →
            committee → public vote, and only people with proven expertise in that subject get a vote
            on it. Not money, not seniority.
          </p>
        </div>

        <div class="t-panel">
          <div class="t-panel-h"><b>Skill map</b><span class="t-panel-c">5 / 16 earned</span></div>
          <div v-for="r in skillRows" :key="r.id" class="t-skill">
            <span class="t-dot" :class="`t-dot-${r.tone}`" :style="{ width: `${r.dot}px`, height: `${r.dot}px` }" />
            <span class="mono t-skill-id">{{ r.id }}</span>
            <span class="t-skill-l">{{ r.level }}</span>
          </div>
          <p class="t-panel-n">Dot size shows level. Filled = Apply or above.</p>
        </div>
      </div>
    </section>

    <!-- ═══ 06 PEOPLE ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">06 / People, not servers</p>
      <h2 class="h-sec">Tutoring, classrooms and reputation.</h2>
      <div class="t-cards">
        <article v-for="p in people" :key="p.t" class="t-card">
          <h3>{{ p.t }}</h3>
          <p>{{ p.b }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ 07 PLATFORMS ═══ -->
    <section class="section pad">
      <p class="eyebrow">07 / Runs everywhere</p>
      <h2 class="h-sec">One codebase. Five platforms. Native throughout.</h2>
      <div class="t-plats">
        <div v-for="p in platforms" :key="p.k" class="t-plat">
          <b>{{ p.k }}</b><span>{{ p.v }}</span>
        </div>
      </div>
      <p class="t-panel-n t-wide">
        For live video tutoring on Android we recommend a device with 6 GB or more of RAM. Nine
        languages at launch — English, Chinese, Spanish, French, Hindi, Urdu, Telugu, Marathi and
        Bengali. Eight of the nine are machine-drafted and awaiting a native speaker; the app says
        so on the ones that are.
      </p>
    </section>

    <!-- ═══ HONEST LIMITS ═══ -->
    <section class="section pad section-wash">
      <p class="eyebrow">Honest limits</p>
      <h2 class="h-sec">What this does not do yet.</h2>
      <p class="p-sub t-limits">
        All of the above is built and shipping in the alpha, with four exceptions, each named where
        it appears above. On-chain anchoring is written and runs against the Cardano test network,
        but a build does nothing with it until someone supplies their own Blockfrost key — so treat
        it as in development. Practical-trade submissions are reviewed by an assessor on the same
        node; routing one to an assessor elsewhere is a later phase. The music plugin marks notes
        but does not yet produce a score a credential can be issued from. And the organization side
        — single sign-on, ATS delivery, bulk verification, the employer console — is finished and
        under test in a separate repository that nobody outside this project is running.
      </p>
      <p class="p-sub t-limits">
        None of it has been through an independent validity study, there is no content moderation in
        place, and no external users have stress-tested any of it. An internal security review of
        the Rust core, Tauri configuration, dependencies and frontend was carried out in February
        2026 and its remediation is unfinished; no independent audit has been commissioned. The
        <NuxtLink to="/trust">trust page</NuxtLink> carries the counts and the dates.
      </p>
      <div class="hero-cta">
        <a :href="GITHUB" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub btn">Read the source</a>
        <NuxtLink to="/verify" class="plausible-event-name=Nav-Verify btn-ghost btn-solid">Verify a credential</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.h-sec { margin-bottom: 14px; }


.t-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 26px; }

.t-split { display: grid; gap: 28px; align-items: start; }
@media (min-width: 940px) { .t-split { grid-template-columns: 1fr 1fr; gap: 44px; } }

.t-prose { display: grid; gap: 14px; max-width: 62ch; }
.t-prose p { margin: 0; font-size: 15px; line-height: 1.75; color: rgb(var(--color-muted-foreground)); }
.t-prose a { color: rgb(var(--color-primary)); }
.t-note { border-inline-start: 2px solid rgb(var(--color-border)); padding-inline-start: 14px; font-size: 14px !important; }

.t-facts { display: grid; gap: 0; margin: 22px 0 0; border-top: 1px solid rgb(var(--color-border)); }
.t-facts dt { font-size: 14px; font-weight: 700; padding-top: 13px; }
.t-facts dd { margin: 2px 0 13px; font-size: 14px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); border-bottom: 1px solid rgb(var(--color-border)); padding-bottom: 13px; }
.t-facts dd:last-child { border-bottom: 0; }

.t-code { border: 1px solid rgb(var(--color-border)); border-radius: 14px; overflow: hidden; background: rgb(var(--color-muted)); }
.t-code-bar { padding: 10px 14px; border-bottom: 1px solid rgb(var(--color-border)); font-family: var(--font-mono); font-size: 11.5px; }
.t-code-bar .on { color: rgb(var(--color-primary)); }
.t-code pre { margin: 0; padding: 16px; overflow-x: auto; }
.t-code code { font-family: var(--font-mono); font-size: 12.5px; line-height: 1.75; color: rgb(var(--color-foreground)); }
.t-code .c { color: rgb(var(--color-muted-foreground)); }
.t-code .k { color: rgb(var(--color-primary)); }
.t-code .s { color: rgb(var(--color-institution)); }

.t-cards { display: grid; gap: 16px; }
@media (min-width: 820px) { .t-cards { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 820px) { .t-cards-4 { grid-template-columns: repeat(4, 1fr); } }
.t-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.t-card h3 { margin: 0 0 8px; font-size: 15.5px; letter-spacing: -0.01em; }
.t-card p { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }

.t-panel { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.t-panel-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; font-size: 14px; }
.t-panel-c { font-family: var(--font-mono); font-size: 11.5px; color: rgb(var(--color-muted-foreground)); }
.t-sig { display: grid; grid-template-columns: 1fr auto; gap: 4px 12px; align-items: center; margin-bottom: 12px; }
.t-sig-k { font-size: 13px; color: rgb(var(--color-muted-foreground)); }
.t-sig-v { font-family: var(--font-mono); font-size: 12.5px; }
.t-track { grid-column: 1 / -1; height: 4px; border-radius: 99px; background: rgb(var(--color-border)); overflow: hidden; }
.t-fill { display: block; height: 100%; background: rgb(var(--color-primary)); }
.t-panel-f { display: flex; align-items: baseline; gap: 12px; margin-top: 18px; padding-top: 16px; border-top: 1px solid rgb(var(--color-border)); }
.t-score { margin: 0; font-family: var(--font-display); font-size: 40px; font-weight: 300; line-height: 1; }
.t-score-l { margin: 0; font-size: 13px; color: rgb(var(--color-muted-foreground)); }
.t-score-l b { color: rgb(var(--color-foreground)); }
.t-panel-n { margin: 14px 0 0; font-family: var(--font-mono); font-size: 11px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); }
.t-wide { max-width: 76ch; }

.t-skill { display: flex; align-items: center; gap: 11px; padding: 9px 0; border-bottom: 1px solid rgb(var(--color-border)); }
.t-skill:last-of-type { border-bottom: 0; }
.t-dot { border-radius: 50%; flex: none; }
.t-dot-on { background: rgb(var(--color-primary)); }
.t-dot-violet { background: rgb(var(--color-primary)); box-shadow: 0 0 0 3px rgb(var(--color-primary) / 0.2); }
.t-dot-off { border: 1px solid rgb(var(--color-muted-foreground)); }
.t-skill-id { flex: 1; min-width: 0; font-size: 12.5px; overflow-wrap: anywhere; }
.t-skill-l { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.06em; color: rgb(var(--color-muted-foreground)); }

.t-plats { display: grid; gap: 12px; grid-template-columns: repeat(2, 1fr); }
@media (min-width: 860px) { .t-plats { grid-template-columns: repeat(5, 1fr); } }
.t-plat { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 16px; background: rgb(var(--color-card)); display: grid; gap: 4px; }
.t-plat b { font-size: 15px; }
.t-plat span { font-family: var(--font-mono); font-size: 11.5px; color: rgb(var(--color-muted-foreground)); }

.t-limits { max-width: 74ch; margin-bottom: 22px; }
.mono { font-family: var(--font-mono); font-size: 0.92em; }
</style>
