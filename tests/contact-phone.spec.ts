import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

test.beforeEach(async ({ page }) => {
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
  await page.route('**/gtm.js*', route => route.abort())
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

  for (const value of ['123456', '1234567890123456']) {
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

test('normalizes local and international formatting before submission', async ({ page }) => {
  const phone = page.getByLabel('Phone number', { exact: false })
  let submittedPhone = ''
  await page.route('**/api/public/contact', route => {
    submittedPhone = route.request().postDataJSON().phone
    return route.fulfill({ status: 201, json: { ok: true } })
  })
  for (const value of ['9600066505', '+91 (96000) 66505', '+1 (202) 555-0123', '020 7946 0958', '+44.20.7946.0958']) {
    await page.goto('/contact')
    await page.getByLabel('Your name').fill('Test Visitor')
    await page.getByLabel('Your message').fill('I would like to arrange a visit next week.')
    await phone.fill(value)
    await expect(phone).toHaveValue(value.replace(/\D/g, ''))
    await page.getByRole('button', { name: 'Submit enquiry', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Enquiry received.' })).toBeVisible()
    await expect(page.getByRole('alert')).toHaveCount(0)
    expect(submittedPhone).toBe(value.replace(/\D/g, ''))
  }
})

test('removes non-digits during entry and preserves the cursor when correcting a number', async ({ page }) => {
  const phone = page.locator('#enquiry-phone')
  await expect(phone).toHaveAttribute('inputmode', 'numeric')
  await phone.fill('abcdefg')
  await expect(phone).toHaveValue('')
  await page.locator('.prepare-button').click()
  await expect(phone).toBeFocused()
  await expect(page.locator('.draft-preview')).toHaveCount(0)
  await phone.pressSequentially('abc96000xyz66505')
  await expect(phone).toHaveValue('9600066505')
  await phone.evaluate((input: HTMLInputElement) => input.setSelectionRange(5, 5))
  await phone.pressSequentially('a7')
  await expect(phone).toHaveValue('96000766505')
  expect(await phone.evaluate((input: HTMLInputElement) => input.selectionStart)).toBe(6)
  await phone.press('Backspace')
  await expect(phone).toHaveValue('9600066505')
  await phone.fill('')
  // Insert a complete pasted value in a single input event, including formatting.
  await phone.fill('+91 (96000) 66505 abc')
  await expect(phone).toHaveValue('919600066505')
})

for (const language of ['en', 'ta']) {
  test(`shows sending progress, prevents duplicates and recovers after failure in ${language}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    if (language === 'ta') await page.goto('/ta/contact')
    await page.locator('#enquiry-name').fill('Test Visitor')
    await page.locator('#enquiry-message').fill('I would like to arrange a visit next week.')
    await page.locator('#enquiry-phone').fill('9600066505')
    let release!: () => void
    const pending = new Promise<void>(resolve => { release = resolve })
    let attempts = 0
    await page.route('**/api/public/contact', async route => {
      attempts++
      if (attempts === 1) {
        await pending
        return route.fulfill({ status: 503, json: { ok: false } })
      }
      return route.fulfill({ status: 201, json: { ok: true } })
    })
    const button = page.locator('.prepare-button')
    await button.click()
    try {
      await expect(button).toBeDisabled()
      await expect(button).toContainText(language === 'ta' ? 'அனுப்பப்படுகிறது…' : 'Sending enquiry…')
      await expect(page.locator('.enquiry-card form')).toHaveAttribute('aria-busy', 'true')
      await expect(page.locator('.enquiry-submit-spinner')).toBeVisible()
      await page.locator('.enquiry-card form').evaluate((form: HTMLFormElement) => { form.requestSubmit(); form.requestSubmit() })
      await expect.poll(() => attempts).toBe(1)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await expect(page.locator('.enquiry-submit-spinner')).toHaveCSS('animation-name', 'none')
    } finally { release() }
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(button).toBeEnabled()
    await expect(page.locator('.enquiry-submit-spinner')).toHaveCount(0)
    await expect(page.locator('#enquiry-phone')).toHaveValue('9600066505')
    await expect(page.locator('#enquiry-message')).toHaveValue('I would like to arrange a visit next week.')
    await button.click()
    await expect(page.locator('.draft-preview')).toBeVisible()
    await expect(page.locator('.enquiry-card form')).toHaveCount(0)
    expect(attempts).toBe(2)
  })
}

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
