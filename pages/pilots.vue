<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Run a pilot — Alexandria',
  meta: [
    { name: 'description', content: 'Pilot Alexandria with one program or one role family. Defined scope, 8–12 weeks, agreed success measures, and an honest account of what is and is not built yet.' },
    { property: 'og:title', content: 'Run a pilot — Alexandria' },
    { property: 'og:description', content: 'Pilot Alexandria with one program or one role family. Defined scope and agreed success measures.' },
    { property: 'og:url', content: 'https://alexandria.ifftu.dev/pilots' },
    { property: 'og:image', content: 'https://alexandria.ifftu.dev/og/pilots.jpg' },
    { property: 'og:image:alt', content: 'Pilots — small, real, and measured.' },
    { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og/pilots.jpg' },
    { name: 'twitter:image:alt', content: 'Pilots — small, real, and measured.' },
    { name: 'twitter:title', content: 'Run a pilot — Alexandria' },
    { name: 'twitter:description', content: 'Pilot Alexandria with one program or one role family.' },
  ],
  link: [{ rel: 'canonical', href: 'https://alexandria.ifftu.dev/pilots' }],
})

const route = useRoute()
const audience = ref<'institution' | 'employer'>(route.query.for === 'employer' ? 'employer' : 'institution')

const SHAPES = {
  institution: {
    scope: 'One program, one credential pathway, 50–250 learners',
    length: '8–12 weeks',
    inputs: 'A course or module you already teach, an assessment you already trust, and someone who can answer questions about how it is run.',
    outputs: 'Learners holding credentials they can prove independently, a skill map of what your curriculum actually develops, and a written evaluation.',
    measures: ['Activation and completion', 'Assessment integrity', 'Credentials issued and independently verified', 'Offline usage', 'Administrator effort'],
  },
  employer: {
    scope: 'One role family or skills framework, a defined candidate or employee cohort',
    length: '6–10 weeks',
    inputs: 'A live requisition or an internal-mobility decision, and the people who normally screen for it.',
    outputs: 'Credentials verified inside your existing process, and evidence of whether verified proof changed the decision or the time it took.',
    measures: ['Verification completion rate', 'Review time per candidate', 'False-claim detection', 'Candidate consent rate', 'Integration effort'],
  },
} as const

const shape = computed(() => SHAPES[audience.value])
</script>

<template>
  <div class="page-institution">
    <section class="hero hero-page">
      <MeshGradient :blobs="['37,99,235', '129,140,248', '96,165,250', '34,211,238', '79,70,229']" />
      <div class="hero-scrim" />
      <div class="pad hero-inner hero-centered">
        <p class="eyebrow hero-eyebrow">Pilots</p>
        <h1>Small, real, and measured.</h1>
        <p class="hero-lede">
          One program or one role family, with success measures agreed before we start. We would
          rather run a narrow pilot that produces evidence than a wide one that produces enthusiasm.
        </p>
      </div>
    </section>

    <section class="section pad">
      <div class="pi-toggle" role="group" aria-label="Pilot type">
        <button type="button" :class="{ on: audience === 'institution' }" :aria-pressed="audience === 'institution'" @click="audience = 'institution'">
          For an institution
        </button>
        <button type="button" :class="{ on: audience === 'employer' }" :aria-pressed="audience === 'employer'" @click="audience = 'employer'">
          For an employer
        </button>
      </div>

      <div class="pi-grid">
        <div class="pi-card">
          <h2 class="h-sec">What a pilot looks like</h2>
          <dl class="pi-facts">
            <dt>Scope</dt><dd>{{ shape.scope }}</dd>
            <dt>Length</dt><dd>{{ shape.length }}</dd>
            <dt>You bring</dt><dd>{{ shape.inputs }}</dd>
            <dt>You leave with</dt><dd>{{ shape.outputs }}</dd>
          </dl>
          <h3 class="pi-h3">Measured on</h3>
          <ul class="pi-list">
            <li v-for="m in shape.measures" :key="m">{{ m }}</li>
          </ul>
          <p class="pi-note">
            These figures are starting points, not commitments — they move to fit the program.
            <StatusChip state="planned" label="Pilot program forming" />
          </p>
        </div>

        <div>
          <h2 class="h-sec">Start the conversation</h2>
          <p class="p-sub">
            This reaches a person directly. If a pilot does not make sense for you yet, we will say
            so — an unhappy pilot helps neither of us.
          </p>
          <EnquiryForm :audience="audience" />
        </div>
      </div>
    </section>

    <section class="section pad section-wash">
      <h2 class="h-sec">Before you ask</h2>
      <div class="pi-honest">
        <p>
          Alexandria is an alpha. The interface needs design work, there is no content moderation
          yet, and nobody outside the project is running it in production. A pilot is genuinely a
          pilot: you would be among the first, with the access to us that implies and the roughness
          that comes with it.
        </p>
        <p>
          What is solid is the part that matters for a pilot — learners hold their own credentials,
          those credentials verify without us, and assessment integrity is computed on the device
          rather than by watching people through a server.
          <NuxtLink to="/trust">What we can and cannot claim today</NuxtLink> is written down.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.h-sec { margin-bottom: 14px; }
.pi-h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: rgb(var(--color-muted-foreground)); margin: 20px 0 8px; }
.p-sub { max-width: 56ch; }

.pi-toggle { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid rgb(var(--color-border)); border-radius: 999px; margin-bottom: 26px; }
.pi-toggle button {
  font-family: inherit; font-size: 13.5px; font-weight: 600; padding: 9px 16px; min-height: 40px;
  border: 0; border-radius: 999px; background: transparent; color: rgb(var(--color-muted-foreground)); cursor: pointer;
}
.pi-toggle button.on { background: rgb(var(--color-primary)); color: rgb(var(--color-primary-foreground)); }

.pi-grid { display: grid; gap: 28px; }
@media (min-width: 940px) { .pi-grid { grid-template-columns: 1fr 1fr; gap: 40px; } }

.pi-card { border: 1px solid rgb(var(--color-border)); border-radius: 14px; padding: 20px; background: rgb(var(--color-card)); }
.pi-facts { display: grid; gap: 10px; margin: 14px 0 0; }
@media (min-width: 560px) { .pi-facts { grid-template-columns: max-content 1fr; gap: 10px 20px; } }
.pi-facts dt { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: rgb(var(--color-muted-foreground)); }
.pi-facts dd { margin: 0; font-size: 14px; line-height: 1.6; }
.pi-list { list-style: revert; margin: 0; padding-inline-start: 18px; display: grid; gap: 6px; font-size: 14px; line-height: 1.55; color: rgb(var(--color-muted-foreground)); }
.pi-note { margin: 18px 0 0; font-size: 12.5px; line-height: 1.6; color: rgb(var(--color-muted-foreground)); display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }

.pi-honest { max-width: 70ch; display: grid; gap: 14px; }
.pi-honest p { margin: 0; font-size: 15px; line-height: 1.7; color: rgb(var(--color-muted-foreground)); }
.pi-honest a { color: rgb(var(--color-primary)); }
</style>
