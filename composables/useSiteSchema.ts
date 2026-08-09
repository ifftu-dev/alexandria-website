/**
 * Organization, WebSite and BreadcrumbList, emitted from the layout so every
 * page carries them.
 *
 * Before this, 11 of 13 pages had no structured data at all — only the homepage
 * (SoftwareApplication) and the announcement post (BlogPosting). Nothing on the
 * site stated who publishes it, what its logo is, or how it relates to IFFTU,
 * so none of that was available to anything reading the page as data rather
 * than as text.
 *
 * One `@graph` rather than several loose scripts: it lets the nodes reference
 * each other by `@id`, so the publisher of a page is the same entity as the
 * owner of the site rather than three unlinked copies of the same name.
 */
const SITE = 'https://alexandria.ifftu.dev'

export function useSiteSchema() {
  const route = useRoute()

  /**
   * Breadcrumbs from the path. Only for real interior pages — a breadcrumb
   * trail of length one on the homepage is noise, and search engines ignore it.
   */
  function crumbs() {
    const parts = route.path.split('/').filter(Boolean)
    if (!parts.length) return null

    const items = [{ name: 'Home', item: SITE + '/' }]
    let acc = ''
    for (const part of parts) {
      acc += `/${part}`
      items.push({
        // `/why-recognition` → `Why recognition`. Good enough for every route
        // the site has, and the post slug reads correctly too.
        name: part.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase()),
        item: SITE + acc,
      })
    }

    return {
      '@type': 'BreadcrumbList',
      '@id': `${SITE}${route.path}#breadcrumbs`,
      'itemListElement': items.map((c, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': c.name,
        'item': c.item,
      })),
    }
  }

  const graph = computed(() => {
    const nodes: Record<string, unknown>[] = [
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        'name': 'Alexandria',
        'legalName': 'Alexandria Pvt. Ltd.',
        'url': SITE,
        'logo': { '@type': 'ImageObject', 'url': `${SITE}/icon.svg` },
        'description': 'A free, open-source learning app where you study offline and own the credentials you earn.',
        'sameAs': [
          'https://github.com/ifftu-dev/alexandria',
          'https://www.ifftu.dev/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        'name': 'Alexandria',
        'url': SITE,
        'inLanguage': 'en-US',
        'publisher': { '@id': `${SITE}/#organization` },
      },
    ]

    const trail = crumbs()
    if (trail) nodes.push(trail)

    return { '@context': 'https://schema.org', '@graph': nodes }
  })

  useHead({
    script: [{
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(graph.value)),
    }],
  })
}
