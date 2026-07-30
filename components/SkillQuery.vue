<script setup lang="ts">
/**
 * Composite skill query — the recruiter hero device.
 *
 * Demonstrates the thing the recruiter page promises: search by verified
 * competency with a Bloom's level and a confidence threshold, and get back
 * a plain-language explanation of why each candidate matched and what gaps
 * remain. Sample data — recruiter features are not implemented yet.
 */
const LEVELS = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'] as const

const SKILLS = [
  'welding.pipe.6g',
  'metallurgy.basics',
  'inspection.ndt',
  'welding.tig',
  'safety.rigging',
] as const

interface Candidate {
  id: string
  name: string
  creds: number
  skills: Record<string, [level: number, confidence: number]>
}

const CANDIDATES: Candidate[] = [
  { id: 'AN', name: 'A. Nakamura', creds: 6, skills: { 'welding.pipe.6g': [2, 0.92], 'inspection.ndt': [1, 0.71], 'safety.rigging': [2, 0.80] } },
  { id: 'PS', name: 'P. Sharma', creds: 9, skills: { 'welding.pipe.6g': [3, 0.88], 'metallurgy.basics': [2, 0.95], 'welding.tig': [1, 0.66] } },
  { id: 'JO', name: 'J. Okoro', creds: 7, skills: { 'welding.tig': [5, 0.90], 'welding.pipe.6g': [2, 0.80], 'safety.rigging': [3, 0.86] } },
  { id: 'MS', name: 'M. Silva', creds: 4, skills: { 'metallurgy.basics': [2, 0.84], 'safety.rigging': [2, 0.90] } },
  { id: 'LC', name: 'L. Chen', creds: 8, skills: { 'inspection.ndt': [3, 0.93], 'welding.pipe.6g': [1, 0.60], 'metallurgy.basics': [3, 0.78] } },
]

const LEVEL_CHOICES = [
  { value: 1, label: 'Understand' },
  { value: 2, label: 'Apply' },
  { value: 3, label: 'Analyse' },
  { value: 5, label: 'Create' },
]

const selected = ref<string[]>(['welding.pipe.6g'])
const minLevel = ref(2)
const confidence = ref(75)

const minConfidence = computed(() => confidence.value / 100)

function toggle(skill: string) {
  const i = selected.value.indexOf(skill)
  if (i > -1) selected.value.splice(i, 1)
  else selected.value.push(skill)
}

const matches = computed(() => {
  if (!selected.value.length) return []

  const rows = CANDIDATES.map((candidate) => {
    const hits: { skill: string, level: number, confidence: number }[] = []
    const gaps: { skill: string, level: number | null, confidence: number | null }[] = []

    for (const skill of selected.value) {
      const held = candidate.skills[skill]
      if (held && held[0] >= minLevel.value && held[1] >= minConfidence.value)
        hits.push({ skill, level: held[0], confidence: held[1] })
      else if (held)
        gaps.push({ skill, level: held[0], confidence: held[1] })
      else
        gaps.push({ skill, level: null, confidence: null })
    }

    return { candidate, hits, gaps }
  }).filter(row => row.hits.length > 0)

  rows.sort((a, b) => b.hits.length - a.hits.length || b.candidate.creds - a.candidate.creds)
  return rows
})
</script>

<template>
  <div class="panel">
    <div class="panel-top">
      <span class="dot" />
      <b>Composite skill query</b>
      <span class="mono">SAMPLE DATA</span>
    </div>

    <div class="panel-body">
      <p class="lbl">Required skills</p>
      <div class="chips">
        <button
          v-for="skill in SKILLS"
          :key="skill"
          type="button"
          class="chip"
          :class="{ on: selected.includes(skill) }"
          :aria-pressed="selected.includes(skill)"
          @click="toggle(skill)"
        >
          {{ skill }}
        </button>
      </div>

      <div class="controls">
        <div>
          <p class="lbl">Minimum Bloom level</p>
          <div class="seg">
            <button
              v-for="choice in LEVEL_CHOICES"
              :key="choice.value"
              type="button"
              :class="{ on: minLevel === choice.value }"
              @click="minLevel = choice.value"
            >
              {{ choice.label }}
            </button>
          </div>
        </div>
        <div>
          <p class="lbl">Confidence threshold</p>
          <div class="range">
            <input v-model.number="confidence" type="range" min="50" max="95" step="5" aria-label="Confidence threshold">
            <output class="mono">{{ minConfidence.toFixed(2) }}</output>
          </div>
        </div>
      </div>

      <div class="count">
        <b>{{ matches.length }}</b>
        <span>{{ matches.length === 1 ? 'candidate matches' : 'candidates match' }}</span>
      </div>

      <p v-if="!selected.length" class="empty">Pick at least one required skill.</p>
      <p v-else-if="!matches.length" class="empty">Nobody clears that bar. Lower the level or the confidence threshold.</p>

      <div v-for="row in matches" :key="row.candidate.id" class="cand">
        <span class="av">{{ row.candidate.id }}</span>
        <span class="cand-body">
          <span class="nm">{{ row.candidate.name }}</span>
          <span class="why">
            Matched
            <template v-for="(hit, i) in row.hits" :key="hit.skill">
              <template v-if="i > 0"> · </template>{{ hit.skill }} at <em>{{ LEVELS[hit.level] }}</em> ({{ hit.confidence.toFixed(2) }})
            </template>
          </span>
          <span v-if="row.gaps.length" class="gap">
            Gap:
            <template v-for="(gap, i) in row.gaps" :key="gap.skill">
              <template v-if="i > 0"> · </template>
              <template v-if="gap.level === null">{{ gap.skill }} — no credential</template>
              <template v-else>{{ gap.skill }} only at {{ LEVELS[gap.level] }} ({{ gap.confidence!.toFixed(2) }})</template>
            </template>
          </span>
        </span>
        <span class="cr">
          <b class="mono">{{ row.candidate.creds }}</b>
          <span>creds</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  background: rgb(var(--color-card));
  border: 1px solid rgb(var(--color-border));
  border-radius: 14px;
  box-shadow: var(--shadow-hero);
  overflow: hidden;
  container-type: inline-size;
}
.panel-top {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 14px;
  border-bottom: 1px solid rgb(var(--color-border));
  background: rgb(var(--color-muted));
  color: rgb(var(--color-foreground));
}
.panel-top b { font-size: 12.5px; font-weight: 700; letter-spacing: -0.01em; }
.panel-top .mono { margin-inline-start: auto; font-size: 10.5px; color: rgb(var(--color-muted-foreground)); }
.dot { width: 7px; height: 7px; border-radius: 50%; background: rgb(var(--color-primary)); display: block; }
.panel-body { padding: 16px; color: rgb(var(--color-foreground)); }

.lbl {
  font-size: 11px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase;
  color: rgb(var(--color-muted-foreground)); margin: 0 0 8px;
}
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.chip {
  font-family: var(--font-mono); font-size: 11.5px; padding: 5px 11px; border-radius: 999px; cursor: pointer;
  /* These are the primary controls of the recruiter demo and get tapped, not
     clicked, on the widths where this page is read most. */
  display: inline-flex; align-items: center; min-height: 40px;
  border: 1px solid rgb(var(--color-border)); background: transparent; color: rgb(var(--color-muted-foreground));
  transition: border-color 150ms, color 150ms, background 150ms;
}
.chip:hover { border-color: rgb(var(--color-primary) / 0.5); color: rgb(var(--color-foreground)); }
.chip.on {
  background: rgb(var(--color-primary) / 0.13);
  border-color: rgb(var(--color-primary) / 0.45);
  color: rgb(var(--color-primary));
  font-weight: 600;
}

.controls { display: grid; gap: 14px; margin-bottom: 16px; }
@container (min-width: 420px) { .controls { grid-template-columns: 1fr 1fr; } }
.seg { display: flex; border: 1px solid rgb(var(--color-border)); border-radius: 8px; overflow: hidden; }
.seg button {
  flex: 1; font-family: inherit; font-size: 11.5px; font-weight: 600; padding: 7px 4px; border: none;
  min-height: 40px;
  background: transparent; color: rgb(var(--color-muted-foreground)); cursor: pointer;
  transition: background 150ms, color 150ms;
}
.seg button + button { border-inline-start: 1px solid rgb(var(--color-border)); }
.seg button.on { background: rgb(var(--color-primary)); color: rgb(var(--color-primary-foreground)); }
.range { display: flex; align-items: center; gap: 10px; }
.range input { flex: 1; accent-color: rgb(var(--color-primary)); }
.range output { font-size: 12px; font-weight: 600; min-width: 3.2ch; }

.count {
  display: flex; align-items: baseline; gap: 8px;
  padding-top: 14px; border-top: 1px solid rgb(var(--color-border)); margin-bottom: 12px;
}
.count b { font-size: 22px; font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; color: rgb(var(--color-primary)); }
.count span { font-size: 12.5px; color: rgb(var(--color-muted-foreground)); }
.empty { padding: 20px 0; font-size: 13px; color: rgb(var(--color-muted-foreground)); text-align: center; margin: 0; }

.cand { display: flex; gap: 11px; padding: 11px 0; border-top: 1px solid rgb(var(--color-border)); }
.cand:first-of-type { border-top: none; }
.av {
  width: 32px; height: 32px; border-radius: 8px; flex: none; display: grid; place-items: center;
  font-size: 11.5px; font-weight: 700;
  background: rgb(var(--color-primary) / 0.14); color: rgb(var(--color-primary));
}
.cand-body { min-width: 0; }
.nm { display: block; font-size: 13.5px; font-weight: 600; letter-spacing: -0.01em; }
.why { display: block; font-size: 11.5px; color: rgb(var(--color-muted-foreground)); margin-top: 2px; line-height: 1.45; }
.why em { font-style: normal; color: rgb(var(--color-primary)); font-weight: 600; font-family: var(--font-mono); }
.gap { display: block; font-size: 11px; color: rgb(var(--color-warn)); margin-top: 3px; line-height: 1.45; }
.cr { margin-inline-start: auto; text-align: end; flex: none; }
.cr b { display: block; font-size: 12.5px; font-weight: 700; }
.cr span { font-size: 10px; color: rgb(var(--color-muted-foreground)); text-transform: uppercase; letter-spacing: 0.07em; }
</style>
