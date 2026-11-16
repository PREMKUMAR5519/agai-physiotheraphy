import { writeFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { loadEnv } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const env = loadEnv(process.env.NODE_ENV || 'production', root, '')
const base = (process.env.CMS_API_URL || env.CMS_API_URL || process.env.VITE_CMS_API_URL || env.VITE_CMS_API_URL)?.replace(/\/$/, '')
if (!base) {
  console.log('No CMS_API_URL configured; using the checked-in content snapshot.')
} else {
  const response = await fetch(`${base}/api/public/content`, { signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error(`CMS content sync failed (${response.status}). Start the CMS before building.`)
  const data = await response.json()
  if (data.schemaVersion !== 1 || !data.content?.clinic || !Array.isArray(data.content.services) || !Array.isArray(data.articles)) throw new Error('Invalid CMS response; existing snapshot preserved')
  const target = resolve(root, 'src/cms-snapshot.json')
  writeFileSync(`${target}.tmp`, JSON.stringify(data, null, 2) + '\n')
  renameSync(`${target}.tmp`, target)
  console.log(`Synced published website content and ${data.articles.length} articles.`)
}
