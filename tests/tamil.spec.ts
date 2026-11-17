import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

test.beforeEach(async ({ page }) => {
  await page.route('**/api/public/content', route => route.fulfill({ json: snapshot }))
  await page.route('**/api/public/services', route => route.fulfill({ json: { schemaVersion: 1, services: snapshot.content.services } }))
  await page.route('**/gtm.js*', route => route.abort())
  await page.addInitScript(() => { window.open = url => { document.documentElement.dataset.whatsapp = String(url); return null } })
})

test('booking preserves details and schedule when switching languages and sends a Tamil request', async ({ page }) => {
  await page.goto('/book-appointment?service=sports-injury')
  await page.locator('#appointment-name').fill('தமிழ் செல்வன்')
  await page.locator('#appointment-phone').fill('abc1234567')
  await page.locator('.appointment-consent input').check()
  await page.locator('.language-switch').click()
  await expect(page).toHaveURL('/ta/book-appointment?service=sports-injury')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta')
  await expect(page.locator('#appointment-name')).toHaveValue('தமிழ் செல்வன்')
  await expect(page.locator('#appointment-service')).toContainText('விளையாட்டுக் காயங்களுக்கான மறுவாழ்வு')
  await page.locator('.appointment-submit').click()
  await expect(page.getByRole('alert')).toHaveText('சரியான தொடர்பு எண்ணை உள்ளிடுங்கள்.')
  await page.locator('#appointment-phone').fill('9600066505')
  await page.locator('.appointment-submit').click()
  await expect(page.locator('.booking-calendar')).toBeVisible()
  await page.locator('.booking-calendar-days button:not([disabled])').last().click()
  const date = await page.locator('.booking-calendar-days .is-selected').getAttribute('data-date')
  await page.locator('.language-switch').click()
  await expect(page.locator('.booking-calendar-days .is-selected')).toHaveAttribute('data-date', date!)
  await page.locator('.language-switch').click()
  await page.locator('.appointment-submit').click()
  const url = await page.locator('html').getAttribute('data-whatsapp')
  expect(new URL(url!).searchParams.get('text')).toContain('பெயர்: தமிழ் செல்வன்')
  expect(new URL(url!).searchParams.get('text')).toContain('சந்திப்புக்கான கோரிக்கை')
})

test('contact retains Tamil input across language changes and supports error, retry and success', async ({ page }) => {
  let attempts = 0
  await page.route('**/api/public/contact', route => {
    attempts++
    return route.fulfill({ status: attempts === 1 ? 503 : 200, json: attempts === 1 ? { message: 'Unavailable' } : { ok: true } })
  })
  await page.goto('/contact')
  await page.locator('#enquiry-name').fill('தமிழ் செல்வன்')
  await page.locator('#enquiry-phone').fill('9600066505')
  await page.locator('#enquiry-message').fill('சந்திப்புக்கு முன்பதிவு செய்ய உதவி தேவை.')
  await page.locator('.language-switch').click()
  await expect(page.locator('#enquiry-message')).toHaveValue('சந்திப்புக்கு முன்பதிவு செய்ய உதவி தேவை.')
  await page.locator('.prepare-button').click()
  await expect(page.getByRole('alert')).toHaveText('உங்கள் கேள்வியை அனுப்ப முடியவில்லை. மீண்டும் முயலுங்கள்.')
  await page.locator('.prepare-button').click()
  await expect(page.locator('.draft-preview')).toContainText('உங்கள் கேள்வி பெறப்பட்டது.')
  expect(attempts).toBe(2)
})

test('Tamil required-field and email validation messages clear after correction', async ({ page }) => {
  await page.goto('/ta/contact')
  await page.locator('.prepare-button').click()
  await expect(page.locator('#enquiry-name')).toBeFocused()
  expect(await page.locator('#enquiry-name').evaluate((field: HTMLInputElement) => field.validationMessage)).toBe('இந்த விவரத்தை நிரப்புங்கள்.')
  await page.locator('#enquiry-name').fill('தமிழ் செல்வன்')
  await page.locator('#enquiry-email').fill('invalid')
  await page.locator('.prepare-button').click()
  expect(await page.locator('#enquiry-email').evaluate((field: HTMLInputElement) => field.validationMessage)).toBe('சரியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்.')
  await page.locator('#enquiry-email').fill('visitor@example.com')
  expect(await page.locator('#enquiry-email').evaluate((field: HTMLInputElement) => field.validationMessage)).toBe('')
})

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`Tamil pages fit ${width}px and have alternate language metadata`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/ta', '/ta/about', '/ta/services', '/ta/blogs', '/ta/book-appointment', '/ta/contact']) {
      await page.goto(path)
      await expect(page.locator('html')).toHaveAttribute('lang', 'ta')
      await expect(page.locator('h1')).toContainText(/[\u0b80-\u0bff]/)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.agaiphysiotherapy.com${path}`)
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `https://www.agaiphysiotherapy.com${path.slice(3) || '/'}`)
      await expect(page.locator('.language-switch')).toBeVisible()
      const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
        const box = el.getBoundingClientRect()
        return box.width > 0 && box.right > innerWidth + 1 && getComputedStyle(el).visibility !== 'hidden'
      }).map(el => `${el.tagName}.${el.className}`))
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), overflow.join(', ')).toBe(true)
      if (width === 390) {
        await page.screenshot({ path: `tmp/tamil-${path.split('/').pop()}.png`, fullPage: true })
        await page.screenshot({ path: `tmp/tamil-${path.split('/').pop()}-top.png` })
      }
    }
  })
}

test('English header still fits narrow mobile and tablet screens', async ({ page }) => {
  await page.goto('/book-appointment')
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(page.locator('.language-switch')).toBeVisible()
      if (width === 390) await page.screenshot({ path: 'tmp/language-toggle-mobile.png' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('each page switches to its equivalent and all internal navigation retains Tamil', async ({ page }) => {
  for (const path of ['/', '/about', '/services', '/blogs', '/book-appointment', '/contact']) {
    await page.goto(`${path}?source=test`)
    await page.locator('.language-switch .is-selected').click()
    await expect(page).toHaveURL(`${path === '/' ? '/ta' : `/ta${path}`}?source=test`)
    const leaks = await page.locator('a[href^="/"]').evaluateAll(links => links.filter(link => !link.classList.contains('language-switch') && !link.getAttribute('href')?.startsWith('/ta')).map(link => link.getAttribute('href')))
    expect(leaks).toEqual([])
    await page.locator('.language-switch').focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(`${path}?source=test`)
  }
})

test('Tamil home retains form values and care search works in Tamil', async ({ page }) => {
  await page.goto('/')
  await page.locator('#appointment-name').fill('தமிழ் செல்வன்')
  await page.locator('#appointment-phone').fill('9600066505')
  await page.locator('.language-switch').click()
  await expect(page.locator('#appointment-name')).toHaveValue('தமிழ் செல்வன்')
  await page.locator('#care-path-query').fill('கர்ப்பகாலம்')
  await expect(page.locator('.care-need')).toHaveCount(1)
  await expect(page.locator('.care-need')).toContainText('கர்ப்பகாலம்')
})

test('services preserve filter and booking selection across languages', async ({ page }) => {
  await page.goto('/services?category=sports')
  await page.locator('.language-switch').click()
  await expect(page).toHaveURL('/ta/services?category=sports')
  await expect(page.locator('.service-detail')).toHaveCount(2)
  await page.locator('.service-enquiry').first().click()
  await expect(page).toHaveURL('/ta?service=sports-injury#appointment')
  await expect(page.locator('#appointment-service')).toContainText('விளையாட்டுக் காயங்களுக்கான மறுவாழ்வு')
})

test('Tamil article navigation labels original English content and returns to the same article', async ({ page }) => {
  const slug = snapshot.articles[0].slug
  await page.goto(`/ta/blogs/${slug}`)
  await expect(page.locator('.journal-article-heading .article-language-note')).toBeVisible()
  await expect(page.locator('h1')).toHaveAttribute('lang', 'en')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
  await page.locator('.language-switch').click()
  await expect(page).toHaveURL(`/blogs/${slug}`)
})

test('Tamil chat supports booking shortcuts and keeps navigation in Tamil', async ({ page }) => {
  await page.goto('/ta/about')
  await page.locator('.care-chat-launcher').click()
  await page.locator('.care-chat-shortcuts button').first().click()
  await expect(page.locator('.care-chat-message--assistant')).toContainText('WhatsApp')
  await expect(page.locator('.care-chat-actions a').first()).toHaveAttribute('href', '/ta#appointment')
  await page.locator('#care-chat-input').fill('மையம் எங்கே உள்ளது?')
  await page.locator('.care-chat-composer button').click()
  await expect(page.locator('.care-chat-message--assistant').last()).toContainText('முகவரி')
})
