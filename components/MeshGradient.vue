<script setup lang="ts">
/**
 * Animated mesh gradient on canvas — the moving backdrop behind every hero
 * and CTA band. Drawn rather than layered as CSS blurs so it stays cheap:
 * one canvas, additive radial fills, paused whenever it scrolls out of view.
 *
 * Reduced-motion visitors and narrow viewports get no canvas at all — the
 * static CSS layer behind it stands in, so there is nothing to paint.
 */
const props = withDefaults(defineProps<{
  /** rgb triplets, one per blob, e.g. '79,70,229' */
  blobs?: string[]
  /** solid color painted under the blobs */
  base?: string
}>(), {
  blobs: () => ['79,70,229', '34,211,238', '244,114,182', '251,191,36', '16,185,129'],
  base: '#131a38',
})

const canvas = ref<HTMLCanvasElement | null>(null)

/**
 * sx/sy are radians per second, so the drift is identical on a 60Hz laptop and
 * a 120Hz phone. Each orb takes 8–13 seconds per cycle, which is plainly in
 * motion the moment you look at it without tipping into distraction. The rates
 * are mutually non-harmonic so the field never visibly repeats.
 */
const SEEDS = [
  { x: 0.22, y: 0.28, r: 0.78, sx: 0.68, sy: 0.53 },
  { x: 0.78, y: 0.22, r: 0.66, sx: 0.56, sy: 0.75 },
  { x: 0.68, y: 0.82, r: 0.60, sx: 0.80, sy: 0.47 },
  { x: 0.16, y: 0.82, r: 0.46, sx: 0.49, sy: 0.66 },
  { x: 0.50, y: 0.55, r: 0.52, sx: 0.62, sy: 0.58 },
]

/**
 * A static CSS rendering of the same gradient, server-rendered underneath the
 * canvas.
 *
 * The canvas is transparent until `onMounted` paints it, and `.hero` sets
 * `color: #fff` with no background of its own — so between first paint and
 * hydration the hero was white text on the page background, i.e. invisible, and
 * then appeared to "load" a second later. Whatever the measured metrics said,
 * that is what a visitor actually saw.
 *
 * Built from `props.blobs`, `props.base` and the same SEEDS, so each page keeps
 * its own palette without a second source of truth. Stops mirror the canvas
 * (0.55/0.16/0 at 0/50/100%), pulled down slightly because CSS layers composite
 * normally where the canvas uses `lighter`: the canvas arriving should read as
 * the color deepening, never as a jump.
 */
const staticBackground = computed(() => {
  const layers = props.blobs.map((c, i) => {
    const seed = SEEDS[i % SEEDS.length]!
    const x = (seed.x * 100).toFixed(1)
    const y = (seed.y * 100).toFixed(1)
    return `radial-gradient(circle at ${x}% ${y}%, rgba(${c},0.5) 0%, rgba(${c},0.16) 50%, rgba(${c},0) 72%)`
  })
  return `${layers.join(', ')}, ${props.base}`
})

/** How far each orb wanders from its home position, as a share of the canvas. */
const DRIFT = 0.19

onMounted(() => {
  const cv = canvas.value
  if (!cv) return

  // Narrow viewports and reduced-motion visitors keep the static CSS layer and
  // never start a canvas at all. Animating costs a full-viewport fill plus five
  // radial gradients every frame — the largest single item under "Rendering" on
  // a throttled phone — to drift a backdrop nobody is studying, on the devices
  // least able to afford it. The static layer is built from the same palette, so
  // the only thing given up is the movement.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || window.matchMedia('(max-width: 700px)').matches) {
    return
  }

  const ctx = cv.getContext('2d')
  if (!ctx) return

  let w = 0
  let h = 0
  let elapsed = 0
  let last = 0
  let raf: number | null = null
  let running = false

  const shapes = props.blobs.map((c, i) => ({ c, ...SEEDS[i % SEEDS.length]! }))

  function size() {
    const rect = cv!.getBoundingClientRect()
    // Deliberately below the device ratio. Every shape here is a wide, soft
    // radial gradient, so there is no high-frequency detail for the extra
    // pixels to resolve — they only cost fill rate, and this canvas spans the
    // viewport. A phone at DPR 3 was painting ~5M pixels per frame for an
    // image that looks identical at a quarter of that.
    const dpr = Math.min(window.devicePixelRatio || 1, rect.width < 700 ? 1 : 1.5)
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
      const x = (b.x + Math.sin(elapsed * b.sx + i) * DRIFT) * w
      const y = (b.y + Math.cos(elapsed * b.sy + i * 1.7) * DRIFT) * h
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

  /**
   * Capped at ~30fps. The DPR cap above bounded how many pixels each frame
   * costs; this bounds how many frames there are. Five viewport-sized radial
   * gradients is fill-rate-bound work, and Rendering was the largest single
   * group on the main thread.
   *
   * Motion is unaffected: `paint` advances by real elapsed time, so the drift
   * moves at the same speed whatever the frame rate — and at DRIFT this slow
   * there is nothing at 60fps that is not at 30.
   */
  const FRAME_MS = 1000 / 30
  let painted = 0

  function draw(now = 0) {
    if (now - painted >= FRAME_MS || !painted) {
      painted = now
      paint(now)
    }
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

  // Reduced-motion visitors returned above, so the only path left is the
  // animated one, gated on visibility.
  const observer = new IntersectionObserver((entries) => {
    entries[0]?.isIntersecting ? start() : stop()
  }, { threshold: 0.02 })
  observer.observe(cv)

  onUnmounted(() => {
    stop()
    observer?.disconnect()
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <!-- Painted by the browser on first paint; the canvas takes over on mount. -->
  <div
    class="absolute inset-0"
    :style="{ background: staticBackground }"
    aria-hidden="true"
  />
  <canvas
    ref="canvas"
    class="absolute inset-0 h-full w-full"
    aria-hidden="true"
  />
</template>
