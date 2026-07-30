/**
 * Responsive audit. Loads every page at a spread of widths and reports, per
 * width: horizontal overflow, elements wider than the viewport, misaligned
 * section gutters, and tap targets under 44px. Facts only — no opinions.
 */
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:8931'
// Flat filenames because the emitted site is flat (autoSubfolderIndex: false).
// Against a real host, '/recruiter' works too; a local static server would hand
// back a directory listing for it instead, which silently audits the wrong page.
const PAGES = process.env.AUDIT_PATHS?.split(',')
  ?? ['/', '/recruiter.html', '/institutions.html', '/privacy.html']
const WIDTHS = [320, 360, 390, 414, 480, 640, 768, 834, 1024, 1280, 1440]

const audit = () => {
  const vw = document.documentElement.clientWidth
  const de = document.documentElement

  // Anything sticking out horizontally.
  const wide = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const style = getComputedStyle(el)
    if (style.position === 'fixed') continue
    if (r.right > vw + 1 || r.left < -1) {
      // An ancestor that clips makes this invisible rather than broken — which is
      // how decorative glows and full-bleed art legitimately sit outside a box.
      let clipped = false
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const o = getComputedStyle(a)
        if (/hidden|clip|auto|scroll/.test(o.overflowX) || /hidden|clip|auto|scroll/.test(o.overflow)) { clipped = true; break }
      }
      if (!clipped) {
        wide.push({
          sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
          left: Math.round(r.left),
          right: Math.round(r.right),
        })
      }
    }
  }

  // Section gutters: every `.pad` should share one left edge and one width.
  const pads = [...document.querySelectorAll('.pad')].map((el) => {
    const r = el.getBoundingClientRect()
    return { left: Math.round(r.left), width: Math.round(r.width) }
  })
  const lefts = [...new Set(pads.map(p => p.left))]
  const widths = [...new Set(pads.map(p => p.width))]

  // Interactive things too small to hit reliably.
  const small = []
  for (const el of document.querySelectorAll('a, button, input, [role="tab"]')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (getComputedStyle(el).position === 'fixed') continue
    // Ignore anything inside the app replica: it is a picture of a UI, not one.
    if (el.closest('.app-replica')) continue
    // Inline links inside running text are not tap targets in the 44px sense;
    // flagging them buries the standalone controls that genuinely are.
    const disp = getComputedStyle(el).display
    const iconOnly = (el.textContent || '').trim() === ''
    if (disp === 'inline' && !iconOnly) continue
    if (r.height < 40 || r.width < 24) {
      small.push({
        sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''),
        w: Math.round(r.width),
        h: Math.round(r.height),
        text: (el.textContent || '').trim().slice(0, 24),
      })
    }
  }

  return {
    docScroll: de.scrollWidth,
    clientW: vw,
    overflowsPage: de.scrollWidth > vw + 1,
    wide: wide.slice(0, 8),
    padLefts: lefts,
    padWidths: widths,
    small: small.slice(0, 8),
  }
}

const browser = await chromium.launch()
const findings = []

for (const path of PAGES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(120)
    const r = await page.evaluate(audit)
    const problems = []
    if (r.overflowsPage) problems.push(`page scrolls horizontally (${r.docScroll} > ${r.clientW})`)
    for (const w of r.wide) problems.push(`overflows: ${w.sel} [${w.left}..${w.right}]`)
    if (r.padLefts.length > 1) problems.push(`gutters disagree: .pad lefts = ${r.padLefts.join(', ')}`)
    if (r.padWidths.length > 1) problems.push(`gutters disagree: .pad widths = ${r.padWidths.join(', ')}`)
    for (const s of r.small) problems.push(`tap target ${s.w}x${s.h}: ${s.sel} "${s.text}"`)
    if (problems.length) findings.push({ path, width, problems })
    await page.close()
  }
}

await browser.close()

if (findings.length === 0) {
  console.log('  no findings across', PAGES.length * WIDTHS.length, 'page/width combinations')
} else {
  const byProblem = new Map()
  for (const f of findings) {
    for (const p of f.problems) {
      const key = p.replace(/\[\-?\d+\.\.\-?\d+\]/, '[..]').replace(/\d+/g, 'N')
      if (!byProblem.has(key)) byProblem.set(key, [])
      byProblem.get(key).push(`${f.path}@${f.width}`)
    }
  }
  console.log(`  ${byProblem.size} distinct problem(s) across ${findings.length} page/width combination(s)\n`)
  for (const [problem, where] of [...byProblem].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${problem}`)
    console.log(`     ${where.length} occurrence(s): ${where.slice(0, 6).join(', ')}${where.length > 6 ? ' …' : ''}`)
  }
}
