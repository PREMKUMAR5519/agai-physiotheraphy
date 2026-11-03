import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/contact')
  await page.getByLabel('Your name').fill('Test Visitor')
  await page.getByLabel('Your message').fill('I would like to arrange a visit next week.')
})

test('rejects invalid phone numbers and allows correction without an email', async ({ page }) => {
  const phone = page.getByLabel('Phone number', { exact: false })
  const submit = page.getByRole('button', { name: 'Submit enquiry', exact: true })
  await submit.click()
  await expect(phone).toBeFocused()
  await expect(page.locator('.draft-preview')).toHaveCount(0)

  for (const value of ['abcdefg', '98765abc210', '123456', '1234567890123456', '   ', '++919600066505', '9196+00066505']) {
    await phone.fill(value)
    await submit.click()
    await expect(phone).toBeFocused()
    await expect(phone).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('alert')).toContainText('7–15 digits')
    await expect(page.locator('.draft-preview')).toHaveCount(0)
  }

  await phone.fill('+91 96000 66505')
  await expect(page.getByRole('alert')).toHaveCount(0)
  await submit.click()
  await expect(page.getByLabel('Enquiry draft')).toHaveValue(/Email: Not provided\nPhone: \+91 96000 66505/)
  await phone.fill('invalid')
  await expect(page.locator('.draft-preview')).toHaveCount(0)
  await submit.click()
  await expect(phone).toHaveAttribute('aria-invalid', 'true')
})

test('accepts local and international formatting', async ({ page }) => {
  const phone = page.getByLabel('Phone number', { exact: false })
  for (const value of ['9600066505', '+91 (96000) 66505', '+1 (202) 555-0123', '020 7946 0958', '+44.20.7946.0958']) {
    await phone.fill(value)
    await page.getByRole('button', { name: 'Submit enquiry', exact: true }).click()
    await expect(page.getByLabel('Enquiry draft')).toHaveValue(new RegExp(`Phone: ${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))
    await expect(page.getByRole('alert')).toHaveCount(0)
  }
})
