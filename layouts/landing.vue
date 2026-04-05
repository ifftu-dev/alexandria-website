<script setup lang="ts">
useTheme()

const mobileMenuOpen = ref(false)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[rgb(var(--color-background))]">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 text-xl font-semibold text-[rgb(var(--color-foreground))] transition-opacity hover:opacity-80">
          <svg class="h-8 w-8 text-[rgb(var(--color-primary))]" viewBox="0 0 32 32" fill="none" width="32" height="32">
            <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" stroke-width="2" fill="none" />
            <path d="M16 8v16M8 12l8 4 8-4" stroke="currentColor" stroke-width="2" />
          </svg>
          <span class="hidden sm:inline">Alexandria</span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="flex items-center gap-2 sm:gap-4">
          <!-- Desktop nav links -->
          <NuxtLink to="/recruiter" class="hidden rounded-md px-3 py-2 text-sm font-semibold text-[rgb(var(--color-recruiter))] transition-colors hover:bg-[rgb(var(--color-recruiter)/0.12)] hover:text-[rgb(var(--color-recruiter-dark))] sm:block">
            For Recruiters
          </NuxtLink>
          <NuxtLink to="/institutions" class="hidden rounded-md px-3 py-2 text-sm font-semibold text-[rgb(var(--color-institution))] transition-colors hover:bg-[rgb(var(--color-institution)/0.12)] hover:text-[rgb(var(--color-institution-dark))] sm:block">
            For Institutions
          </NuxtLink>
          <!-- Mobile hamburger -->
          <button
            type="button"
            class="sm:hidden ml-1 flex h-9 w-9 items-center justify-center rounded-md text-[rgb(var(--color-muted-foreground))] transition-colors hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))]"
            aria-label="Open menu"
            @click="mobileMenuOpen = true"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <UiThemeToggle />
        </nav>
      </div>
    </header>

    <!-- Mobile menu drawer -->
    <Teleport to="body">
      <Transition name="mobile-menu">
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-[100] sm:hidden"
          @click.self="closeMobileMenu"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeMobileMenu" />

          <!-- Drawer panel -->
          <nav class="mobile-drawer absolute right-0 top-0 flex h-full w-72 flex-col bg-[rgb(var(--color-background))] shadow-2xl">
            <!-- Drawer header -->
            <div class="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border))] px-5">
              <span class="text-sm font-semibold uppercase tracking-widest text-[rgb(var(--color-muted-foreground))]">Menu</span>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-md text-[rgb(var(--color-muted-foreground))] transition-colors hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))]"
                aria-label="Close menu"
                @click="closeMobileMenu"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Drawer links -->
            <div class="flex-1 overflow-y-auto px-3 py-4">
              <NuxtLink
                to="/recruiter"
                class="flex items-center gap-3 rounded-lg px-3 py-3 text-[0.9375rem] font-semibold text-[rgb(var(--color-recruiter))] transition-colors hover:bg-[rgb(var(--color-recruiter)/0.12)]"
                @click="closeMobileMenu"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                For Recruiters
              </NuxtLink>

              <NuxtLink
                to="/institutions"
                class="flex items-center gap-3 rounded-lg px-3 py-3 text-[0.9375rem] font-semibold text-[rgb(var(--color-institution))] transition-colors hover:bg-[rgb(var(--color-institution)/0.12)]"
                @click="closeMobileMenu"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                For Institutions
              </NuxtLink>
            </div>

            <!-- Drawer footer -->
            <div class="border-t border-[rgb(var(--color-border))] px-5 py-4">
              <p class="text-xs text-[rgb(var(--color-muted-foreground))]">Knowledge must remain free.</p>
            </div>
          </nav>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-muted))]">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <!-- Brand Section -->
        <div class="mb-12 text-center">
          <div class="mb-4 flex items-center justify-center gap-3">
            <svg class="h-10 w-10 text-[rgb(var(--color-primary))]" viewBox="0 0 32 32" fill="none" width="40" height="40">
              <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" stroke-width="2" fill="none" />
              <path d="M16 8v16M8 12l8 4 8-4" stroke="currentColor" stroke-width="2" />
            </svg>
            <span class="text-2xl font-bold text-[rgb(var(--color-foreground))]">Alexandria</span>
          </div>
          <p class="mx-auto max-w-md text-[rgb(var(--color-muted-foreground))]">
            Free, open-source, decentralized learning for everyone. A native app that runs on every platform. No servers. No gatekeepers.
          </p>
          <!-- Social Icons -->
          <div class="mt-6 flex items-center justify-center gap-4">
            <a href="https://github.com/ifftu-dev/alexandria" target="_blank" rel="noopener noreferrer" class="rounded-full p-2 text-[rgb(var(--color-muted-foreground))] transition-colors hover:bg-[rgb(var(--color-background))] hover:text-[rgb(var(--color-foreground))]" aria-label="GitHub">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="rounded-full p-2 text-[rgb(var(--color-muted-foreground))] transition-colors hover:bg-[rgb(var(--color-background))] hover:text-[rgb(var(--color-foreground))]" aria-label="Twitter">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" class="rounded-full p-2 text-[rgb(var(--color-muted-foreground))] transition-colors hover:bg-[rgb(var(--color-background))] hover:text-[rgb(var(--color-foreground))]" aria-label="Discord">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Links Grid -->
        <div class="grid grid-cols-2 gap-6 border-t border-[rgb(var(--color-border))] pt-8 sm:gap-8 sm:pt-12 md:grid-cols-4">
          <!-- Platform -->
          <div>
            <h4 class="mb-4 font-semibold text-[rgb(var(--color-foreground))]">Platform</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="https://github.com/ifftu-dev/alexandria/releases" target="_blank" rel="noopener noreferrer" class="text-[rgb(var(--color-muted-foreground))] transition-colors hover:text-[rgb(var(--color-foreground))]">Download</a></li>
              <li><a href="https://github.com/ifftu-dev/alexandria" target="_blank" rel="noopener noreferrer" class="text-[rgb(var(--color-muted-foreground))] transition-colors hover:text-[rgb(var(--color-foreground))]">Source Code</a></li>
            </ul>
          </div>

          <!-- For -->
          <div>
            <h4 class="mb-4 font-semibold text-[rgb(var(--color-foreground))]">For</h4>
            <ul class="space-y-3 text-sm">
              <li><NuxtLink to="/recruiter" class="font-medium text-[rgb(var(--color-recruiter))] transition-colors hover:text-[rgb(var(--color-recruiter-dark))]">Recruiters</NuxtLink></li>
              <li><NuxtLink to="/institutions" class="font-medium text-[rgb(var(--color-institution))] transition-colors hover:text-[rgb(var(--color-institution-dark))]">Institutions</NuxtLink></li>
            </ul>
          </div>

          <!-- About -->
          <div>
            <h4 class="mb-4 font-semibold text-[rgb(var(--color-foreground))]">About</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="https://github.com/ifftu-dev/alexandria" target="_blank" rel="noopener noreferrer" class="text-[rgb(var(--color-muted-foreground))] transition-colors hover:text-[rgb(var(--color-foreground))]">GitHub</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="mb-4 font-semibold text-[rgb(var(--color-foreground))]">Legal</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="#" class="text-[rgb(var(--color-muted-foreground))] transition-colors hover:text-[rgb(var(--color-foreground))]">Privacy Policy</a></li>
              <li><a href="#" class="text-[rgb(var(--color-muted-foreground))] transition-colors hover:text-[rgb(var(--color-foreground))]">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 border-t border-[rgb(var(--color-border))] pt-8 text-center">
          <p class="text-sm text-[rgb(var(--color-muted-foreground))]">&copy; {{ new Date().getFullYear() }} Alexandria. Released under the MIT License.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Mobile menu drawer transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.25s ease;
}
.mobile-menu-enter-active .mobile-drawer,
.mobile-menu-leave-active .mobile-drawer {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
.mobile-menu-enter-from .mobile-drawer,
.mobile-menu-leave-to .mobile-drawer {
  transform: translateX(100%);
}
</style>
