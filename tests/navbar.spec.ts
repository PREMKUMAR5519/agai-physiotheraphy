import { test, expect, devices } from '@playwright/test'

for (const device of ['iPhone 13', 'Pixel 7']) {
test(`${device} viewport stays stable while the navbar hides and chat remains visible`, async ({ browser }) => {
  const context = await browser.newContext({ ...devices[device] })
  const page = await context.newPage()
  try {
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const width = await page.evaluate(() => window.innerWidth)
    for (const y of [500, 1000, 1600, 2500, 500, 0]) {
      await page.evaluate(y => window.scrollTo(0, y), y)
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(y)
      if (y === 500 && await page.evaluate(() => window.scrollY) === 500) {
        // Wait for the first hide animation, where transformed drawers previously caused overflow.
        await page.locator('.site-header').evaluate(async element => {
          await Promise.all(element.getAnimations().map(animation => animation.finished))
        })
      }
      await expect.poll(() => page.evaluate(() => window.innerWidth)).toBe(width)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      const launcher = page.getByRole('button', { name: 'Open AGAI chat' })
      await expect(launcher).toBeInViewport()
      const rect = (await launcher.boundingBox())!
      expect(rect.x + rect.width).toBeLessThanOrEqual(width)
    }
    await page.evaluate(() => window.scrollTo(0, 1600))
    await page.getByRole('button', { name: 'Open AGAI chat' }).tap()
    await expect(page.getByRole('dialog')).toBeInViewport()
  } finally {
    await context.close()
  }
})
}

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
