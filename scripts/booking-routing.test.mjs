import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { isValidPhone } from '../src/phone.ts'
import { clinicToday, isPastAppointmentTime } from '../src/appointment-time.ts'
import middleware from '../middleware.js'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

const originalFetch = globalThis.fetch
const originalEnv = { CMS_API_URL: process.env.CMS_API_URL, VITE_CMS_API_URL: process.env.VITE_CMS_API_URL }
afterEach(() => {
  globalThis.fetch = originalFetch
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})

test('phone validation accepts formatting but rejects letters, misplaced + and invalid lengths', () => {
  for (const phone of ['9876543210', '+91 (96000) 66505', ' 020 7946 0958 ', '1234567', '+123456789012345']) assert.equal(isValidPhone(phone), true, phone)
  for (const phone of ['abc1234567', '123456', '1234567890123456', '123+4567890', '1234567 ext 12', '', '+++++++']) assert.equal(isValidPhone(phone), false, phone)
})

test('clinic calendar and slot cutoff use IST across UTC day/month boundaries', () => {
  const now = new Date('2026-11-30T19:00:00Z')
  const today = clinicToday(now)
  assert.equal(today.getFullYear(), 2026)
  assert.equal(today.getMonth(), 11)
  assert.equal(today.getDate(), 1)
  const afternoon = new Date('2026-11-17T10:00:00Z') // 15:30 IST
  assert.equal(isPastAppointmentTime('2026-11-17', '09:00 AM', afternoon), true)
  assert.equal(isPastAppointmentTime('2026-11-17', '12:00 PM', afternoon), true)
  assert.equal(isPastAppointmentTime('2026-11-17', '03:30 PM', afternoon), true)
  assert.equal(isPastAppointmentTime('2026-11-17', '04:00 PM', afternoon), false)
  assert.equal(isPastAppointmentTime('2026-11-18', '09:00 AM', afternoon), false)
  assert.equal(isPastAppointmentTime('', '09:00 AM', afternoon), false)
  assert.equal(isPastAppointmentTime('2026-11-17', 'Flexible', afternoon), false)
})

test('built article continues to its static page without a CMS dependency', async () => {
  globalThis.fetch = () => { throw new Error('Should not fetch') }
  const response = await middleware(new Request(`https://example.com/blogs/${snapshot.articles[0].slug}`))
  assert.equal(response.headers.get('x-middleware-next'), '1')
})

test('unknown article returns actual 404 with noindex', async () => {
  process.env.CMS_API_URL = 'https://cms.example.com'
  globalThis.fetch = async () => Response.json(snapshot)
  const response = await middleware(new Request('https://example.com/blogs/no-such-article'))
  assert.equal(response.status, 404)
  assert.match(response.headers.get('x-robots-tag'), /noindex/)
  assert.match(await response.text(), /Article not found/)
})

test('new published article rewrites to the client shell and preserves its query', async () => {
  process.env.CMS_API_URL = 'https://cms.example.com/api/public/content'
  globalThis.fetch = async () => Response.json({ ...snapshot, articles: [{ ...snapshot.articles[0], slug: 'just-published' }] })
  const response = await middleware(new Request('https://example.com/blogs/just-published?source=test'))
  assert.equal(response.headers.get('x-middleware-rewrite'), 'https://example.com/blogs?source=test')
})

test('CMS failure returns temporary 503 rather than a false missing-article response', async () => {
  process.env.CMS_API_URL = 'https://cms.example.com'
  for (const fetcher of [async () => { throw new Error('timeout') }, async () => new Response('', { status: 503 }), async () => Response.json({ articles: [] })]) {
    globalThis.fetch = fetcher
    const response = await middleware(new Request('https://example.com/blogs/just-published'))
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('retry-after'), '60')
  }
})

test('without a CMS unknown routes still return 404', async () => {
  delete process.env.CMS_API_URL
  delete process.env.VITE_CMS_API_URL
  assert.equal((await middleware(new Request('https://example.com/blogs/no-such-article'))).status, 404)
  assert.equal((await middleware(new Request('https://example.com/blogs/invalid_slug'))).status, 404)
})

test('Tamil article routing preserves language and real missing-article status', async () => {
  process.env.CMS_API_URL = 'https://cms.example.com'
  globalThis.fetch = async () => Response.json(snapshot)
  const missing = await middleware(new Request('https://example.com/ta/blogs/no-such-article'))
  assert.equal(missing.status, 404)
  assert.match(await missing.text(), /lang="ta"/)
  const built = await middleware(new Request(`https://example.com/ta/blogs/${snapshot.articles[0].slug}`))
  assert.equal(built.headers.get('x-middleware-next'), '1')
  globalThis.fetch = async () => Response.json({ ...snapshot, articles: [{ ...snapshot.articles[0], slug: 'just-published' }] })
  const published = await middleware(new Request('https://example.com/ta/blogs/just-published?source=test'))
  assert.equal(published.headers.get('x-middleware-rewrite'), 'https://example.com/ta/blogs?source=test')
})
