import { expect, test } from '@playwright/test'
import { blogArticles } from '../src/blogs'
import site from '../src/site.json' with { type: 'json' }
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

// These expectations describe the build snapshot, independent of a local CMS.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
})

test('robots and sitemap index expose every public route as valid XML', async ({ page, request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(robots.headers()['content-type']).toContain('text/plain')
  expect(await robots.text()).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)
  await page.goto('/')
  async function parseSitemap(path: string) {
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
    const xml = await response.text()
    expect(xml).toContain('href="/sitemap.xsl"')
    return page.evaluate(source => {
      const document = new DOMParser().parseFromString(source, 'application/xml')
      return {
        errors: document.querySelectorAll('parsererror').length,
        root: document.documentElement.localName,
        namespace: document.documentElement.namespaceURI,
        urls: [...document.querySelectorAll('loc')].map(node => node.textContent),
        dates: [...document.querySelectorAll('lastmod')].map(node => node.textContent),
      }
    }, xml)
  }
  const index = await parseSitemap('/sitemap.xml')
  expect(index.errors).toBe(0)
  expect(index.root).toBe('sitemapindex')
  expect(index.urls).toEqual([`${site.url}/page-sitemap.xml`, `${site.url}/blog-sitemap.xml`])
  const urls: string[] = []
  for (const url of index.urls) {
    const child = await parseSitemap(new URL(url).pathname)
    expect(child.errors).toBe(0)
    expect(child.root).toBe('urlset')
    expect(child.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9')
    for (const date of child.dates) expect(Number.isFinite(Date.parse(date))).toBe(true)
    urls.push(...child.urls)
  }
  expect(urls.sort()).toEqual([
    '/', '/about', '/services', '/blogs', '/contact',
    ...blogArticles.map(article => `/blogs/${article.slug}`),
  ].map(path => site.url + path).sort())
  const stylesheet = await request.get('/sitemap.xsl')
  expect(stylesheet.status()).toBe(200)
  expect(await stylesheet.text()).toContain('AGAI Physiotherapy Centre')
})

test('canonical and robots metadata follow routes, filters, and missing pages', async ({ page }) => {
  for (const path of ['/', '/about', '/services?category=all#care', '/blogs?q=care', '/contact/', ...blogArticles.map(article => `/blogs/${article.slug}`)]) {
    await page.goto(path)
    const canonicalPath = new URL(path, site.url).pathname.replace(/\/$/, '') || '/'
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', site.url + canonicalPath)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  }
  for (const path of ['/does-not-exist', '/blogs/does-not-exist']) {
    await page.goto(path)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
  }
  await page.getByRole('link', { name: 'Explore the journal' }).click()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.url}/blogs`)
  await page.getByRole('link', { name: 'About us', exact: true }).first().click()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.url}/about`)
})
