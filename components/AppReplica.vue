<script setup lang="ts">
/**
 * Interactive replica of the Alexandria desktop shell.
 *
 * Mirrors the real app: 3rem topbar with the alpha badge and ⌘K search,
 * a 15rem sidebar (Home / Opinions / Community / Skills & Credentials /
 * Goals plus the Live tutoring and Classrooms sections), and the four-tab
 * mobile bar that replaces the sidebar on narrow screens — see
 * AppSidebar.vue, AppTopBar.vue and MobileTabBar.vue in the app repo.
 *
 * Sizing is driven by a container query on the window itself rather than
 * the viewport, so the replica lays out correctly wherever it is embedded.
 */
type Screen = 'home' | 'opinions' | 'community' | 'skills' | 'goals' | 'tutoring' | 'classroom'

const screen = ref<Screen>('home')
const history = ref<Screen[]>(['home'])
const cursor = ref(0)
const collapsed = ref(false)
const openSections = reactive({ tutoring: true, classrooms: true })

const omniOpen = ref(false)
const omniQuery = ref('')
const omniInput = ref<HTMLInputElement | null>(null)

/**
 * The person the replica is signed in as. It cycles so no single region reads as
 * the default learner — the app is meant for anyone, and one hard-coded name says
 * otherwise. Priya is first because the prerendered HTML ships that frame, and the
 * cycling only starts once the client has hydrated.
 *
 * Ramlal, Lakshmi, Muthu, Sunita, Gopal and Kamla are here deliberately: village
 * names, not the metropolitan Indian names a marketing site defaults to. The
 * learner this app is built for is likelier to be in a district town than a
 * tier-one city, and the shell should say so. Haripada and Anima are Bengali,
 * Jagabandhu and Basanti Odia — two states whose names a pan-Indian list of the
 * usual sort leaves out entirely.
 *
 * The order alternates Indian and non-Indian throughout, so a rotation that is
 * half one country still reads as the world.
 */
const NAMES = [
  'Priya', 'Wei', 'Haripada', 'María', 'Ramlal', 'Mohammed',
  'Lakshmi', 'Yuki', 'Basanti', 'Amara', 'Muthu', 'Sofia',
  'Anima', 'Ivan', 'Sunita', 'Linh', 'Jagabandhu', 'Fatima',
  'Gopal', 'Thabo', 'Kamla', 'Lucas',
] as const

const nameIndex = ref(0)
const learner = computed(() => NAMES[nameIndex.value]!)
const initial = computed(() => learner.value.slice(0, 1).toUpperCase())

const verified = reactive<Record<string, 'idle' | 'checking' | 'done'>>({})
const vote = ref<'for' | 'against' | 'abstain' | null>(null)
const toast = ref('')
const progress = ref(12)
const root = ref<HTMLElement | null>(null)

let toastTimer: ReturnType<typeof setTimeout> | null = null
function say(message: string) {
  toast.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 1900)
}

/**
 * Sidebar order, and the only place it is defined. Goals sits third rather than
 * being appended after the loop, so the sequence here is the sequence rendered;
 * its icon is concentric rings rather than a path, hence the `rings` flag.
 */
const NAV: { key: string, label: string, d?: string, rings?: true }[] = [
  { key: 'home', label: 'Home', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'opinions', label: 'Opinions', d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
  { key: 'goals', label: 'Goals', rings: true },
  { key: 'skills', label: 'Skills & Credentials', d: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { key: 'community', label: 'Community', d: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
]

const TABS = [
  { key: 'home', label: 'Home', d: NAV[0]!.d! },
  { key: 'tutoring', label: 'Tutoring', d: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { key: 'classroom', label: 'Classrooms', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'skills', label: 'Skills', d: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z' },
] as const

const CREDENTIALS = [
  { id: 'c1', title: 'Root pass, 6G pipe', kind: 'Assessment', meta: 'did:key:z6Mkha…QYtP · ed25519', glyph: '✦' },
  { id: 'c2', title: 'Weld symbol reading', kind: 'Course', meta: 'blake3:9f2c…e17a · anchored', glyph: '◈' },
  { id: 'c3', title: 'Peer review · 14 submissions', kind: 'Contribution', meta: 'cardano:tx/8a41…c92f', glyph: '◎' },
  { id: 'c4', title: 'Metallurgy basics', kind: 'Course', meta: 'did:key:z6Mkha…QYtP · ed25519', glyph: '◇' },
]

const OMNI = [
  { group: 'Courses', title: 'Pipe welding fundamentals', kind: 'course', to: 'home' },
  { group: 'Courses', title: 'Reading weld symbols', kind: 'course', to: 'home' },
  { group: 'Courses', title: 'Guitar: fretboard theory', kind: 'plugin', to: 'home' },
  { group: 'Skills', title: 'welding.pipe.6g', kind: 'skill', to: 'skills' },
  { group: 'Skills', title: 'metallurgy.basics', kind: 'skill', to: 'skills' },
  { group: 'Credentials', title: 'Root pass, 6G pipe', kind: 'signed', to: 'skills' },
  { group: 'People', title: 'Ravi Kulkarni', kind: 'tutor', to: 'tutoring' },
  { group: 'Classrooms', title: 'Welding · Batch 12', kind: '24', to: 'classroom' },
  { group: 'Opinions', title: 'TIG-first curricula…', kind: 'debate', to: 'opinions' },
  { group: 'Governance', title: '6G prerequisite proposal', kind: 'vote', to: 'community' },
] as const

const omniResults = computed(() => {
  const q = omniQuery.value.trim().toLowerCase()
  const hits = q
    ? OMNI.filter(i => i.title.toLowerCase().includes(q) || i.group.toLowerCase().includes(q))
    : [...OMNI]
  const grouped: { group: string, items: typeof hits }[] = []
  for (const item of hits) {
    const last = grouped[grouped.length - 1]
    if (last && last.group === item.group) last.items.push(item)
    else grouped.push({ group: item.group, items: [item] })
  }
  return grouped
})

function show(next: Screen) {
  screen.value = next
  if (next === 'home') {
    progress.value = 12
    setTimeout(() => { progress.value = 58 }, 60)
  }
}

function go(next: Screen) {
  if (history.value[cursor.value] === next) { show(next); return }
  history.value = history.value.slice(0, cursor.value + 1)
  history.value.push(next)
  cursor.value = history.value.length - 1
  show(next)
}

function back() {
  if (cursor.value === 0) return
  cursor.value -= 1
  show(history.value[cursor.value]!)
}

function forward() {
  if (cursor.value >= history.value.length - 1) return
  cursor.value += 1
  show(history.value[cursor.value]!)
}

function openOmni() {
  omniOpen.value = true
  omniQuery.value = ''
  nextTick(() => omniInput.value?.focus())
}

function pickOmni(to: string) {
  go(to as Screen)
  omniOpen.value = false
}

function omniEnter() {
  const first = omniResults.value[0]?.items[0]
  if (first) pickOmni(first.to)
}

function verify(id: string) {
  if (verified[id] === 'done') return
  verified[id] = 'checking'
  const reduce = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  setTimeout(() => {
    verified[id] = 'done'
    say('Verified with 0 network calls')
  }, reduce ? 0 : 620)
}

function castVote(choice: 'for' | 'against' | 'abstain') {
  vote.value = choice
}

/**
 * "/" or ⌘K opens search, matching the app's own shortcut — but only while the
 * pointer or focus is actually inside this window. The site has its own `/`
 * palette now, and a decorative replica should not take a global key away from
 * it just for being on screen.
 */
function onKeydown(e: KeyboardEvent) {
  const el = document.activeElement
  const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
  const isK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
  if (!isK && (typing || e.key !== '/')) return
  const node = root.value
  if (!node) return
  const engaged = node.matches(':hover') || node.contains(el)
  if (!engaged) return
  e.preventDefault()
  openOmni()
}

/**
 * Advance the name roughly once a second. The hero is often on screen for only a
 * few seconds, and a name that turns over slowly reads as a hard-coded one to
 * anybody who does not stay — the whole point is that it visibly is not.
 *
 * Reduced motion keeps the rotation and drops the animation: the name still
 * turns over, it just cuts rather than slides. It pauses in a background tab,
 * where the repaint buys nothing anyone can see.
 */
let nameTimer: ReturnType<typeof setInterval> | null = null

function stopNames() {
  if (nameTimer) { clearInterval(nameTimer); nameTimer = null }
}

function startNames() {
  if (nameTimer || document.hidden) return
  nameTimer = setInterval(() => {
    nameIndex.value = (nameIndex.value + 1) % NAMES.length
  }, 1100)
}

function onVisibility() {
  if (document.hidden) stopNames()
  else startNames()
}

onMounted(() => {
  show('home')
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('visibilitychange', onVisibility)
  startNames()
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('visibilitychange', onVisibility)
  stopNames()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <div ref="root" class="app-replica" :class="{ collapsed }">
    <!-- topbar -->
    <div class="tb">
      <div class="tb-lights"><i style="background:#FF5F57" /><i style="background:#FEBC2E" /><i style="background:#28C840" /></div>
      <button class="tb-ico" type="button" aria-label="Toggle sidebar" @click="collapsed = !collapsed">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
      </button>
      <button class="tb-ico" type="button" aria-label="Back" :disabled="cursor === 0" @click="back">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
      </button>
      <button class="tb-ico" type="button" aria-label="Forward" :disabled="cursor >= history.length - 1" @click="forward">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
      </button>
      <span class="tb-alpha">Alpha</span>

      <div class="tb-searchwrap">
        <button class="tb-search" type="button" @click="openOmni">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
          <span>Search courses, skills, people…</span>
          <kbd>⌘K</kbd>
        </button>
      </div>

      <div class="tb-right">
        <span class="tb-net"><i />Connected</span>
        <button class="tb-av" type="button" :title="`${learner} · local profile`" @click="say('Local profile — nothing stored on a server')">
          <Transition name="nm" mode="out-in"><span :key="initial">{{ initial }}</span></Transition>
        </button>
      </div>
    </div>

    <div class="app-body">
      <!-- sidebar -->
      <aside class="sb">
        <nav class="sb-nav">
          <button
            v-for="item in NAV"
            :key="item.key"
            type="button"
            class="sb-item"
            :class="{ on: screen === item.key }"
            @click="go(item.key as Screen)"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <template v-if="item.rings">
                <circle cx="12" cy="12" r="8.25" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" />
              </template>
              <path v-else stroke-linecap="round" stroke-linejoin="round" :d="item.d" />
            </svg>
            <span class="sb-label">{{ item.label }}</span>
          </button>

          <div class="sb-sep" />

          <div class="sb-sec" :class="{ closed: !openSections.tutoring }">
            <button type="button" @click="openSections.tutoring = !openSections.tutoring">Live tutoring</button>
            <svg class="cv" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div v-show="openSections.tutoring" class="sb-rows">
            <button type="button" class="sb-row" @click="go('tutoring')">
              <span class="in">RK</span><span class="tt">Ravi K · System design</span><span class="sb-live" />
            </button>
            <button type="button" class="sb-row" @click="go('tutoring')">
              <span class="in">AM</span><span class="tt">Aisha M · 6G root pass</span>
            </button>
          </div>

          <div class="sb-sec" :class="{ closed: !openSections.classrooms }">
            <button type="button" @click="openSections.classrooms = !openSections.classrooms">Classrooms</button>
            <svg class="cv" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div v-show="openSections.classrooms" class="sb-rows">
            <button type="button" class="sb-row" @click="go('classroom')">
              <span class="in">SD</span><span class="tt">System Design · Cohort 4</span><span class="mt">24</span>
            </button>
            <button type="button" class="sb-row" @click="go('classroom')">
              <span class="in">W</span><span class="tt">Welding · Batch 12</span><span class="mt">24</span>
            </button>
          </div>
        </nav>

        <!-- Skill graph widget, pinned to the foot of the sidebar as in the app -->
        <div v-show="!collapsed" class="sb-graph">
          <SkillGraph :height="150" :node-scale="0.5" />
        </div>
      </aside>

      <!-- main -->
      <main class="main">
        <!-- HOME -->
        <section v-if="screen === 'home'" class="scr">
          <p class="greet">Good evening, <Transition name="nm" mode="out-in"><span :key="learner" class="greet-name">{{ learner }}</span></Transition></p>
          <p class="greet-sub">3 peers nearby are sharing courses you follow</p>

          <button type="button" class="card resume" @click="say('Opens the lesson player — full-bleed, works offline')">
            <span class="play">▶</span>
            <span class="resume-body">
              <span class="kicker">Resume</span>
              <span class="ttl">Root pass, 6G pipe</span>
              <span class="meta">Structural welding · module 7 of 12 · assessed on device</span>
              <span class="prog"><i :style="{ width: `${progress}%` }" /></span>
            </span>
          </button>

          <div class="sec-h"><b>Your goal</b><button type="button" @click="go('goals')">All goals</button></div>
          <div class="card goal">
            <span class="ring" style="--p:58"><span>58%</span></span>
            <span>
              <span class="goal-t">Become an Engineering Manager</span>
              <span class="goal-m">4 of 7 skills at Apply · 2 mentoring attestations to go</span>
            </span>
          </div>

          <div class="sec-h"><b>Skill map</b><button type="button" @click="go('skills')">Open graph</button></div>
          <div class="card">
            <div class="graph">
              <button type="button" class="node lv3" @click="say('metallurgy.basics — open in the skill graph')">metallurgy.basics</button>
              <button type="button" class="node lv3" @click="say('welding.safety — open in the skill graph')">welding.safety</button>
              <button type="button" class="node lv2" @click="say('welding.pipe.6g — open in the skill graph')">welding.pipe.6g</button>
              <button type="button" class="node" @click="say('welding.tig — open in the skill graph')">welding.tig</button>
              <button type="button" class="node" @click="say('inspection.ndt — open in the skill graph')">inspection.ndt</button>
            </div>
            <p class="hint">Bloom levels · filled = Apply or above</p>
          </div>

          <div class="sec-h"><b>Continue learning</b><button type="button" @click="go('skills')">See all</button></div>
          <div class="grid3">
            <div class="ccard"><div class="thumb" /><div class="cb"><div class="ct">Pipe welding fundamentals</div><div class="cm">7/12 · offline</div></div></div>
            <div class="ccard"><div class="thumb" /><div class="cb"><div class="ct">Reading weld symbols</div><div class="cm">3/8 · offline</div></div></div>
            <div class="ccard"><div class="thumb" /><div class="cb"><div class="ct">Guitar: fretboard theory</div><div class="cm">1/10 · plugin</div></div></div>
          </div>

          <div class="sec-h"><b>Recommended for you</b><button type="button" @click="go('skills')">Browse</button></div>
          <div class="grid3">
            <div class="ccard"><div class="thumb" /><div class="cb"><div class="ct">NDT basics: visual inspection</div><div class="cm">Free · 9 lessons</div></div></div>
            <div class="ccard"><div class="thumb" /><div class="cb"><div class="ct">Metallurgy for welders</div><div class="cm">Free · 14 lessons</div></div></div>
            <div class="ccard"><div class="thumb" /><div class="cb"><div class="ct">Rigging &amp; site safety</div><div class="cm">Free · 6 lessons</div></div></div>
          </div>
        </section>

        <!-- OPINIONS -->
        <section v-else-if="screen === 'opinions'" class="scr">
          <p class="greet">Opinions</p>
          <p class="greet-sub">Credentialed takes from practitioners who hold the skill</p>
          <div class="op">
            <div class="op-h"><span class="av">RK</span><span class="nm">Ravi Kulkarni</span><span class="cr">Welding · Create</span></div>
            <p>TIG-first curricula waste beginners' time. Start on stick — the feedback loop teaches puddle control faster, and the transfer to TIG is close to free.</p>
            <div class="op-bar"><i style="width:64%;background:rgb(var(--app-primary))" /><i style="width:36%;background:rgb(var(--app-muted))" /></div>
            <div class="op-meta"><span>64% of credentialed welders agree</span><span>142 weighted votes</span></div>
          </div>
          <div class="op">
            <div class="op-h"><span class="av">AM</span><span class="nm">Aisha Mensah</span><span class="cr">Music · Evaluate</span></div>
            <p>Ear training before notation. Notation is a compression format for something you should already be able to hear.</p>
            <div class="op-bar"><i style="width:41%;background:rgb(var(--app-primary))" /><i style="width:59%;background:rgb(var(--app-muted))" /></div>
            <div class="op-meta"><span>41% agree — genuinely contested</span><span>88 weighted votes</span></div>
          </div>
          <p class="hint">Weight comes from credentials in that skill, not follower counts.</p>
        </section>

        <!-- COMMUNITY -->
        <section v-else-if="screen === 'community'" class="scr">
          <p class="greet">Community</p>
          <p class="greet-sub">Welding · governance</p>
          <div class="card">
            <div class="gov-t">Add 6G position to the pipe-welding prerequisite chain</div>
            <div class="gov-stage">
              <span class="on">Draft</span><span class="on">Committee</span><span class="on">Public vote</span><span>Anchored</span>
            </div>
            <p class="hint">Voting closes in 3 days. Your vote is weighted by your credentials in <b>welding.*</b>.</p>
            <div class="gov-vote">
              <button type="button" :class="{ cast: vote === 'for' }" @click="castVote('for')">Vote for</button>
              <button type="button" :class="{ cast: vote === 'against' }" @click="castVote('against')">Vote against</button>
              <button type="button" :class="{ cast: vote === 'abstain' }" @click="castVote('abstain')">Abstain</button>
            </div>
            <p class="hint">
              {{ vote
                ? 'Vote recorded and weighted by your welding credentials. The result anchors on-chain when voting closes.'
                : 'You are eligible: 4 credentials at Apply or above in this subject.' }}
            </p>
          </div>
          <div class="sec-h"><b>Recently anchored</b></div>
          <div class="card hint">Renamed <b>welding.mig</b> → <b>welding.gmaw</b> · anchored on-chain 12 days ago · 89% for</div>
        </section>

        <!-- SKILLS -->
        <section v-else-if="screen === 'skills'" class="scr">
          <p class="greet">Skills &amp; Credentials</p>
          <p class="greet-sub">Signed under your identity — verify any of them offline</p>
          <div v-for="c in CREDENTIALS" :key="c.id" class="cred">
            <span class="seal">{{ c.glyph }}</span>
            <span class="cred-body">
              <span class="t">{{ c.title }} <span class="kind">{{ c.kind }}</span></span>
              <span class="m">{{ c.meta }}</span>
            </span>
            <button
              type="button"
              class="vf"
              :class="{ ok: verified[c.id] === 'done' }"
              @click="verify(c.id)"
            >
              {{ verified[c.id] === 'done' ? '✓ Genuine · 18 ms' : verified[c.id] === 'checking' ? 'Checking…' : 'Verify' }}
            </button>
          </div>
          <p class="hint">Six kinds of credential. Share only what you choose — the level alone, or the full record behind it.</p>
        </section>

        <!-- GOALS -->
        <section v-else-if="screen === 'goals'" class="scr">
          <p class="greet">Goals</p>
          <p class="greet-sub">Tracked against the public skill map, not a streak counter</p>
          <div class="card goal">
            <span class="ring" style="--p:58"><span>58%</span></span>
            <span><span class="goal-t">Become an Engineering Manager</span><span class="goal-m">System design at Apply · 2 mentoring attestations short of Analyze</span></span>
          </div>
          <div class="card goal">
            <span class="ring" style="--p:41"><span>41%</span></span>
            <span><span class="goal-t">$100,000 job</span><span class="goal-m">9 skills verifiable · recruiters can check them without asking us</span></span>
          </div>
          <div class="card goal">
            <span class="ring" style="--p:23"><span>23%</span></span>
            <span><span class="goal-t">UPSC 2027</span><span class="goal-m">Polity at Apply, Modern History at Remember · mock 12 of 40</span></span>
          </div>
        </section>

        <!-- TUTORING -->
        <section v-else-if="screen === 'tutoring'" class="scr">
          <p class="greet">Live tutoring</p>
          <p class="greet-sub">Video, audio and screen-share go straight between the two devices</p>

          <div class="card stage">
            <div class="tiles">
              <div class="tile">
                <span class="tile-av">RK</span>
                <span class="tile-name">Ravi K <i>mentor</i></span>
                <span class="tile-share">sharing screen</span>
              </div>
              <div class="tile self">
                <span class="tile-av">P</span>
                <span class="tile-name">You</span>
                <span class="tile-muted" aria-hidden="true">mic off</span>
              </div>
            </div>
            <div class="ctl">
              <button type="button" class="ctl-b on" @click="say('Mic stays on your device — the stream is peer to peer')">Mic</button>
              <button type="button" class="ctl-b on" @click="say('Camera on · encrypted, direct connection')">Camera</button>
              <button type="button" class="ctl-b" @click="say('Share a window or the whole screen')">Share</button>
              <button type="button" class="ctl-b leave" @click="say('Leaves the session — nothing is recorded anywhere')">Leave</button>
            </div>
            <p class="hint stage-meta">
              <span class="dot-live" aria-hidden="true" /> 24:11 · direct connection · encrypted · 38 ms
            </p>
          </div>

          <div class="sec-h"><b>This session</b><button type="button" @click="go('skills')">Open skill</button></div>
          <div class="card agenda">
            <span class="ag-row"><b>Reviewing</b>systems.design.tradeoffs · at Apply, aiming for Analyze</span>
            <span class="ag-row"><b>Evidence</b>Ravi can attest the skill afterwards — you keep the credential</span>
            <span class="ag-row"><b>Notes</b>Stay yours, on this device</span>
          </div>

          <div class="sec-h"><b>Upcoming</b><button type="button" @click="say('Mentors are ranked per skill by whether their learners actually progressed')">Find a mentor</button></div>
          <button type="button" class="card slot" @click="say('Thursday 18:00 · joins directly, no lobby')">
            <span class="live-av sm">AM</span>
            <span><span class="goal-t">Aisha M · 6G root pass review</span><span class="goal-m">Thursday 18:00 local · 45 min · screen-share from the booth camera</span></span>
            <span class="slot-when">Thu</span>
          </button>
          <button type="button" class="card slot" @click="say('Sunday 09:30 · mock interview, one to one')">
            <span class="live-av sm">DS</span>
            <span><span class="goal-t">Dev S · Mock system design interview</span><span class="goal-m">Sunday 09:30 local · 60 min · counts toward the EM goal</span></span>
            <span class="slot-when">Sun</span>
          </button>
        </section>

        <!-- CLASSROOM -->
        <section v-else class="scr">
          <p class="greet">System Design · Cohort 4</p>
          <p class="greet-sub">Invite-only · 24 members · you decide who's in</p>

          <div class="card chan">
            <span class="chan-row on"><b>#</b>announcements<i class="chan-n">2</i></span>
            <span class="chan-row"><b>#</b>questions<i class="chan-n">7</i></span>
            <span class="chan-row"><b>#</b>assignments</span>
            <span class="chan-row"><b>#</b>showcase</span>
          </div>

          <div class="sec-h"><b>#announcements</b><button type="button" @click="say('Members are invited by the instructor — nothing here is public')">Members</button></div>
          <div class="card thread">
            <div class="msg">
              <span class="msg-av ins">MR</span>
              <span class="msg-b">
                <span class="msg-h">Meera R <i>instructor</i><em>09:12</em></span>
                <span class="msg-t">Design review Friday. Bring a diagram — we assess the tradeoffs you argue for, not the diagram itself.</span>
              </span>
            </div>
            <div class="msg">
              <span class="msg-av">DS</span>
              <span class="msg-b">
                <span class="msg-h">Dev S<em>09:31</em></span>
                <span class="msg-t">Is the assessment offline? I'm on patchy wifi this week.</span>
              </span>
            </div>
            <div class="msg">
              <span class="msg-av ins">MR</span>
              <span class="msg-b">
                <span class="msg-h">Meera R <i>instructor</i><em>09:34</em></span>
                <span class="msg-t">Entirely. It runs on your machine and syncs the result when you reconnect.</span>
              </span>
            </div>
          </div>
          <div class="composer">
            <span class="composer-in">Message #announcements</span>
            <button type="button" class="composer-b" @click="say('Messages pass between members\' devices, not through a server')">Send</button>
          </div>

          <div class="sec-h"><b>Open assignment</b><button type="button" @click="go('skills')">Rubric</button></div>
          <button type="button" class="card asg" @click="say('Submissions are graded on device; the credential is signed under your own key')">
            <span class="asg-l">
              <span class="goal-t">Design a read-heavy feed at 10M users</span>
              <span class="goal-m">Due Friday 23:00 local · assessed on device · earns systems.design.tradeoffs</span>
            </span>
            <span class="asg-r"><b>18</b><i>of 24 in</i></span>
          </button>
        </section>
      </main>
    </div>

    <!-- mobile tab bar -->
    <nav class="mtab">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        type="button"
        :class="{ on: screen === tab.key }"
        @click="go(tab.key as Screen)"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" :d="tab.d" /></svg>
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <!-- omni search -->
    <div v-if="omniOpen" class="omni" @click.self="omniOpen = false">
      <div class="omni-box">
        <div class="omni-in">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
          <input
            ref="omniInput"
            v-model="omniQuery"
            type="text"
            placeholder="Search courses, skills, people…"
            aria-label="Search"
            @keydown.esc="omniOpen = false"
            @keydown.enter="omniEnter"
          >
          <kbd>esc</kbd>
        </div>
        <div class="omni-list">
          <template v-if="omniResults.length">
            <template v-for="group in omniResults" :key="group.group">
              <div class="g">{{ group.group }}</div>
              <button v-for="item in group.items" :key="item.title" type="button" @click="pickOmni(item.to)">
                <span class="t">{{ item.title }}</span><span class="k">{{ item.kind }}</span>
              </button>
            </template>
          </template>
          <div v-else class="omni-empty">No matches — everything is searched locally.</div>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<style scoped>
/* Palette tokens live in assets/css/main.css — they must not be scoped,
   because the dark set is keyed on `.dark` on <html>. */
.app-replica {
  background: rgb(var(--app-background));
  color: rgb(var(--app-foreground));
  border: 1px solid rgb(var(--app-border));
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  position: relative;
  height: clamp(520px, 74vh, 760px);
  container-type: inline-size;
  transition: background 250ms ease, color 250ms ease, border-color 250ms ease;
}

@media (max-width: 700px) { .app-replica { height: clamp(440px, 66vh, 560px); } }

button { font-family: inherit; }

/* topbar */
.tb {
  display: flex; align-items: center; height: 3rem; padding: 0 0.75rem; gap: 0.5rem;
  border-bottom: 1px solid rgb(var(--app-border)); background: rgb(var(--app-background)); flex-shrink: 0;
}
.tb-lights { display: flex; gap: 6px; margin-right: 0.35rem; }
.tb-lights i { width: 11px; height: 11px; border-radius: 50%; display: block; }
.tb-ico {
  display: flex; align-items: center; justify-content: center; width: 2.25rem; height: 2rem;
  border-radius: 0.5rem; color: rgb(var(--app-muted-foreground)); background: transparent; border: none;
  cursor: pointer; transition: background 150ms, color 150ms;
}
.tb-ico:hover { background: rgb(var(--app-muted)); color: rgb(var(--app-foreground)); }
.tb-ico:disabled { opacity: 0.35; cursor: default; }
.tb-ico svg { width: 1.05rem; height: 1.05rem; }
.tb-alpha {
  margin-inline-start: 0.5rem; padding: 0.0625rem 0.4375rem; font-size: 0.6875rem; letter-spacing: 0.02em;
  text-transform: uppercase; font-weight: 600; border-radius: 0.3rem;
  background: rgb(var(--app-warning) / 0.16); color: rgb(var(--app-warning));
}
.tb-searchwrap { flex: 1 1 0%; display: flex; justify-content: center; min-width: 0; padding: 0 0.25rem; }
.tb-search {
  position: relative; display: flex; align-items: center; width: 100%; max-width: 32rem; cursor: text; gap: 0.5rem;
  background: rgb(var(--app-muted) / 0.35); border: 1px solid transparent; border-radius: 0.5rem;
  padding: 0.375rem 0.625rem; text-align: start; transition: background 200ms;
}
.tb-search:hover { background: rgb(var(--app-muted) / 0.6); }
.tb-search svg { width: 0.875rem; height: 0.875rem; color: rgb(var(--app-muted-foreground) / 0.6); flex: none; }
.tb-search span { font-size: 0.8125rem; color: rgb(var(--app-muted-foreground) / 0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tb-search kbd {
  margin-inline-start: auto; font-family: var(--font-mono); font-size: 0.625rem; padding: 0.05rem 0.3rem;
  border: 1px solid rgb(var(--app-border)); border-radius: 0.25rem; color: rgb(var(--app-muted-foreground));
}
.tb-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.tb-net {
  display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.6875rem; font-weight: 600;
  color: rgb(var(--app-muted-foreground)); white-space: nowrap;
}
.tb-net i { width: 0.4rem; height: 0.4rem; border-radius: 50%; background: rgb(var(--app-success)); display: block; animation: pulse 2.6s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.tb-av {
  width: 1.6rem; height: 1.6rem; border-radius: 50%; background: rgb(var(--app-primary));
  color: rgb(var(--app-primary-foreground)); font-size: 0.65rem; font-weight: 700;
  display: grid; place-items: center; border: none; cursor: pointer;
}

/* sidebar */
.app-body { display: flex; flex: 1; overflow: hidden; }
.sb {
  width: 15rem; flex: none; border-inline-end: 1px solid rgb(var(--app-border));
  background: rgb(var(--app-background)); display: flex; flex-direction: column; overflow: hidden;
  transition: width 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.app-replica.collapsed .sb { width: 4rem; }
.sb-nav { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; gap: 0.125rem; }
.sb-graph {
  flex: none;
  padding: 0.5rem 0.75rem 0.75rem;
  border-top: 1px solid rgb(var(--app-border));
}
.sb-item {
  display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.5rem 0.75rem; border: none;
  border-radius: 0.625rem; background: transparent; color: rgb(var(--app-muted-foreground));
  font-size: 0.875rem; font-weight: 500; line-height: 1; cursor: pointer; text-align: start;
  transition: background 150ms, color 150ms;
}
.sb-item:hover { background: rgb(var(--app-muted)); color: rgb(var(--app-foreground)); }
.sb-item.on { background: rgb(var(--app-muted) / 0.8); color: rgb(var(--app-foreground)); font-weight: 600; }
.sb-item svg { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
.sb-label { white-space: nowrap; transition: opacity 300ms, width 300ms; }
.app-replica.collapsed .sb-label,
.app-replica.collapsed .sb-sec,
.app-replica.collapsed .sb-rows { opacity: 0; width: 0; height: 0; overflow: hidden; }
.sb-sep { height: 1px; margin: 0.5rem 0.25rem; background: rgb(var(--app-border)); opacity: 0.5; }
.sb-sec { display: flex; align-items: center; padding: 0.375rem 0.75rem 0.25rem; gap: 0.35rem; }
.sb-sec button {
  flex: 1; font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
  color: rgb(var(--app-muted-foreground)); opacity: 0.7; background: none; border: none; cursor: pointer; text-align: start;
}
.sb-sec .cv { width: 0.85rem; height: 0.85rem; color: rgb(var(--app-muted-foreground)); opacity: 0.6; transition: transform 200ms; }
.sb-sec.closed .cv { transform: rotate(-90deg); }
.sb-rows { padding: 0 0.25rem; display: flex; flex-direction: column; gap: 0.1rem; }
.sb-row {
  display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.5rem; border-radius: 0.5rem;
  cursor: pointer; border: none; background: none; width: 100%; text-align: start;
}
.sb-row:hover { background: rgb(var(--app-muted)); }
.sb-row .in {
  width: 1.35rem; height: 1.35rem; border-radius: 0.35rem; display: grid; place-items: center; flex: none;
  font-size: 0.6rem; font-weight: 700; background: rgb(var(--app-primary) / 0.14); color: rgb(var(--app-primary));
}
.sb-row .tt { font-size: 0.75rem; color: rgb(var(--app-foreground)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-row .mt { font-size: 0.625rem; color: rgb(var(--app-muted-foreground)); }
.sb-live {
  width: 0.375rem; height: 0.375rem; border-radius: 50%; background: #22c55e;
  margin-inline-start: auto; flex: none; animation: pulse 2.2s ease-in-out infinite;
}

/* main */
.main { flex: 1; overflow-y: auto; padding: 1.35rem 1.5rem 1.75rem; }
.scr { animation: screen-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes screen-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.greet { font-size: 1.375rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 0.2rem; }
/* The name swaps in place: inline-block so the transform applies, and opacity and
   transform only, so the swap composites rather than reflowing the line. */
.greet-name { display: inline-block; }
.nm-enter-active, .nm-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.nm-enter-from { opacity: 0; transform: translateY(0.3em); }
.nm-leave-to { opacity: 0; transform: translateY(-0.3em); }
@media (prefers-reduced-motion: reduce) {
  .nm-enter-active, .nm-leave-active { transition: none; }
  .nm-enter-from, .nm-leave-to { transform: none; }
}
.greet-sub { font-size: 0.8125rem; color: rgb(var(--app-muted-foreground)); margin: 0 0 1.1rem; }
.hint { font-size: 0.6875rem; color: rgb(var(--app-muted-foreground)); margin: 0.55rem 0 0; }

.card {
  background: rgb(var(--app-card)); border: 1px solid rgb(var(--app-border)); border-radius: 0.75rem;
  padding: 0.9rem 1rem; margin-bottom: 0.55rem; display: block; width: 100%; text-align: start;
}
.resume { display: flex; align-items: center; gap: 0.9rem; cursor: pointer; transition: border-color 150ms, box-shadow 150ms; }
.resume:hover { border-color: rgb(var(--app-primary) / 0.45); box-shadow: 0 6px 18px -8px rgb(var(--app-primary) / 0.55); }
.resume-body { flex: 1; min-width: 0; display: block; }
.play {
  width: 2.6rem; height: 2.6rem; border-radius: 0.6rem; flex: none; display: grid; place-items: center;
  background: rgb(var(--app-primary)); color: rgb(var(--app-primary-foreground)); font-size: 0.85rem;
}
.kicker { display: block; font-size: 0.625rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgb(var(--app-primary)); }
.ttl { display: block; font-size: 1rem; font-weight: 600; letter-spacing: -0.01em; color: rgb(var(--app-foreground)); }
.meta { display: block; font-size: 0.6875rem; color: rgb(var(--app-muted-foreground)); }
.prog { display: block; height: 0.3rem; border-radius: 99px; background: rgb(var(--app-muted)); overflow: hidden; margin-top: 0.5rem; }
.prog i { display: block; height: 100%; border-radius: 99px; background: rgb(var(--app-primary)); transition: width 800ms cubic-bezier(0.22, 1, 0.36, 1); }

.sec-h { display: flex; align-items: center; justify-content: space-between; margin: 1.3rem 0 0.6rem; }
.sec-h b { font-size: 0.875rem; font-weight: 600; }
/* The replica copies the app's type scale, so these read at 18px tall — under the
   24px touch minimum. The hit area is extended with a pseudo-element instead of
   padding, so the button grows for a thumb without the mock's layout shifting
   away from the interface it is imitating. */
.sec-h button {
  font-size: 0.75rem; color: rgb(var(--app-primary)); background: none; border: none; cursor: pointer;
  position: relative;
}
.sec-h button::after { content: ""; position: absolute; inset: -6px -4px; }

.goal { display: flex; align-items: center; gap: 0.8rem; }
.goal-t { display: block; font-size: 0.8375rem; font-weight: 600; }
.goal-m { display: block; font-size: 0.6875rem; color: rgb(var(--app-muted-foreground)); }
.ring {
  width: 2.8rem; height: 2.8rem; flex: none; border-radius: 50%; display: grid; place-items: center;
  font-size: 0.65rem; font-weight: 700;
  background: conic-gradient(rgb(var(--app-primary)) calc(var(--p) * 1%), rgb(var(--app-muted)) 0);
}
.ring span { width: 2.05rem; height: 2.05rem; border-radius: 50%; background: rgb(var(--app-card)); display: grid; place-items: center; }

.graph { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.node {
  font-size: 0.65rem; padding: 0.22rem 0.55rem; border-radius: 999px; border: 1px solid rgb(var(--app-border));
  color: rgb(var(--app-muted-foreground)); cursor: pointer; background: none;
  transition: background 150ms, color 150ms, border-color 150ms;
}
.node:hover { border-color: rgb(var(--app-primary) / 0.5); color: rgb(var(--app-foreground)); }
.node.lv3 { background: rgb(var(--app-primary) / 0.16); color: rgb(var(--app-primary)); border-color: transparent; font-weight: 600; }
.node.lv2 { background: rgb(var(--app-primary) / 0.08); }

.grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.7rem; }
.ccard {
  border: 1px solid rgb(var(--app-border)); border-radius: 0.7rem; overflow: hidden;
  background: rgb(var(--app-card)); transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms;
}
.ccard:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -10px rgb(0 0 0 / 0.35); }
.thumb { height: 62px; background: linear-gradient(135deg, rgb(var(--app-primary) / 0.3), rgb(var(--app-seal-b) / 0.26)); }
.ccard:nth-child(2) .thumb { background: linear-gradient(135deg, rgb(var(--app-seal-b) / 0.28), rgb(var(--app-primary) / 0.22)); }
.ccard:nth-child(3) .thumb { background: linear-gradient(135deg, rgb(var(--app-warning) / 0.3), rgb(34 197 94 / 0.2)); }
.cb { padding: 0.55rem 0.65rem 0.7rem; }
.ct { font-size: 0.78rem; font-weight: 600; line-height: 1.3; }
.cm { font-size: 0.625rem; color: rgb(var(--app-muted-foreground)); margin-top: 0.15rem; }

/* credentials */
.cred {
  display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.75rem;
  border: 1px solid rgb(var(--app-border)); border-radius: 0.7rem; background: rgb(var(--app-card)); margin-bottom: 0.55rem;
}
.seal {
  width: 2.1rem; height: 2.1rem; border-radius: 0.5rem; flex: none; display: grid; place-items: center; font-size: 0.85rem;
  background: linear-gradient(135deg, rgb(var(--app-primary)), rgb(var(--app-seal-b))); color: #fff;
}
.cred-body { min-width: 0; }
.cred-body .t { display: block; font-size: 0.8375rem; font-weight: 600; }
.cred-body .m { display: block; font-size: 0.625rem; color: rgb(var(--app-muted-foreground)); font-family: var(--font-mono); letter-spacing: 0.03em; }
.kind {
  font-size: 0.5625rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;
  padding: 0.1rem 0.35rem; border-radius: 0.25rem;
  background: rgb(var(--app-primary) / 0.12); color: rgb(var(--app-primary));
}
.vf {
  margin-inline-start: auto; font-size: 0.6875rem; font-weight: 600; padding: 0.32rem 0.65rem; border-radius: 0.4rem;
  border: 1px solid rgb(var(--app-border)); background: transparent; color: rgb(var(--app-foreground));
  cursor: pointer; white-space: nowrap;
}
.vf:hover { background: rgb(var(--app-muted)); }
.vf.ok { background: rgb(34 197 94 / 0.16); color: rgb(var(--app-verified)); border-color: transparent; }

/* opinions */
.op { border: 1px solid rgb(var(--app-border)); border-radius: 0.7rem; background: rgb(var(--app-card)); padding: 0.8rem 0.9rem; margin-bottom: 0.6rem; }
.op-h { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.45rem; }
.op-h .av {
  width: 1.6rem; height: 1.6rem; border-radius: 50%; background: rgb(var(--app-seal-b) / 0.34);
  display: grid; place-items: center; font-size: 0.625rem; font-weight: 700;
}
.op-h .nm { font-size: 0.78rem; font-weight: 600; }
.op-h .cr {
  font-size: 0.5625rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700;
  color: rgb(var(--app-verified)); background: rgb(34 197 94 / 0.15); padding: 0.08rem 0.3rem; border-radius: 0.25rem;
}
.op p { margin: 0; font-size: 0.8375rem; line-height: 1.5; }
.op-bar { display: flex; height: 0.3rem; border-radius: 99px; overflow: hidden; margin-top: 0.6rem; }
.op-bar i { display: block; height: 100%; }
.op-meta { display: flex; justify-content: space-between; font-size: 0.625rem; color: rgb(var(--app-muted-foreground)); margin-top: 0.28rem; }

/* governance */
.gov-t { font-size: 0.9rem; font-weight: 600; }
.gov-stage { display: flex; align-items: center; gap: 0.4rem; margin: 0.65rem 0 0.8rem; flex-wrap: wrap; }
.gov-stage span {
  flex: 1 1 20%; text-align: center; font-size: 0.5625rem; text-transform: uppercase; letter-spacing: 0.08em;
  font-weight: 700; padding: 0.3rem 0; border-radius: 0.35rem;
  background: rgb(var(--app-muted)); color: rgb(var(--app-muted-foreground));
}
.gov-stage span.on { background: rgb(var(--app-governance) / 0.18); color: rgb(var(--app-gov-text)); }
.gov-vote { display: flex; gap: 0.4rem; margin-top: 0.75rem; flex-wrap: wrap; }
.gov-vote button {
  flex: 1 1 30%; font-size: 0.78rem; font-weight: 600; padding: 0.45rem; border-radius: 0.45rem;
  border: 1px solid rgb(var(--app-border)); background: transparent; color: rgb(var(--app-foreground)); cursor: pointer;
}
.gov-vote button:hover { background: rgb(var(--app-muted)); }
.gov-vote button.cast { background: rgb(var(--app-primary)); color: rgb(var(--app-primary-foreground)); border-color: transparent; }

/* tutoring + classroom */
.live { display: flex; align-items: center; gap: 0.85rem; }
.live-av {
  width: 3rem; height: 3rem; border-radius: 0.6rem; background: rgb(var(--app-primary) / 0.16);
  display: grid; place-items: center; font-weight: 700; color: rgb(var(--app-primary)); flex: none;
}
.chan { padding: 0.5rem; }
.chan-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.5rem; border-radius: 0.5rem; font-size: 0.75rem; }
.chan-row b { font-family: var(--font-mono); color: rgb(var(--app-muted-foreground)); }
.chan-row.on { background: rgb(var(--app-primary) / 0.1); }
.chan-row.on b { color: rgb(var(--app-primary)); }
.chan-row { position: relative; }
.chan-n {
  margin-inline-start: auto; font-style: normal; font-size: 0.625rem; font-weight: 700;
  min-width: 1.05rem; padding: 0 0.25rem; border-radius: 999px; text-align: center;
  background: rgb(var(--app-primary)); color: rgb(var(--app-primary-foreground));
}

/* live session — two tiles, controls, connection line. Faces are initials on a
   tinted block rather than stock photography: this is a replica of a UI, and a
   fake person's face would be the one dishonest pixel in it. */
.stage { padding: 0.6rem; }
.tiles { display: grid; grid-template-columns: 1.6fr 1fr; gap: 0.4rem; }
.tile {
  position: relative; border-radius: 0.55rem; min-height: 6.5rem; padding: 0.5rem;
  display: flex; flex-direction: column; justify-content: flex-end; gap: 0.3rem; overflow: hidden;
  background: linear-gradient(150deg, rgb(var(--app-primary) / 0.22), rgb(var(--app-seal-b) / 0.16));
}
.tile.self { background: linear-gradient(150deg, rgb(var(--app-muted-foreground) / 0.22), rgb(var(--app-primary) / 0.1)); }
.tile-av {
  position: absolute; inset-block-start: 0.5rem; inset-inline-start: 0.5rem;
  width: 1.75rem; height: 1.75rem; border-radius: 0.45rem; display: grid; place-items: center;
  font-size: 0.7rem; font-weight: 700; background: rgb(var(--app-card) / 0.85); color: rgb(var(--app-primary));
}
.tile-name { font-size: 0.7rem; font-weight: 600; display: flex; align-items: center; gap: 0.3rem; }
.tile-name i { font-style: normal; font-size: 0.6rem; font-weight: 600; color: rgb(var(--app-muted-foreground)); }
.tile-share, .tile-muted {
  align-self: flex-start; font-size: 0.6rem; font-weight: 600; padding: 0.1rem 0.35rem;
  border-radius: 999px; background: rgb(var(--app-card) / 0.8); color: rgb(var(--app-muted-foreground));
}
.tile-share { color: rgb(var(--app-primary)); }

.ctl { display: flex; gap: 0.35rem; margin-top: 0.5rem; flex-wrap: wrap; }
.ctl-b {
  flex: 1 1 auto; font-size: 0.7rem; font-weight: 600; padding: 0.4rem 0.5rem; border-radius: 0.45rem;
  border: 1px solid rgb(var(--app-border)); background: transparent;
  color: rgb(var(--app-muted-foreground)); cursor: pointer;
}
.ctl-b:hover { background: rgb(var(--app-muted)); }
.ctl-b.on { background: rgb(var(--app-primary) / 0.12); border-color: transparent; color: rgb(var(--app-primary)); }
.ctl-b.leave { color: rgb(var(--app-no)); }
.stage-meta { display: flex; align-items: center; gap: 0.4rem; }
.dot-live { width: 0.4rem; height: 0.4rem; border-radius: 50%; background: rgb(var(--app-no)); flex: none; }

.agenda { display: grid; gap: 0.4rem; }
.ag-row { display: flex; gap: 0.5rem; font-size: 0.7rem; color: rgb(var(--app-muted-foreground)); }
.ag-row b {
  flex: none; min-width: 4.25rem; font-size: 0.625rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: rgb(var(--app-foreground)); padding-top: 0.05rem;
}

.slot { display: flex; align-items: center; gap: 0.7rem; cursor: pointer; }
.slot:hover { border-color: rgb(var(--app-primary) / 0.4); }
.live-av.sm { width: 2.25rem; height: 2.25rem; font-size: 0.75rem; border-radius: 0.5rem; }
.slot-when {
  margin-inline-start: auto; flex: none; font-size: 0.65rem; font-weight: 700;
  color: rgb(var(--app-muted-foreground));
}

/* classroom thread */
.thread { display: grid; gap: 0.7rem; }
.msg { display: flex; gap: 0.55rem; }
.msg-av {
  flex: none; width: 1.75rem; height: 1.75rem; border-radius: 0.45rem; display: grid; place-items: center;
  font-size: 0.65rem; font-weight: 700;
  background: rgb(var(--app-muted-foreground) / 0.16); color: rgb(var(--app-muted-foreground));
}
.msg-av.ins { background: rgb(var(--app-primary) / 0.16); color: rgb(var(--app-primary)); }
.msg-b { min-width: 0; }
.msg-h { display: flex; align-items: baseline; gap: 0.35rem; font-size: 0.72rem; font-weight: 600; flex-wrap: wrap; }
.msg-h i { font-style: normal; font-size: 0.575rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--app-primary)); }
.msg-h em { font-style: normal; font-size: 0.6rem; font-weight: 500; color: rgb(var(--app-muted-foreground)); }
.msg-t { display: block; font-size: 0.72rem; line-height: 1.45; color: rgb(var(--app-muted-foreground)); margin-top: 0.1rem; }

.composer { display: flex; gap: 0.4rem; align-items: center; }
.composer-in {
  flex: 1; min-width: 0; font-size: 0.72rem; padding: 0.5rem 0.7rem; border-radius: 999px;
  border: 1px solid rgb(var(--app-border)); background: rgb(var(--app-card));
  color: rgb(var(--app-muted-foreground)); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.composer-b {
  flex: none; font-size: 0.7rem; font-weight: 700; padding: 0.5rem 0.85rem; border-radius: 999px;
  border: none; background: rgb(var(--app-primary)); color: rgb(var(--app-primary-foreground)); cursor: pointer;
}

.asg { display: flex; align-items: center; gap: 0.7rem; cursor: pointer; }
.asg:hover { border-color: rgb(var(--app-primary) / 0.4); }
/* Grows, so the count column ends up against the right edge instead of floating
   mid-card with dead space beside it. */
.asg-l { flex: 1; min-width: 0; }
.asg-r {
  flex: none; text-align: center; padding-inline-start: 0.6rem;
  border-inline-start: 1px solid rgb(var(--app-border));
}
.asg-r b { display: block; font-size: 1rem; font-weight: 700; line-height: 1; }
.asg-r i { font-style: normal; font-size: 0.575rem; color: rgb(var(--app-muted-foreground)); }

/* mobile tab bar */
.mtab { display: none; border-top: 1px solid rgb(var(--app-border)); background: rgb(var(--app-card)); flex-shrink: 0; }
.mtab button {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.125rem;
  padding: 0.5rem 0.25rem 0.3rem; background: none; border: none; cursor: pointer;
  color: rgb(var(--app-muted-foreground)); transition: color 150ms;
}
.mtab button svg { width: 1.25rem; height: 1.25rem; stroke-width: 1.75; }
.mtab button span { font-size: 0.6rem; font-weight: 500; line-height: 1.15; }
.mtab button.on { color: rgb(var(--app-primary)); }
.mtab button.on svg { stroke-width: 2.25; }

/* omni search */
.omni {
  position: absolute; inset: 0; z-index: 20; display: flex; padding-top: 4rem; justify-content: center;
  background: rgb(0 0 0 / 0.42); backdrop-filter: blur(2px);
}
.omni-box {
  width: min(460px, 88%); height: max-content; max-height: 78%;
  background: rgb(var(--app-card)); border: 1px solid rgb(var(--app-border));
  border-radius: 0.75rem; box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.6); overflow: hidden;
  animation: omni-in 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes omni-in { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: none; } }
.omni-in { display: flex; align-items: center; gap: 0.55rem; padding: 0.75rem 0.9rem; border-bottom: 1px solid rgb(var(--app-border)); }
.omni-in svg { width: 0.95rem; height: 0.95rem; color: rgb(var(--app-muted-foreground)); flex: none; }
.omni-in input { flex: 1; border: none; outline: none; background: none; font-family: inherit; font-size: 0.875rem; color: rgb(var(--app-foreground)); }
.omni-in kbd { font-family: var(--font-mono); font-size: 0.625rem; color: rgb(var(--app-muted-foreground)); }
.omni-list { max-height: 260px; overflow-y: auto; padding: 0.35rem; }
.omni-list button {
  display: flex; align-items: center; gap: 0.55rem; width: 100%; padding: 0.48rem 0.6rem; border: none;
  background: none; border-radius: 0.45rem; cursor: pointer; text-align: start; color: rgb(var(--app-foreground));
}
.omni-list button:hover { background: rgb(var(--app-muted)); }
.omni-list .g { font-size: 0.5625rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgb(var(--app-muted-foreground)); padding: 0.45rem 0.6rem 0.2rem; font-weight: 700; }
.omni-list .t { font-size: 0.8375rem; }
.omni-list .k { margin-inline-start: auto; font-family: var(--font-mono); font-size: 0.625rem; color: rgb(var(--app-muted-foreground)); }
.omni-empty { padding: 1rem 0.9rem; font-size: 0.8375rem; color: rgb(var(--app-muted-foreground)); }

/* toast */
.toast {
  position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); z-index: 30;
  background: rgb(var(--app-foreground)); color: rgb(var(--app-background));
  font-size: 0.78rem; font-weight: 600; padding: 0.45rem 0.85rem; border-radius: 0.5rem; pointer-events: none;
}
.toast-enter-active, .toast-leave-active { transition: opacity 220ms ease, transform 220ms ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }

/* The window responds to its own width, not the viewport, so it lays out
   correctly at any embed size — mirroring the app hiding its sidebar below md. */
@container (max-width: 700px) {
  .sb { display: none; }
  .mtab { display: flex; }
  .tb { padding: 0 0.5rem; gap: 0.35rem; }
  .tb-lights { display: none; }
  .tb-ico { display: none; }
  .tb-search kbd { display: none; }
  .tb-net { font-size: 0; gap: 0; }
  .tb-net i { width: 0.45rem; height: 0.45rem; }
  .main { padding: 1rem 1rem 1.15rem; }
  .greet { font-size: 1.15rem; }
  .omni { padding-top: 3.2rem; }
}
@container (max-width: 460px) {
  .tb-alpha { display: none; }
  .tb-search span { font-size: 0.75rem; }
  .main { padding: 0.85rem 0.85rem 1rem; }
  .grid3 { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
  .thumb { height: 48px; }
  .sec-h { margin: 1rem 0 0.5rem; }
  .cred { flex-wrap: wrap; gap: 0.55rem; padding: 0.55rem 0.6rem; }
  .mtab button span { font-size: 0.55rem; }
}
</style>
