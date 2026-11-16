import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

for (const width of [390, 820, 1440]) {
  test(`50 services keep images beside readable text at ${width}px`, async ({ page }, testInfo) => {
    const services = Array.from({ length: 50 }, (_, index) => ({
      ...snapshot.content.services[index % snapshot.content.services.length],
      id: `service-${index}`,
      shortTitle: index === 1 ? 'Individual movement rehabilitation and conditioning support '.repeat(20) : `Movement care ${index + 1}`,
      ...(index === 1 ? { intro: 'Personalised rehabilitation and exercise advice for everyday movement. '.repeat(40) } : {}),
      ...(index === 2 ? { shortTitle: 'UnbrokenServiceTitle'.repeat(30), intro: 'UnbrokenDescription'.repeat(80) } : {}),
      // Exercise both optimized picture markup and plain CMS image markup.
      ...(index % 2 ? { previewImage: '/images/home-hero-main.webp' } : {}),
    }))
    await page.setViewportSize({ width, height: 900 })
    await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
    await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services } }))
    await page.goto('/')
    const cards = page.locator('.service-preview')
    await expect(cards).toHaveCount(50)
    await cards.first().scrollIntoViewIfNeeded()
    const bounds = await cards.evaluateAll(nodes => nodes.map(card => {
      const image = card.querySelector('img')!.getBoundingClientRect()
      const copy = card.querySelector('.service-preview-copy')!.getBoundingClientRect()
      const box = card.getBoundingClientRect()
      const title = card.querySelector('h3')!
      const description = card.querySelector('p')!
      return { imageRight: image.right, imageTop: image.top, imageHeight: image.height,
        titleHeight: title.getBoundingClientRect().height, titleLineHeight: parseFloat(getComputedStyle(title).lineHeight),
        descriptionHeight: description.getBoundingClientRect().height, descriptionLineHeight: parseFloat(getComputedStyle(description).lineHeight),
        copyLeft: copy.left, copyTop: copy.top, copyBottom: copy.bottom, copyWidth: copy.width,
        cardBottom: box.bottom, cardTop: box.top, cardHeight: box.height }
    }))
    for (const box of bounds) {
      expect(box.cardHeight).toBe(190)
      expect(box.titleHeight).toBeLessThanOrEqual(box.titleLineHeight * 2 + 1)
      expect(box.descriptionHeight).toBeLessThanOrEqual(box.descriptionLineHeight * 3 + 1)
      expect(box.imageRight).toBeLessThanOrEqual(box.copyLeft + 1)
      expect(box.imageTop).toBeCloseTo(box.cardTop + 1, 0)
      expect(box.imageHeight).toBeCloseTo(box.cardHeight - 2, 0)
      expect(box.copyWidth).toBeGreaterThan(170)
      expect(box.copyBottom).toBeLessThanOrEqual(box.cardBottom)
      expect(box.copyTop).toBeLessThan(box.cardBottom - 30)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(cards.last()).toHaveAttribute('href', '/services#service-49')
    await page.screenshot({ path: testInfo.outputPath(`services-${width}.png`) })
  })
}
