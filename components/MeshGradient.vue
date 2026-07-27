<script setup lang="ts">
/**
 * Animated mesh gradient on canvas — the moving backdrop behind every hero
 * and CTA band. Drawn rather than layered as CSS blurs so it stays cheap:
 * one canvas, additive radial fills, paused whenever it scrolls out of view.
 *
 * Honours prefers-reduced-motion by painting a single static frame.
 */
const props = withDefaults(defineProps<{
  /** rgb triplets, one per blob, e.g. '79,70,229' */
  blobs?: string[]
  /** solid colour painted under the blobs */
  base?: string
}>(), {
  blobs: () => ['79,70,229', '34,211,238', '244,114,182', '251,191,36', '16,185,129'],
  base: '#131a38',
})

const canvas = ref<HTMLCanvasElement | null>(null)

/**
 * sx/sy are radians per second, so the drift is identical on a 60Hz laptop and
 * a 120Hz phone. These give each orb a 90–160 second cycle — slow enough that
 * the movement registers as atmosphere rather than animation.
 */
const SEEDS = [
  { x: 0.22, y: 0.28, r: 0.78, sx: 0.055, sy: 0.042 },
  { x: 0.78, y: 0.22, r: 0.66, sx: 0.045, sy: 0.061 },
  { x: 0.68, y: 0.82, r: 0.60, sx: 0.066, sy: 0.038 },
  { x: 0.16, y: 0.82, r: 0.46, sx: 0.039, sy: 0.053 },
  { x: 0.50, y: 0.55, r: 0.52, sx: 0.050, sy: 0.047 },
]

onMounted(() => {
  const cv = canvas.value
  if (!cv) return
  const ctx = cv.getContext('2d')
  if (!ctx) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0
  let h = 0
  let elapsed = 0
  let last = 0
  let raf: number | null = null
  let running = false

  const shapes = props.blobs.map((c, i) => ({ c, ...SEEDS[i % SEEDS.length]! }))

  function size() {
    const rect = cv!.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = rect.width
    h = rect.height
    cv!.width = Math.max(1, Math.round(w * dpr))
    cv!.height = Math.max(1, Math.round(h * dpr))
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    // Setting width/height clears the canvas, so repaint straight away.
    // Without this, a section that resizes while scrolled out of view (the
    // CTA band, say) stays blank until it next animates.
    paint()
  }

  function paint(now = 0) {
    // Advance by real elapsed time, clamped so a backgrounded tab doesn't
    // resume with a jump. Paused frames simply don't accumulate.
    if (last) elapsed += Math.min((now - last) / 1000, 0.1)
    last = now

    ctx!.fillStyle = props.base
    ctx!.fillRect(0, 0, w, h)
    ctx!.globalCompositeOperation = 'lighter'

    for (let i = 0; i < shapes.length; i++) {
      const b = shapes[i]!
      const x = (b.x + Math.sin(elapsed * b.sx + i) * 0.13) * w
      const y = (b.y + Math.cos(elapsed * b.sy + i * 1.7) * 0.13) * h
      const rad = b.r * Math.max(w, h) * 0.62
      const g = ctx!.createRadialGradient(x, y, 0, x, y, rad)
      g.addColorStop(0, `rgba(${b.c},0.55)`)
      g.addColorStop(0.5, `rgba(${b.c},0.16)`)
      g.addColorStop(1, `rgba(${b.c},0)`)
      ctx!.fillStyle = g
      ctx!.beginPath()
      ctx!.arc(x, y, rad, 0, Math.PI * 2)
      ctx!.fill()
    }

    ctx!.globalCompositeOperation = 'source-over'
  }

  function draw(now = 0) {
    paint(now)
    raf = requestAnimationFrame(draw)
  }

  function start() { if (!running) { running = true; last = 0; draw() } }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf) }

  size()

  // Measure from the element's own box, not just window resizes: the hero can
  // change width after hydration (fonts landing, scrollbar appearing, the
  // announcement banner mounting), and a stale measurement leaves part of the
  // canvas unpainted.
  const resizeObserver = new ResizeObserver(size)
  resizeObserver.observe(cv)

  let observer: IntersectionObserver | null = null
  if (reduce) {
    // Single static frame — no loop, no drift.
    paint()
  }
  else {
    observer = new IntersectionObserver((entries) => {
      entries[0]?.isIntersecting ? start() : stop()
    }, { threshold: 0.02 })
    observer.observe(cv)
  }

  onUnmounted(() => {
    stop()
    observer?.disconnect()
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <canvas
    ref="canvas"
    class="absolute inset-0 h-full w-full"
    aria-hidden="true"
  />
</template>
