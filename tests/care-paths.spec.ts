import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

test.beforeEach(async ({ page }) => {
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
})

for (const width of [390, 820, 1440]) {
  test(`care paths render and filter at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/#when-to-visit')
    const section = page.locator('#when-to-visit')
    await expect(section.locator('.care-need')).toHaveCount(6)
    await section.locator('.care-need').last().scrollIntoViewIfNeeded()
    await expect.poll(() => section.locator('.care-need-icon img').evaluateAll(nodes => nodes.every(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0))).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await section.screenshot({ path: testInfo.outputPath(`care-paths-${width}.png`), style: '.site-header, .care-chat, .skip-link { visibility: hidden !important; }' })
    await section.getByRole('button', { name: 'Women’s health', exact: true }).click()
    await expect(section.locator('.care-need')).toHaveCount(1)
    await expect(section.locator('.care-need')).toHaveAttribute('href', '/services#womens-wellness')
    const search = section.getByRole('searchbox', { name: 'Search care paths' })
    await search.fill('back pain')
    await expect(section.locator('.care-need')).toHaveCount(0)
    await section.getByRole('button', { name: 'Show all care paths' }).click()
    await expect(search).toHaveValue('')
    await expect(section.locator('.care-need')).toHaveCount(6)
    await search.fill('back pain')
    await section.getByRole('button', { name: 'Find care', exact: true }).click()
    await expect(section.locator('#care-path-results')).toBeFocused()
    await expect(section.locator('.care-need')).toHaveCount(1)
    await section.locator('.care-need').click()
    await expect(page).toHaveURL('/services#orthopaedic')
  })
}
