/**
 * Critical-CSS split, run over the prerendered HTML after `nuxt generate`.
 *
 * The build ships one blocking stylesheet (`_nuxt/entry.*.css`, ~45 KB raw,
 * ~10 KB brotli). Component styles are already inlined by Nuxt, so that single
 * request is the entire render-blocking cost — and on a throttled connection it
 * is a round trip that first paint waits on. This inlines the rules needed for
 * what is on screen at that moment and loads the rest asynchronously.
 *
 * Written by hand rather than with Beasties/Critters, which was tried first and
 * rejected: those tools keep every rule matching *any element in the document*,
 * and on a long landing page that is nearly the whole sheet. Measured, it inlined
 * 60 KB into index.html, left the blocking link in place, and grew the document
 * from 16 KB to 21 KB brotli — worse on both counts.
 *
 * The selector allowlist below is the whole design of this step: it is what "above
 * the fold" means for this site, expressed once. Anything not matched still
 * arrives, a moment later, from the async sheet.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { globSync } from 'node:fs'
import { basename } from 'node:path'
import postcss from 'postcss'

const DIST = 'dist'

/**
 * Selectors whose rules are needed before the async sheet lands: design tokens,
 * the reset, the nav, the hero and its CTA, and the handful of Tailwind
 * utilities the gradient layer uses. `.dark` is included wholesale because the
 * theme class is set on <html> before paint — omit it and a dark-mode visitor
 * gets a light-mode flash.
 */
const CRITICAL = [
  /^:root/, /^html/, /^body/, /^\*/, /^::?(before|after|selection|placeholder)/,
  // replaced-element resets: the gradient canvas and every inline icon depend on
  // these, and they are bare element selectors the class patterns below miss
  /^img\b/, /^svg\b/, /^canvas\b/, /^video\b/,
  /\.dark\b/,
  /^\.pad\b/, /^\.eyebrow\b/, /^\.sr-only\b/, /^\.mono\b/,
  /^\.nav/, /^\.brand/, /^\.burger/, /^\.skip/,
  /^\.hero/, /^\.shelf/,
  /^\.btn/, /^\.ea\b/, /^\.ea-/, /^\.tag-link/,
  // utilities on the gradient layer and canvas
  /^\.absolute$/, /^\.relative$/, /^\.inset-0$/, /^\.h-full$/, /^\.w-full$/,
  // First screen of the audience pages: the section wrapper, the "not built yet"
  // notice under each hero, the trust row, section headings and the first tile
  // grid. Found by diffing the classes used in the opening markup of every page
  // against what the allowlist above already covered — without these, those
  // pages flash unstyled until the async sheet lands.
  /^\.section\b/, /^\.notice\b/, /^\.trust\b/, /^\.p-sub\b/, /^\.h-sec\b/,
  /^\.prose\b/, /^\.lede\b/, /^\.grid2\b/, /^\.tiles?\b/, /^\.tile-/,
  /^\.pa-/, /^\.mk\b/, /^\.on$/, /^\.n$/,
]

/** At-rules that must survive regardless of what they contain. */
const KEEP_AT = new Set(['font-face', 'property', 'layer', 'charset'])

const isCritical = selector => CRITICAL.some(re => re.test(selector.trim()))

/** Keep the subset of a rule's selector list that is critical. */
function filterSelectors(rule) {
  const kept = rule.selectors.filter(isCritical)
  if (kept.length === 0) return false
  rule.selectors = kept
  return true
}

function extract(css) {
  const root = postcss.parse(css)
  const out = postcss.root()

  root.each((node) => {
    if (node.type === 'atrule') {
      // `@layer a, b;` and `@charset` have no body and must be preserved as-is.
      if (KEEP_AT.has(node.name) && !node.nodes) { out.append(node.clone()); return }
      if (KEEP_AT.has(node.name)) { out.append(node.clone()); return }

      if (node.name === 'media' || node.name === 'supports') {
        const clone = node.clone()
        clone.each((inner) => {
          if (inner.type === 'rule') { if (!filterSelectors(inner)) inner.remove() }
          else if (inner.type !== 'decl') inner.remove()
        })
        if (clone.nodes?.length) out.append(clone)
        return
      }
      return // @keyframes and friends: nothing above the fold animates on load
    }

    if (node.type === 'rule') {
      const clone = node.clone()
      if (filterSelectors(clone)) out.append(clone)
    }
  })

  return out.toString()
}

const sheets = globSync(`${DIST}/_nuxt/entry.*.css`)
if (sheets.length !== 1) {
  console.error(`  expected exactly one entry stylesheet, found ${sheets.length} — not touching the HTML`)
  process.exit(1)
}

const full = await readFile(sheets[0], 'utf8')
const critical = extract(full)
console.log(`  extracted ${(critical.length / 1024).toFixed(1)} KB critical from ${(full.length / 1024).toFixed(1)} KB`)

let changed = 0
for (const page of globSync(`${DIST}/**/*.html`)) {
  const html = await readFile(page, 'utf8')

  // Defer every stylesheet link, keeping a <noscript> copy of each so the page is
  // still styled with JavaScript off — the swap depends on the onload handler.
  // The critical subset is inlined once, in place of the entry sheet; the other
  // chunks (the skill graph, per-page styles) are entirely below the fold and
  // need no inline counterpart.
  const links = [...html.matchAll(/<link rel="stylesheet" href="(\/_nuxt\/[^"]+\.css)"([^>]*)>/g)]
  if (links.length === 0) continue

  let out = html
  let deferred = 0
  for (const [tag, href, rest] of links) {
    const isEntry = /\/entry\.[^/]+\.css$/.test(href)
    const replacement = (isEntry ? `<style>${critical}</style>` : '')
      + `<link rel="preload" as="style" href="${href}"${rest} onload="this.rel='stylesheet'">`
      + `<noscript>${tag}</noscript>`
    out = out.replace(tag, replacement)
    deferred++
  }

  await writeFile(page, out)
  changed++
  console.log(`  ${basename(page).padEnd(20)} ${deferred} sheet(s) deferred`)
}

console.log(`  ${changed} page(s) rewritten`)
