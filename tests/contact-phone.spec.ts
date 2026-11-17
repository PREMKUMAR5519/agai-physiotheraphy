import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/public/contact', route => route.fulfill({ status: 201, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true }) }))
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
  await expect(page.getByRole('heading', { name: 'Enquiry received.' })).toBeVisible()
  await expect(page.locator('.enquiry-card form')).toHaveCount(0)
})

test('accepts local and international formatting', async ({ page }) => {
  const phone = page.getByLabel('Phone number', { exact: false })
  for (const value of ['9600066505', '+91 (96000) 66505', '+1 (202) 555-0123', '020 7946 0958', '+44.20.7946.0958']) {
    await page.goto('/contact')
    await page.getByLabel('Your name').fill('Test Visitor')
    await page.getByLabel('Your message').fill('I would like to arrange a visit next week.')
    await phone.fill(value)
    await page.getByRole('button', { name: 'Submit enquiry', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Enquiry received.' })).toBeVisible()
    await expect(page.getByRole('alert')).toHaveCount(0)
  }
})

test('keeps the form and entered details when submission fails', async ({ page }) => {
  await page.route('**/api/public/contact', route => route.fulfill({ status: 500, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: false, message: 'Please try again.' }) }))
  await page.getByLabel('Phone number').fill('9600066505')
  await page.getByRole('button', { name: 'Submit enquiry', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('Please try again.')
  await expect(page.getByLabel('Your name')).toHaveValue('Test Visitor')
  await expect(page.getByLabel('Your message')).toHaveValue('I would like to arrange a visit next week.')
  await expect(page.getByRole('button', { name: 'Submit enquiry', exact: true })).toBeEnabled()
  await expect(page.locator('.draft-preview')).toHaveCount(0)
})
