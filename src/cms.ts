import snapshot from './cms-snapshot.json' with { type: 'json' }
import { contentEndpoint, parsePublishedContent } from './cms-contract'

type Snapshot = typeof snapshot
let current: Snapshot = snapshot

// Load before App so shared components use the same published content per visit.
// The build snapshot keeps the website available during a CMS outage.
export async function loadPublishedContent() {
  try {
    const endpoint = contentEndpoint(import.meta.env.VITE_CMS_API_URL)
    if (!endpoint) return false
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(4000), cache: 'no-store', credentials: 'omit' })
    if (!response.ok) throw new Error(`CMS returned ${response.status}`)
    const data = parsePublishedContent(await response.json(), endpoint)
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
