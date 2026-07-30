<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Privacy — Alexandria',
  meta: [
    { name: 'description', content: 'How Alexandria handles data on alexandria.ifftu.dev. Short version: we don’t track you.' },
    { property: 'og:title', content: 'Privacy — Alexandria' },
    { property: 'og:description', content: 'We don’t track you. The only thing we ever ask for is an email address, and only if you ask for early access.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/privacy' },
    { name: 'twitter:title', content: 'Privacy — Alexandria' },
    { name: 'twitter:description', content: 'We don’t track you. The only thing we ever ask for is an email address, and only if you ask for early access.' },
  ],
  link: [
    { rel: 'canonical', href: 'https://alexandria.ifftu.dev/privacy' },
  ],
})
</script>

<template>
  <div class="pad privacy">
    <p class="eyebrow">Data policy</p>
    <h1>Privacy</h1>
    <p class="lede">
      Short version: we don't track you, and the only thing we ever ask for is an email address
      you choose to give us. Long version: read on.
    </p>

    <div class="prose">
      <h2>The early-access list</h2>
      <p>
        If you enter your email address to ask for early access, we store two things: the address
        itself, and which platform your browser reported so we know which build you are waiting for.
        That is the only personal data this site ever collects, and only because you typed it in.
      </p>
      <ul>
        <li>Used for one thing: telling you when an alpha build is ready for your platform.</li>
        <li>Never sold, never shared, never used to advertise to you.</li>
        <li>Held by <a href="https://www.useplunk.com/legal/privacy" target="_blank" rel="noopener noreferrer">Plunk</a>, the open-source mailing service we use to send the invitations. Nobody else receives it.</li>
        <li>You get one confirmation email straight away, so you know the address registered. After that, nothing until there is a build.</li>
        <li>Email <a href="mailto:admin@ifftu.dev">admin@ifftu.dev</a> and we delete it. No account to close, no form to find.</li>
      </ul>

      <h2>What we collect otherwise</h2>
      <p>
        This site uses
        <a href="https://plausible.io/privacy-focused-web-analytics" target="_blank" rel="noopener noreferrer">Plausible Analytics</a>,
        a privacy-friendly, cookieless tool. We collect aggregate pageview counts, referrer URLs,
        country (derived from your IP, then discarded), browser name, and OS name.
      </p>

      <h2>What we don't collect</h2>
      <ul>
        <li>No cookies.</li>
        <li>No personal identifiers in analytics — the early-access list above is separate, and never joined to it.</li>
        <li>No cross-site tracking.</li>
        <li>No fingerprinting.</li>
        <li>No data sold or shared with third parties.</li>
        <li>No profile of you, anywhere.</li>
      </ul>

      <h2>Why we collect anything</h2>
      <p>
        We want to know which platforms people are waiting on, which pages land, and which nav items
        get clicked — so we spend our time improving the parts that actually get used, and build for
        the platforms people actually asked for.
      </p>

      <h2>The app itself</h2>
      <p>
        The Alexandria desktop and mobile app is a separate story — it works offline, runs on your
        device, and syncs directly between your devices. No servers see your activity. This policy
        only covers <code>alexandria.ifftu.dev</code>, the marketing website.
      </p>

      <h2>Third parties</h2>
      <p>
        Plausible hosts analytics for us in the EU. Their
        <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer">data policy</a>
        explains exactly what they do and don't store. We don't use Google Analytics, Facebook Pixel,
        or any other profile-building tool. Fonts are self-hosted from this domain, so no font request
        ever reaches a third party.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests about data? Email
        <a href="mailto:admin@ifftu.dev">admin@ifftu.dev</a>.
      </p>
    </div>
  </div>
</template>

<style scoped>
.privacy { padding-block: clamp(56px, 8vw, 88px); }
.privacy h1 { font-size: clamp(34px, 5vw, 48px); line-height: 1.06; letter-spacing: -0.035em; font-weight: 700; margin: 0; }
.lede { font-size: 17.5px; color: rgb(var(--color-muted-foreground)); margin: 16px 0 8px; max-width: 52ch; }
</style>
