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

const NAV = [
  { key: 'home', label: 'Home', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'opinions', label: 'Opinions', d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
  { key: 'community', label: 'Community', d: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
  { key: 'skills', label: 'Skills & Credentials', d: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
] as const

const TABS = [
  { key: 'home', label: 'Home', d: NAV[0].d },
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

/** "/" or ⌘K opens search, matching the app's own shortcut. */
function onKeydown(e: KeyboardEvent) {
  const el = document.activeElement
  const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
  const isK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
  if (!isK && (typing || e.key !== '/')) return
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return
  const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
  if (visible < 60) return
  e.preventDefault()
  openOmni()
}

onMounted(() => {
  show('home')
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
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
        <button class="tb-av" type="button" title="Priya · local profile" @click="say('Local profile — nothing stored on a server')">P</button>
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
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" :d="item.d" /></svg>
            <span class="sb-label">{{ item.label }}</span>
          </button>
          <button type="button" class="sb-item" :class="{ on: screen === 'goals' }" @click="go('goals')">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <circle cx="12" cy="12" r="8.25" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" />
            </svg>
            <span class="sb-label">Goals</span>
          </button>

          <div class="sb-sep" />

          <div class="sb-sec" :class="{ closed: !openSections.tutoring }">
            <button type="button" @click="openSections.tutoring = !openSections.tutoring">Live tutoring</button>
            <svg class="cv" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div v-show="openSections.tutoring" class="sb-rows">
            <button type="button" class="sb-row" @click="go('tutoring')">
              <span class="in">RK</span><span class="tt">Ravi K · 6G root pass</span><span class="sb-live" />
            </button>
            <button type="button" class="sb-row" @click="go('tutoring')">
              <span class="in">AM</span><span class="tt">Aisha M · Fretboard</span>
            </button>
          </div>

          <div class="sb-sec" :class="{ closed: !openSections.classrooms }">
            <button type="button" @click="openSections.classrooms = !openSections.classrooms">Classrooms</button>
            <svg class="cv" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div v-show="openSections.classrooms" class="sb-rows">
            <button type="button" class="sb-row" @click="go('classroom')">
              <span class="in">W</span><span class="tt">Welding · Batch 12</span><span class="mt">24</span>
            </button>
            <button type="button" class="sb-row" @click="go('classroom')">
              <span class="in">M</span><span class="tt">Music theory</span><span class="mt">9</span>
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
          <p class="greet">Good evening, Priya</p>
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
            <span class="ring" style="--p:68"><span>68%</span></span>
            <span>
              <span class="goal-t">Certified on 6G pipe welding</span>
              <span class="goal-m">4 of 6 skills at Apply · 2 assessments left</span>
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
            <span class="ring" style="--p:68"><span>68%</span></span>
            <span><span class="goal-t">Certified on 6G pipe welding</span><span class="goal-m">2 assessments left · est. 3 weeks at current pace</span></span>
          </div>
          <div class="card goal">
            <span class="ring" style="--p:34"><span>34%</span></span>
            <span><span class="goal-t">Teach a course this year</span><span class="goal-m">Instructor mode unlocks at Analyse in one skill</span></span>
          </div>
          <div class="card goal">
            <span class="ring" style="--p:12"><span>12%</span></span>
            <span><span class="goal-t">Play through Blackbird cleanly</span><span class="goal-m">Assessed by the music plugin, on device</span></span>
          </div>
        </section>

        <!-- TUTORING -->
        <section v-else-if="screen === 'tutoring'" class="scr">
          <p class="greet">Live tutoring</p>
          <p class="greet-sub">Peer to peer — no call runs through a company</p>
          <div class="card live">
            <span class="live-av">RK</span>
            <span>
              <span class="goal-t">Ravi K · 6G root pass review</span>
              <span class="goal-m">Live now · video, audio, screen-share · direct connection</span>
            </span>
            <span class="sb-live" />
          </div>
          <div class="sec-h"><b>Upcoming</b></div>
          <div class="card hint">Aisha M · Fretboard theory · Thursday 18:00 local</div>
        </section>

        <!-- CLASSROOM -->
        <section v-else class="scr">
          <p class="greet">Welding · Batch 12</p>
          <p class="greet-sub">Invite-only · 24 members · you decide who's in</p>
          <div class="card chan">
            <span class="chan-row on"><b>#</b>announcements</span>
            <span class="chan-row"><b>#</b>questions</span>
            <span class="chan-row"><b>#</b>assignments</span>
            <span class="chan-row"><b>#</b>showcase</span>
          </div>
          <div class="sec-h"><b>Latest in #announcements</b></div>
          <div class="card hint">
            <b>Instructor:</b> Root-pass assessments open Friday. Everything runs locally — no internet needed during the test.
          </div>
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
.sec-h button { font-size: 0.75rem; color: rgb(var(--app-primary)); background: none; border: none; cursor: pointer; }

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
