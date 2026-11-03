import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('website and email distinguish the application and verifier licenses', () => {
  for (const path of ['layouts/landing.vue', 'netlify/email/confirmation.ts', 'README.md']) {
    const source = read(path)
    assert.match(source, /GNU AGPL v3 or later/)
    assert.match(source, /MIT OR Apache-2\.0/)
    assert.doesNotMatch(source, /MIT-licensed core|Core released under the MIT License|IFFTU Enterprise License/)
  }
  assert.match(read('README.md'), /This website repository is MIT-licensed/)
  assert.doesNotMatch(read('layouts/landing.vue'), /License \(open-core\)/)
})

test('verifier discloses status requests before the Verify action', () => {
  const source = read('pages/verify.vue')
  assert.doesNotMatch(source, /nothing sent anywhere|does not fetch the issuer's revocation list|Both need data a static page cannot have/)
  assert.match(source, /host may receive your IP address and the requested URL/)
  assert.match(source, /Browser or site security policies may block the request/)
  assert.ok(source.indexOf('class="v-note v-privacy"') < source.indexOf('@click="run"'))
  assert.match(source, /Revocation checks may request the issuer/)
  assert.match(source, /status-list checks may make network requests/)
})

test('verifier separates signatures, unresolved status, anchors and trust', () => {
  const source = read('pages/verify.vue')
  assert.match(source, /An unchecked revocation status is not proof that/)
  assert.match(source, /A valid signature alone does not settle revocation/)
  assert.match(source, /Chain anchors are not checked here/)
  assert.match(source, /does not\s+establish assessment quality, issuer authority or recognition/)
})

test('search palette reaches every top-level page', () => {
  const palette = read('components/CommandPalette.vue')
  const pages = readdirSync(new URL('../pages', import.meta.url), { withFileTypes: true })
    .filter(entry => entry.isDirectory() || entry.name.endsWith('.vue'))
    .map(entry => entry.isDirectory() ? entry.name : entry.name.replace(/\.vue$/, ''))
    .filter(name => !['index', '[slug]'].includes(name))
  assert.ok(pages.includes('privacy'), 'expected to discover the privacy page')
  for (const page of pages) {
    assert.match(palette, new RegExp(`go\\('/${page}'\\)`), `no palette command opens /${page}`)
  }
})

test('privacy policy discloses the one third-party origin the site loads', () => {
  const privacy = read('pages/privacy.vue')
  assert.match(read('nuxt.config.ts'), /https:\/\/plausible\.io\//)
  assert.match(privacy, /Plausible/)
  assert.doesNotMatch(privacy, /embeds nothing from another origin/)
})

/** Every file a visitor or crawler reads text from, minus the dated blog posts. */
function copyFiles() {
  const walk = dir => readdirSync(new URL(`../${dir}`, import.meta.url), { withFileTypes: true })
    .flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`])
  return [
    ...walk('pages'), ...walk('components'), ...walk('layouts'),
    'error.vue', 'app.vue', 'nuxt.config.ts', 'content/evidence.ts',
    'composables/useSiteSchema.ts', 'netlify/email/confirmation.ts',
    'netlify/functions/early-access.ts', 'netlify/functions/enquiry.ts', 'public/app-open.html',
  ].filter(path => /\.(vue|ts|html)$/.test(path))
}

/** Source with comments removed, so prose in a code comment cannot trip a copy rule. */
function visible(path) {
  const source = path.startsWith('netlify/functions/')
    // Handlers are mostly code and logs; only their responses and emails reach a person.
    ? read(path).split('\n').map(line => /\b(?:error|subject|body):/.test(line) ? line : '').join('\n')
    : read(path)
  return source
    .replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, ''))
    .replace(/^[ \t]*\/\/.*$/gm, '')
}

const MONTH = '(?:January|February|March|April|May|June|July|August|September|October|November|December)'
const HOUSE_STYLE = [
  [/\blicence\b/i, 'American spelling: license'],
  [/canonicalis/i, 'American spelling: canonicalization'],
  [/\b[Rr]igour\b/, 'American spelling: rigor'],
  [/\bper cent\b/i, 'American usage: percent, or a figure with %'],
  [/\benrol\b/i, 'American spelling: enroll'],
  [/\bre-(?:discover|test)/i, 'no hyphen: rediscover, retest'],
  // Skips identifiers that keep the old spelling on purpose: `EnquiryForm`, the
  // `#enquiry` anchor, `id="enquiry"` and the `enquiry.ts` path.
  [/(?<![#/"=\w-])[Ee]nquir(?:y|ies)\b(?!\.ts)/, 'American usage in visible copy: inquiry'],
  // Skips the `waitlist` composable: `const waitlist =`, `waitlist.open()`, `action: 'waitlist'`.
  [/(?<![\w.'])waitlist\b(?!\.[a-z(]|\s*=)/, 'the list is the "waiting list"'],
  [/\bskill map\b/i, 'the app calls it the "skill graph"'],
  [/\bOpinions\b/, 'the app renamed Opinions to "Discussions"'],
  [new RegExp(`\\b\\d{1,2} ${MONTH} \\d{4}\\b`), 'dates read "Month day, year"'],
  [/[A-Za-z]\\?'[a-z]/, 'curly apostrophes (’) in prose'],
]

test('visible copy follows the house style', () => {
  const problems = []
  for (const path of copyFiles()) {
    const lines = visible(path).split('\n')
    lines.forEach((line, i) => {
      for (const [rule, why] of HOUSE_STYLE) {
        const hit = line.match(rule)
        if (hit) problems.push(`${path}:${i + 1} "${hit[0]}" — ${why}`)
      }
    })
  }
  assert.deepEqual(problems, [])
})
