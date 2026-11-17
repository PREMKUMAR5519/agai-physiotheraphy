import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

test.use({ timezoneId: 'America/Los_Angeles' })
test.beforeEach(async ({ page }) => {
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
  await page.clock.install({ time: new Date('2026-11-17T10:00:00Z') }) // 15:30 IST, 02:00 in Los Angeles
  await page.addInitScript(() => { window.open = url => { document.documentElement.dataset.whatsapp = String(url); return null } })
  await page.goto('/book-appointment')
  await page.getByLabel('Full name').fill('Test Visitor')
  await page.getByLabel('Contact number').fill('+91 (96000) 66505')
  await page.getByRole('combobox', { name: 'Service *', exact: true }).click()
  await page.getByRole('option', { name: 'Not sure yet / help me choose', exact: true }).click()
  await page.locator('.appointment-card').getByRole('checkbox').check()
})

test('booking rejects invalid phones and accepts international formatting', async ({ page }) => {
  for (const phone of ['abc1234567', '1234567890123456', '123+4567890']) {
    await page.getByLabel('Contact number').fill(phone)
    await page.getByRole('button', { name: 'Continue choosing date' }).click()
    await expect(page.getByRole('alert')).toHaveText('Please enter a valid contact number.')
    await expect(page.getByLabel('Contact number')).toBeFocused()
    await expect(page.locator('.booking-calendar')).toHaveCount(0)
  }
  await page.getByLabel('Contact number').fill('+91 (96000) 66505')
  await page.getByRole('button', { name: 'Continue choosing date' }).click()
  await expect(page.locator('.booking-calendar')).toBeVisible()
})

test('today disables elapsed IST slots, future dates and flexible dates retain them', async ({ page }) => {
  await page.getByRole('button', { name: 'Continue choosing date' }).click()
  await page.locator('[data-date="2026-11-17"]').click()
  await expect(page.getByRole('radio', { name: '09:00 AM', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Afternoon', exact: true }).click()
  await expect(page.getByRole('radio', { name: '03:30 PM', exact: true })).toBeDisabled()
  await expect(page.getByRole('radio', { name: '04:00 PM', exact: true })).toBeEnabled()
  await page.locator('[data-date="2026-11-18"]').click()
  await page.getByRole('radio', { name: '12:00 PM', exact: true }).check()
  await page.locator('[data-date="2026-11-17"]').click()
  await expect(page.getByRole('radio', { name: 'Any time works for me' })).toBeChecked()
  await page.getByRole('button', { name: 'Flexible date', exact: true }).click()
  await expect(page.getByRole('radio', { name: '12:00 PM', exact: true })).toBeEnabled()
})

test('a selected time that expires while the form is open cannot be submitted', async ({ page }) => {
  await page.getByRole('button', { name: 'Continue choosing date' }).click()
  await page.locator('[data-date="2026-11-17"]').click()
  await page.getByRole('button', { name: 'Afternoon', exact: true }).click()
  await page.getByRole('radio', { name: '04:00 PM', exact: true }).check()
  await page.clock.fastForward(31 * 60 * 1000)
  await expect(page.getByRole('radio', { name: '04:00 PM', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Book appointment', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('That time has already passed')
  await expect(page.locator('html')).not.toHaveAttribute('data-whatsapp')
  await page.getByRole('radio', { name: '04:30 PM', exact: true }).check()
  await page.getByRole('button', { name: 'Book appointment', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-whatsapp', /wa.me/)
})
