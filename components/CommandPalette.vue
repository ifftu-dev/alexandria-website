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
}

const open = ref(false)
const query = ref('')
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
  { name: 'Read the source', hint: 'github', run: () => { close(); window.open(GITHUB, '_blank', 'noopener') } },
  {
    name: 'Switch theme',
    hint: 'light / dark',
    run: () => setTheme(theme.value === 'dark' ? 'light' : 'dark'),
  },
  {
    name: 'Delete all my data',
    hint: 'nothing to delete',
    answer: 'Done. It lived on your device the whole time — we never held a copy to delete.',
    run: () => {},
  },
  {
    name: 'Make it paid',
    hint: 'denied',
    answer: 'Denied. Making that impossible rather than merely unlikely is the entire point of the structure — which we are still putting in place, and say so.',
    run: () => {},
  },
  {
    name: 'Show me the roadmap',
    hint: 'three items',
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
  nextTick(() => input.value?.focus())
}

function close() {
  open.value = false
  answer.value = ''
}

function runAt(index: number) {
  const command = results.value[index]
  if (!command) return
  if (command.answer) { answer.value = command.answer; return }
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
  const typing = el instanceof HTMLInputElement
    || el instanceof HTMLTextAreaElement
    || (el instanceof HTMLElement && el.isContentEditable)
  if (typing) return

  // The app replica has its own `/` search, and inside its window that one wins —
  // it is the joke this palette's footer makes.
  if (el instanceof HTMLElement && el.closest('.app-replica')) return

  event.preventDefault()
  openPalette()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

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
              placeholder="Search this site — or ask for something unreasonable"
              aria-label="Search this site"
            >
            <kbd>esc</kbd>
          </div>

          <ul v-if="results.length" class="cmdk-list">
            <li v-for="(c, i) in results" :key="c.name">
              <button
                type="button"
                :class="{ on: i === cursor }"
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

          <p v-if="answer" class="cmdk-answer" role="status">{{ answer }}</p>

          <p class="cmdk-foot">
            ↑↓ move · ↵ open · this palette does less than the one in the app. That one is real.
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

.cmdk-foot {
  margin: 0;
  padding: 11px 17px;
  border-top: 1px solid rgb(var(--color-border));
  font-family: var(--font-mono);
  font-size: 10.5px;
  line-height: 1.6;
  color: rgb(var(--color-muted-foreground));
}

.cmdk-enter-active, .cmdk-leave-active { transition: opacity 160ms ease; }
.cmdk-enter-from, .cmdk-leave-to { opacity: 0; }
.cmdk-enter-active .cmdk-panel { animation: cmdkIn 200ms cubic-bezier(0.2, 0.9, 0.3, 1); }
@keyframes cmdkIn {
  from { transform: translateY(-8px) scale(0.98); opacity: 0; }
  to { transform: none; opacity: 1; }
}
</style>
