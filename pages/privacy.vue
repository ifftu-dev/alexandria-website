<script setup lang="ts">
definePageMeta({
  layout: 'landing',
})

useHead({
  title: 'Privacy — Alexandria',
  meta: [
    { name: 'description', content: 'How Alexandria handles data on alexandria.ifftu.dev. Short version: we don’t track you.' },
  ],
  link: [
    { rel: 'canonical', href: 'https://alexandria.ifftu.dev/privacy' },
  ],
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
    <p class="font-mono text-xs uppercase tracking-widest text-[rgb(var(--color-muted-foreground))]">
      // data policy
    </p>
    <h1 class="mt-4 text-4xl font-bold leading-tight tracking-tight text-[rgb(var(--color-foreground))] sm:text-5xl">
      Privacy
    </h1>
    <p class="mt-6 text-lg text-[rgb(var(--color-muted-foreground))]">
      Short version: we don't track you. Long version: read on.
    </p>

    <section class="mt-12 space-y-10 text-[rgb(var(--color-foreground))]">
      <div>
        <h2 class="text-2xl font-semibold">01 / What we collect</h2>
        <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
          This site uses
          <a href="https://plausible.io/privacy-focused-web-analytics" target="_blank" rel="noopener noreferrer" class="text-[rgb(var(--color-primary))] underline-offset-4 hover:underline">Plausible Analytics</a>,
          a privacy-friendly, cookieless tool. We collect aggregate pageview counts, referrer URLs,
          country (derived from your IP, then discarded), browser name, and OS name.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold">02 / What we don't collect</h2>
        <ul class="mt-3 list-none space-y-2 text-[rgb(var(--color-muted-foreground))]">
          <li class="before:mr-2 before:text-[rgb(var(--color-primary))] before:content-['//']">No cookies.</li>
          <li class="before:mr-2 before:text-[rgb(var(--color-primary))] before:content-['//']">No personal identifiers.</li>
          <li class="before:mr-2 before:text-[rgb(var(--color-primary))] before:content-['//']">No cross-site tracking.</li>
          <li class="before:mr-2 before:text-[rgb(var(--color-primary))] before:content-['//']">No fingerprinting.</li>
          <li class="before:mr-2 before:text-[rgb(var(--color-primary))] before:content-['//']">No data sold or shared with third parties.</li>
          <li class="before:mr-2 before:text-[rgb(var(--color-primary))] before:content-['//']">No profile of you, anywhere.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl font-semibold">03 / Why we collect anything</h2>
        <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
          We want to know which platforms people download from, which pages land, and which nav items get clicked —
          so we spend our time improving the parts that actually get used.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold">04 / The app itself</h2>
        <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
          The Alexandria desktop and mobile app is a separate story — it's peer-to-peer, offline-first,
          and runs on your device. No servers see your activity. This policy only covers
          <code class="rounded bg-[rgb(var(--color-muted))] px-1.5 py-0.5 font-mono text-sm">alexandria.ifftu.dev</code>,
          the marketing website.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold">05 / Third parties</h2>
        <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
          Plausible hosts analytics for us in the EU. Their
          <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer" class="text-[rgb(var(--color-primary))] underline-offset-4 hover:underline">data policy</a>
          explains exactly what they do and don't store. We don't use Google Analytics, Facebook Pixel, or any other profile-building tool.
          Web fonts are loaded from Google Fonts; Google may log the IP address of font requests per their terms.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold">06 / Contact</h2>
        <p class="mt-3 leading-relaxed text-[rgb(var(--color-muted-foreground))]">
          Questions or requests about data? Email
          <a href="mailto:admin@ifftu.dev" class="text-[rgb(var(--color-primary))] underline-offset-4 hover:underline">admin@ifftu.dev</a>.
        </p>
      </div>
    </section>
  </div>
</template>
