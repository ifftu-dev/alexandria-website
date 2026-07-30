<script setup lang="ts">
/**
 * Skill-mapped curriculum — the institutions hero device.
 *
 * Pick a module, see which skills it develops, at which Bloom level, and how
 * far the cohort has got. This is the institution page's central claim made
 * concrete. Sample data — institution features are not implemented yet.
 */
const LEVELS = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'] as const

interface Module {
  code: string
  title: string
  note: string
  skills: { skill: string, level: number, coverage: number }[]
}

const MODULES: Module[] = [
  {
    code: 'M1',
    title: 'Safety and setup',
    note: 'Prerequisite for every practical module. Assessed by checklist, on device.',
    skills: [
      { skill: 'safety.rigging', level: 2, coverage: 72 },
      { skill: 'welding.safety', level: 3, coverage: 88 },
    ],
  },
  {
    code: 'M3',
    title: 'Root pass technique',
    note: 'First module where a credential is issued automatically on passing.',
    skills: [
      { skill: 'welding.pipe.6g', level: 1, coverage: 45 },
      { skill: 'metallurgy.basics', level: 2, coverage: 68 },
    ],
  },
  {
    code: 'M7',
    title: '6G position welding',
    note: 'The Bloom level steps up here — students apply under position constraints.',
    skills: [
      { skill: 'welding.pipe.6g', level: 2, coverage: 82 },
      { skill: 'inspection.ndt', level: 1, coverage: 40 },
    ],
  },
  {
    code: 'M9',
    title: 'Defect identification',
    note: 'Analytical work. Feeds the skill-gap report for the whole cohort.',
    skills: [
      { skill: 'inspection.ndt', level: 3, coverage: 76 },
      { skill: 'metallurgy.basics', level: 3, coverage: 70 },
    ],
  },
  {
    code: 'M12',
    title: 'Capstone assessment',
    note: 'Issues the portfolio credential employers can verify independently.',
    skills: [
      { skill: 'welding.pipe.6g', level: 3, coverage: 94 },
      { skill: 'inspection.ndt', level: 2, coverage: 64 },
      { skill: 'welding.safety', level: 3, coverage: 90 },
    ],
  },
]

const active = ref(0)
const painted = ref(false)
const current = computed(() => MODULES[active.value]!)

function select(index: number) {
  active.value = index
  painted.value = false
  nextTick(() => { painted.value = true })
}

onMounted(() => { painted.value = true })
</script>

<template>
  <div class="panel">
    <div class="panel-top">
      <span class="dot" />
      <b>Skill-mapped curriculum</b>
      <span class="mono">WELD-201</span>
    </div>

    <div class="map">
      <div class="modules">
        <button
          v-for="(module, i) in MODULES"
          :key="module.code"
          type="button"
          class="mod"
          :class="{ on: active === i }"
          :aria-pressed="active === i"
          @click="select(i)"
        >
          <span class="n mono">{{ module.code }}</span>
          <span class="t">{{ module.title }}</span>
        </button>
      </div>

      <div class="detail">
        <p class="lbl">Skills this module develops</p>
        <div v-for="entry in current.skills" :key="entry.skill" class="skill">
          <div class="row">
            <code>{{ entry.skill }}</code>
            <span class="lv">{{ LEVELS[entry.level] }}</span>
          </div>
          <div class="bar"><i :style="{ width: painted ? `${entry.coverage}%` : '0%' }" /></div>
        </div>
        <p class="note">{{ current.note }}</p>
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
  color: rgb(var(--color-foreground));
}
.panel-top {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 14px;
  border-bottom: 1px solid rgb(var(--color-border));
  background: rgb(var(--color-muted));
}
.panel-top b { font-size: 12.5px; font-weight: 700; letter-spacing: -0.01em; }
.panel-top .mono { margin-inline-start: auto; font-size: 10.5px; color: rgb(var(--color-muted-foreground)); }
.dot { width: 7px; height: 7px; border-radius: 50%; background: rgb(var(--color-primary)); display: block; }

.map { display: grid; }
@container (min-width: 460px) { .map { grid-template-columns: 1fr 1fr; } }

.modules { border-bottom: 1px solid rgb(var(--color-border)); }
@container (min-width: 460px) {
  .modules { border-bottom: none; border-inline-end: 1px solid rgb(var(--color-border)); }
}
.mod {
  display: flex; align-items: center; gap: 9px; width: 100%; padding: 10px 14px; border: none;
  background: transparent; cursor: pointer; font-family: inherit; text-align: start;
  color: rgb(var(--color-foreground)); border-bottom: 1px solid rgb(var(--color-border));
  transition: background 150ms;
}
.mod:last-child { border-bottom: none; }
.mod:hover { background: rgb(var(--color-muted)); }
.mod.on { background: rgb(var(--color-primary) / 0.1); }
.mod .n { font-size: 10.5px; color: rgb(var(--color-muted-foreground)); flex: none; }
.mod .t { font-size: 12.5px; font-weight: 600; }
.mod.on .t { color: rgb(var(--color-primary)); }

.detail { padding: 14px; }
.lbl {
  font-size: 11px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase;
  color: rgb(var(--color-muted-foreground)); margin: 0 0 10px;
}
.skill { margin-bottom: 11px; }
.skill .row { display: flex; align-items: baseline; gap: 8px; }
.skill code { font-family: var(--font-mono); font-size: 11.5px; }
.lv {
  margin-inline-start: auto; font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  padding: 2px 6px; border-radius: 4px;
  background: rgb(var(--color-primary) / 0.14); color: rgb(var(--color-primary));
}
.bar { height: 4px; border-radius: 99px; background: rgb(var(--color-border)); margin-top: 5px; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: rgb(var(--color-primary)); transition: width 500ms cubic-bezier(0.22, 1, 0.36, 1); }
.note {
  font-size: 11.5px; color: rgb(var(--color-muted-foreground));
  padding-top: 11px; border-top: 1px solid rgb(var(--color-border)); margin: 0;
}
</style>
