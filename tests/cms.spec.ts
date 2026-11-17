import { test, expect } from '@playwright/test'
import snapshot from '../src/cms-snapshot.json' with { type: 'json' }

const endpoint = '**/api/public/content'
const article = {
  ...snapshot.articles[0], slug: 'live-published-blog', title: 'Live published blog',
  sections: [{ heading: 'Live heading', text: 'Published content from the CMS.' }],
  body: { type: 'doc', content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Live heading' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Published content from the CMS.', marks: [{ type: 'bold' }] }] },
  ] },
}

test('loads live blogs, searches, and opens a new rich-text article directly', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json: { ...snapshot, articles: [article] } }))
  await page.goto('/blogs')
  await expect(page.getByRole('heading', { name: article.title, exact: true })).toBeVisible()
  await page.getByRole('searchbox').fill('not-a-match')
  await expect(page.getByRole('heading', { name: 'No articles found.' })).toBeVisible()
  await page.goto(`/blogs/${article.slug}`)
  await expect(page.getByRole('heading', { level: 1, name: article.title })).toBeVisible()
  await expect(page.locator('.rich-text strong')).toHaveText('Published content from the CMS.')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.agaiphysiotherapy.com/blogs/${article.slug}`)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: article.title })).toBeVisible()
})

test('an empty published list does not resurrect sample blogs', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json: { ...snapshot, articles: [] } }))
  await page.goto('/blogs')
  await expect(page.getByRole('heading', { name: 'No articles found.' })).toBeVisible()
  await page.goto(`/blogs/${snapshot.articles[0].slug}`)
  await expect(page.getByRole('heading', { name: 'Article not found.' })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
})

for (const failure of ['outage', 'malformed'] as const) {
  test(`keeps the last built blogs available during ${failure}`, async ({ page }) => {
    await page.route(endpoint, route => failure === 'outage' ? route.abort() : route.fulfill({ json: { ...snapshot, articles: [{ slug: 'broken' }] } }))
    await page.goto(`/blogs/${snapshot.articles[0].slug}`)
    await expect(page.getByRole('heading', { level: 1, name: snapshot.articles[0].title })).toBeVisible()
  })
}
