import { test, expect } from '@playwright/test'

for (const width of [320, 390, 768, 1440]) {
  for (const path of ['/', '/about', '/services', '/contact']) {
    test(`${path} renders without overflow or browser errors at ${width}px`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('main')).toBeVisible()
      for (const image of await page.locator('img:visible').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect.poll(() => image.evaluate(element => {
          const rendered = element as HTMLImageElement
          return rendered.complete && rendered.naturalWidth > 0
        }), { message: `Image should load: ${await image.getAttribute('src')}` }).toBe(true)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      expect(errors).toEqual([])
    })
  }
}

test('page navigation, metadata, direct reloads and browser history work', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await nav.getByRole('link', { name: 'Our services' }).click()
  await expect(page).toHaveURL(/\/services$/)
  await expect(page).toHaveTitle('Our services | AGAI Physiotherapy Centre')
  await expect(nav.getByRole('link', { name: 'Our services' })).toHaveAttribute('aria-current', 'page')
  await page.reload()
  await expect(page.locator('.service-detail')).toHaveCount(7)
  await nav.getByRole('link', { name: 'Contact us' }).click()
  await expect(page).toHaveTitle('Contact us | AGAI Physiotherapy Centre')
  await page.goBack()
  await expect(page).toHaveURL(/\/services$/)
  await page.goForward()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Contact AGAI/)
})

test('service filters persist in the URL and history', async ({ page }) => {
  await page.goto('/services')
  await page.getByRole('button', { name: 'Women’s wellness', exact: true }).click()
  await expect(page.locator('.service-detail')).toHaveCount(2)
  await expect(page.getByRole('status')).toHaveText('2 services')
  await expect(page).toHaveURL(/category=wellness/)
  await page.reload()
  await expect(page.locator('.service-detail')).toHaveCount(2)
  await page.getByRole('button', { name: 'Healthy ageing', exact: true }).click()
  await expect(page.locator('.service-detail')).toHaveCount(1)
  await expect(page.getByRole('status')).toHaveText('1 service')
  await page.goBack()
  await expect(page.getByRole('button', { name: 'Women’s wellness', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'All services', exact: true }).click()
  await expect(page.locator('.service-detail')).toHaveCount(7)
})

test('deep links reach services and preselect the appointment service', async ({ page }) => {
  await page.goto('/')
  await page.locator('.service-preview').filter({ hasText: 'Orthopaedic rehabilitation' }).click()
  await expect(page).toHaveURL(/\/services#orthopaedic$/)
  await expect(page.locator('#orthopaedic')).toBeInViewport()
  await page.locator('#orthopaedic').getByRole('link', { name: /Book Appointment for/ }).click()
  await expect(page).toHaveURL('/?service=orthopaedic#appointment')
  await expect(page.locator('#appointment-service')).toContainText('Orthopaedic')
  await page.reload()
  await expect(page.locator('#appointment-service')).toContainText('Orthopaedic')
  await page.goto('/?service=unknown#appointment')
  await expect(page.locator('#appointment-service')).toContainText('Select')
})

test('mobile menu supports Escape, navigation and founder anchor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Our services' }).focus()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused()
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact us' }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Meet our founder' }).click()
  await expect(page.locator('#founder')).toBeInViewport()
  await expect(page.locator('#founder')).toBeFocused()
})

test('FAQ expands with the keyboard', async ({ page }) => {
  await page.goto('/')
  const question = page.locator('summary').filter({ hasText: 'Is AGAI only for athletes?' })
  await expect(page.locator('details').filter({ has: question })).toHaveAttribute('open', '')
  await question.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('details').filter({ has: question })).not.toHaveAttribute('open', '')
  await page.keyboard.press('Enter')
  await expect(page.locator('details').filter({ has: question })).toHaveAttribute('open', '')
  await expect(page.getByText('No. Alongside sports rehabilitation', { exact: false })).toBeVisible()
})

test('FAQ filters questions and provides a contact route for unpublished coverage details', async ({ page }) => {
  await page.goto('/')
  const section = page.locator('.home-faq')
  await expect(section.locator('details')).toHaveCount(5)
  await section.getByRole('button', { name: 'First Visit & Triage', exact: true }).click()
  await expect(section.locator('summary')).toHaveText(['1.When should I consider physiotherapy?', '2.What if I am unsure which service to choose?'])
  await section.getByRole('button', { name: 'Treatments & Care', exact: true }).click()
  await expect(section.locator('details')).toHaveCount(3)
  await section.getByRole('button', { name: 'Coverage & Plans', exact: true }).click()
  await expect(section.locator('details')).toHaveCount(0)
  await expect(section.getByRole('heading', { name: 'Questions about coverage or fees?' })).toBeVisible()
  await section.locator('.home-faq-empty').getByRole('link', { name: 'Contact us' }).click()
  await expect(page).toHaveURL('/contact')
})

test('enquiry validates and submits the selected service', async ({ page }) => {
  let submitted: Record<string, string> | undefined
  await page.route('**/api/public/contact', route => {
    submitted = route.request().postDataJSON()
    return route.fulfill({ status: 201, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true }) })
  })
  await page.goto('/contact?service=sports-injury')
  await page.getByRole('button', { name: 'Submit enquiry' }).click()
  expect(submitted).toBeUndefined()
  await page.getByLabel('Your name').fill('   ')
  await page.getByLabel('Phone number').fill('+91 96000 66505')
  await page.getByLabel('Your message').fill('                   ')
  await page.getByRole('button', { name: 'Submit enquiry' }).click()
  await expect(page.getByRole('alert')).toContainText('excluding extra spaces')
  await page.getByLabel('Your name').fill('Test Visitor')
  await page.getByLabel('Email address').fill('visitor@example.com')
  await page.getByLabel('Your message').fill('I would like to ask about an appointment next week.')
  await page.getByRole('button', { name: 'Submit enquiry' }).click()
  await expect(page.getByRole('heading', { name: 'Enquiry received.' })).toBeFocused()
  expect(submitted?.service).toBe('Sports injury prevention & rehabilitation')
  expect(submitted?.email).toBe('visitor@example.com')
  await expect(page.getByLabel('Your name')).toHaveValue('')
})

test('unknown routes offer a working return home', async ({ page }) => {
  await page.goto('/does-not-exist')
  await expect(page).toHaveTitle('Page not found | AGAI Physiotherapy Centre')
  await page.getByRole('link', { name: 'Back to home' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Move Better. Recover Stronger. Perform Better.')
})
