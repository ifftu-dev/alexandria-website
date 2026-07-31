<script setup lang="ts">
/**
 * A single post.
 *
 * The body is set in the display serif rather than the UI sans — see
 * `.article` in main.css. Long-form is what Newsreader is for, and the site
 * already carries it for headings, so it costs nothing extra to read an essay
 * in the face the rest of the page is titled in.
 */
definePageMeta({ layout: 'landing' })

const route = useRoute()
const post = usePost(String(route.params.slug))

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

// Wrap tables so a wide one scrolls inside the column instead of the page.
const html = post ? post.html.replace(/<table>/g, '<div class="art-tablewrap"><table>').replace(/<\/table>/g, '</table></div>') : ''

const url = `https://alexandria.ifftu.dev/blog/${post.slug}`

useHead({
  title: `${post.title} — Alexandria`,
  meta: [
    { name: 'description', content: post.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: post.title },
    { property: 'og:description', content: post.description },
    { property: 'og:url', content: url },
    { property: 'article:published_time', content: post.date },
    { property: 'article:author', content: post.author },
    { name: 'twitter:title', content: post.title },
    { name: 'twitter:description', content: post.description },
  ],
  link: [{ rel: 'canonical', href: url }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.description,
        'datePublished': post.date,
        'author': { '@type': 'Person', 'name': post.author },
        'publisher': { '@type': 'Organization', 'name': 'Alexandria' },
        'mainEntityOfPage': url,
      }),
    },
  ],
})
</script>

<template>
  <div v-if="post" class="page-accent">
    <article>
      <header class="section pad art-head">
        <p class="eyebrow">
          {{ post.kind }} · {{ formatDate(post.date) }}<template v-if="post.readingTime"> · {{ post.readingTime }}</template>
        </p>
        <h1>{{ post.title }}</h1>
        <p v-if="post.standfirst" class="art-stand">{{ post.standfirst }}</p>
        <p v-if="post.author" class="art-by">By {{ post.author }}</p>
      </header>

      <!-- eslint-disable-next-line vue/no-v-html -- rendered at build time from
           our own markdown; markdown-it runs with html:false so a post cannot
           inject markup even if one were ever authored by someone else. -->
      <div class="pad article" v-html="html" />

      <footer class="pad art-foot">
        <NuxtLink to="/blog" class="chev">All posts <i>‹</i></NuxtLink>
        <button type="button" class="btn plausible-event-name=EarlyAccess" @click="useWaitlist().open()">
          Join the waiting list
        </button>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.art-head { max-width: 80ch; padding-bottom: 0; }
.art-head h1 {
  font-family: var(--font-display);
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 300;
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0;
  max-width: 20ch;
}
/* The standfirst is the post's argument in one line, so it takes the brand
   colour rather than the muted grey the rest of the metadata uses — it is the
   thing a reader should carry away if they read nothing else. */
.art-stand {
  font-family: var(--font-display);
  font-size: clamp(19px, 2.4vw, 24px);
  font-style: italic;
  font-weight: 300;
  line-height: 1.45;
  color: rgb(var(--color-primary));
  margin: 20px 0 0;
  max-width: 44ch;
}
.art-by {
  margin: 22px 0 0;
  font-size: 14px;
  color: rgb(var(--color-muted-foreground));
}

.art-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 80ch;
  margin-inline: auto;
  padding-block: clamp(40px, 6vw, 64px);
  border-top: 1px solid rgb(var(--color-border));
}
.art-foot a { font-size: 14px; font-weight: 600; color: rgb(var(--color-primary)); }
.art-foot i { font-style: normal; }
</style>
