import { blogArticles } from './blogs.ts'
import { clinic } from './content.ts'
import site from './site.json' with { type: 'json' }

// Single source for page metadata: used by the client on navigation and by
// prerender.js to write the same values into each static HTML file.
const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'AGAI Physiotherapy Centre | Sports Rehabilitation & Performance', description: 'Move better. Recover stronger. Perform better. Connect with AGAI in Ambattur, Chennai for sports rehabilitation, injury prevention and personalised physiotherapy care.' },
  '/about': { title: 'About us | AGAI Physiotherapy Centre', description: 'Meet your physiotherapist at AGAI in Ambattur, Chennai, and learn what to expect from your first visit and personalised care.' },
  '/services': { title: 'Our services | AGAI Physiotherapy Centre', description: 'Explore our physiotherapy services, including sports injury rehabilitation, conditioning, orthopaedics, neurology, women’s wellness, pelvic floor and geriatric rehabilitation.' },
  '/blogs': { title: 'The AGAI Journal | Blogs', description: 'Thoughtful reads on movement, everyday wellbeing and preparing for physiotherapy care at AGAI.' },
  '/contact': { title: 'Contact us | AGAI Physiotherapy Centre', description: 'Contact AGAI Physiotherapy Centre and prepare an enquiry about rehabilitation, physiotherapy services or appointments.' },
}

export const socialImage = `${site.url}/brand-kit/assets/agai-social-1200x630.png`

export function normalizePath(pathname: string) {
  return pathname.replace(/\/$/, '') || '/'
}

export function getPageMeta(pathname: string) {
  const path = normalizePath(pathname)
  const article = path.startsWith('/blogs/') ? blogArticles.find(item => `/blogs/${item.slug}` === path) : undefined
  const meta = article
    ? { title: `${article.title} | AGAI Journal`, description: article.excerpt }
    : pageMeta[path] || { title: 'Page not found | AGAI Physiotherapy Centre', description: 'Find your way back to AGAI Physiotherapy Centre.' }
  const indexable = Boolean(article || pageMeta[path])
  return {
    ...meta,
    indexable,
    canonical: indexable ? `${site.url}${path}` : undefined,
    type: article ? 'article' : 'website',
  }
}

/** Every URL that gets its own static HTML file at build time. */
export const prerenderPaths = [...Object.keys(pageMeta), ...blogArticles.map(article => `/blogs/${article.slug}`)]

// Derived from the clinic details so content edits flow through.
// Add a street address to clinic.address once it is confirmed.
const [latitude, longitude] = (clinic.mapsEmbedUrl.match(/[?&]ll=(-?[\d.]+),(-?[\d.]+)/) ?? []).slice(1).map(Number)

/** schema.org description of the clinic, written into the head of each prerendered page. */
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Physiotherapy',
  '@id': `${site.url}/#clinic`,
  name: clinic.name,
  url: site.url,
  image: socialImage,
  telephone: clinic.phone || undefined,
  email: clinic.email || undefined,
  address: clinic.address ? {
    '@type': 'PostalAddress',
    streetAddress: clinic.address,
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    postalCode: clinic.address.match(/\b\d{6}\b/)?.[0],
    addressCountry: 'IN',
  } : undefined,
  geo: Number.isFinite(latitude) && Number.isFinite(longitude) ? { '@type': 'GeoCoordinates', latitude, longitude } : undefined,
  hasMap: clinic.mapsUrl || undefined,
  founder: { '@type': 'Person', name: clinic.founder, jobTitle: 'Sports Physiotherapist' },
}
