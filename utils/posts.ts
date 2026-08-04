import MarkdownIt from 'markdown-it'

/**
 * The blog, without a content framework.
 *
 * Posts are markdown files in `content/blog/`. Vite inlines them at build time,
 * markdown-it renders them, and the whole thing prerenders to static HTML — so
 * nothing here runs in the browser and no reader downloads a parser.
 *
 * @nuxt/content would do this too, and brings a database, a query layer and a
 * runtime the site would otherwise not have. For a handful of essays that is a
 * lot of machinery to carry.
 */

export interface Heading {
  id: string
  text: string
}

export interface Post {
  slug: string
  title: string
  standfirst: string
  date: string
  author: string
  readingTime: string
  kind: string
  description: string
  html: string
  /** Section headings, for the contents rail on a long post. */
  headings: Heading[]
  /** Rough minutes, from the body — a stated figure that can drift is worse
   *  than none, so this is computed rather than typed into frontmatter. */
  minutes: number
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
}

// External links open away from the site and must not hand it the opener.
const defaultLinkOpen = md.renderer.rules.link_open
  ?? ((tokens, i, options, _env, self) => self.renderToken(tokens, i, options))

md.renderer.rules.link_open = (tokens, i, options, env, self) => {
  // attrGet is typed string | number in markdown-it 15.
  const href = String(tokens[i]!.attrGet('href') ?? '')
  if (/^https?:\/\//.test(href)) {
    tokens[i]!.attrSet('target', '_blank')
    tokens[i]!.attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, i, options, env, self)
}

/**
 * Frontmatter, parsed by hand.
 *
 * Deliberately not a YAML dependency: the fields are flat `key: value` strings
 * and staying that way is a feature. If a post ever needs nested frontmatter,
 * that is the moment to reach for a parser, not before.
 */
function parse(raw: string): { data: Record<string, string>, body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw)
  if (!match) return { data: {}, body: raw }

  const data: Record<string, string> = {}
  for (const line of match[1]!.split('\n')) {
    const at = line.indexOf(':')
    if (at === -1) continue
    data[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, '')
  }
  return { data, body: raw.slice(match[0].length) }
}

const files: Record<string, string> = import.meta.glob('~/content/blog/*.md', { query: '?raw', import: 'default', eager: true })

const all: Post[] = Object.entries(files).map(([path, raw]) => {
  const { data, body } = parse(raw)

  const headings: Heading[] = []
  let html = md.render(body)
  // Give every h2 an id and collect it in document order.
  html = html.replace(/<h2>(.*?)<\/h2>/g, (_m, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '')
    const id = slugify(text)
    headings.push({ id, text })
    return `<h2 id="${id}">${inner}</h2>`
  })

  const words = body.replace(/[#>*`_\[\]()]/g, ' ').split(/\s+/).filter(Boolean).length

  return {
    headings,
    minutes: Math.max(1, Math.round(words / 220)),
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
    title: data.title ?? 'Untitled',
    standfirst: data.standfirst ?? '',
    date: data.date ?? '',
    author: data.author ?? '',
    readingTime: data.readingTime ?? '',
    kind: data.kind ?? 'Post',
    description: data.description ?? data.standfirst ?? '',
    html,
  }
// Newest first.
}).sort((a, b) => b.date.localeCompare(a.date))

export function usePosts(): Post[] {
  return all
}

export function usePost(slug: string): Post | undefined {
  return all.find(p => p.slug === slug)
}

/** "July 31, 2026" — written out, because a blog date is read, not sorted. */
export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
