<script setup lang="ts">
useTheme()

const mobileMenuOpen = ref(false)
function closeMobileMenu() { mobileMenuOpen.value = false }

// Announcement banner — dismissal persists forever per-browser via localStorage.
// The banner ships in the server-rendered HTML and the pre-paint script in
// nuxt.config.ts sets data-announce="off" on <html> when it was dismissed, so
// CSS hides it before anything is painted. Toggling it after hydration instead
// would reflow the whole page.
const ANNOUNCEMENT_DISMISS_KEY = 'alexandria-announcement-dismissed'
const bannerDismissed = ref(false)

function dismissBanner() {
  bannerDismissed.value = true
  document.documentElement.setAttribute('data-announce', 'off')
  localStorage.setItem(ANNOUNCEMENT_DISMISS_KEY, '1')
}

const year = new Date().getFullYear()
</script>

<template>
  <div class="shell">
    <!-- Announcement banner -->
    <div v-if="!bannerDismissed" class="announce">
      <a
        href="https://www.ifftu.dev/blog/introducing-alexandria/"
        target="_blank"
        rel="noopener noreferrer"
        class="plausible-event-name=Announcement announce-link"
      >
        Read the announcement post
        <span aria-hidden="true">&rarr;</span>
      </a>
      <button type="button" class="announce-x" aria-label="Dismiss announcement" @click="dismissBanner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

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

        <nav class="nav-links">
          <NuxtLink to="/recruiter" class="plausible-event-name=Nav-Recruiter link-recruiter">For recruiters</NuxtLink>
          <NuxtLink to="/institutions" class="plausible-event-name=Nav-Institutions link-institution">For institutions</NuxtLink>
        </nav>

        <div class="nav-right">
          <a
            href="https://github.com/ifftu-dev/alexandria"
            target="_blank"
            rel="noopener noreferrer"
            class="plausible-event-name=CTA-GitHub nav-gh"
            aria-label="Alexandria on GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
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
              <NuxtLink to="/recruiter" class="plausible-event-name=Nav-Recruiter link-recruiter" @click="closeMobileMenu">For recruiters</NuxtLink>
              <NuxtLink to="/institutions" class="plausible-event-name=Nav-Institutions link-institution" @click="closeMobileMenu">For institutions</NuxtLink>
              <a
                href="https://github.com/ifftu-dev/alexandria/releases"
                target="_blank"
                rel="noopener noreferrer"
                class="plausible-event-name=Download"
                @click="closeMobileMenu"
              >Download</a>
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
              <li><a href="https://github.com/ifftu-dev/alexandria/releases" target="_blank" rel="noopener noreferrer" class="plausible-event-name=Download">Download</a></li>
              <li><a href="https://github.com/ifftu-dev/alexandria" target="_blank" rel="noopener noreferrer" class="plausible-event-name=CTA-GitHub">Source code</a></li>
            </ul>
          </div>

          <div class="foot-col">
            <h2>For</h2>
            <ul>
              <li><NuxtLink to="/recruiter" class="plausible-event-name=Nav-Recruiter">Recruiters</NuxtLink></li>
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

/* announcement */
.announce { position: relative; background: rgb(var(--color-primary)); color: rgb(var(--color-primary-foreground)); }
.announce-link {
  display: block; padding: 10px 40px; text-align: center; font-size: 14px; font-weight: 600;
  text-decoration: none; color: inherit; transition: opacity 150ms ease;
}
.announce-link:hover { opacity: 0.9; }
.announce-link span { margin-inline-start: 4px; }
.announce-x {
  position: absolute; inset-inline-end: 8px; top: 50%; transform: translateY(-50%);
  display: flex; height: 28px; width: 28px; align-items: center; justify-content: center;
  border: none; border-radius: 8px; background: transparent; color: inherit; opacity: 0.8; cursor: pointer;
  transition: background 150ms ease, opacity 150ms ease;
}
.announce-x:hover { background: rgb(255 255 255 / 0.18); opacity: 1; }
.announce-x svg { width: 15px; height: 15px; }

/* header */
.site-nav {
  position: sticky; top: 0; z-index: 60;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, rgb(var(--color-background)) 84%, transparent);
  border-bottom: 1px solid rgb(var(--color-border));
}
.nav-in { display: flex; align-items: center; justify-content: space-between; height: 62px; gap: 14px; }
.brand {
  display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px;
  letter-spacing: -0.02em; text-decoration: none; color: rgb(var(--color-foreground)); flex: none;
}
.brand svg { color: rgb(var(--color-primary)); }
.nav-links { display: none; gap: 8px; }
@media (min-width: 760px) { .nav-links { display: flex; } }
.nav-links a {
  font-size: 14.5px; font-weight: 600; text-decoration: none; padding: 7px 12px; border-radius: 999px;
  transition: background 150ms ease;
}
.link-recruiter { color: rgb(var(--color-recruiter)); }
.link-recruiter:hover { background: rgb(var(--color-recruiter) / 0.12); }
.link-institution { color: rgb(var(--color-institution)); }
.link-institution:hover { background: rgb(var(--color-institution) / 0.12); }
.nav-right { display: flex; align-items: center; gap: 6px; }
.nav-gh {
  display: none; align-items: center; justify-content: center; width: 38px; height: 38px;
  border-radius: 10px; color: rgb(var(--color-muted-foreground)); transition: color 150ms ease, background 150ms ease;
}
@media (min-width: 760px) { .nav-gh { display: flex; } }
.nav-gh:hover { color: rgb(var(--color-foreground)); background: rgb(var(--color-muted)); }
.nav-gh svg { width: 19px; height: 19px; }
.nav-burger {
  display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;
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
.drawer-foot {
  margin: 0; padding: 16px 18px; border-top: 1px solid rgb(var(--color-border));
  font-size: 12.5px; color: rgb(var(--color-muted-foreground));
}
.drawer-enter-active, .drawer-leave-active { transition: opacity 250ms ease; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(100%); }

/* footer */
.site-foot { background: rgb(var(--color-muted)); border-top: 1px solid rgb(var(--color-border)); padding: 54px 0 40px; }
.foot-grid { display: grid; gap: 32px; grid-template-columns: 1fr; }
@media (min-width: 760px) { .foot-grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
.foot-brand p { margin: 14px 0 0; font-size: 14px; color: rgb(var(--color-muted-foreground)); max-width: 42ch; line-height: 1.6; }
.foot-social { display: flex; gap: 8px; margin-top: 16px; }
.foot-social a {
  display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px;
  color: rgb(var(--color-muted-foreground)); transition: color 150ms ease, background 150ms ease;
}
.foot-social a:hover { color: rgb(var(--color-foreground)); background: rgb(var(--color-background)); }
.foot-social svg { width: 18px; height: 18px; }
.foot-col h2 { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgb(var(--color-muted-foreground)); margin: 0 0 14px; }
.foot-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.foot-col a { font-size: 14px; color: rgb(var(--color-muted-foreground)); text-decoration: none; }
.foot-col a:hover { color: rgb(var(--color-primary)); }
.foot-base {
  margin-top: 40px; padding-top: 22px; border-top: 1px solid rgb(var(--color-border));
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;
}
.foot-base p { margin: 0; font-size: 13px; color: rgb(var(--color-muted-foreground)); max-width: 64ch; }
.ifftu {
  display: inline-flex; align-items: center; gap: 7px; text-decoration: none; flex: none;
  font-size: 14px; font-weight: 600; color: rgb(var(--color-primary));
  padding: 7px 15px; border-radius: 999px;
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
