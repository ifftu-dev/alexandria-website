<script setup lang="ts">
/**
 * One label for how real a thing is, used everywhere a capability, price or
 * demo is described.
 *
 * The site's recurring failure was mixing shipped features, roadmap items and
 * sample data into single undifferentiated lists — a reader had no way to tell
 * which was which, so the credible parts inherited the doubt of the speculative
 * ones. Four states, used consistently, cost less trust than any amount of
 * hedging prose.
 *
 * `alpha`   in the build you can run today
 * `building` being worked on, not finished
 * `planned` intended, not started, no date implied
 * `sample`  a demonstration over made-up data
 */
const props = withDefaults(defineProps<{
  state: 'alpha' | 'building' | 'planned' | 'sample'
  /** Overrides the default wording where a sentence needs something shorter. */
  label?: string
}>(), { label: undefined })

const DEFAULTS: Record<string, string> = {
  alpha: 'Available in alpha',
  building: 'In development',
  planned: 'Planned',
  sample: 'Sample data',
}

const text = computed(() => props.label ?? DEFAULTS[props.state])
</script>

<template>
  <span class="chip" :class="`chip-${props.state}`">
    <span class="chip-dot" aria-hidden="true" />{{ text }}
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  /* Declared so a page's label styling cannot capitalise it. This chip appears
     inside other components' headers, and `.pa-head span` was shouting it. */
  text-transform: none;
  line-height: 1;
  padding: 5px 10px 5px 8px;
  border-radius: 999px;
  border: 1px solid transparent;
  white-space: nowrap;
  vertical-align: middle;
}
.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
}

/* Colour carries a hint, but never the meaning on its own — the words do that,
   which is what keeps this legible to anyone who cannot separate the hues. */
.chip-alpha {
  color: rgb(var(--color-ok));
  background: rgb(var(--color-ok) / 0.12);
  border-color: rgb(var(--color-ok) / 0.28);
}
.chip-building {
  color: rgb(var(--color-primary));
  background: rgb(var(--color-primary) / 0.12);
  border-color: rgb(var(--color-primary) / 0.28);
}
.chip-planned {
  color: rgb(var(--color-muted-foreground));
  background: rgb(var(--color-muted));
  border-color: rgb(var(--color-border));
}
.chip-sample {
  color: rgb(var(--color-warning, 202 138 4));
  background: rgb(var(--color-warning, 202 138 4) / 0.12);
  border-color: rgb(var(--color-warning, 202 138 4) / 0.3);
}
</style>
