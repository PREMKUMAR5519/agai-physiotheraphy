import type snapshot from './cms-snapshot.json'

type Snapshot = typeof snapshot
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)

// Accept an origin or the copied public endpoint, but never send credentials.
export function contentEndpoint(value: string | undefined) {
  if (!value?.trim()) return null
  const url = new URL(value.trim())
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('CMS URL must be an HTTP(S) URL without credentials, query or fragment')
  if (!['', '/', '/api/public/content', '/api/public/content/'].includes(url.pathname)) throw new Error('Use the CMS origin or /api/public/content URL')
  return `${url.origin}/api/public/content`
}

export function parsePublishedContent(value: unknown, endpoint: string): Snapshot {
  if (!object(value) || value.schemaVersion !== 1 || !object(value.content) || !object(value.content.clinic) || !Array.isArray(value.content.services) || !Array.isArray(value.content.faqs) || !Array.isArray(value.articles)) throw new Error('Invalid CMS content response')
  const slugs = new Set<string>()
  for (const article of value.articles) {
    if (!object(article) || !['slug', 'title', 'category', 'excerpt', 'image', 'imageAlt'].every(key => typeof article[key] === 'string') || !Array.isArray(article.sections)) throw new Error('Invalid published article')
    const slug = article.slug as string
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug)) throw new Error('Invalid or duplicate blog slug')
    slugs.add(slug)
    if (!article.sections.every(section => object(section) && typeof section.heading === 'string' && typeof section.text === 'string')) throw new Error('Invalid article sections')
    if (article.body !== undefined) {
      let nodes = 0
      function validateNode(node: unknown, depth = 0): boolean {
        if (!object(node) || typeof node.type !== 'string' || depth > 12 || ++nodes > 5000) return false
        return (node.text === undefined || typeof node.text === 'string') &&
          (node.attrs === undefined || object(node.attrs)) &&
          (node.marks === undefined || (Array.isArray(node.marks) && node.marks.every(mark => validateNode(mark, depth + 1)))) &&
          (node.content === undefined || (Array.isArray(node.content) && node.content.every(child => validateNode(child, depth + 1))))
      }
      if (!object(article.body) || article.body.type !== 'doc' || !validateNode(article.body)) throw new Error('Invalid article rich text')
    }
  }
  // Uploaded media belongs to the CMS; bundled /images assets belong to the website.
  return JSON.parse(JSON.stringify(value), (_key, item) => typeof item === 'string' && item.startsWith('/uploads/') ? new URL(item, endpoint).href : item) as Snapshot
}
