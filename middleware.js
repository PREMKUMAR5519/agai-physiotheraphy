import { next, rewrite } from '@vercel/functions'
import snapshot from './src/cms-snapshot.json' with { type: 'json' }
import { contentEndpoint, parsePublishedContent } from './src/cms-contract.ts'

export const config = { matcher: ['/blogs/:slug', '/ta/blogs/:slug'], runtime: 'nodejs' }

function unavailable(status, tamil = false) {
  const missing = status === 404
  const title = tamil ? (missing ? 'கட்டுரை கிடைக்கவில்லை' : 'கட்டுரைகள் தற்காலிகமாகக் கிடைக்கவில்லை') : missing ? 'Article not found' : 'Articles temporarily unavailable'
  return new Response(`<!doctype html><html lang="${tamil ? 'ta' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><title>${title} | AGAI Physiotherapy Centre</title></head><body><main><h1>${title}.</h1><p>${tamil ? (missing ? 'இந்தக் கட்டுரை இல்லை அல்லது வெளியீட்டிலிருந்து நீக்கப்பட்டுள்ளது.' : 'சிறிது நேரம் கழித்து மீண்டும் முயலுங்கள்.') : missing ? 'This article does not exist or is no longer published.' : 'Please try again shortly.'}</p><a href="${tamil ? '/ta/blogs' : '/blogs'}">${tamil ? 'கட்டுரைகளைப் பாருங்கள்' : 'Explore the journal'}</a></main></body></html>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, follow', ...(missing ? {} : { 'Retry-After': '60' }) },
  })
}

// Built articles use their static files. Only unbuilt slugs require a CMS lookup.
export default async function middleware(request) {
  const url = new URL(request.url)
  const tamil = url.pathname.startsWith('/ta/')
  const match = /^(?:\/ta)?\/blogs\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(url.pathname)
  if (!match) return unavailable(404, tamil)
  const slug = match[1]
  if (snapshot.articles.some(article => article.slug === slug)) return next()
  try {
    const endpoint = contentEndpoint(process.env.CMS_API_URL || process.env.VITE_CMS_API_URL)
    if (!endpoint) return unavailable(404, tamil)
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(4000), cache: 'no-store', credentials: 'omit' })
    if (!response.ok) return unavailable(503, tamil)
    const content = parsePublishedContent(await response.json(), endpoint)
    if (!content.articles.some(article => article.slug === slug)) return unavailable(404, tamil)
    url.pathname = tamil ? '/ta/blogs' : '/blogs'
    return rewrite(url, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    // An outage is not evidence that a newly published article doesn't exist.
    return unavailable(503, tamil)
  }
}
