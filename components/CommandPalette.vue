<script setup lang="ts">
/**
 * The `/` palette from the design brief.
 *
 * Six commands navigate, one toggles the theme, and three answer with a deadpan
 * line instead of going anywhere. The jokes are the point: each one is an
 * argument about the product wearing a joke's clothes, which is why the copy is
 * reproduced as written rather than paraphrased.
 *
 * The brief scopes this to the home page and then says it should be promoted to
 * every page in a real build. It is mounted from the layout, so it is.
 *
 * One line was changed. The brief's answer to "Make it paid" is "Denied by
 * IFFTU. Permanently. The veto does not take requests." — which states the veto
 * as a live instrument. It is intended and undrafted, and the homepage says so
 * plainly, so a gag asserting otherwise would undercut the one section on the
 * site that admits the gap.
 */
const router = useRouter()
const { theme, setTheme } = useTheme()
const waitlist = useWaitlist()

const GITHUB = 'https://github.com/ifftu-dev/alexandria'

interface Command {
  name: string
  hint: string
  run: () => void
  /** Extra text matched against, but not shown — a post's standfirst. */
  keywords?: string
  /** Grouping label, so a long result list still reads as a list of things. */
  group?: string
  /** A deadpan answer shown in place of navigating. */
  answer?: string
  /** Which bit of theatre plays before the answer lands. */
  gag?: 'wipe' | 'denied' | 'roadmap'
}

const open = ref(false)
const query = ref('')
/** The long placeholder is the better line, but below ~520px it is cut mid-word. */
const placeholder = ref('Search this site — or ask for something unreasonable')
const cursor = ref(0)
const answer = ref('')
const input = ref<HTMLInputElement | null>(null)

/**
 * Posts are part of the palette, not a separate search. Someone who half
 * remembers a phrase from the announcement should find it in the same place they
 * look for everything else.
 */
const posts = usePosts()

const POST_COMMANDS: Command[] = [
  { name: 'Read the blog', hint: '/blog', run: () => go('/blog') },
  ...posts.map(post => ({
    name: post.title,
    hint: formatDate(post.date),
    // Section headings too, so half remembering "how this compares" finds it.
    keywords: `${post.standfirst} ${post.kind} ${post.headings.map(h => h.text).join(' ')} blog post article writing`,
    group: 'Blog',
    run: () => go(`/blog/${post.slug}`),
  })),
]

const COMMANDS: Command[] = [
  { name: 'Join the waiting list', hint: 'waitlist', run: () => { close(); waitlist.open() } },
  { name: 'Read the evidence', hint: '/why-recognition', run: () => go('/why-recognition') },
  { name: 'See how it actually works', hint: '/technology', run: () => go('/technology') },
  { name: 'Hire on verified skill', hint: '/employers', run: () => go('/employers') },
  { name: 'Run it at my institution', hint: '/institutions', run: () => go('/institutions') },
  { name: 'Check a credential', hint: '/verify', run: () => go('/verify') },
  // Both have Nav- goals and both were missing while every other audience page
  // was here, which was an oversight rather than a decision.
  { name: 'Learn for free', hint: '/learners', run: () => go('/learners') },
  { name: 'Run a pilot', hint: '/pilots', run: () => go('/pilots') },
  { name: 'Read the source', hint: 'github', run: () => { close(); window.open(GITHUB, '_blank', 'noopener') } },
  {
    name: 'Switch theme',
    hint: 'light / dark',
    run: () => setTheme(theme.value === 'dark' ? 'light' : 'dark'),
  },
  {
    name: 'Delete all my data',
    hint: 'nothing to delete',
    gag: 'wipe',
    answer: 'Done. It lived on your device the whole time — we never held a copy to delete.',
    run: () => {},
  },
  {
    name: 'Make it paid',
    hint: 'denied',
    gag: 'denied',
    answer: 'Denied. Making that impossible rather than merely unlikely is the entire point of the structure — which we are still putting in place, and say so.',
    run: () => {},
  },
  {
    name: 'Show me the roadmap',
    hint: 'three items',
    gag: 'roadmap',
    answer: 'Ship the alpha. Find out whether employers pay. Panic responsibly.',
    run: () => {},
  },
]

const ALL: Command[] = [...COMMANDS, ...POST_COMMANDS]

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return ALL
  // Keywords are matched but never shown, so a post is findable by a line from
  // its standfirst without the row turning into a paragraph.
  return ALL.filter(c => `${c.name} ${c.hint} ${c.keywords ?? ''}`.toLowerCase().includes(q))
})

watch(results, () => { cursor.value = 0 })

function go(path: string) {
  close()
  router.push(path)
}

function openPalette() {
  open.value = true
  query.value = ''
  answer.value = ''
  cursor.value = 0
  // However it was opened — the `/` key, the nav button, the drawer — the nav
  // has made its point and should stop pulsing.
  useSearchPing().markUsed()
  nextTick(() => input.value?.focus())
}

function close() {
  open.value = false
  answer.value = ''
  stopTheatre()
}

/**
 * The three joke commands get a beat of theatre before they answer.
 *
 * `wipe` deletes the row's own label left to right, which is the only data this
 * palette has ever been able to delete. `denied` refuses bodily. `roadmap` types
 * itself out, because a three-item roadmap deserves to be read at the speed it
 * was written.
 *
 * All of it is decoration, so all of it is skipped under `prefers-reduced-motion`
 * and the answer simply appears.
 */
type Gag = NonNullable<Command['gag']>

const playing = ref<{ index: number, gag: Gag } | null>(null)
const typing = ref(false)
let gagTimer: ReturnType<typeof setTimeout> | undefined
let typeTimer: ReturnType<typeof setInterval> | undefined

const BEAT: Record<Gag, number> = { wipe: 620, denied: 420, roadmap: 140 }

function calm() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function stopTheatre() {
  clearTimeout(gagTimer)
  clearInterval(typeTimer)
  playing.value = null
  typing.value = false
}

/** Reveal one character at a time. Slow enough to read, short enough to sit through. */
function typewrite(text: string) {
  typing.value = true
  let i = 0
  typeTimer = setInterval(() => {
    answer.value = text.slice(0, i += 1)
    if (i >= text.length) { clearInterval(typeTimer); typing.value = false }
  }, 16)
}

function playGag(index: number, gag: Gag, text: string) {
  stopTheatre()
  answer.value = ''

  if (calm()) { answer.value = text; return }

  playing.value = { index, gag }
  gagTimer = setTimeout(() => {
    playing.value = null
    if (gag === 'roadmap') typewrite(text)
    else answer.value = text
  }, BEAT[gag])
}

function runAt(index: number) {
  const command = results.value[index]
  if (!command) return
  if (command.answer) {
    if (command.gag) playGag(index, command.gag, command.answer)
    else answer.value = command.answer
    return
  }
  command.run()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) { close(); return }

  if (open.value) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      cursor.value = (cursor.value + 1) % Math.max(results.value.length, 1)
    }
    else if (event.key === 'ArrowUp') {
      event.preventDefault()
      cursor.value = (cursor.value - 1 + results.value.length) % Math.max(results.value.length, 1)
    }
    else if (event.key === 'Enter') {
      event.preventDefault()
      runAt(cursor.value)
    }
    return
  }

  if (event.key !== '/') return

  const el = document.activeElement
  const inAField = el instanceof HTMLInputElement
    || el instanceof HTMLTextAreaElement
    || (el instanceof HTMLElement && el.isContentEditable)
  if (inAField) return

  // The app replica has its own `/` search, and inside its window that one wins —
  // it is the joke this palette's footer makes.
  if (el instanceof HTMLElement && el.closest('.app-replica')) return

  event.preventDefault()
  openPalette()
}

onMounted(() => {
  // 204px against a 252px field at 390px wide, measured rather than guessed —
  // the long line needs 298px and was being cut mid-word.
  if (window.matchMedia('(max-width: 520px)').matches) placeholder.value = 'Search, or ask the impossible'
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  stopTheatre()
})

defineExpose({ openPalette })
</script>

<template>
  <Teleport to="body">
    <Transition name="cmdk">
      <div v-if="open" class="cmdk-root" @click.self="close">
        <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Search this site">
          <div class="cmdk-search">
            <span class="cmdk-dot" aria-hidden="true" />
            <input
              ref="input"
              v-model="query"
              type="text"
              :placeholder="placeholder"
              aria-label="Search this site"
            >
            <kbd>esc</kbd>
          </div>

          <ul v-if="results.length" class="cmdk-list">
            <li v-for="(c, i) in results" :key="c.name">
              <button
                type="button"
                :class="[
                  { on: i === cursor },
                  playing?.index === i ? `gag-${playing.gag}` : '',
                ]"
                @mouseenter="cursor = i"
                @click="runAt(i)"
              >
                <span class="cmdk-name">
                  <span v-if="c.group" class="cmdk-group">{{ c.group }}</span>
                  {{ c.name }}
                </span>
                <span class="cmdk-hint">{{ c.hint }}</span>
              </button>
            </li>
          </ul>
          <p v-else class="cmdk-none">Nothing matches that. The palette is small on purpose.</p>

          <p v-if="answer" class="cmdk-answer" :class="{ typing }" role="status">{{ answer }}</p>

          <p class="cmdk-foot">
            <span class="cmdk-keys">↑↓ move · ↵ open · </span>this palette does less than the one in the app. That one is real.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cmdk-root {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgb(6 9 20 / 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 14vh 20px 20px;
}

.cmdk-panel {
  width: 100%;
  max-width: 580px;
  border-radius: 16px;
  border: 1px solid rgb(var(--color-border));
  background: rgb(var(--color-card));
  box-shadow: 0 40px 90px -30px rgb(0 0 0 / 0.6);
  overflow: hidden;
}

.cmdk-search { display: flex; align-items: center; gap: 11px; padding: 15px 17px; border-bottom: 1px solid rgb(var(--color-border)); }
.cmdk-dot { width: 7px; height: 7px; border-radius: 50%; background: rgb(var(--color-primary)); flex: none; }
.cmdk-search input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; font-family: inherit; font-size: 15px; color: rgb(var(--color-foreground)); }
.cmdk-search input::placeholder { color: rgb(var(--color-muted-foreground)); }

kbd {
  font-family: var(--font-mono);
  font-size: 10.5px;
  padding: 3px 6px;
  border-radius: 5px;
  border: 1px solid rgb(var(--color-border));
  color: rgb(var(--color-muted-foreground));
}

.cmdk-list { list-style: none; margin: 0; padding: 7px; max-height: 46vh; overflow-y: auto; }
.cmdk-list button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  font-family: inherit;
  font-size: 14.5px;
  color: rgb(var(--color-foreground));
  cursor: pointer;
  text-align: start;
}
.cmdk-list button.on { background: rgb(var(--color-primary) / 0.12); }
.cmdk-name { display: flex; align-items: center; gap: 9px; min-width: 0; }
.cmdk-group {
  flex: none;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgb(var(--color-primary) / 0.12);
  color: rgb(var(--color-primary));
}
.cmdk-hint { font-family: var(--font-mono); font-size: 11.5px; color: rgb(var(--color-muted-foreground)); flex: none; }

.cmdk-none { margin: 0; padding: 20px 17px; font-size: 14px; color: rgb(var(--color-muted-foreground)); }

.cmdk-answer {
  margin: 0;
  padding: 13px 17px;
  background: rgb(var(--color-primary) / 0.09);
  border-top: 1px solid rgb(var(--color-border));
  font-size: 13.5px;
  line-height: 1.6;
  color: rgb(var(--color-foreground));
}

/* Hidden where there is no keyboard to press. The line after it is the part
   worth keeping, so the paragraph stays. */
@media (max-width: 700px) { .cmdk-keys { display: none; } }

.cmdk-foot {
  margin: 0;
  padding: 11px 17px;
  border-top: 1px solid rgb(var(--color-border));
  font-family: var(--font-mono);
  font-size: 10.5px;
  line-height: 1.6;
  color: rgb(var(--color-muted-foreground));
}

/* ─── Theatre ────────────────────────────────────────────
   Three jokes, three beats. Everything here is decoration and every rule is
   switched off wholesale under `prefers-reduced-motion` at the foot of the file. */

/* "Delete all my data" — the label deletes itself, left to right. The only data
   this palette has ever been in a position to delete. */
.cmdk-list button.gag-wipe .cmdk-name { animation: gagWipe 620ms cubic-bezier(0.5, 0, 0.75, 0) forwards; }
.cmdk-list button.gag-wipe .cmdk-hint { animation: gagFade 620ms ease forwards; }
@keyframes gagWipe {
  from { clip-path: inset(0 0 0 0); }
  to { clip-path: inset(0 0 0 100%); }
}
@keyframes gagFade { to { opacity: 0.25; } }

/* "Make it paid" — refused bodily. */
.cmdk-list button.gag-denied {
  animation: gagShake 420ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
  background: rgb(239 68 68 / 0.13);
}
@keyframes gagShake {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(3px); }
  30%, 50%, 70% { transform: translateX(-5px); }
  40%, 60% { transform: translateX(5px); }
}

/* "Show me the roadmap" — a brief flicker while it thinks better of it. */
.cmdk-list button.gag-roadmap { animation: gagBlink 140ms steps(2, end) 2; }
@keyframes gagBlink { 50% { background: rgb(var(--color-primary) / 0.22); } }

/* The caret that follows the typewriter, and stops when it does. */
.cmdk-answer.typing::after {
  content: '▍';
  margin-inline-start: 1px;
  color: rgb(var(--color-primary));
  animation: gagCaret 900ms steps(1, end) infinite;
}
@keyframes gagCaret { 50% { opacity: 0; } }

.cmdk-enter-active, .cmdk-leave-active { transition: opacity 160ms ease; }
.cmdk-enter-from, .cmdk-leave-to { opacity: 0; }
.cmdk-enter-active .cmdk-panel { animation: cmdkIn 200ms cubic-bezier(0.2, 0.9, 0.3, 1); }
@keyframes cmdkIn {
  from { transform: translateY(-8px) scale(0.98); opacity: 0; }
  to { transform: none; opacity: 1; }
}

/* The gags are jokes, not information — nobody loses anything by not seeing them
   move. The script skips the delay too, so the answer arrives immediately rather
   than after a beat of nothing. */
@media (prefers-reduced-motion: reduce) {
  .cmdk-list button.gag-wipe .cmdk-name,
  .cmdk-list button.gag-wipe .cmdk-hint,
  .cmdk-list button.gag-denied,
  .cmdk-list button.gag-roadmap,
  .cmdk-answer.typing::after,
  .cmdk-enter-active .cmdk-panel { animation: none; }
}
</style>
