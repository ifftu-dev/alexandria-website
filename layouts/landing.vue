<script setup lang="ts">
useTheme()

const mobileMenuOpen = ref(false)
function closeMobileMenu() { mobileMenuOpen.value = false }

// Announcement toast — bottom-right, dismissal persists per-browser.
// It is fixed-position and mounts after hydration, so it cannot move the page;
// the old full-width banner sat in the flow and pushed everything down.
const waitlist = useWaitlist()

const ANNOUNCEMENT_DISMISS_KEY = 'alexandria-announcement-dismissed'
const showToast = ref(false)

onMounted(() => {
  if (localStorage.getItem(ANNOUNCEMENT_DISMISS_KEY) === '1') return
  // Let the page land before asking for attention.
  setTimeout(() => { showToast.value = true }, 1400)
})

function dismissToast() {
  showToast.value = false
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

        <nav class="nav-links" aria-label="Audiences">
          <NuxtLink to="/learners" class="plausible-event-name=Nav-Learners">Learners</NuxtLink>
          <NuxtLink to="/employers" class="plausible-event-name=Nav-Recruiter link-recruiter">Employers</NuxtLink>
          <NuxtLink to="/institutions" class="plausible-event-name=Nav-Institutions link-institution">Institutions</NuxtLink>
        </nav>

        <div class="nav-right">
          <NuxtLink to="/verify" class="plausible-event-name=Nav-Verify nav-verify">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verify
          </NuxtLink>
          <span class="nav-sep" aria-hidden="true" />
          <button
            type="button"
            class="plausible-event-name=EarlyAccess nav-cta"
            @click="waitlist.open()"
          >Join the waiting list</button>
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
              <NuxtLink to="/learners" class="plausible-event-name=Nav-Learners" @click="closeMobileMenu">For learners</NuxtLink>
              <NuxtLink to="/employers" class="plausible-event-name=Nav-Recruiter link-recruiter" @click="closeMobileMenu">For employers</NuxtLink>
              <NuxtLink to="/institutions" class="plausible-event-name=Nav-Institutions link-institution" @click="closeMobileMenu">For institutions</NuxtLink>
              <NuxtLink to="/verify" class="plausible-event-name=Nav-Verify" @click="closeMobileMenu">Verify a credential</NuxtLink>
              <NuxtLink to="/why-recognition" class="plausible-event-name=Nav-Evidence" @click="closeMobileMenu">Why recognition</NuxtLink>
              <NuxtLink to="/technology" @click="closeMobileMenu">Technology</NuxtLink>
              <NuxtLink to="/pilots" class="plausible-event-name=Nav-Pilots" @click="closeMobileMenu">Run a pilot</NuxtLink>
              <button
                type="button"
                class="plausible-event-name=EarlyAccess drawer-cta"
                @click="closeMobileMenu(); waitlist.open()"
              >Join the waiting list</button>
              <a
                href="https://github.com/ifftu-dev/alexandria"
                target="_blank"
                rel="noopener noreferrer"
                class="plausible-event-name=CTA-GitHub"
                @click="closeMobileMenu"
              >Source code</a>
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

    <!-- Announcement toast -->
    <Teleport to="body">
      <Transition name="toast">
        <aside v-if="showToast" class="toast" aria-label="Announcement">
          <a
            href="https://www.ifftu.dev/blog/introducing-alexandria/"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=Announcement toast-link"
          >
            <span class="toast-eyebrow">New</span>
            <span class="toast-text">Read the announcement post</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
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
              <li><NuxtLink to="/why-recognition" class="plausible-event-name=Nav-Evidence">Why recognition</NuxtLink></li>
              <li><NuxtLink to="/technology">Technology</NuxtLink></li>
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
@media (min-width: 760px) { .nav-links { display: flex; } }
.nav-links a {
  font-size: 14.5px; font-weight: 600; text-decoration: none; padding: 9px 12px; border-radius: 999px;
  display: inline-flex; align-items: center; min-height: 40px;
  transition: background 150ms ease;
}
/* The audience tints belong to the pages, not to the bar. Three links in three
   colours reads as decoration and makes the nav look busier than it is; the
   colour still appears, on hover and on the page you are actually on. */
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
   colour, which is what lets it carry the state without an underline as well. */
.nav-links a.router-link-active {
  font-weight: 700;
  color: rgb(var(--color-primary));
  background: rgb(var(--color-primary) / 0.14);
}
/* Qualified with `.nav-links a` to outrank the generic active rule above. Without
   it the audience pill rendered in the brand indigo on the very page whose colour
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
.nav-cta {
  display: none;
  font-size: 14.5px;
  font-weight: 600;
  text-decoration: none;
  color: rgb(var(--color-primary));
  border: 1px solid rgb(var(--color-primary) / 0.35);
  border-radius: 999px;
  padding: 7px 15px;
  transition: background 150ms ease, border-color 150ms ease;
}
@media (min-width: 760px) { .nav-cta { display: inline-flex; } }
.nav-cta { min-height: 40px; }

/* A utility, not a destination: quieter than the audience links and separated
   from the CTA by a hairline, so the bar reads as three groups rather than a
   row of seven equal things. */
.nav-verify {
  display: none; align-items: center; gap: 6px; min-height: 40px;
  padding: 9px 12px; border-radius: 999px;
  font-size: 14px; font-weight: 600; text-decoration: none;
  color: rgb(var(--color-muted-foreground));
  transition: color 150ms ease, background 150ms ease;
}
.nav-verify svg { width: 15px; height: 15px; }
.nav-verify:hover { color: rgb(var(--color-foreground)); background: rgb(var(--color-muted)); }
/* Same pill as the audience links, so "current page" looks like one thing across
   the bar even though this link is styled quieter than they are. */
.nav-verify.router-link-active {
  color: rgb(var(--color-primary));
  background: rgb(var(--color-primary) / 0.14);
}
.nav-sep { display: none; width: 1px; height: 20px; margin: 0 4px; background: rgb(var(--color-border)); }
@media (min-width: 900px) { .nav-verify { display: inline-flex; } .nav-sep { display: block; } }
.nav-cta:hover { background: rgb(var(--color-primary) / 0.1); border-color: rgb(var(--color-primary) / 0.6); }

/* The drawer and footer triggers were links and are buttons now, so they need
   the surrounding link styling restated rather than inherited. */
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
@media (min-width: 760px) { .nav-burger { display: none; } }
.nav-burger:hover { background: rgb(var(--color-muted)); color: rgb(var(--color-foreground)); }
.nav-burger svg { width: 20px; height: 20px; }

/* drawer */
.drawer-root { position: fixed; inset: 0; z-index: 100; }
@media (min-width: 760px) { .drawer-root { display: none; } }
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
.drawer-links { display: flex; flex-direction: column; gap: 2px; padding: 12px; flex: 1; }
.drawer-links a {
  padding: 11px 12px; border-radius: 10px; font-size: 15px; font-weight: 600; text-decoration: none;
  color: rgb(var(--color-foreground)); transition: background 150ms ease;
}
.drawer-links a:hover { background: rgb(var(--color-muted)); }
.drawer-links a.router-link-active {
  background: rgb(var(--color-primary) / 0.12);
  font-weight: 700;
}
.drawer-links a.router-link-active::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: currentColor;
  margin-inline-end: 9px;
  vertical-align: -2px;
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
.toast {
  position: fixed;
  z-index: 90;
  inset-inline-end: 20px;
  inset-block-end: 20px;
  display: flex;
  align-items: stretch;
  max-width: min(22rem, calc(100vw - 32px));
  border: 1px solid rgb(var(--color-border));
  border-radius: 14px;
  background: color-mix(in srgb, rgb(var(--color-card)) 92%, transparent);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-lift);
  overflow: hidden;
}
@media (max-width: 560px) {
  .toast { inset-inline: 16px; inset-block-end: 16px; max-width: none; }
}
.toast-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 6px 13px 15px;
  text-decoration: none;
  color: rgb(var(--color-foreground));
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  flex: 1;
  min-width: 0;
}
.toast-link:hover { background: rgb(var(--color-primary) / 0.06); }
.toast-eyebrow {
  flex: none;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 7px;
  border-radius: 999px;
  background: rgb(var(--color-primary) / 0.14);
  color: rgb(var(--color-primary));
}
.toast-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.toast-link svg { width: 13px; height: 13px; flex: none; color: rgb(var(--color-muted-foreground)); }
.toast-link:hover svg { color: rgb(var(--color-primary)); }
.toast-x {
  flex: none;
  width: 38px;
  border: none;
  border-inline-start: 1px solid rgb(var(--color-border));
  background: transparent;
  color: rgb(var(--color-muted-foreground));
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}
.toast-x:hover { background: rgb(var(--color-muted)); color: rgb(var(--color-foreground)); }
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
.foot-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.foot-col a { font-size: 14px; color: rgb(var(--color-muted-foreground)); text-decoration: none; }
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
