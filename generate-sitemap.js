// Mirrors the artsandscience sitemap index + child sitemaps approach.
// All content is local, so generation is offline and no PHP endpoint is needed.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { stripTypeScriptTypes } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const read = path => readFileSync(resolve(root, path), 'utf8')
const site = JSON.parse(read('src/site.json'))
if (new URL(site.url).origin !== site.url || !site.url.startsWith('https://')) {
  throw new Error('src/site.json must contain an HTTPS origin without a trailing slash')
}

// Use the actual article data, including future additions, without maintaining
// a second slug list. Node 22.18+ supports this without a new dependency.
const outputText = stripTypeScriptTypes(read('src/defaultBlogs.ts'))
const { blogArticles: defaultArticles } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const snapshot = JSON.parse(read('src/cms-snapshot.json'))
const blogArticles = snapshot.articles ?? defaultArticles

const pages = [
  { path: '/', source: 'src/pages/HomePage.tsx', changefreq: 'monthly', priority: 1.0 },
  { path: '/about', source: 'src/pages/AboutPage.tsx', changefreq: 'monthly', priority: 0.8 },
  { path: '/services', source: 'src/pages/ServicesPage.tsx', changefreq: 'monthly', priority: 0.9 },
  { path: '/blogs', source: 'src/pages/BlogsPage.tsx', changefreq: 'weekly', priority: 0.8 },
  { path: '/book-appointment', source: 'src/pages/BookAppointmentPage.tsx', changefreq: 'monthly', priority: 0.9 },
  { path: '/contact', source: 'src/pages/ContactPage.tsx', changefreq: 'monthly', priority: 0.8 },
]

// Fail the build if routes are added/removed without updating this generator.
// The router uses literal paths; count all Route elements as well so a move
// to computed routes requires an explicit update here.
const app = read('src/App.tsx')
const routes = [...app.matchAll(/<Route\s+path\s*=\s*["']([^"']+)["']/g)].map(match => match[1])
const expectedRoutes = [...pages.map(page => page.path), '/blogs/:slug', '*']
if ((app.match(/<Route\s/g) || []).length !== routes.length || routes.length !== expectedRoutes.length || expectedRoutes.some(path => !routes.includes(path))) {
  throw new Error('Routes changed: update pages and article routes in generate-sitemap.js')
}

const git = (...args) => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch { return '' }
}
const sourceTimes = new Map()
function sourceTime(path) {
  if (!sourceTimes.has(path)) {
    const committed = git('log', '-1', '--format=%cI', '--', path)
    const dirty = git('status', '--porcelain', '--', path)
    sourceTimes.set(path, committed && !dirty ? new Date(committed) : statSync(resolve(root, path)).mtime)
  }
  return sourceTimes.get(path)
}

// Follow local imports so edits to shared content and components update the
// affected pages. Omit lastmod without Git history rather than use checkout time.
const dependencies = new Map()
function sources(path, found = new Set()) {
  if (found.has(path)) return found
  found.add(path)
  if (!/\.[jt]sx?$/.test(path)) return found
  if (!dependencies.has(path)) {
    const imports = [...read(path).matchAll(/^import\s+(?:[^'";]+?\s+from\s+)?['"](\.[^'"]+)['"]/gm)].map(match => match[1])
    dependencies.set(path, imports.map(value => {
      const base = resolve(root, dirname(path), value)
      const candidate = ['', '.ts', '.tsx', '.json', '/index.ts', '/index.tsx']
        .map(extension => base + extension).find(file => existsSync(file) && statSync(file).isFile())
      if (!candidate) throw new Error(`Missing sitemap dependency: ${value} in ${path}`)
      return candidate
    }))
  }
  for (const dependency of dependencies.get(path)) sources(dependency, found)
  return found
}
const hasHistory = Boolean(git('rev-parse', '--verify', 'HEAD'))
const newest = dates => new Date(Math.max(...dates.map(date => date.getTime())))
function lastModified(source) {
  if (!hasHistory) return undefined
  const files = sources(source)
  for (const shared of ['src/content.ts', 'src/components/Layout.tsx', 'src/site.json']) sources(shared, files)
  return newest([...files].map(sourceTime))
}
const toIst = date => `${new Date(date.getTime() + 19800000).toISOString().slice(0, 19)}+05:30`
const escapeXml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])
const head = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- generated: ${toIst(new Date())} -->`
const lastmodTag = date => date ? `\n    <lastmod>${toIst(date)}</lastmod>` : ''
const articleDate = lastModified('src/pages/BlogsPage.tsx')
const groups = [
  { file: 'page-sitemap.xml', urls: pages.map(({ source, ...page }) => ({ ...page, lastmod: lastModified(source) })) },
  { file: 'blog-sitemap.xml', urls: blogArticles.map(article => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) throw new Error(`Invalid blog slug: ${article.slug}`)
    const publishedDate = article.updatedAt ? new Date(article.updatedAt) : articleDate
    if (publishedDate && Number.isNaN(publishedDate.getTime())) throw new Error(`Invalid article date: ${article.slug}`)
    return { path: `/blogs/${article.slug}`, lastmod: publishedDate, changefreq: 'monthly', priority: 0.7 }
  }) },
]
const paths = groups.flatMap(group => group.urls.map(url => url.path))
if (new Set(paths).size !== paths.length) throw new Error('Duplicate sitemap URLs')

const index = []
for (const group of groups) {
  const destination = resolve(root, 'public', group.file)
  if (!group.urls.length) {
    if (existsSync(destination)) unlinkSync(destination)
    continue
  }
  const entries = group.urls.map(url => `  <url>\n    <loc>${escapeXml(site.url + url.path)}</loc>${lastmodTag(url.lastmod)}\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority.toFixed(1)}</priority>\n  </url>`)
  writeFileSync(destination, `${head}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`)
  const dates = group.urls.map(url => url.lastmod).filter(Boolean)
  index.push(`  <sitemap>\n    <loc>${escapeXml(`${site.url}/${group.file}`)}</loc>${lastmodTag(dates.length ? newest(dates) : undefined)}\n    <!-- urls: ${group.urls.length} -->\n  </sitemap>`)
}
writeFileSync(resolve(root, 'public/sitemap.xml'), `${head}\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${index.join('\n')}\n</sitemapindex>\n`)
writeFileSync(resolve(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)
console.log(`Generated sitemap.xml (${index.length} sitemaps, ${paths.length} URLs) and robots.txt for ${site.url}`)
