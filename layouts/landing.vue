<script setup lang="ts">
useTheme()

const mobileMenuOpen = ref(false)
function closeMobileMenu() { mobileMenuOpen.value = false }

// Announcement toast — bottom-right, dismissal persists per-browser.
// It is fixed-position and mounts after hydration, so it cannot move the page;
// the old full-width banner sat in the flow and pushed everything down.
const waitlist = useWaitlist()
const palette = ref<{ openPalette: () => void } | null>(null)

// The palette is the most enjoyable thing here and the least discoverable —
// nobody presses `/` on a marketing page. The button pulses until it is used.
const searchPing = useSearchPing()

/**
 * The drawer, as data.
 *
 * It was a flat list of ten links whose rows did not share a left edge: the
 * links carried padding from `.drawer-links a`, the waiting-list button
 * inherited `padding: 0` from `.drawer-cta` (shared with the footer), and the
 * search row's label was pushed right by its own icon. Three different left
 * edges in one column.
 *
 * Every row now renders from the same template with the same icon slot, so the
 * labels line up by construction rather than by three rules agreeing. Grouping
 * mirrors the top nav's axis — who it is for, the argument, then what you can
 * do — because the drawer IS the navigation on a phone.
 */
const DRAWER_GROUPS = [
  {
    title: 'Who it’s for',
    items: [
      { to: '/learners', label: 'For learners', cls: 'plausible-event-name=Nav-Learners', icon: 'M4.26 10.147a60.44 60.44 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342' },
      { to: '/employers', label: 'For employers', cls: 'plausible-event-name=Nav-Recruiter link-recruiter', icon: 'M20.25 14.15v4.073a2.25 2.25 0 01-1.632 2.163l-1.32.377a12.06 12.06 0 01-6.596 0l-1.32-.377a2.25 2.25 0 01-1.632-2.163V14.15M16.5 6.478V6a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 007.5 6v.478M3 8.25h18a.75.75 0 01.75.75v3.44a2.25 2.25 0 01-1.632 2.163l-4.5 1.286a12.06 12.06 0 01-6.636 0l-4.5-1.286A2.25 2.25 0 012.25 12.44V9A.75.75 0 013 8.25z' },
      { to: '/institutions', label: 'For institutions', cls: 'plausible-event-name=Nav-Institutions link-institution', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
    ],
  },
  {
    title: 'The argument',
    items: [
      { to: '/why-recognition', label: 'Why recognition', cls: 'plausible-event-name=Nav-Recognition', icon: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z' },
      { to: '/technology', label: 'Technology', cls: 'plausible-event-name=Nav-Technology', icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z' },
      { to: '/blog', label: 'Blog', cls: 'plausible-event-name=Nav-Blog', icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z' },
    ],
  },
  {
    title: 'Take part',
    items: [
      { to: '/verify', label: 'Verify a credential', cls: 'plausible-event-name=Nav-Verify', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
      { to: '/pilots', label: 'Run a pilot', cls: 'plausible-event-name=Nav-Pilots', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5' },
      { action: 'waitlist', label: 'Join the waiting list', cls: 'plausible-event-name=EarlyAccess', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
      { href: 'https://github.com/ifftu-dev/alexandria', label: 'Source code', cls: 'plausible-event-name=CTA-GitHub', icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
    ],
  },
] as const

const ANNOUNCEMENT_POST = '/blog/introducing-alexandria'
const ANNOUNCEMENT_DISMISS_KEY = 'alexandria-announcement-dismissed'
const armed = ref(false)
const route = useRoute()
// Inviting someone to read the post they are currently reading is noise, and it
// sits on top of the text while they do it.
const showToast = computed(() => armed.value && route.path.replace(/\/$/, '') !== ANNOUNCEMENT_POST)

onMounted(() => {
  // The dismissal flag is deliberately NOT consulted. The announcement is the
  // project's one standing invitation to read what it is actually for, and a
  // visitor who closed it three weeks ago on a different page is not someone we
  // want to keep it from. Closing it still hides it for the rest of the visit —
  // it just does not follow anyone across sessions.
  //
  // The write below is kept so the preference is there to honor the day we
  // decide to, and so the key does not have to be reintroduced from scratch.
  setTimeout(() => { armed.value = true }, 1400)
  searchPing.arm()
})

function dismissToast() {
  armed.value = false
  localStorage.setItem(ANNOUNCEMENT_DISMISS_KEY, '1')
}

const year = new Date().getFullYear()
</script>

<template>
  <div class="shell">
    <!-- Header -->
    <header class="site-nav">
      <div class="pad nav-in">
        <NuxtLink to="/" aria-label="Alexandria home" class="brand">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" stroke-width="2" fill="none" />
            <path d="M16 8v16M8 12l8 4 8-4" stroke="currentColor" stroke-width="2" />
          </svg>
          <span>Alexandria</span>
        </NuxtLink>

        <!--
          Ordered by axis: the argument, then who it is for, then our voice.

          It used to run Why recognition / Technology / Blog / Employers /
          Institutions — two audiences with the third missing and the blog wedged
          between the argument and the audiences. Someone scanning that sees a
          product for organizations, on a site whose whole thesis is that it is
          for learners.

          Six items rather than a "who it's for" menu because there is room: the
          row uses 784px of 1080 at the narrowest width this nav is shown at, and
          hiding three links behind a disclosure to save space we have would cost
          clicks for nothing.
        -->
        <nav class="nav-links" aria-label="Main">
          <NuxtLink to="/why-recognition" class="plausible-event-name=Nav-Recognition">Why recognition</NuxtLink>
          <NuxtLink to="/technology" class="plausible-event-name=Nav-Technology">Technology</NuxtLink>
          <NuxtLink to="/learners" class="plausible-event-name=Nav-Learners">Learners</NuxtLink>
          <NuxtLink to="/employers" class="plausible-event-name=Nav-Recruiter link-recruiter">Employers</NuxtLink>
          <NuxtLink to="/institutions" class="plausible-event-name=Nav-Institutions link-institution">Institutions</NuxtLink>
          <NuxtLink to="/blog" class="plausible-event-name=Nav-Blog">Blog</NuxtLink>
        </nav>

        <div class="nav-right">
          <button
            type="button"
            class="nav-search"
            :class="{ pinging: searchPing.pinging.value }"
            aria-label="Search this site"
            @click="palette?.openPalette()"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <span>Search</span>
            <kbd>/</kbd>
          </button>
          <UiThemeToggle />
          <button type="button" class="nav-burger" aria-label="Open menu" @click="mobileMenuOpen = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="mobileMenuOpen" class="drawer-root" @click.self="closeMobileMenu">
          <div class="drawer-backdrop" @click="closeMobileMenu" />
          <nav class="drawer">
            <div class="drawer-head">
              <span>Menu</span>
              <button type="button" aria-label="Close menu" @click="closeMobileMenu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="drawer-links">
              <button type="button" class="drawer-row drawer-search" @click="closeMobileMenu(); palette?.openPalette()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
                </svg>
                <span>Search this site</span>
                <kbd>/</kbd>
              </button>

              <template v-for="group in DRAWER_GROUPS" :key="group.title">
                <p class="drawer-group">{{ group.title }}</p>
                <template v-for="item in group.items" :key="item.label">
                  <NuxtLink
                    v-if="'to' in item"
                    :to="item.to"
                    :class="['drawer-row', item.cls]"
                    @click="closeMobileMenu"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
                    </svg>
                    <span>{{ item.label }}</span>
                  </NuxtLink>

                  <a
                    v-else-if="'href' in item"
                    :href="item.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="['drawer-row', item.cls]"
                    @click="closeMobileMenu"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
                    </svg>
                    <span>{{ item.label }}</span>
                  </a>

                  <button
                    v-else
                    type="button"
                    :class="['drawer-row', item.cls]"
                    @click="closeMobileMenu(); waitlist.open()"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
                    </svg>
                    <span>{{ item.label }}</span>
                  </button>
                </template>
              </template>
            </div>
            <p class="drawer-foot">Knowledge must remain free.</p>
          </nav>
        </div>
      </Transition>
    </Teleport>

    <main class="shell-main">
      <slot />
    </main>

    <WaitlistModal />
    <CommandPalette ref="palette" />

    <!-- Announcement toast -->
    <Teleport to="body">
      <Transition name="toast">
        <aside v-if="showToast" class="toast" aria-label="Announcement">
          <NuxtLink
            :to="ANNOUNCEMENT_POST"
            class="plausible-event-name=Announcement toast-link"
            @click="dismissToast"
          >
            <span class="toast-eyebrow">New</span>
            <span class="toast-text">Read the announcement post</span>
          </NuxtLink>
          <button type="button" class="toast-x" aria-label="Dismiss announcement" @click="dismissToast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </aside>
      </Transition>
    </Teleport>

    <!-- Footer -->
    <footer class="site-foot">
      <div class="pad">
        <div class="foot-grid">
          <div class="foot-brand">
            <div class="brand">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" stroke-width="2" fill="none" />
                <path d="M16 8v16M8 12l8 4 8-4" stroke="currentColor" stroke-width="2" />
              </svg>
              <span>Alexandria</span>
            </div>
            <p>
              Free, open-source learning for everyone. Runs on every device, keeps your data on your device,
              and works offline. Your account is yours alone. No gatekeepers.
            </p>
            <div class="foot-social">
              <a
                href="https://github.com/ifftu-dev/alexandria"
                target="_blank"
                rel="noopener noreferrer"
                class="plausible-event-name=CTA-GitHub"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com/Alexandria_FTU" target="_blank" rel="noopener noreferrer" aria-label="Alexandria on X">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div class="foot-col">
            <h2>Platform</h2>
            <ul>
              <li><button type="button" class="plausible-event-name=EarlyAccess foot-cta" @click="waitlist.open()">Waiting list</button></li>
              <li><a href="https://github.com/ifftu-dev/alexandria" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub">Source code</a></li>
            </ul>
          </div>

          <div class="foot-col">
            <h2>For</h2>
            <ul>
              <li><NuxtLink to="/learners" class="plausible-event-name=Nav-Learners">Learners</NuxtLink></li>
              <li><NuxtLink to="/employers" class="plausible-event-name=Nav-Recruiter">Employers</NuxtLink></li>
              <li><NuxtLink to="/pilots" class="plausible-event-name=Nav-Pilots">Run a pilot</NuxtLink></li>
              <li><NuxtLink to="/partners">Partners</NuxtLink></li>
              <li><NuxtLink to="/verify" class="plausible-event-name=Nav-Verify">Verify a credential</NuxtLink></li>
              <li><NuxtLink to="/why-recognition" class="plausible-event-name=Nav-Recognition">Why recognition</NuxtLink></li>
              <li><NuxtLink to="/blog" class="plausible-event-name=Nav-Blog">Blog</NuxtLink></li>
              <li><NuxtLink to="/technology" class="plausible-event-name=Nav-Technology">Technology</NuxtLink></li>
              <li><NuxtLink to="/trust">Trust</NuxtLink></li>
              <li><NuxtLink to="/institutions" class="plausible-event-name=Nav-Institutions">Institutions</NuxtLink></li>
            </ul>
          </div>

          <div class="foot-col">
            <h2>Legal</h2>
            <ul>
              <li><NuxtLink to="/privacy">Privacy policy</NuxtLink></li>
              <li><a href="https://github.com/ifftu-dev/alexandria/blob/main/LICENSE.md" target="_blank" rel="noopener noreferrer">License (open-core)</a></li>
            </ul>
          </div>
        </div>

        <div class="foot-base">
          <p>
            &copy; {{ year }} Alexandria Pvt. Ltd. Core released under the MIT License;
            enterprise modules under the IFFTU Enterprise License.
          </p>
          <a class="ifftu" href="https://www.ifftu.dev" target="_blank" rel="noopener noreferrer">
            An <b>IFFTU</b> product
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.shell { display: flex; min-height: 100vh; flex-direction: column; background: rgb(var(--color-background)); }
.shell-main { flex: 1; }

/* header */
.site-nav {
  position: sticky; top: 0; z-index: 60;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, rgb(var(--color-background)) 84%, transparent);
  border-bottom: 1px solid rgb(var(--color-border));
}
.nav-in { display: flex; align-items: center; justify-content: space-between; height: 62px; gap: 14px; }
.brand {
  display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px; min-height: 40px;
  letter-spacing: -0.02em; text-decoration: none; color: rgb(var(--color-foreground)); flex: none;
}
.brand svg { color: rgb(var(--color-primary)); }
.nav-links { display: none; gap: 2px; }
/* 880, not 760: the bar carries five destinations now, and below this width
   they crowd the wordmark and the CTA. The drawer holds the same set. */
@media (min-width: 880px) { .nav-links { display: flex; } }
.nav-links a {
  font-size: 14.5px; font-weight: 600; text-decoration: none; padding: 9px 12px; border-radius: 999px;
  display: inline-flex; align-items: center; min-height: 40px;
  transition: background 150ms ease;
}
/* The audience tints belong to the pages, not to the bar. Three links in three
   colors reads as decoration and makes the nav look busier than it is; the
   color still appears, on hover and on the page you are actually on. */
.link-recruiter:hover, .link-recruiter.router-link-active {
  color: rgb(var(--color-recruiter));
  background: rgb(var(--color-recruiter) / 0.12);
}
.link-institution:hover, .link-institution.router-link-active {
  color: rgb(var(--color-institution));
  background: rgb(var(--color-institution) / 0.12);
}

/* Current page. NuxtLink sets router-link-active plus aria-current="page", so
   the state is announced as well as shown. The pill is a shape, not just a
   color, which is what lets it carry the state without an underline as well. */
.nav-links a.router-link-active {
  font-weight: 700;
  color: rgb(var(--color-primary));
  background: rgb(var(--color-primary) / 0.14);
}
/* Qualified with `.nav-links a` to outrank the generic active rule above. Without
   it the audience pill rendered in the brand indigo on the very page whose color
   it exists to show. */
.nav-links a.link-recruiter.router-link-active {
  color: rgb(var(--color-recruiter));
  background: rgb(var(--color-recruiter) / 0.16);
}
.nav-links a.link-institution.router-link-active {
  color: rgb(var(--color-institution));
  background: rgb(var(--color-institution) / 0.16);
}

/* Home has no nav item of its own, so the wordmark carries the state.
   Must be exact-active: "/" is a prefix of every route, so router-link-active
   would mark it current on all four pages. */
.brand.router-link-exact-active { color: rgb(var(--color-primary)); }
.nav-right { display: flex; align-items: center; gap: 6px; }

/* The palette's only discoverability affordance — the brief is explicit that it
   has to exist, since a bare `/` shortcut is invisible. */
.nav-search {
  display: inline-flex; align-items: center; gap: 7px; min-height: 40px;
  padding: 9px 12px; border-radius: 999px; border: 0; cursor: pointer;
  font-family: inherit; font-size: 14px; font-weight: 600;
  background: transparent; color: rgb(var(--color-muted-foreground));
  transition: color 150ms ease, background 150ms ease;
}
.nav-search svg { width: 15px; height: 15px; }
.nav-search kbd {
  font-family: var(--font-mono); font-size: 10.5px; line-height: 1;
  padding: 3px 6px; border-radius: 5px;
  border: 1px solid rgb(var(--color-border));
}
.nav-search:hover { color: rgb(var(--color-foreground)); background: rgb(var(--color-muted)); }

/* Below 1080 it becomes an icon the size of the burger beside it. It used to be
   hidden outright, which left the palette unreachable on a phone — no `/` key to
   press — and unreachable between 880 and 1080 as well, where the burger has not
   appeared yet either. */
@media (max-width: 1079px) {
  .nav-search {
    width: 40px; height: 40px; padding: 0;
    justify-content: center; border-radius: 10px;
  }
  .nav-search span, .nav-search kbd { display: none; }
}

/* A ring that expands out of the button and fades, twice a cycle, until someone
   opens the palette. Drawn on a pseudo-element so nothing in the button's own
   box moves — a nav control that jitters is an irritation, not an invitation.
   It is armed a few seconds after mount so it never competes with the hero. */
.nav-search { position: relative; }
.nav-search.pinging { color: rgb(var(--color-foreground)); }
.nav-search.pinging::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1.5px solid rgb(var(--color-primary));
  animation: navPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  pointer-events: none;
}
.nav-search.pinging kbd {
  border-color: rgb(var(--color-primary) / 0.55);
  color: rgb(var(--color-primary));
}
@keyframes navPing {
  0% { transform: scale(0.94); opacity: 0; }
  10% { opacity: 0.9; }
  62% { transform: scale(1.24); opacity: 0; }
  100% { transform: scale(1.24); opacity: 0; }
}

/* Still worth marking as the thing to try, just without the pulse. */
@media (prefers-reduced-motion: reduce) {
  .nav-search.pinging::after { animation: none; opacity: 0.6; transform: none; }
}


/* The drawer and footer triggers were links and are buttons now, so they need
   the surrounding link styling restated rather than inherited. */
/* Sits with the links rather than apart from them: on a phone the drawer is the
   whole navigation, and search belongs in it. */
.drawer-search {
  display: flex; align-items: center; gap: 10px;
  width: 100%; border: 0; background: transparent; cursor: pointer;
  font-family: inherit; text-align: start;
}
.drawer-search svg { width: 17px; height: 17px; flex: none; opacity: 0.75; }

.drawer-cta, .foot-cta {
  font: inherit;
  background: none;
  border: none;
  padding: 0;
  text-align: start;
  cursor: pointer;
  color: inherit;
}
.drawer-cta:hover, .foot-cta:hover { color: rgb(var(--color-foreground)); }

.nav-burger {
  display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;
  border: none; border-radius: 10px; background: transparent; color: rgb(var(--color-muted-foreground)); cursor: pointer;
}
@media (min-width: 880px) { .nav-burger { display: none; } }
.nav-burger:hover { background: rgb(var(--color-muted)); color: rgb(var(--color-foreground)); }
.nav-burger svg { width: 20px; height: 20px; }

/* drawer */
.drawer-root { position: fixed; inset: 0; z-index: 100; }
@media (min-width: 880px) { .drawer-root { display: none; } }
.drawer-backdrop { position: absolute; inset: 0; background: rgb(0 0 0 / 0.45); backdrop-filter: blur(2px); }
.drawer {
  position: absolute; inset-block: 0; inset-inline-end: 0; width: 17rem;
  display: flex; flex-direction: column;
  background: rgb(var(--color-background)); box-shadow: var(--shadow-lift);
}
.drawer-head {
  display: flex; align-items: center; justify-content: space-between; height: 62px;
  padding: 0 18px; border-bottom: 1px solid rgb(var(--color-border));
  font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: rgb(var(--color-muted-foreground));
}
.drawer-head button {
  display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;
  border: none; border-radius: 8px; background: transparent; color: rgb(var(--color-muted-foreground)); cursor: pointer;
}
.drawer-head button:hover { background: rgb(var(--color-muted)); }
.drawer-head svg { width: 18px; height: 18px; }
.drawer-links { display: flex; flex-direction: column; gap: 1px; padding: 10px; flex: 1; overflow-y: auto; }

/* ONE rule for every row, whatever element it is. The previous version styled
   links via `.drawer-links a`, left the waiting-list button on `.drawer-cta`'s
   `padding: 0` (a rule shared with the footer), and let the search row's icon
   push its label right — three different left edges in one column. A grid with a
   fixed icon track means the labels align by construction. */
.drawer-row {
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  text-align: start;
  text-decoration: none;
  color: rgb(var(--color-foreground));
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}
.drawer-row svg { width: 18px; height: 18px; opacity: 0.55; }
.drawer-row:hover { background: rgb(var(--color-muted)); }
.drawer-row:hover svg { opacity: 0.9; }
.drawer-row kbd {
  font-family: var(--font-mono); font-size: 10.5px; line-height: 1;
  padding: 3px 6px; border-radius: 5px;
  border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-muted-foreground));
}

/* The active marker is drawn on the border box rather than inserted inline —
   an inline ::before shifted the label off the shared left edge, which is half
   of what made the old column look crooked. */
.drawer-row.router-link-active {
  background: rgb(var(--color-primary) / 0.12);
  color: rgb(var(--color-primary));
  box-shadow: inset 3px 0 0 rgb(var(--color-primary));
}
.drawer-row.router-link-active svg { opacity: 1; }

/* Group headers. The drawer is the whole navigation on a phone, so it takes the
   same axis as the top nav: who it is for, the argument, what you can do. */
.drawer-group {
  margin: 16px 0 4px;
  padding-inline: 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgb(var(--color-muted-foreground));
}
.drawer-group:first-of-type { margin-top: 14px; }

/* Rows arrive a beat after the panel, top to bottom. Cheap, and it makes the
   drawer feel like it opened rather than appeared. */
.drawer-links > * { animation: drawerRow 260ms cubic-bezier(0.16, 1, 0.3, 1) backwards; }
.drawer-links > :nth-child(1) { animation-delay: 60ms; }
.drawer-links > :nth-child(2) { animation-delay: 85ms; }
.drawer-links > :nth-child(3) { animation-delay: 100ms; }
.drawer-links > :nth-child(4) { animation-delay: 115ms; }
.drawer-links > :nth-child(5) { animation-delay: 130ms; }
.drawer-links > :nth-child(6) { animation-delay: 145ms; }
.drawer-links > :nth-child(7) { animation-delay: 160ms; }
.drawer-links > :nth-child(8) { animation-delay: 175ms; }
.drawer-links > :nth-child(n + 9) { animation-delay: 190ms; }
@keyframes drawerRow {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .drawer-links > * { animation: none; }
}
.drawer-foot {
  margin: 0; padding: 16px 18px; border-top: 1px solid rgb(var(--color-border));
  font-size: 12.5px; color: rgb(var(--color-muted-foreground));
}
.drawer-enter-active, .drawer-leave-active { transition: opacity 250ms ease; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(100%); }

/* announcement toast */
/* Deliberately not a card. On a page made of cards, another bordered surface in
   --color-card is the one thing guaranteed not to be noticed. The gradient is
   fixed rather than themed, for the same reason the hero is: it carries its own
   contrast, so the ink stays white in light mode and dark mode alike. */
.toast {
  position: fixed;
  z-index: 90;
  inset-inline-end: 20px;
  inset-block-end: 20px;
  display: flex;
  align-items: stretch;
  max-width: min(23rem, calc(100vw - 32px));
  border: 1px solid rgb(255 255 255 / 0.16);
  border-radius: 14px;
  background: var(--grad-surface);
  box-shadow: var(--grad-surface-shadow);
  overflow: hidden;
}
@media (max-width: 560px) {
  .toast { inset-inline: 16px; inset-block-end: 16px; max-width: none; }
}
.toast-link {
  display: flex;
  align-items: center;
  gap: 10px;
  /* Right padding clears the close button, which is positioned over this rather
     than sitting beside it — so the whole toast is the link except that one
     target. */
  padding: 14px 48px 14px 16px;
  text-decoration: none;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  flex: 1;
  min-width: 0;
}
.toast-link:hover { background: rgb(255 255 255 / 0.1); }
.toast-eyebrow {
  flex: none;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 7px;
  border-radius: 999px;
  /* 0.14, not 0.22: the chip sits at the lightest end of the gradient, and a
     heavier scrim lifted its background until 10px white text fell to 4.02:1
     against the 4.5 small text needs. This leaves 4.74:1. */
  background: rgb(255 255 255 / 0.14);
  border: 1px solid rgb(255 255 255 / 0.3);
  color: #fff;
}
.toast-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.toast-x {
  position: absolute;
  inset-inline-end: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: rgb(255 255 255 / 0.75);
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}
.toast-x:hover { background: rgb(255 255 255 / 0.14); color: #fff; }
.toast-x svg { width: 14px; height: 14px; }

.toast-enter-active { transition: opacity 320ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1); }
.toast-leave-active { transition: opacity 200ms ease, transform 200ms ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px) scale(0.98); }

/* footer */
.site-foot { background: rgb(var(--color-muted)); border-top: 1px solid rgb(var(--color-border)); padding: 54px 0 40px; }
.foot-grid { display: grid; gap: 32px; grid-template-columns: 1fr; }
@media (min-width: 760px) { .foot-grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
.foot-brand p { margin: 14px 0 0; font-size: 14px; color: rgb(var(--color-muted-foreground)); max-width: 42ch; line-height: 1.6; }
.foot-social { display: flex; gap: 8px; margin-top: 16px; }
.foot-social a {
  display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px;
  color: rgb(var(--color-muted-foreground)); transition: color 150ms ease, background 150ms ease;
}
.foot-social a:hover { color: rgb(var(--color-foreground)); background: rgb(var(--color-background)); }
.foot-social svg { width: 18px; height: 18px; }
.foot-col h2 { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgb(var(--color-muted-foreground)); margin: 0 0 14px; }
.foot-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
/* WCAG 2.2 target size: these are navigation links in a list, not links inside a
   sentence, so the inline exception does not cover them. At 14px they were 16px
   tall — the padding brings the touch area to 24px without moving the type. */
.foot-col a {
  font-size: 14px;
  color: rgb(var(--color-muted-foreground));
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding-block: 3px;
}
.foot-col a:hover { color: rgb(var(--color-primary)); }
.foot-col a.router-link-exact-active { color: rgb(var(--color-primary)); font-weight: 600; }
.foot-base {
  margin-top: 40px; padding-top: 22px; border-top: 1px solid rgb(var(--color-border));
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;
}
.foot-base p { margin: 0; font-size: 13px; color: rgb(var(--color-muted-foreground)); max-width: 64ch; }
.ifftu {
  display: inline-flex; align-items: center; gap: 7px; text-decoration: none; flex: none;
  font-size: 14px; font-weight: 600; color: rgb(var(--color-primary));
  padding: 9px 15px; border-radius: 999px; min-height: 40px;
  background: linear-gradient(100deg, rgb(var(--color-primary) / 0.12), rgb(var(--color-cyan) / 0.15));
  border: 1px solid rgb(var(--color-primary) / 0.26);
  transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 160ms ease, border-color 160ms ease;
}
.ifftu b {
  font-weight: 800;
  background: linear-gradient(100deg, rgb(var(--color-primary)), rgb(var(--color-cyan)));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.ifftu svg { width: 13px; height: 13px; transition: transform 160ms ease; }
.ifftu:hover {
  transform: translateY(-1px);
  border-color: rgb(var(--color-primary) / 0.55);
  box-shadow: 0 8px 20px -10px rgb(var(--color-primary) / 0.85);
}
.ifftu:hover svg { transform: translate(2px, -2px); }
</style>
