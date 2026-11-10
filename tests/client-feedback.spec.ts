import { test, expect } from '@playwright/test'

for (const width of [320, 390, 768, 1024, 1101, 1280, 1440]) {
  test(`larger branding and patient guidance fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const brand = page.locator('.site-header .agai-site-brand')
    await expect(brand).toBeInViewport()
    await expect(page.locator('.hero-brand').getByRole('img', { name: 'AGAI Physiotherapy Centre' })).toBeVisible()
    if (width < 768) {
      await expect(brand.locator('.agai-header-brand strong')).toHaveCSS('font-size', '36px')
      await page.getByRole('button', { name: 'Open navigation' }).click()
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
      await page.keyboard.press('Escape')
    } else {
      await expect(brand.locator('.agai-horizontal-logo')).toHaveCSS('width', width <= 1100 ? '160px' : '200px')
      const navigation = await page.locator('#main-navigation').boundingBox()
      const logo = await brand.boundingBox()
      expect(logo!.x + logo!.width).toBeLessThanOrEqual(navigation!.x)
      expect(navigation!.x + navigation!.width).toBeLessThanOrEqual(width)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await page.locator('.hero-help-link').click()
    await expect(page).toHaveURL(/#when-to-visit$/)
    await expect(page.locator('#when-to-visit')).toBeFocused()
    await expect(page.locator('.care-need')).toHaveCount(6)
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: `test-results/feedback-needs-${width}.png` })
      await page.evaluate(() => window.scrollTo(0, 0))
      await expect(page.locator('.site-header')).toBeInViewport()
      await page.locator('.site-header').evaluate(async element => { await Promise.all(element.getAnimations().map(animation => animation.finished)) })
      await page.screenshot({ path: `test-results/feedback-home-${width}.png` })
    }
  })
}

test('a patient can move from an everyday concern to the matching service and booking', async ({ page }) => {
  await page.goto('/')
  await page.locator('.care-need').filter({ has: page.getByRole('heading', { name: 'Pain or stiffness', exact: true }) }).click()
  await expect(page).toHaveURL('/services#orthopaedic')
  const service = page.locator('#orthopaedic')
  await expect(service).toBeInViewport()
  await expect(service.getByRole('heading', { name: 'When to consider this care' })).toBeVisible()
  await expect(service.locator('.service-for-you')).toContainText('climbing stairs')
  await service.getByRole('link', { name: 'Book Appointment for Orthopaedic rehabilitation' }).click()
  await expect(page).toHaveURL('/?service=orthopaedic#appointment')
  await expect(page.getByRole('combobox', { name: 'Service *', exact: true })).toContainText('Orthopaedic rehabilitation')
})

test('About introduces the physiotherapist briefly and explains the first visit', async ({ page }) => {
  await page.goto('/about#founder')
  await expect(page.locator('#founder')).toBeFocused()
  await expect(page.locator('#founder')).toContainText('BPT, MPT')
  await expect(page.locator('.qualifications, .experience-timeline, .founder-portrait')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Tell us what is difficult' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Agree on a plan together' })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 900 })
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden()
  await page.locator('#main-navigation').evaluate(async element => { await Promise.all(element.getAnimations().map(animation => animation.finished)) })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.locator('#founder').scrollIntoViewIfNeeded()
  await page.screenshot({ path: 'test-results/feedback-founder-mobile.png' })
  await page.locator('#founder').getByRole('link', { name: 'Talk to us about your needs' }).click()
  await expect(page.locator('#appointment')).toBeInViewport()
})
