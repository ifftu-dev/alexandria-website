<script setup lang="ts">
/**
 * One label for how real a thing is, used everywhere a capability, price or
 * demo is described.
 *
 * The site's recurring failure was mixing shipped features, roadmap items and
 * sample data into single undifferentiated lists — a reader had no way to tell
 * which was which, so the credible parts inherited the doubt of the speculative
 * ones. A small set of states, used consistently, costs less trust than any
 * amount of hedging prose.
 *
 * `alpha`   in the build you can run today
 * `built`   written, tested and running — but not something you can get yet
 * `building` being worked on, not finished
 * `planned` intended, not started, no date implied
 * `sample`  a demonstration over made-up data
 *
 * `built` exists because the other four could not describe the organisation
 * side honestly. Single sign-on, ATS delivery, bulk verification and the
 * employer search are finished and under test in the control-plane repository,
 * and no customer can buy or use any of them. Calling that `planned` says
 * nothing has been started, which is false; calling it `alpha` invites a reader
 * to go and run it, which they cannot. Overstating and understating are both
 * ways of being wrong about the same fact.
 */
const props = withDefaults(defineProps<{
  state: 'alpha' | 'built' | 'building' | 'planned' | 'sample'
  /** Overrides the default wording where a sentence needs something shorter. */
  label?: string
}>(), { label: undefined })

const DEFAULTS: Record<string, string> = {
  alpha: 'Available in alpha',
  built: 'Built · not yet available',
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
