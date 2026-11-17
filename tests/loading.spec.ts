import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

for (const width of [390, 1440]) {
  test(`loading spinner is centered and clears when ready at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    let release!: () => void
    const waiting = new Promise<void>(resolve => { release = resolve })
    await page.route('**/api/public/content', async route => {
      await waiting
      await route.fulfill({ json: snapshot })
    })
    await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
    await page.goto('/book-appointment', { waitUntil: 'domcontentloaded' })
    const loader = page.locator('#startup-screen')
    await expect(loader).toBeVisible()
    await expect(page.getByText('Loading website', { exact: false })).toHaveCount(0)
    const spinner = (await page.locator('.startup-spinner').boundingBox())!
    expect(Math.abs(spinner.x + spinner.width / 2 - width / 2)).toBeLessThan(2)
    expect(Math.abs(spinner.y + spinner.height / 2 - 844 / 2)).toBeLessThan(2)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('.startup-spinner')).toHaveCSS('animation-name', 'none')
    release()
    await expect(page.getByLabel('Full name')).toBeVisible()
    await expect(loader).toBeHidden()
    await expect(page.locator('#root')).toHaveAttribute('aria-busy', 'false')
  })
}

test('a failed page module shows a retry and recovers on reload', async ({ page }) => {
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  let fail = true
  await page.route('**/src/App.tsx', route => fail ? route.abort() : route.continue())
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Unable to load the page' })).toBeVisible()
  await expect(page.locator('.startup-spinner')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Try again' })).toBeFocused()
  fail = false
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.locator('#main')).toBeVisible()
  await expect(page.locator('#startup-screen')).toBeHidden()
})

test('CMS failure falls back to the saved page instead of leaving the loader', async ({ page }) => {
  await page.route('**/api/public/content', route => route.abort())
  await page.goto('/book-appointment')
  await expect(page.getByLabel('Full name')).toBeVisible()
  await expect(page.locator('#startup-screen')).toBeHidden()
})
