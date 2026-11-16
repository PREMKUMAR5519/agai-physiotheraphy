import snapshot from './cms-snapshot.json' with { type: 'json' }

type Snapshot = typeof snapshot
let current: Snapshot = snapshot

// Load before App so shared components use the same published content per visit.
// The build snapshot keeps the website available during a CMS outage.
export async function loadPublishedContent() {
  const base = import.meta.env.VITE_CMS_API_URL?.replace(/\/$/, '')
  if (!base) return false
  try {
    const response = await fetch(`${base}/api/public/content`, { signal: AbortSignal.timeout(4000), cache: 'no-store' })
    if (!response.ok) throw new Error(`CMS returned ${response.status}`)
    const data = await response.json()
    if (data.schemaVersion !== 1 || !Array.isArray(data.articles) || !data.content?.clinic || !Array.isArray(data.content.services) || !Array.isArray(data.content.faqs)) throw new Error('Invalid CMS response')
    current = data
    return JSON.stringify(data.content) !== JSON.stringify(snapshot.content) || JSON.stringify(data.articles) !== JSON.stringify(snapshot.articles)
  } catch (error) {
    console.warn('Using the last built website content because the CMS is unavailable.', error)
    return false
  }
}

export function getContent<T>(key: keyof Snapshot['content'], fallback: T): T {
  const value = current.content[key]
  if (value && !Array.isArray(value) && typeof value === 'object') return { ...fallback, ...value } as T
  return (value ?? fallback) as T
}
export function getArticles<T>(fallback: T): T {
  return (current.articles ?? fallback) as T
}