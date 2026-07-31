/**
 * Reorder `dist/_headers` so specific paths win.
 *
 * Netlify applies every matching rule in `_headers` and, where two rules set the
 * same header, the LAST match wins. Nitro emits them in the opposite order to
 * what that requires:
 *
 *   /_nuxt/builds/meta/*   1 year, immutable
 *   /_nuxt/builds/*        max-age=1
 *   /_nuxt/*               1 year, immutable   <- also matches both of the above
 *
 * So `/_nuxt/builds/latest.json` — a FIXED url that the app polls to notice a new
 * deploy — was being served with a one-year immutable cache, which strands a
 * client on whatever build it first saw. Confirmed against production before this
 * script existed:
 *
 *   $ curl -sI https://alexandria.ifftu.dev/_nuxt/builds/latest.json
 *   cache-control: public,max-age=31536000,immutable
 *
 * Sorting by wildcard depth puts the broad rules first and the narrow ones last,
 * which is the order Netlify's precedence actually needs. This runs after
 * `nuxt generate`, so it applies on Netlify too — the build command is
 * `npm run generate`.
 */
import { readFile, writeFile } from 'node:fs/promises'

const FILE = new URL('../dist/_headers', import.meta.url)

/** A rule is "broader" when its path matches a superset of another's. */
function specificity(path) {
  // A trailing /* matches everything below it, so depth before the wildcard is
  // what decides how narrow the rule is.
  const segments = path.split('/').filter(Boolean)
  const wildcards = segments.filter(s => s.includes('*')).length
  return segments.length - wildcards * 0.5
}

const raw = await readFile(FILE, 'utf8').catch(() => null)
if (!raw) {
  console.log('order-headers: no dist/_headers, nothing to do')
  process.exit(0)
}

// Blocks are a path line followed by its indented header lines.
const blocks = []
for (const line of raw.split('\n')) {
  if (!line.trim()) continue
  if (!/^\s/.test(line)) blocks.push({ path: line.trim(), lines: [] })
  else blocks.at(-1)?.lines.push(line)
}

const before = blocks.map(b => b.path)
blocks.sort((a, b) => specificity(a.path) - specificity(b.path))
const after = blocks.map(b => b.path)

if (before.join() === after.join()) {
  console.log('order-headers: already ordered broad -> narrow')
  process.exit(0)
}

await writeFile(FILE, blocks.map(b => [b.path, ...b.lines].join('\n')).join('\n') + '\n')
console.log('order-headers: reordered so specific paths win')
for (const p of after) console.log('  ' + p)
