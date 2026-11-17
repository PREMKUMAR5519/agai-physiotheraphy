import { englishPath, isTamilPath, languagePath, translatedPages } from './locale-paths'
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
  '/book-appointment': { title: 'Book appointment | AGAI Physiotherapy Centre', description: 'Book a physiotherapy appointment at AGAI Physiotherapy Centre in Ambattur, Chennai. Choose a service and tell us what you need help with.' },
  '/ta': { title: 'AGAI இயன்முறை மருத்துவ மையம் | அம்பத்தூர், சென்னை', description: 'இயக்கம், மீட்சி மற்றும் உடற்திறனுக்கான தனிப்பட்ட இயன்முறை மருத்துவம். சென்னை அம்பத்தூரில் உள்ள AGAI மையத்தின் சேவைகளை அறியுங்கள்.' },
  '/ta/about': { title: 'எங்களைப் பற்றி | AGAI இயன்முறை மருத்துவ மையம்', description: 'AGAI மையத்தின் மருத்துவர், சிகிச்சை அணுகுமுறை மற்றும் முதல் வருகையில் எதிர்பார்க்கக்கூடியவை குறித்து அறியுங்கள்.' },
  '/ta/services': { title: 'எங்கள் சேவைகள் | AGAI இயன்முறை மருத்துவ மையம்', description: 'விளையாட்டுக் காயங்கள், மூட்டுப் பிரச்சினைகள், நரம்பியல் பாதிப்புகள், பெண்கள் நலம் மற்றும் முதியோருக்கான மறுவாழ்வுச் சேவைகளை அறியுங்கள்.' },
  '/ta/blogs': { title: 'கட்டுரைகள் | AGAI இயன்முறை மருத்துவ மையம்', description: 'இயக்கம், அன்றாட நலம் மற்றும் சிகிச்சைக்குத் தயாராவது குறித்த AGAI கட்டுரைகளைப் பாருங்கள். கட்டுரைகள் தற்போது ஆங்கிலத்தில் உள்ளன.' },
  '/ta/book-appointment': { title: 'சந்திப்புக்கு முன்பதிவு | AGAI இயன்முறை மருத்துவ மையம்', description: 'சென்னை அம்பத்தூரில் உள்ள AGAI மையத்தில் சந்திப்புக்கு முன்பதிவு செய்யுங்கள். உங்களுக்கு ஏற்ற சேவை, தேதி மற்றும் நேரத்தைத் தெரிவியுங்கள்.' },
  '/ta/contact': { title: 'தொடர்புகொள்ளுங்கள் | AGAI இயன்முறை மருத்துவ மையம்', description: 'சேவைகள் அல்லது சந்திப்பு குறித்துக் கேட்க AGAI மையத்தைத் தொடர்புகொள்ளுங்கள். உங்கள் விசாரணையைத் தமிழில் அனுப்பலாம்.' },
  '/contact': { title: 'Contact us | AGAI Physiotherapy Centre', description: 'Contact AGAI Physiotherapy Centre and prepare an enquiry about rehabilitation, physiotherapy services or appointments.' },
}

export const socialImage = `${site.url}/brand-kit/assets/agai-social-1200x630.png`

export function normalizePath(pathname: string) {
  return pathname.replace(/\/$/, '') || '/'
}

export function getPageMeta(pathname: string) {
  const path = normalizePath(pathname)
  const sourcePath = englishPath(path)
  const article = sourcePath.startsWith('/blogs/') ? blogArticles.find(item => `/blogs/${item.slug}` === sourcePath) : undefined
  const meta = article
    ? { title: `${article.title} | AGAI Journal`, description: article.excerpt }
    : pageMeta[path] || { title: 'Page not found | AGAI Physiotherapy Centre', description: 'Find your way back to AGAI Physiotherapy Centre.' }
  const indexable = Boolean((article && !isTamilPath(path)) || pageMeta[path])
  const language = isTamilPath(path) ? 'ta' : 'en'
  const alternates = translatedPages.includes(sourcePath)
    ? [{ language: 'en', href: `${site.url}${sourcePath}` }, { language: 'ta', href: `${site.url}${languagePath(sourcePath, true)}` }, { language: 'x-default', href: `${site.url}${sourcePath}` }]
    : []
  return {
    ...meta,
    language,
    alternates,
    indexable,
    canonical: indexable ? `${site.url}${path}` : undefined,
    type: article ? 'article' : 'website',
  }
}

/** Every URL that gets its own static HTML file at build time. */
export const prerenderPaths = [...Object.keys(pageMeta), ...blogArticles.flatMap(article => [`/blogs/${article.slug}`, `/ta/blogs/${article.slug}`])]

// Derived from the clinic details so content edits flow through.
// Add a street address to clinic.address once it is confirmed.
const [latitude, longitude] = (clinic.mapsEmbedUrl.match(/[?&]ll=(-?[\d.]+),(-?[\d.]+)/) ?? []).slice(1).map(Number)

/** schema.org description of the clinic, written into the head of each prerendered page. */
// Tells search engines the short name to show above the address in results.
const website = {
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  name: 'AGAI',
  alternateName: [clinic.name, 'AGAI Physiotherapy'],
  url: `${site.url}/`,
}

const clinicData = {
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

export const structuredData = { '@context': 'https://schema.org', '@graph': [website, clinicData] }
export const siteUrl = site.url
