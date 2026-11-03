import { test, expect } from '@playwright/test'

for (const width of [320, 390, 767]) {
  test(`mobile hero booking stays unobstructed by chat at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const booking = page.locator('.hero-pill')
    const launcher = page.getByRole('button', { name: 'Open AGAI chat' })
    const button = (await booking.boundingBox())!
    const chat = (await launcher.boundingBox())!
    expect(button.x + button.width + 12).toBeLessThanOrEqual(chat.x)
    expect(button.y + button.height).toBeLessThanOrEqual(800)
    expect(await booking.evaluate(element => {
      const rect = element.getBoundingClientRect()
      return [rect.left + 4, rect.left + rect.width / 2, rect.right - 4].every(x =>
        element.contains(document.elementFromPoint(x, rect.top + rect.height / 2)))
    })).toBe(true)
    await booking.click({ position: { x: button.width - 10, y: button.height / 2 } })
    await expect(page).toHaveURL(/\/#appointment$/)
    await expect(page.locator('#appointment')).toBeInViewport()
    await launcher.click()
    await expect(page.getByRole('dialog', { name: 'AGAI care guide' })).toBeVisible()
  })
}

test('chat guides a visitor to booking and keeps conversation across routes', async ({ page }) => {
  await page.goto('/services')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: 'Open AGAI chat' }).click()
  const chat = page.getByRole('dialog', { name: 'AGAI care guide' })
  await expect(chat).toContainText('Automated clinic assistant')
  await chat.getByRole('button', { name: /Book a visit/ }).click()
  await expect(chat.getByRole('log')).toContainText('the clinic will confirm')
  await chat.getByRole('link', { name: 'Book an appointment', exact: true }).click()
  await expect(page).toHaveURL(/\/#appointment$/)
  await expect(chat).toHaveCount(0)
  await expect(page.locator('#appointment')).toBeInViewport()
  await page.getByRole('button', { name: 'Open AGAI chat' }).click()
  await expect(chat.getByRole('log')).toContainText('How do I book an appointment?')
  await chat.getByRole('button', { name: 'Start a new chat' }).click()
  await expect(chat.getByRole('log')).toBeEmpty()
  await expect(chat.getByRole('button', { name: 'Start a new chat' })).toBeDisabled()
})

test('typed replies use clinic information and provide human handoff for unknowns', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open AGAI chat' }).click()
  const chat = page.getByRole('dialog')
  const input = chat.getByRole('textbox', { name: 'Your question' })
  await input.fill('   ')
  await expect(chat.getByRole('button', { name: 'Send message' })).toBeDisabled()
  for (const [question, answer] of [
    ['Where is the clinic?', 'Ambattur, Chennai'],
    ['Tell me about sports rehabilitation', 'Sports injury prevention'],
    ['What are the fees?', 'verified price list'],
    ['What are your opening hours?', 'not live slots'],
    ['I have knee pain', 'individual assessment'],
    ['Can you arrange a taxi?', 'verified answer'],
  ]) {
    await input.fill(question)
    await input.press('Enter')
    await expect(chat.locator('.care-chat-message--assistant').last()).toContainText(answer)
    await expect(input).toHaveValue('')
  }
  await expect(chat.locator('.care-chat-message--assistant').last().getByRole('link', { name: 'Talk on WhatsApp' })).toHaveAttribute('href', 'https://wa.me/919600066505')
  await expect(chat.getByRole('log')).toContainText('Can you arrange a taxi?')
})

for (const width of [320, 390, 768, 1440]) {
  test(`chat fits and closes accessibly at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open AGAI chat' }).click()
    const panel = page.getByRole('dialog')
    await expect(panel.getByRole('textbox')).toBeFocused()
    const bounds = await panel.boundingBox()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(800)
    await panel.getByRole('button', { name: /Explore care/ }).click()
    await expect(panel.getByRole('link', { name: 'View all services' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.keyboard.press('Escape')
    await expect(panel).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Open AGAI chat' })).toBeFocused()
  })
}
