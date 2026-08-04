<script setup lang="ts">
definePageMeta({ layout: 'landing' })

const posts = usePosts()

/**
 * The newest post gets the whole width and the rest share a grid.
 *
 * With one post that is the difference between a list of length one — which
 * reads as an empty page with a row in it — and a page that looks intentional.
 * The treatment keeps working as posts accumulate, which is the point.
 */
const lead = computed(() => posts[0])
const rest = computed(() => posts.slice(1))

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
      <template v-if="lead">
        <p class="bl-rail">
          <span>Latest</span>
          <i aria-hidden="true" />
        </p>

        <NuxtLink :to="`/blog/${lead.slug}`" class="bl-lead">
          <div class="bl-lead-in">
            <p class="bl-meta">
              <span class="bl-kind">{{ lead.kind }}</span>
              <span>{{ formatDate(lead.date) }}</span>
              <span>{{ lead.readingTime || `${lead.minutes} min read` }}</span>
            </p>
            <h2>{{ lead.title }}</h2>
            <p class="bl-stand">{{ lead.standfirst }}</p>
            <div class="bl-lead-foot">
              <span v-if="lead.author" class="bl-by">
                <span class="bl-avatar" aria-hidden="true">{{ lead.author.slice(0, 1) }}</span>
                {{ lead.author }}
              </span>
              <span class="bl-more">Read it <i aria-hidden="true">›</i></span>
            </div>
          </div>
        </NuxtLink>
      </template>

      <template v-if="rest.length">
        <p class="bl-rail bl-rail-2">
          <span>Earlier</span>
          <i aria-hidden="true" />
        </p>

        <ol class="bl-grid">
          <li v-for="post in rest" :key="post.slug">
            <NuxtLink :to="`/blog/${post.slug}`">
              <p class="bl-meta">
                <span class="bl-kind">{{ post.kind }}</span>
                <span>{{ formatDate(post.date) }}</span>
              </p>
              <h3>{{ post.title }}</h3>
              <p class="bl-stand bl-stand-sm">{{ post.standfirst }}</p>
              <span class="bl-more">Read it <i aria-hidden="true">›</i></span>
            </NuxtLink>
          </li>
        </ol>
      </template>

      <!-- Written for the case where it will actually be read: someone arriving
           before there is anything here. -->
      <div v-if="!posts.length" class="bl-empty">
        <p>Nothing published yet.</p>
        <p class="p-sub">The first post goes up when there is something true to say.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* A label with a rule running off to the edge — enough structure to separate
   two groups without a heading that would compete with the post titles. */
.bl-rail {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 20px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgb(var(--color-muted-foreground));
}
.bl-rail i { flex: 1; height: 1px; background: rgb(var(--color-border)); }
.bl-rail-2 { margin-top: clamp(44px, 6vw, 68px); }

.bl-lead {
  display: block;
  position: relative;
  border-radius: 20px;
  padding: 1px; /* the gradient edge is the padding, the card sits inside it */
  background: linear-gradient(135deg, rgb(var(--color-primary) / 0.55), rgb(var(--color-border)) 42%, rgb(var(--color-border)));
  text-decoration: none;
  color: inherit;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.bl-lead-in {
  position: relative;
  border-radius: 19px;
  background: rgb(var(--color-card));
  padding: clamp(28px, 4vw, 44px);
  overflow: hidden;
}
/* A single soft wash in the corner, at low enough alpha that the standfirst
   keeps its contrast on top of it. */
.bl-lead-in::before {
  content: '';
  position: absolute;
  inset-inline-end: -80px;
  top: -110px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(var(--color-primary) / 0.14), transparent 68%);
  pointer-events: none;
}
.bl-lead:hover { transform: translateY(-2px); box-shadow: 0 22px 44px -22px rgb(10 12 30 / 0.34); }
@media (prefers-reduced-motion: reduce) { .bl-lead { transition: none; } .bl-lead:hover { transform: none; } }

.bl-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(var(--color-muted-foreground));
}
.bl-kind {
  padding: 4px 9px;
  border-radius: 999px;
  background: rgb(var(--color-primary) / 0.12);
  color: rgb(var(--color-primary));
}

.bl-lead h2 {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(30px, 4.6vw, 48px);
  font-weight: 300;
  letter-spacing: -0.022em;
  line-height: 1.06;
  margin: 0;
  max-width: 20ch;
}
/* Same line as the article standfirst, so it takes the same color — a reader
   arriving from the index should recognize it. */
.bl-stand {
  position: relative;
  margin: 16px 0 0;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(17px, 2vw, 20px);
  line-height: 1.55;
  color: rgb(var(--color-primary));
  max-width: 52ch;
}
.bl-stand-sm { font-size: 16px; margin-top: 12px; }

.bl-lead-foot {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: clamp(24px, 3vw, 34px);
  padding-top: 20px;
  border-top: 1px solid rgb(var(--color-border));
}
.bl-by { display: inline-flex; align-items: center; gap: 10px; font-size: 14px; }
.bl-avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--grad-surface);
  color: #fff;
  font-family: var(--font-display);
  font-size: 15px;
}

.bl-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.bl-grid a {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgb(var(--color-border));
  border-radius: 16px;
  background: rgb(var(--color-card));
  padding: 24px;
  text-decoration: none;
  color: inherit;
  transition: border-color 150ms ease, transform 200ms ease;
}
.bl-grid a:hover { border-color: rgb(var(--color-primary) / 0.4); transform: translateY(-2px); }
@media (prefers-reduced-motion: reduce) { .bl-grid a { transition: none; } .bl-grid a:hover { transform: none; } }
.bl-grid h3 {
  font-family: var(--font-display);
  font-size: clamp(21px, 2.6vw, 26px);
  font-weight: 300;
  letter-spacing: -0.015em;
  line-height: 1.14;
  margin: 0;
  max-width: 22ch;
}
.bl-grid .bl-more { margin-top: auto; padding-top: 20px; }

.bl-more { display: inline-block; font-size: 13.5px; font-weight: 600; color: rgb(var(--color-primary)); }
.bl-more i { font-style: normal; display: inline-block; transition: transform 160ms ease; }
.bl-lead:hover .bl-more i, .bl-grid a:hover .bl-more i { transform: translateX(3px); }
@media (prefers-reduced-motion: reduce) { .bl-more i { transition: none; } }

.bl-empty {
  border: 1px dashed rgb(var(--color-border));
  border-radius: 16px;
  padding: clamp(32px, 5vw, 56px);
  text-align: center;
}
.bl-empty p { margin: 0; font-family: var(--font-display); font-size: 22px; font-weight: 300; }
.bl-empty .p-sub { margin-top: 8px; font-size: 15px; }
</style>
