<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Partners and public programmes — Alexandria',
  meta: [
    { name: 'description', content: 'Offline-first learning, multilingual delivery and portable credentials for governments, workforce programmes, NGOs and foundations working where connectivity and recognition are hardest.' },
    { property: 'og:title', content: 'Partners and public programmes — Alexandria' },
    { property: 'og:description', content: 'Portable learning infrastructure for programmes working where access is hardest.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/partners' },
    { name: 'twitter:title', content: 'Partners and public programmes — Alexandria' },
    { name: 'twitter:description', content: 'Portable learning infrastructure where access is hardest.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/partners' }],
})

const fits = [
  { title: 'Where connectivity is intermittent', body: 'Courses download and assessments run on the device. A learner who is offline for a week loses nothing, and syncs when they can.', state: 'alpha' as const },
  { title: 'Where recognition does not travel', body: 'A credential signed under the learner’s own key is checkable by an employer in another country, another system, or ten years later.', state: 'alpha' as const },
  { title: 'Where the language is not English', body: 'Nine languages today, including Hindi, Bengali, Telugu, Marathi and Urdu. Adding one is translation work, not engineering work.', state: 'alpha' as const },
  { title: 'Where the programme must outlive the vendor', body: 'The core is MIT-licensed and self-hostable. If we disappear, the deployment and every credential it issued keep working.', state: 'alpha' as const },
]
</script>

<template>
  <div class="page-accent">
    <section class="hero hero-page">
      <MeshGradient :blobs="['251,191,36', '244,114,182', '79,70,229', '34,211,238', '16,185,129']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Partners</p>
        <h1>Where access is hardest.</h1>
        <p class="hero-lede">
          Offline-first learning, multilingual delivery, and credentials that keep their meaning
          outside the programme that issued them.
        </p>
        <div class="hero-cta">
          <a href="#enquiry" class="btn btn-lg">Discuss a deployment</a>
          <a href="https://www.ifftu.dev/blog/introducing-alexandria/" target="_blank" rel="noopener noreferrer" class="plausible-event-name=Announcement btn-ghost">Read the project brief</a>
        </div>
      </div>
    </section>

    <section class="section pad">
      <h2 class="h-sec">Who this is for</h2>
      <p class="p-sub">
        Governments and public education bodies, workforce-development programmes, NGOs and
        foundations, universities running research pilots, connectivity and device partners, and
        credential or standards organisations.
      </p>
      <div class="pa-grid">
        <div v-for="f in fits" :key="f.title" class="pa-card">
          <div class="pa-head"><h3>{{ f.title }}</h3><StatusChip :state="f.state" /></div>
          <p>{{ f.body }}</p>
        </div>
      </div>
    </section>

    <section class="section pad section-wash">
      <h2 class="h-sec">How we would work</h2>
      <div class="pa-honest">
        <p>
          Grant and programme funding pays for deployment, localisation, measurement and support —
          not for learners' access to their own credentials. That distinction is the whole design,
          and it is not negotiable in a funded deployment either.
        </p>
        <p>
          Alexandria is pre-production. A partnership now means shaping what gets built and being
          candid in both directions about what is not ready. If a programme needs certainty this
          year, we will say so.
          <NuxtLink to="/trust">What we can claim today</NuxtLink> is written down and dated.
        </p>
      </div>
    </section>

    <section id="enquiry" class="pad section">
      <h2 class="h-sec">Discuss a deployment</h2>
      <p class="p-sub">Reaches a person. Tell us the population and the constraint you are working against.</p>
      <div class="pa-form"><EnquiryForm audience="partner" /></div>
    </section>
  </div>
</template>

<style scoped>
.h-sec { margin-bottom: 14px; }

.pa-grid { display: grid; gap: 16px; }
@media (min-width: 800px) { .pa-grid { grid-template-columns: 1fr 1fr; } }
.pa-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.pa-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.pa-head h3 { margin: 0; font-size: 15.5px; letter-spacing: -0.01em; }
.pa-card p { margin: 0; font-size: 14px; line-height: 1.65; color: rgb(var(--color-muted-foreground)); }
.pa-honest { max-width: 70ch; display: grid; gap: 14px; }
.pa-honest p { margin: 0; font-size: 15px; line-height: 1.7; color: rgb(var(--color-muted-foreground)); }
.pa-honest a { color: rgb(var(--color-primary)); }
.pa-form { max-width: 620px; }
</style>
