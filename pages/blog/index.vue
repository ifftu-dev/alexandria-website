<script setup lang="ts">
definePageMeta({ layout: 'landing' })

const posts = usePosts()

useHead({
  title: 'Blog — Alexandria',
  meta: [
    { name: 'description', content: 'Announcements, progress and essays from the people building Alexandria — what we are doing, what has changed, and what we got wrong.' },
    { property: 'og:title', content: 'Blog — Alexandria' },
    { property: 'og:description', content: 'Announcements, progress and essays from the people building Alexandria.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/blog' },
    { name: 'twitter:title', content: 'Blog — Alexandria' },
    { name: 'twitter:description', content: 'Announcements, progress and essays from the people building Alexandria.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/blog' }],
})
</script>

<template>
  <div class="page-accent">
    <section class="hero hero-page">
      <MeshGradient :blobs="['79,70,229', '99,102,241', '129,140,248', '34,211,238', '79,70,229']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Blog</p>
        <h1>Building in the open.</h1>
        <p class="hero-lede">
          Announcements, progress and essays from the people making Alexandria. This is
          where we say what we are doing, what has changed, and what we got wrong —
          before anyone has to ask.
        </p>
      </div>
    </section>

    <section class="section pad">
      <ol class="bl-list">
        <li v-for="post in posts" :key="post.slug">
          <NuxtLink :to="`/blog/${post.slug}`">
            <p class="bl-meta">
              {{ post.kind }} · {{ formatDate(post.date) }}<template v-if="post.readingTime"> · {{ post.readingTime }}</template>
            </p>
            <h2>{{ post.title }}</h2>
            <p class="bl-stand">{{ post.standfirst }}</p>
            <span class="bl-more">Read it <i>›</i></span>
          </NuxtLink>
        </li>
      </ol>
      <p v-if="!posts.length" class="p-sub">Nothing published yet.</p>
    </section>
  </div>
</template>

<style scoped>
.bl-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 1px; background: rgb(var(--color-border)); border: 1px solid rgb(var(--color-border)); border-radius: 14px; overflow: hidden; }
.bl-list a {
  display: block;
  background: rgb(var(--color-card));
  padding: 26px 24px;
  text-decoration: none;
  color: inherit;
  transition: background 150ms ease;
}
.bl-list a:hover { background: rgb(var(--color-muted)); }
.bl-meta { margin: 0 0 10px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: rgb(var(--color-muted-foreground)); }
.bl-list h2 { font-family: var(--font-display); font-size: clamp(23px, 3vw, 30px); font-weight: 300; letter-spacing: -0.015em; line-height: 1.15; margin: 0; max-width: 24ch; }
/* Same line as the article standfirst, so it takes the same colour — a reader
   arriving from the index should recognise it. */
.bl-stand { margin: 12px 0 0; font-family: var(--font-display); font-style: italic; font-size: 16.5px; line-height: 1.6; color: rgb(var(--color-primary)); max-width: 62ch; }
.bl-more { display: inline-block; margin-top: 16px; font-size: 13.5px; font-weight: 600; color: rgb(var(--color-primary)); }
.bl-more i { font-style: normal; }
</style>
