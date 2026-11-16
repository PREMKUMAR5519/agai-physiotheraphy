import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

const service = { ...snapshot.content.services[0], id: 'live-service', title: 'Live movement coaching', shortTitle: 'Live movement coaching', category: 'wellness' }
test.beforeEach(async ({ page }) => {
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
})

test('shared context loads a new service, preserves direct appointment selection and updates navigation', async ({ page }) => {
  let requests = 0
  let release: () => void = () => {}
  const waiting = new Promise<void>(resolve => { release = resolve })
  await page.route('**/api/public/services', async route => {
    requests++
    await waiting
    await route.fulfill({ json: { schemaVersion: 1, services: [service] } })
  })
  await page.goto('/?service=live-service#appointment')
  await expect(page.getByText('Updating services…')).toBeVisible()
  // The fallback remains rendered while the API is pending.
  await expect(page.locator('.service-preview')).toHaveCount(snapshot.content.services.length)
  release()
  await expect(page.locator('.service-preview h3')).toHaveText(service.shortTitle)
  await expect(page.getByRole('combobox', { name: 'Service *', exact: true })).toContainText(service.shortTitle)
  await page.locator('.service-preview').click()
  await expect(page.locator('.service-detail h3')).toHaveText(service.title)
  await expect(page).toHaveURL(/services#live-service/)
  expect(requests).toBeLessThanOrEqual(2) // StrictMode may cancel the initial development request.
})

test('failed services fetch keeps cached data and retry updates the existing context', async ({ page }) => {
  let failed = true
  await page.route('**/api/public/services', route => failed ? route.fulfill({ status: 503, json: { message: 'Unavailable' } }) : route.fulfill({ json: { schemaVersion: 1, services: [service] } }))
  await page.goto('/services')
  await expect(page.getByText('We could not refresh services.', { exact: false })).toBeVisible()
  await expect(page.locator('.service-detail')).toHaveCount(snapshot.content.services.length)
  failed = false
  await page.getByRole('button', { name: 'Retry loading services' }).click()
  await expect(page.locator('.service-detail h3')).toHaveText(service.title)
  await expect(page.getByRole('button', { name: 'Retry loading services' })).toHaveCount(0)
})

test('empty published services do not restore fallback services', async ({ page }) => {
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: [] } }))
  await page.goto('/services')
  await expect(page.locator('.service-detail')).toHaveCount(0)
  await expect(page.getByText('No services are currently published.', { exact: false })).toBeVisible()
})
