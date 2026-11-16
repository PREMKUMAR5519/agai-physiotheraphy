import { writeFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { loadEnv } from 'vite'
import { contentEndpoint, parsePublishedContent } from '../src/cms-contract.ts'
import { parseServices } from '../src/services-api.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
const env = loadEnv(process.env.NODE_ENV || 'production', root, '')
const endpoint = contentEndpoint(process.env.CMS_API_URL || env.CMS_API_URL || process.env.VITE_CMS_API_URL || env.VITE_CMS_API_URL)
if (!endpoint) {
  console.log('No CMS_API_URL configured; using the checked-in content snapshot.')
} else {
  const servicesEndpoint = endpoint.replace(/\/content$/, '/services')
  const [response, servicesResponse] = await Promise.all([endpoint, servicesEndpoint].map(url => fetch(url, { signal: AbortSignal.timeout(10000), cache: 'no-store', credentials: 'omit' })))
  if (!response.ok || !servicesResponse.ok) throw new Error(`CMS sync failed (content ${response.status}, services ${servicesResponse.status}). Verify the public CMS URL and availability; existing snapshot preserved.`)
  const data = parsePublishedContent(await response.json(), endpoint)
  data.content.services = parseServices(await servicesResponse.json(), servicesEndpoint).map(service => ({ ...service, focus: [...service.focus] }))
  const target = resolve(root, 'src/cms-snapshot.json')
  writeFileSync(`${target}.tmp`, JSON.stringify(data, null, 2) + '\n')
  renameSync(`${target}.tmp`, target)
  console.log(`Synced published website content and ${data.articles.length} articles.`)
}
