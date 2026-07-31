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
