import { test, expect } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`navbar follows scroll direction at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/services')
    const header = page.locator('.site-header')
    await expect(header).toBeInViewport()
    await page.mouse.wheel(0, 900)
    await expect(header).not.toBeInViewport()
    await page.mouse.wheel(0, -150)
    await expect.poll(async () => (await header.boundingBox())?.y).toBe(0)
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(500)
    await page.mouse.wheel(0, 200)
    await expect(header).not.toBeInViewport()
    // Keyboard users can still reach navigation while it is hidden.
    await header.getByRole('link', { name: 'AGAI Physiotherapy Centre - home' }).focus()
    await expect.poll(async () => (await header.boundingBox())?.y).toBe(0)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect(header).toBeInViewport()
  })
}

test('mobile navigation stays open at a scrolled position', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/services')
  await page.mouse.wheel(0, 900)
  await expect(page.locator('.site-header')).not.toBeInViewport()
  await page.mouse.wheel(0, -150)
  await expect.poll(async () => (await page.locator('.site-header').boundingBox())?.y).toBe(0)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await expect(nav).toBeInViewport()
  await expect.poll(async () => (await nav.boundingBox())?.y).toBe(0)
  await page.mouse.wheel(0, 200)
  await expect(page.locator('.site-header')).toBeInViewport()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused()
  await expect(nav).toBeHidden()
  await page.mouse.move(195, 500)
  await page.mouse.wheel(0, 200)
  await expect(page.locator('.site-header')).not.toBeInViewport()
})

test('navbar respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services')
  await expect(page.locator('.site-header')).toHaveCSS('transition-duration', '0s')
})
