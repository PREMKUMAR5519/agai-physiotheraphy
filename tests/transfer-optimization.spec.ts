import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

test('public data is reused on reload and refreshed after its freshness window', async ({ page }) => {
  let contentRequests = 0
  let serviceRequests = 0
  await page.route('**/api/public/content', route => {
    contentRequests++
    return route.fulfill({ json: snapshot })
  })
  await page.route('**/api/public/services', route => {
    serviceRequests++
    return route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } })
  })
  await page.goto('/services')
  await expect(page.locator('.service-detail')).toHaveCount(7)
  await expect(page.getByText('Updating services…')).toHaveCount(0)
  expect(contentRequests).toBe(1)
  expect(serviceRequests).toBe(1)
  await page.reload()
  await expect(page.locator('.service-detail')).toHaveCount(7)
  await expect(page.getByText('Updating services…')).toHaveCount(0)
  expect(contentRequests).toBe(1)
  expect(serviceRequests).toBe(1)
  await page.evaluate(() => {
    for (const key of Object.keys(localStorage).filter(key => key.startsWith('agai:public:v1:'))) {
      const entry = JSON.parse(localStorage.getItem(key)!)
      entry.savedAt = Date.now() - 61_000
      localStorage.setItem(key, JSON.stringify(entry))
    }
  })
  await page.reload()
  await expect(page.getByText('Updating services…')).toHaveCount(0)
  await expect.poll(() => serviceRequests).toBe(2)
  expect(contentRequests).toBe(2)
})

test('invalid browser data is replaced by validated network content', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('agai:public:v1:http://127.0.0.1:5001/api/public/content', JSON.stringify({ savedAt: Date.now(), data: { articles: [] } }))
  })
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
  await page.goto('/blogs')
  await expect(page.locator('.journal-card')).toHaveCount(snapshot.articles.length)
})

test('service and blog images use loadable versioned responsive assets', async ({ page }, testInfo) => {
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 850 })
    for (const [url, selector] of [['/services', '.service-detail-image img'], ['/blogs', '.journal-card-image img']]) {
      await page.goto(url)
      const image = page.locator(selector).first()
      await image.scrollIntoViewIfNeeded()
      await expect(image).toHaveAttribute('src', /^\/optimized\//)
      await expect(image).toHaveAttribute('srcset', /\d+w/)
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true)
      await page.screenshot({ path: testInfo.outputPath(`${url.slice(1)}-${width}.png`) })
    }
  }
})
