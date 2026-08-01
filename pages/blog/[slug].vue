<script setup lang="ts">
/**
 * A single post.
 *
 * The body is set in the display serif rather than the UI sans — see
 * `.article` in main.css. Long-form is what Newsreader is for, and the site
 * already carries it for headings, so it costs nothing extra to read an essay
 * in the face the rest of the page is titled in.
 *
 * Three things here exist because the posts run long: a progress line, so a
 * reader can see how much is left; a contents rail, so the shape is visible
 * before committing to it; and a header with room to breathe.
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

const body = ref<HTMLElement | null>(null)
const progress = ref(0)
const activeHeading = ref('')

function onScroll() {
  const el = body.value
  if (!el) return

  // Full when the end of the body reaches the bottom of the viewport, not when
  // the document does — otherwise the footer keeps the bar short of 100%.
  const start = el.offsetTop
  const span = Math.max(1, el.offsetHeight - window.innerHeight * 0.5)
  progress.value = Math.min(100, Math.max(0, ((window.scrollY - start) / span) * 100))

  // Whichever heading was passed most recently is the one the reader is under.
  let current = ''
  for (const h of post!.headings) {
    const node = document.getElementById(h.id)
    if (node && node.getBoundingClientRect().top < 140) current = h.id
  }
  activeHeading.value = current
}

/** True where the contents rail has its own column. Starts true so the server
 *  renders the list open and it is present without JavaScript. */
const wide = ref(true)
let mq: MediaQueryList | null = null
const syncWide = () => { wide.value = mq?.matches ?? true }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  mq = window.matchMedia('(min-width: 1140px)')
  syncWide()
  mq.addEventListener('change', syncWide)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  mq?.removeEventListener('change', syncWide)
})

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
    <div class="art-progress" aria-hidden="true">
      <i :style="{ width: `${progress}%` }" />
    </div>

    <article>
      <header class="pad art-head">
        <NuxtLink to="/blog" class="plausible-event-name=Nav-Blog art-back">
          <span aria-hidden="true">‹</span> Blog
        </NuxtLink>

        <p class="art-kicker">
          <span class="art-kind">{{ post.kind }}</span>
          <span>{{ formatDate(post.date) }}</span>
          <span>{{ post.readingTime || `${post.minutes} min read` }}</span>
        </p>

        <h1>{{ post.title }}</h1>
        <p v-if="post.standfirst" class="art-stand">{{ post.standfirst }}</p>

        <div v-if="post.author" class="art-by">
          <span class="art-avatar" aria-hidden="true">{{ post.author.slice(0, 1) }}</span>
          <span>
            <b>{{ post.author }}</b>
            <i>Alexandria</i>
          </span>
        </div>
      </header>

      <div class="pad art-body">
        <!-- Beside the text on wide screens, above it and folded shut on narrow
             ones — nine headings ahead of the first paragraph is a table of
             contents standing in front of the article. A `details` rather than
             a toggle of our own so it still opens with no JavaScript. -->
        <details v-if="post.headings.length > 2" class="art-toc" :open="wide">
          <summary class="art-toc-h">Contents</summary>
          <ol>
            <li v-for="h in post.headings" :key="h.id">
              <a :href="`#${h.id}`" :class="{ on: activeHeading === h.id }">{{ h.text }}</a>
            </li>
          </ol>
        </details>

        <!-- eslint-disable-next-line vue/no-v-html -- rendered at build time from
             our own markdown; markdown-it runs with html:false so a post cannot
             inject markup even if one were ever authored by someone else. -->
        <div ref="body" class="article article-lead" v-html="html" />
      </div>

      <footer class="pad art-foot">
        <div class="art-foot-in">
          <p class="art-foot-t">Alexandria is free, open source, and filling its alpha in groups.</p>
          <div class="art-foot-cta">
            <button type="button" class="btn-gradient plausible-event-name=EarlyAccess" @click="useWaitlist().open()">
              Join the waiting list
            </button>
            <NuxtLink to="/blog" class="plausible-event-name=Nav-Blog art-foot-link">All posts</NuxtLink>
          </div>
        </div>
      </footer>
    </article>
  </div>
</template>

<style scoped>
/* A hairline of progress across the top. The cheapest honest answer to "how
   much of this is left", and it costs one transform-free width change. */
.art-progress {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 60;
  height: 2px;
  pointer-events: none;
}
.art-progress i {
  display: block;
  height: 100%;
  background: var(--grad-surface);
  transition: width 90ms linear;
}

.art-head {
  max-width: 80ch;
  padding-block: clamp(38px, 5vw, 60px) 0;
}
.art-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(var(--color-muted-foreground));
  text-decoration: none;
}
.art-back:hover { color: rgb(var(--color-primary)); }

.art-kicker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 26px 0 0;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(var(--color-muted-foreground));
}
.art-kind {
  padding: 4px 9px;
  border-radius: 999px;
  background: rgb(var(--color-primary) / 0.12);
  color: rgb(var(--color-primary));
}

.art-head h1 {
  font-family: var(--font-display);
  font-size: clamp(38px, 6vw, 68px);
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 20px 0 0;
  max-width: 18ch;
}
/* The standfirst is the post's argument in one line, so it takes the brand
   colour rather than the muted grey the rest of the metadata uses — it is the
   thing a reader should carry away if they read nothing else. */
.art-stand {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.6vw, 26px);
  font-style: italic;
  font-weight: 300;
  line-height: 1.4;
  color: rgb(var(--color-primary));
  margin: 22px 0 0;
  max-width: 42ch;
}

.art-by {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 30px 0 0;
}
.art-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--grad-surface);
  color: #fff;
  font-family: var(--font-display);
  font-size: 18px;
}
.art-by b { display: block; font-size: 14.5px; font-weight: 600; }
.art-by i { display: block; font-style: normal; font-size: 12.5px; color: rgb(var(--color-muted-foreground)); }

.art-body {
  display: grid;
  gap: 32px;
  max-width: 80ch;
  padding-top: clamp(34px, 4vw, 48px);
}
/* `.article` centres itself and pads its own top; inside the grid the column
   does both, so it would otherwise double the gap under the header. */
.art-body .article { margin-inline: 0; padding-top: 0; }
@media (min-width: 1140px) {
  .art-body {
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 56px;
    max-width: 1080px;
  }
}

.art-toc { align-self: start; }
@media (min-width: 1140px) {
  .art-toc { position: sticky; top: 104px; }
}
.art-toc-h {
  margin: 0 0 12px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(var(--color-muted-foreground));
  list-style: none; /* the disclosure triangle; ours is drawn below */
  cursor: default;
}
.art-toc-h::-webkit-details-marker { display: none; }
.art-toc ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.art-toc a {
  display: block;
  padding: 5px 0 5px 13px;
  border-inline-start: 2px solid rgb(var(--color-border));
  font-size: 13px;
  line-height: 1.45;
  color: rgb(var(--color-muted-foreground));
  text-decoration: none;
  transition: color 140ms ease, border-color 140ms ease;
}
.art-toc a:hover { color: rgb(var(--color-foreground)); }
.art-toc a.on {
  color: rgb(var(--color-primary));
  border-inline-start-color: rgb(var(--color-primary));
}
@media (max-width: 1139px) {
  .art-toc {
    border: 1px solid rgb(var(--color-border));
    border-radius: 14px;
    padding: 16px 20px;
    background: rgb(var(--color-card));
  }
  .art-toc ol { grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 2px 20px; padding-top: 6px; }
  .art-toc-h {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    cursor: pointer;
  }
  .art-toc-h::after {
    content: '';
    width: 7px;
    height: 7px;
    border-inline-end: 1.5px solid currentcolor;
    border-block-end: 1.5px solid currentcolor;
    transform: rotate(45deg) translate(-2px, -2px);
    transition: transform 160ms ease;
  }
  .art-toc[open] .art-toc-h { margin-bottom: 6px; }
  .art-toc[open] .art-toc-h::after { transform: rotate(225deg) translate(-1px, -1px); }
}

.art-foot { padding-block: clamp(44px, 6vw, 72px) clamp(56px, 8vw, 96px); }
.art-foot-in {
  max-width: 80ch;
  margin-inline: auto;
  padding-top: clamp(32px, 4vw, 46px);
  border-top: 1px solid rgb(var(--color-border));
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.art-foot-t {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(19px, 2.2vw, 23px);
  font-weight: 300;
  line-height: 1.35;
  max-width: 26ch;
}
.art-foot-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.art-foot-link { font-size: 14px; font-weight: 600; color: rgb(var(--color-primary)); }
</style>
