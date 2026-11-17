import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

async function events(page: Page) {
  return page.evaluate(() => (window.dataLayer || []).map(item => Array.from(item as ArrayLike<unknown>)).filter(item => item[0] === 'event'))
}

test.beforeEach(async ({ page }) => {
  // Never send test traffic or fictional patient details to Google.
  await page.route('**://www.googletagmanager.com/**', route => route.abort())
  await page.route('**://*.google-analytics.com/**', route => route.abort())
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
  await page.addInitScript(() => { window.open = () => null })
})

for (const [path, location] of [['/', 'home'], ['/book-appointment', 'booking_page']]) {
  test(`booking funnel counts each milestone once on ${location} without patient data`, async ({ page }) => {
    await page.goto(`${path}?service=orthopaedic&email=private@example.com#appointment`)
    await expect(page.getByLabel('Full name')).toBeVisible()
    expect(await events(page)).toEqual([])
    await page.getByLabel('Full name').fill('Private Patient')
    await page.getByLabel('Contact number').fill('abc1234567')
    await page.locator('.appointment-card').getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Continue choosing date' }).click()
    expect((await events(page)).map(item => item[1])).toEqual(['booking_start'])
    await page.getByLabel('Contact number').fill('+91 9876543210')
    await page.getByLabel('Email (optional)').fill('private@example.com')
    await page.getByText('Add a note', { exact: false }).click()
    await page.getByLabel('A note for the clinic').fill('Private medical note')
    await page.getByRole('button', { name: 'Continue choosing date' }).click()
    await page.getByRole('button', { name: 'Back', exact: true }).click()
    await page.getByRole('button', { name: 'Continue choosing date' }).click()
    await page.getByRole('button', { name: 'Book appointment', exact: true }).click()
    await page.getByRole('button', { name: 'Book appointment', exact: true }).click()
    const tracked = await events(page)
    expect(tracked.map(item => item[1])).toEqual(['booking_start', 'booking_details_complete', 'booking_whatsapp_handoff'])
    for (const item of tracked) {
      const payload = item[2] as Record<string, unknown>
      expect(payload).toEqual({
        send_to: 'G-HZHXQFCBF5', form_location: location,
        step: item[1] === 'booking_whatsapp_handoff' ? 2 : 1,
        page_location: `http://127.0.0.1:5186${path}`,
        page_title: location === 'home' ? 'AGAI home' : 'Request an appointment',
        page_referrer: '', user_data: null,
        allow_google_signals: false, allow_ad_personalization_signals: false,
      })
    }
    const serialized = JSON.stringify(tracked)
    for (const privateValue of ['Private Patient', '9876543210', 'private@example.com', 'Private medical note', 'orthopaedic', 'wa.me', 'service=']) expect(serialized).not.toContain(privateValue)
  })
}

test('contact success is measured only after server acknowledgement, not on failed attempts', async ({ page }) => {
  let successful = false
  await page.route('**/api/public/contact', route => route.fulfill({ status: successful ? 200 : 503, json: { ok: successful } }))
  await page.goto('/contact?service=orthopaedic')
  await page.getByLabel('Your name').fill('Private Patient')
  await page.getByLabel('Phone number').fill('9876543210')
  await page.getByLabel('Your message').fill('Private patient enquiry')
  await page.getByRole('button', { name: 'Submit enquiry' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  expect((await events(page)).map(item => item[1])).toEqual(['enquiry_start'])
  successful = true
  await page.getByRole('button', { name: 'Submit enquiry' }).click()
  await expect(page.getByRole('heading', { name: 'Enquiry received.' })).toBeVisible()
  const tracked = await events(page)
  expect(tracked.map(item => item[1])).toEqual(['enquiry_start', 'enquiry_submitted'])
  expect(tracked[1][2]).toMatchObject({ form_location: 'contact_page', page_location: 'http://127.0.0.1:5186/contact', step: 1 })
  expect(JSON.stringify(tracked)).not.toMatch(/Private|9876543210|orthopaedic|submissionId/)
})

test('analytics errors never prevent a valid booking handoff', async ({ page }) => {
  await page.goto('/book-appointment')
  await page.evaluate(() => {
    window.gtag = () => { throw new Error('Analytics unavailable') }
    window.open = () => { document.documentElement.dataset.handoff = 'attempted'; return null }
  })
  await page.getByLabel('Full name').fill('Test Visitor')
  await page.getByLabel('Contact number').fill('9876543210')
  await page.getByRole('combobox', { name: 'Service *', exact: true }).click()
  await page.getByRole('option', { name: 'Not sure yet / help me choose', exact: true }).click()
  await page.locator('.appointment-card').getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Continue choosing date' }).click()
  await page.getByRole('button', { name: 'Book appointment', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-handoff', 'attempted')
})
