<script setup lang="ts">
/**
 * Skill graph — the widget from the app's sidebar (SidebarSkillGraph.vue).
 *
 * Same rendering contract as the product: a force-directed layout on canvas,
 * node color by status (earned green, available yellow, locked gray), node
 * radius by Bloom level via `bloomRadius(level, 2, 0.45)`, hairline links, a
 * glow behind earned and available nodes, then zoom-to-fit once the simulation
 * settles — followed by the same legend and skills-progress line.
 *
 * The app pulls its graph over Tauri IPC from the local taxonomy; here the
 * nodes are a fixed sample of one subject tree, so the marketing site stays
 * static and offline.
 */
const props = withDefaults(defineProps<{
  height?: number
  /** legend + progress line, as the sidebar shows them */
  chrome?: boolean
  /** multiplies node radius — the sidebar runs smaller dots than a feature card */
  nodeScale?: number
}>(), { height: 180, chrome: true, nodeScale: 1 })

type Status = 'earned' | 'available' | 'locked'

interface Node {
  id: string
  bloom: number
  status: Status
  x: number
  y: number
  vx: number
  vy: number
}

// One subject tree: safety and metallurgy earned, 6G in reach, the inspection
// and fabrication branches still locked behind it.
const SEED: { id: string, bloom: number, status: Status }[] = [
  { id: 'welding.safety', bloom: 3, status: 'earned' },
  { id: 'metallurgy.basics', bloom: 2, status: 'earned' },
  { id: 'safety.rigging', bloom: 1, status: 'earned' },
  { id: 'welding.symbols', bloom: 2, status: 'earned' },
  { id: 'welding.smaw', bloom: 2, status: 'earned' },
  { id: 'welding.pipe.6g', bloom: 4, status: 'available' },
  { id: 'welding.tig', bloom: 3, status: 'available' },
  { id: 'welding.gmaw', bloom: 2, status: 'available' },
  { id: 'inspection.visual', bloom: 2, status: 'available' },
  { id: 'inspection.ndt', bloom: 4, status: 'locked' },
  { id: 'inspection.radiographic', bloom: 5, status: 'locked' },
  { id: 'inspection.ultrasonic', bloom: 5, status: 'locked' },
  { id: 'fabrication.layout', bloom: 3, status: 'locked' },
  { id: 'fabrication.pressure', bloom: 5, status: 'locked' },
  { id: 'welding.orbital', bloom: 4, status: 'locked' },
  { id: 'metallurgy.heat', bloom: 4, status: 'locked' },
]

const LINKS: [string, string][] = [
  ['welding.safety', 'welding.smaw'],
  ['metallurgy.basics', 'welding.smaw'],
  ['welding.symbols', 'welding.smaw'],
  ['safety.rigging', 'fabrication.layout'],
  ['welding.smaw', 'welding.pipe.6g'],
  ['welding.smaw', 'welding.tig'],
  ['welding.smaw', 'welding.gmaw'],
  ['welding.safety', 'inspection.visual'],
  ['welding.pipe.6g', 'inspection.ndt'],
  ['inspection.visual', 'inspection.ndt'],
  ['inspection.ndt', 'inspection.radiographic'],
  ['inspection.ndt', 'inspection.ultrasonic'],
  ['welding.pipe.6g', 'fabrication.pressure'],
  ['fabrication.layout', 'fabrication.pressure'],
  ['welding.tig', 'welding.orbital'],
  ['metallurgy.basics', 'metallurgy.heat'],
]

const earned = SEED.filter(n => n.status === 'earned').length
const available = SEED.filter(n => n.status === 'available').length
const locked = SEED.filter(n => n.status === 'locked').length
const total = SEED.length

const canvas = ref<HTMLCanvasElement | null>(null)

/** Matches bloomRadius(level, 2, 0.45) in the app, scaled for the small canvas. */
function radiusFor(bloom: number) {
  return (2 + bloom * 0.45) * 2.1 * props.nodeScale
}

onMounted(() => {
  const cv = canvas.value
  if (!cv) return
  const ctx = cv.getContext('2d')
  if (!ctx) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Deterministic start positions — the layout looks the same on every visit.
  let seed = 20260728
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  const nodes: Node[] = SEED.map(n => ({
    ...n,
    x: (rand() - 0.5) * 120,
    y: (rand() - 0.5) * 120,
    vx: 0,
    vy: 0,
  }))
  const byId = new Map(nodes.map(n => [n.id, n]))
  const links = LINKS
    .map(([a, b]) => ({ a: byId.get(a)!, b: byId.get(b)! }))
    .filter(l => l.a && l.b)

  // The app runs charge -12 / link distance 15 in graph units and then
  // zoom-to-fits. Here the simulation runs directly in canvas pixels, which
  // keeps nodes from overlapping at this size and uses the full width — the
  // sidebar widget is nearly square, these panels are wide.
  let box = { w: 320, h: props.height }

  function tick() {
    const linkDistance = Math.min(Math.max(box.w / 9, 26), 52)
    const charge = -linkDistance * linkDistance * 1.15

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]!
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]!
        let dx = b.x - a.x
        let dy = b.y - a.y
        let d2 = dx * dx + dy * dy
        if (d2 < 0.01) { dx = rand() - 0.5; dy = rand() - 0.5; d2 = 0.25 }
        const d = Math.sqrt(d2)
        const f = charge / d2
        const fx = (dx / d) * f
        const fy = (dy / d) * f
        a.vx += fx; a.vy += fy
        b.vx -= fx; b.vy -= fy
      }
    }

    for (const l of links) {
      const dx = l.b.x - l.a.x
      const dy = l.b.y - l.a.y
      const d = Math.hypot(dx, dy) || 0.01
      const f = (d - linkDistance) * 0.09
      const fx = (dx / d) * f
      const fy = (dy / d) * f
      l.a.vx += fx; l.a.vy += fy
      l.b.vx -= fx; l.b.vy -= fy
    }

    // Pull toward the center, more gently across the x axis so the layout
    // spreads into the width it has rather than balling up.
    for (const n of nodes) {
      n.vx -= n.x * 0.010
      n.vy -= n.y * 0.026
      n.vx *= 0.74
      n.vy *= 0.74
      n.x += n.vx
      n.y += n.vy
    }

    // Separate overlapping dots — the app gets this free from d3's layout at
    // its own scale; at this size it needs saying explicitly.
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]!
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]!
        const min = radiusFor(a.bloom) + radiusFor(b.bloom) + 7
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 0.01
        if (d < min) {
          const push = (min - d) / 2
          a.x -= (dx / d) * push
          a.y -= (dy / d) * push
          b.x += (dx / d) * push
          b.y += (dy / d) * push
        }
      }
    }

    // Keep everything inside the frame.
    const padX = box.w / 2 - 12
    const padY = box.h / 2 - 12
    for (const n of nodes) {
      const r = radiusFor(n.bloom)
      n.x = Math.max(-padX + r, Math.min(padX - r, n.x))
      n.y = Math.max(-padY + r, Math.min(padY - r, n.y))
    }
  }

  function paint() {
    const rect = cv!.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = rect.width
    const h = rect.height
    if (cv!.width !== Math.round(w * dpr) || cv!.height !== Math.round(h * dpr)) {
      cv!.width = Math.max(1, Math.round(w * dpr))
      cv!.height = Math.max(1, Math.round(h * dpr))
    }
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx!.clearRect(0, 0, w, h)

    box = { w, h }
    const px = (n: Node) => n.x + w / 2
    const py = (n: Node) => n.y + h / 2

    ctx!.lineWidth = 0.5
    ctx!.strokeStyle = 'rgba(148, 163, 184, 0.28)'
    for (const l of links) {
      ctx!.beginPath()
      ctx!.moveTo(px(l.a), py(l.a))
      ctx!.lineTo(px(l.b), py(l.b))
      ctx!.stroke()
    }

    for (const n of nodes) {
      const x = px(n)
      const y = py(n)
      const r = radiusFor(n.bloom)

      if (n.status === 'earned') {
        ctx!.beginPath()
        ctx!.arc(x, y, r + 4 * props.nodeScale, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(34, 197, 94, 0.2)'
        ctx!.fill()
      }
      else if (n.status === 'available') {
        ctx!.beginPath()
        ctx!.arc(x, y, r + 3 * props.nodeScale, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(234, 179, 8, 0.15)'
        ctx!.fill()
      }

      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.fillStyle = n.status === 'earned'
        ? '#22c55e'
        : n.status === 'available' ? '#eab308' : 'rgba(100, 116, 139, 0.4)'
      ctx!.fill()
    }
  }

  // cooldownTicks(60): settle, then hold. Animated when it first scrolls into
  // view so the layout visibly finds its shape, as it does in the app.
  let ticks = 0
  let raf: number | null = null
  function settle() {
    tick()
    paint()
    ticks++
    if (ticks < 60) raf = requestAnimationFrame(settle)
  }

  function run() {
    if (ticks >= 60) return
    if (reduce) {
      while (ticks < 60) { tick(); ticks++ }
      paint()
      return
    }
    raf = requestAnimationFrame(settle)
  }

  const io = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) { run(); io.disconnect() }
  }, { threshold: 0.15 })
  io.observe(cv)

  // A resize changes the frame the simulation is solved in, so let it settle
  // again rather than leaving nodes clamped against the old edges.
  const ro = new ResizeObserver(() => {
    const rect = cv.getBoundingClientRect()
    if (Math.abs(rect.width - box.w) > 12) { ticks = Math.min(ticks, 40) }
    paint()
    if (ticks < 60) run()
  })
  ro.observe(cv)

  onUnmounted(() => {
    if (raf) cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
  })
})
</script>

<template>
  <div class="skill-graph">
    <div class="graph-canvas" :style="{ height: `${props.height}px` }">
      <canvas ref="canvas" aria-hidden="true" />
      <span class="graph-expand" aria-hidden="true">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      </span>
    </div>

    <template v-if="props.chrome">
      <div class="graph-legend">
        <span><i class="is-earned" />Earned ({{ earned }})</span>
        <span><i class="is-available" />Available ({{ available }})</span>
        <span><i class="is-locked" />Locked ({{ locked }})</span>
      </div>
      <p class="graph-progress">{{ earned }} / {{ total }} skills · dot size shows skill level</p>
    </template>
  </div>
</template>
