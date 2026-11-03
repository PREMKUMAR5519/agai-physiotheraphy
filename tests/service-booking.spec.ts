import { test, expect } from '@playwright/test'
import { services } from '../src/content'

test('service links open booking with the matching service selected', async ({ page }) => {
  for (const service of services) {
    await page.goto('/services')
    await page.locator(`#${service.id} .service-enquiry`).click()
    await expect(page).toHaveURL(`/?service=${service.id}#appointment`)
    await expect(page.locator('#appointment')).toBeInViewport()
    await expect(page.locator('#appointment-service')).toContainText(service.shortTitle)
  }
  await page.reload()
  await expect(page.locator('#appointment-service')).toContainText(services[6].shortTitle)
})

test('unknown service leaves the booking choice empty', async ({ page }) => {
  await page.goto('/?service=unknown#appointment')
  await expect(page.locator('#appointment-service')).toContainText('Select')
})
